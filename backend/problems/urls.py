from django.urls import path
from . import views

urlpatterns = [
    path("", views.get_problems, name="get_problems"),                  # GET all problems
    path("add/", views.add_problem, name="add_problem"),                # POST add new problem (admin only)
    path("test/", views.test_code, name="test_code"),                   # POST test code execution
    path("run/", views.run_code, name="run_code"),                      # POST run visible testcases (auth required)
    path("submit/", views.submit_code, name="submit_code"),             # POST run hidden testcases (auth required)
    path("<str:problem_id>/", views.get_problem, name="get_problem"),   # GET one problem (basic info)
    path("<str:problem_id>/detail/", views.get_problem_detail, name="get_problem_detail"),  # GET full detail
]
