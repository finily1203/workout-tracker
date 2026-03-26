import { useState } from "react";
import HistoryPage from "./HistoryPage";
import NewSessionPage from "./NewSessionPage";
import Navbar from "../components/Navbar";

function DashboardPage({ user, onSignOut }) {
    const [page, setPage] = useState("dashboard");
    const userId = user.userId || user.username;

    return (
        <div>
            <Navbar onSignOut={onSignOut} setPage={setPage} />
            <div style={{ padding: "2rem" }}>
                {page === "dashboard" && (
                    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                        <h1 style={{ color: "white", fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem" }}>
                            Welcome! 👋
                        </h1>
                        <p style={{ color: "#aaa", marginBottom: "2rem" }}>
                            Track your workouts and monitor your progress.
                        </p>

                        {/* Quick Actions */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", maxWidth: "500px" }}>
                            <button
                                onClick={() => setPage("new")}
                                style={{
                                    background: "linear-gradient(135deg, #4CAF50, #45a049)",
                                    border: "none",
                                    color: "white",
                                    padding: "1.2rem",
                                    borderRadius: "16px",
                                    cursor: "pointer",
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    textAlign: "left"
                                }}>
                                💪 New Session
                            </button>
                            <button
                                onClick={() => setPage("history")}
                                style={{
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    color: "white",
                                    padding: "1.2rem",
                                    borderRadius: "16px",
                                    cursor: "pointer",
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    textAlign: "left"
                                }}>
                                📋 View History
                            </button>
                        </div>

                        {/* Hint about chatbot */}
                        <div style={{
                            marginTop: "2rem",
                            padding: "1rem 1.2rem",
                            background: "rgba(76,175,80,0.08)",
                            border: "1px solid rgba(76,175,80,0.15)",
                            borderRadius: "12px",
                            maxWidth: "500px",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.8rem"
                        }}>
                            <span style={{ fontSize: "1.5rem" }}>🤖</span>
                            <div>
                                <div style={{ color: "white", fontWeight: "600", fontSize: "0.9rem" }}>AI Fitness Coach available</div>
                                <div style={{ color: "#4CAF50", fontSize: "0.8rem" }}>Click the button at the bottom right to chat</div>
                            </div>
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