import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateProblem from "./pages/CreateProblem";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";

function App() {
    return (
        <Router>
            <div className="min-vh-100 bg-light">
                <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' }}>
                    <div className="container">
                        <a className="navbar-brand fw-bold fs-3 text-white" href="/">
                            CodeQuest
                        </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <a className="nav-link fw-semibold px-3 py-2 mx-1 text-white" href="/">Home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link fw-semibold px-3 py-2 mx-1 text-white" href="/create">Create</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link fw-semibold px-3 py-2 mx-1 text-white" href="/problems">Problems</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <main className="py-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/create" element={<CreateProblem />} />
                        <Route path="/problems" element={<Problems />} />
                        <Route path="/problems/:id" element={<ProblemDetail />} />
                    </Routes>
                </main>

                <footer className="bg-dark text-light text-center py-3 mt-auto">
                    <div className="container">
                        <p className="mb-0">CodeQuest - Empowering Coders Worldwide</p>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;
