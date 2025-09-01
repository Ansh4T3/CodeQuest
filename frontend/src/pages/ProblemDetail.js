import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";

function ProblemDetail() {
    const { id } = useParams();
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState(`#include <stdio.h>

int main() {
    // Write your solution here
    // Read input from stdin
    // Print output to stdout
    
    return 0;
}`);
    const [results, setResults] = useState([]);
    const [score, setScore] = useState(null);
    const [runLoading, setRunLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch problem details
    useEffect(() => {
        fetchProblemDetails();
    }, [id]);

    const fetchProblemDetails = async () => {
        try {
            setRunLoading(true);
            setError(null);
            const response = await fetch(`http://127.0.0.1:8000/api/problems/${id}/detail/`);
            if (response.ok) {
                const data = await response.json();
                setProblem(data);
            } else {
                setError("Problem not found");
            }
        } catch (err) {
            setError("Failed to load problem");
        } finally {
            setRunLoading(false);
        }
    };

    // Run Code (visible testcases only)
    const handleRun = async () => {
        try {
            setRunLoading(true);
            setError(null);
            setResults([]);

            const response = await fetch("http://127.0.0.1:8000/api/problems/run/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: code,
                    problem_id: id,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setResults(data.results || []);
                setScore(null);
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to run code");
            }
        } catch (error) {
            console.error("Run error:", error);
            setError("Network error occurred");
        } finally {
            setRunLoading(false);
        }
    };

    // Submit Code (all testcases + score)
    const handleSubmit = async () => {
        try {
            setSubmitLoading(true);
            setError(null);
            setResults([]);

            const response = await fetch("http://127.0.0.1:8000/api/problems/submit/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    problem_id: id,
                    code: code,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setResults(data.results || []);
                setScore(data.score ?? null);
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to submit code");
            }
        } catch (error) {
            console.error("Submit error:", error);
            setError("Network error occurred");
        } finally {
            setSubmitLoading(false);
        }
    };

    if (runLoading && !problem) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 text-center">
                        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted">Loading problem...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !problem) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 text-center">
                        <div className="alert alert-danger" role="alert">
                            <h5 className="alert-heading">Error</h5>
                            <p>{error}</p>
                            <Link to="/problems" className="btn btn-outline-danger">
                                Back to Problems
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!problem) return null;

    return (
        <div className="container-fluid py-4">
            <div className="row">
                {/* Problem Description - Left Side */}
                <div className="col-lg-4 col-md-12 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-primary text-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fw-bold">
                                    Problem
                                </h5>
                                <Link to="/problems" className="btn btn-outline-light btn-sm">
                                    Back
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <h4 className="fw-bold text-dark mb-3">{problem.title}</h4>
                            <p className="text-muted mb-4">{problem.description}</p>

                            {/* Visible Test Cases */}
                            <div className="mb-4">
                                <h6 className="fw-semibold text-dark mb-3">
                                    Visible Test Cases
                                </h6>
                                <div className="list-group list-group-flush">
                                    {problem.test_cases
                                        .filter((t) => !t.hidden)
                                        .map((tc, i) => (
                                            <div key={i} className="list-group-item border-0 px-0 py-2">
                                                <div className="row g-2">
                                                    <div className="col-6">
                                                        <small className="text-muted fw-semibold">Input:</small>
                                                        <div className="bg-light p-2 rounded small">{tc.input || "(no input)"}</div>
                                                    </div>
                                                    <div className="col-6">
                                                        <small className="text-muted fw-semibold">Expected:</small>
                                                        <div className="bg-light p-2 rounded small">{tc.output}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-grid gap-2">
                                <button
                                    className="btn btn-secondary btn-lg"
                                    onClick={handleRun}
                                    disabled={runLoading || submitLoading}
                                >
                                    {runLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Running...
                                        </>
                                    ) : (
                                        <>
                                            Run Code
                                        </>
                                    )}
                                </button>
                                <button
                                    className="btn btn-success btn-lg"
                                    onClick={handleSubmit}
                                    disabled={runLoading || submitLoading}
                                >
                                    {submitLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Solution
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Code Editor and Results - Right Side */}
                <div className="col-lg-8 col-md-12">
                    <div className="row">
                        {/* Code Editor */}
                        <div className="col-12 mb-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-dark text-white">
                                    <h6 className="mb-0 fw-bold">
                                        Code Editor (C Language)
                                    </h6>
                                </div>
                                <div className="card-body p-0">
                                    <Editor
                                        height="400px"
                                        defaultLanguage="c"
                                        theme="vs-dark"
                                        value={code}
                                        onChange={(value) => setCode(value)}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            lineNumbers: 'on',
                                            roundedSelection: false,
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="col-12 mb-4">
                                <div className="alert alert-danger" role="alert">
                                    <h6 className="alert-heading">Error</h6>
                                    <p className="mb-0">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Results */}
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-info text-white">
                                    <h6 className="mb-0 fw-bold">
                                        Results
                                    </h6>
                                </div>
                                <div className="card-body">
                                    {results.length > 0 ? (
                                        <>
                                            {/* Score Display */}
                                            {score !== null && (
                                                <div className="alert alert-success text-center mb-4">
                                                    <h4 className="mb-2">Final Score</h4>
                                                    <div className="display-4 fw-bold text-success">{score}%</div>
                                                    <p className="mb-0">Congratulations! You passed {Math.round(score / 10)} out of {Math.ceil(score / 10)} hidden test cases.</p>
                                                </div>
                                            )}

                                            {/* Test Case Results */}
                                            <div className="table-responsive">
                                                <table className="table table-hover">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>Input</th>
                                                            <th>Expected</th>
                                                            <th>Output</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {results.map((r, i) => (
                                                            <tr key={i} className={r.passed ? "table-success" : "table-danger"}>
                                                                <td><code className="small">{r.input || "(no input)"}</code></td>
                                                                <td><code className="small">{r.expected}</code></td>
                                                                <td><code className="small">{r.output}</code></td>
                                                                <td>
                                                                    <span className={`badge ${r.passed ? "bg-success" : "bg-danger"}`}>
                                                                        {r.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-4">

                                            <p className="text-muted mt-2">No results yet. Run your code or submit your solution to see the results.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProblemDetail;
