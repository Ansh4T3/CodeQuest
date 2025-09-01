import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Problems() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("http://127.0.0.1:8000/api/problems/");
            if (response.ok) {
                const data = await response.json();
                setProblems(data);
            } else {
                setError("Failed to load problems");
            }
        } catch (err) {
            setError("Network error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status" style={{ width: "2.5rem", height: "2.5rem" }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted small">Loading problems...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-danger d-inline-block shadow-sm" role="alert">
                    <h6 className="alert-heading mb-2">Error</h6>
                    <p className="mb-3 small">{error}</p>
                    <button className="btn btn-sm btn-outline-danger" onClick={fetchProblems}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            {/* Header */}
            <div className="row mb-4">
                <div className="col-12 text-center">
                    <h2 className="fw-bold text-dark mb-2">Coding Problems</h2>
                    <p className="text-muted small mb-3">Choose a problem and start coding!</p>
                    <Link to="/create" className="btn btn-success btn-sm px-3 rounded-pill">
                        Create Problem
                    </Link>
                </div>
            </div>

            {/* Problems List */}
            {problems.length > 0 ? (
                <div className="row g-3">
                    {problems.map((problem) => (
                        <div key={problem._id} className="col-lg-6 col-md-12">
                            <div className="card border-0 shadow-sm h-100 rounded-3">
                                <div className="card-body p-3">
                                    <h5 className="fw-semibold text-dark mb-2">{problem.title}</h5>
                                    <p className="text-muted small mb-3">
                                        {problem.description?.length > 120
                                            ? `${problem.description.substring(0, 120)}...`
                                            : problem.description || ""}
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center">

                                        <Link to={`/problems/${problem._id}`} className="btn btn-primary btn-sm px-3 rounded-pill">
                                            Solve
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <div className="display-4 text-muted mb-3">📝</div>
                    <h4 className="text-dark mb-2">No Problems Found</h4>
                    <p className="text-muted small mb-4">It looks like there are no problems available yet.</p>
                    <Link to="/create" className="btn btn-success btn-sm px-3 rounded-pill">
                        Create Your First Problem
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Problems;
