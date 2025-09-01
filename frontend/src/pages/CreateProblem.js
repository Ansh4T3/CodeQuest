import React, { useState } from "react";
import { Link } from "react-router-dom";

function CreateProblem() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [testcases, setTestcases] = useState([{ input: "", output: "", hidden: false }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddTestcase = () => {
        setTestcases([...testcases, { input: "", output: "", hidden: false }]);
    };

    const handleRemoveTestcase = (index) => {
        if (testcases.length > 1) {
            const updated = testcases.filter((_, i) => i !== index);
            setTestcases(updated);
        }
    };

    const handleTestcaseChange = (index, field, value) => {
        const updated = [...testcases];
        updated[index][field] = value;
        setTestcases(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/problems/add/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, test_cases: testcases }),
            });

            if (response.ok) {
                alert("Problem created successfully!");
                setTitle("");
                setDescription("");
                setTestcases([{ input: "", output: "", hidden: false }]);
            } else {
                alert("Error creating problem");
            }
        } catch (error) {
            alert("Network error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-7 col-md-9">
                    {/* Header */}
                    <div className="text-center mb-4">
                        <h2 className="fw-bold text-dark">Create New Problem</h2>
                        <p className="text-muted small">Design clean & structured coding problems</p>
                    </div>

                    {/* Card */}
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                {/* Title */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Problem Title</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        placeholder="Enter problem title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Problem Description</label>
                                    <textarea
                                        className="form-control rounded-3"
                                        rows="4"
                                        placeholder="Write a clear problem statement..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                {/* Testcases */}
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <label className="form-label fw-semibold mb-0">Test Cases</label>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary rounded-pill"
                                            onClick={handleAddTestcase}
                                        >
                                            + Add
                                        </button>
                                    </div>

                                    {testcases.map((testcase, index) => (
                                        <div key={index} className="border rounded-3 p-3 mb-3 bg-light">
                                            <div className="row g-2">
                                                <div className="col-md-5">
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        placeholder="Input"
                                                        value={testcase.input}
                                                        onChange={(e) => handleTestcaseChange(index, "input", e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-5">
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        placeholder="Expected Output"
                                                        value={testcase.output}
                                                        onChange={(e) => handleTestcaseChange(index, "output", e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                {/* Right side stacked controls */}
                                                <div className="col-md-2 d-flex flex-column align-items-center justify-content-center gap-2">
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            id={`hidden-${index}`}
                                                            checked={testcase.hidden}
                                                            onChange={(e) =>
                                                                handleTestcaseChange(index, "hidden", e.target.checked)
                                                            }
                                                        />
                                                        <label
                                                            className="form-check-label small text-muted"
                                                            htmlFor={`hidden-${index}`}
                                                        >
                                                            Hidden
                                                        </label>
                                                    </div>

                                                    {testcases.length > 1 && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger w-100"
                                                            onClick={() => handleRemoveTestcase(index)}
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                </div>

                                {/* Submit Buttons */}
                                <div className="d-flex justify-content-end gap-2">
                                    <Link to="/" className="btn btn-light border rounded-pill px-4">
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn btn-primary rounded-pill px-5"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                ></span>
                                                Creating...
                                            </>
                                        ) : (
                                            "Create Problem"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateProblem;
