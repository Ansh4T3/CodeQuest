from codequest_backend.mongo import db
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json, subprocess, tempfile, os, re, platform
from bson import ObjectId


def get_problems(request):
    problems = list(db.problems.find({}))
    for p in problems:
        p["_id"] = str(p["_id"])  # convert ObjectId to string
    return JsonResponse(problems, safe=False)


@csrf_exempt
def add_problem(request):
    if request.method == "POST":
        data = json.loads(request.body)

        problem = {
            "title": data.get("title"),
            "description": data.get("description"),
            "test_cases": data.get("test_cases", [])
        }

        db.problems.insert_one(problem)
        return JsonResponse({"message": "Problem added successfully"}, status=201)

    return JsonResponse({"error": "Invalid request"}, status=400)


def get_problem(request, problem_id):
    problem = db.problems.find_one({"_id": ObjectId(problem_id)})
    if problem:
        problem["_id"] = str(problem["_id"])
        return JsonResponse(problem, safe=False)
    return JsonResponse({"error": "Problem not found"}, status=404)


def get_problem_detail(request, problem_id):
    try:
        problem = db.problems.find_one({"_id": ObjectId(problem_id)}, {"_id": 0})
        if not problem:
            return JsonResponse({"error": "Problem not found"}, status=404)
        return JsonResponse(problem, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def test_code(request):
    """Test code execution with custom test cases"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            code = data.get("code", "")
            test_cases = data.get("test_cases", [])
            language = data.get("language", "c")
            
            if not code.strip():
                return JsonResponse({"error": "No code provided"}, status=400)
            
            if not test_cases:
                return JsonResponse({"error": "No test cases provided"}, status=400)
            
            # Validate test cases
            for tc in test_cases:
                is_valid, message = validate_test_case(tc)
                if not is_valid:
                    return JsonResponse({"error": f"Invalid test case: {message}"}, status=400)
            
            results = execute_code(code, test_cases, language)
            return JsonResponse({"results": results})
            
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    return JsonResponse({"error": "Invalid request"}, status=405)


@csrf_exempt
def run_code(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            code = body.get("code", "")
            problem_id = body.get("problem_id")

            problem = db.problems.find_one({"_id": ObjectId(problem_id)})
            if not problem:
                return JsonResponse({"error": "Problem not found"}, status=404)

            test_cases = [tc for tc in problem.get("test_cases", []) if not tc.get("hidden", False)]
            results = execute_code(code, test_cases, "c")
            return JsonResponse({"results": results})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)


@csrf_exempt
def submit_code(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            code = data.get("code")
            problem_id = data.get("problem_id")

            problem = db.problems.find_one({"_id": ObjectId(problem_id)})
            if not problem:
                return JsonResponse({"error": "Problem not found"}, status=404)

            all_cases = problem.get("test_cases", [])
            results = execute_code(code, all_cases, "c")

            # Score hidden testcases only
            hidden_cases = [r for r in results if r.get("hidden")]
            passed_hidden = sum(1 for r in hidden_cases if r["passed"])
            total_hidden = len(hidden_cases)
            score = (passed_hidden / total_hidden * 100) if total_hidden > 0 else 0

            return JsonResponse({"results": results, "score": score})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)


def execute_code(code, test_cases, language="c"):
    """
    Execute code with test cases and return results
    Supports C language for now
    """
    results = []
    
    if not code.strip():
        return [{"input": "", "expected": "", "output": "No code provided", "passed": False, "error": "Empty code"}]

    # Use a temporary directory for safety
    with tempfile.TemporaryDirectory() as tmpdirname:
        try:
            if language.lower() == "c":
                results = execute_c_code(code, test_cases, tmpdirname)
            else:
                results = [{"input": "", "expected": "", "output": f"Language {language} not supported", "passed": False, "error": f"Unsupported language: {language}"}]
                
        except Exception as e:
            results = [{"input": "", "expected": "", "output": f"Execution error: {str(e)}", "passed": False, "error": str(e)}]
    
    return results


def find_c_compiler():
    """Find available C compiler on the system"""
    compilers = [
        ("gcc", ["gcc", "--version"]),
        ("cl", ["cl"]),
        ("tcc", ["tcc", "--version"]),
    ]
    
    for name, cmd in compilers:
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
            if result.returncode == 0 or "version" in result.stdout or "version" in result.stderr:
                return name, cmd[0]
        except:
            continue
    
    return None, None


def execute_c_code(code, test_cases, tmpdirname):
    results = []
    
    compiler_name, compiler_cmd = find_c_compiler()
    
    if not compiler_cmd:
        return [{
            "input": tc.get("input", ""),
            "expected": tc.get("output", ""),
            "output": "No C compiler found on system. Please install GCC (MinGW-w64), MSVC Build Tools, or TCC and add it to PATH.",
            "passed": False,
            "status": "No Compiler",
            "error": "No Compiler Available",
            "hidden": tc.get("hidden", False)
        } for tc in test_cases]
    
    c_file = os.path.join(tmpdirname, "program.c")
    exe_file = os.path.join(tmpdirname, "program.exe" if platform.system() == "Windows" else "program.out")
    
    with open(c_file, "w", encoding='utf-8') as f:
        f.write(code)
    
    try:
        if compiler_name == "gcc":
            compile_cmd = [compiler_cmd, c_file, "-o", exe_file, "-std=c99", "-Wall", "-Wextra"]
        elif compiler_name == "cl":
            compile_cmd = [compiler_cmd, c_file, "/Fe:" + exe_file, "/std:c11"]
        elif compiler_name == "tcc":
            compile_cmd = [compiler_cmd, "-o", exe_file, c_file]
        else:
            compile_cmd = [compiler_cmd, c_file, "-o", exe_file]
        
        compile_proc = subprocess.run(
            compile_cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=15,
            cwd=tmpdirname
        )
        
        if compile_proc.returncode != 0:
            error_msg = compile_proc.stderr.strip() or compile_proc.stdout.strip() or "Compilation failed with unknown error"
            
            return [{
                "input": tc["input"],
                "expected": tc["output"],
                "output": error_msg,
                "passed": False,
                "error": "Compilation Failed",
                "status": "Compilation Failed",
                "hidden": tc.get("hidden", False)
            } for tc in test_cases]
    
    except subprocess.TimeoutExpired:
        return [{
            "input": tc["input"],
            "expected": tc["output"],
            "output": "Compilation timeout",
            "passed": False,
            "error": "Compilation Timeout",
            "status": "Compilation Timeout",
            "hidden": tc.get("hidden", False)
        } for tc in test_cases]
    
    for tc in test_cases:
        try:
            input_data = tc["input"].strip() if tc["input"] else ""
            
            run_proc = subprocess.run(
                [exe_file],
                input=input_data + "\n" if input_data else "",
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=5,
                cwd=tmpdirname
            )
            
            output = run_proc.stdout.strip()
            stderr_output = run_proc.stderr.strip()
            
            if stderr_output:
                output = f"STDOUT: {output}\nSTDERR: {stderr_output}" if output else stderr_output
            
            expected = tc["output"].strip()
            actual_output = output.strip() if output else "(no output)"
            
            passed = normalize_output(actual_output) == normalize_output(expected)
            status = "Passed" if passed else "Failed"
            
            results.append({
                "input": tc["input"],
                "expected": expected,
                "output": actual_output,
                "passed": passed,
                "status": status,
                "hidden": tc.get("hidden", False)
            })
            
        except subprocess.TimeoutExpired:
            results.append({
                "input": tc["input"],
                "expected": tc["output"],
                "output": "Time Limit Exceeded (5 seconds)",
                "passed": False,
                "status": "Timeout",
                "hidden": tc.get("hidden", False)
            })
        except Exception as e:
            results.append({
                "input": tc["input"],
                "expected": tc["output"],
                "output": f"Runtime Error: {str(e)}",
                "passed": False,
                "status": "Runtime Error",
                "hidden": tc.get("hidden", False)
            })
    
    return results


def normalize_output(output):
    if not output:
        return ""
    normalized = re.sub(r'\s+', ' ', output.strip()).lower()
    return normalized


def validate_test_case(test_case):
    required_fields = ["input", "output"]
    for field in required_fields:
        if field not in test_case:
            return False, f"Missing required field: {field}"
    return True, "Valid"


def sanitize_input(input_str):
    if not input_str:
        return ""
    dangerous_chars = [';', '&', '|', '`', '$', '(', ')', '<', '>']
    sanitized = input_str
    for char in dangerous_chars:
        sanitized = sanitized.replace(char, '')
    return sanitized.strip()
