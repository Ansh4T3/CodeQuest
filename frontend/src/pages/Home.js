import React from "react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="container-fluid px-0">
            {/* Hero Section */}
            <div className="hero-section text-white text-center py-5" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                minHeight: '60vh',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div className="container">
                    <h1 className="display-3 fw-bold mb-4">Welcome to CodeQuest</h1>
                    <p className="lead fs-4 mb-5">Master coding challenges and become a better programmer</p>
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Link to="/problems" className="btn btn-light btn-lg px-4 py-3 fw-semibold">
                            Solve Problems
                        </Link>
                        <Link to="/create" className="btn btn-outline-light btn-lg px-4 py-3 fw-semibold">
                            Create Problem
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="container py-5">
                <div className="row g-4">
                    <div className="col-lg-4 col-md-6">
                        <div className="card border-0 shadow-sm h-100 hover-lift">
                            <div className="card-body text-center p-4">
                                <h4 className="fw-bold text-dark mb-3">Code Editor</h4>
                                <p className="text-muted mb-0">Write, test, and debug your code with our integrated Monaco editor</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="card border-0 shadow-sm h-100 hover-lift">
                            <div className="card-body text-center p-4">
                                <h4 className="fw-bold text-dark mb-3">Test Cases</h4>
                                <p className="text-muted mb-0">Validate your solutions with comprehensive test cases</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="card border-0 shadow-sm h-100 hover-lift">
                            <div className="card-body text-center p-4">
                                <h4 className="fw-bold text-dark mb-3">Result</h4>
                                <p className="text-muted mb-0">check hidden testcases</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
