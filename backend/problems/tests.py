from django.test import TestCase
from django.test import Client
from django.urls import reverse
import json

# Create your tests here.

class ProblemsViewsTest(TestCase):
    def setUp(self):
        self.client = Client()
        
    def test_get_problems_empty(self):
        """Test getting problems when none exist"""
        response = self.client.get('/api/problems/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(len(data), 0)
    
    def test_add_problem_invalid_request(self):
        """Test adding problem with invalid request"""
        response = self.client.post('/api/problems/add/', {})
        self.assertEqual(response.status_code, 400)
    
    def test_add_problem_valid(self):
        """Test adding problem with valid data"""
        problem_data = {
            "title": "Test Problem",
            "description": "A test problem",
            "test_cases": [
                {"input": "5", "output": "25", "hidden": False}
            ]
        }
        response = self.client.post(
            '/api/problems/add/',
            data=json.dumps(problem_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
    
    def test_test_code_endpoint(self):
        """Test the code testing endpoint"""
        test_data = {
            "code": "#include <stdio.h>\nint main() { printf(\"Hello\"); return 0; }",
            "test_cases": [{"input": "", "output": "Hello"}],
            "language": "c"
        }
        response = self.client.post(
            '/api/problems/test/',
            data=json.dumps(test_data),
            content_type='application/json'
        )
        # This might fail if gcc is not available, but should not crash
        self.assertIn(response.status_code, [200, 400])
