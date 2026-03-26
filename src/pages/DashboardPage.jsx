import { useState } from "react";
import HistoryPage from "./HistoryPage";
import NewSessionPage from "./NewSessionPage";
import Navbar from "../components/Navbar";
import axios from "axios";
import { API_URL } from "../aws-config";

function DashboardPage({ user, onSignOut }) {
    const [page, setPage] = useState("dashboard");
    const [recommendation, setRecommendation] = useState("");
    const [loading, setLoading] = useState(false);
    const userId = user.userId || user.username;

    const getRecommendation = async () => {
        setLoading(true);
        setRecommendation("");
        try {
            const res = await axios.post(`${API_URL}/recommend`, { userId });
            setRecommendation(res.data.recommendation);
        } catch {
            setRecommendation("Error getting recommendation. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar onSignOut={onSignOut} setPage={setPage} />
            <div style={{ padding: "2rem" }}>
                {page === "dashboard" && (
                    <div>
                        <h1>Welcome! 👋</h1>
                        <p>Track your workouts and monitor your progress.</p>
                        <div style={{ marginBottom: "1.5rem" }}>
                            <button onClick={() => setPage("new")}>+ New Session</button>
                            <button onClick={() => setPage("history")} style={{ marginLeft: "1rem" }}>
                                View History
                            </button>
                        </div>

                        {/* AI Recommendation Section */}
                        <div style={{ background: "#1e1e2e", borderRadius: "8px", padding: "1.5rem", marginTop: "1rem", maxWidth: "700px" }}>
                            <h3 style={{ color: "white", marginBottom: "1rem" }}>🤖 AI Workout Recommendation</h3>
                            <button
                                onClick={getRecommendation}
                                disabled={loading}
                                style={{ background: "#4CAF50", color: "white", border: "none", padding: "0.7rem 1.5rem", borderRadius: "6px", cursor: "pointer", fontSize: "1rem" }}>
                                {loading ? "Thinking..." : "Get AI Recommendation"}
                            </button>
                            {recommendation && (
                                <div style={{ marginTop: "1rem", color: "#ddd", whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                                    {recommendation}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {page === "new" && (
                    <NewSessionPage userId={userId} onBack={() => setPage("dashboard")} />
                )}
                {page === "history" && (
                    <HistoryPage userId={userId} onBack={() => setPage("dashboard")} />
                )}
            </div>
        </div>
    );
}

export default DashboardPage;