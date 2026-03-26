import { useState } from "react";
import HistoryPage from "./HistoryPage";
import NewSessionPage from "./NewSessionPage";
import Navbar from "../components/Navbar";

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
};

function DashboardPage({ user, onSignOut }) {
    const [page, setPage] = useState("dashboard");
    const userId = user.userId || user.username;
    const displayName = user.signInDetails?.loginId?.split("@")[0] || "there";

    return (
        <div style={{ background: "#F2F2F7", minHeight: "100vh" }}>
            <Navbar onSignOut={onSignOut} setPage={setPage} currentPage={page} />

            <div style={{ padding: "28px 20px", maxWidth: "680px", margin: "0 auto" }}>
                {page === "dashboard" && (
                    <div>
                        {/* Greeting */}
                        <div style={{ marginBottom: "28px" }}>
                            <p style={{ color: "#8E8E93", fontSize: "15px", marginBottom: "4px" }}>
                                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                            </p>
                            <h1 style={{ fontSize: "34px", fontWeight: "700", letterSpacing: "-0.5px", color: "#000" }}>
                                {getGreeting()}, {displayName}
                            </h1>
                        </div>

                        {/* Quick Actions */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                            <button
                                onClick={() => setPage("new")}
                                style={{
                                    background: "#007AFF",
                                    border: "none",
                                    color: "white",
                                    padding: "20px",
                                    borderRadius: "16px",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    boxShadow: "0 4px 16px rgba(0,122,255,0.28)",
                                    transition: "transform 0.15s ease",
                                }}
                                onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
                                onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                            >
                                <div style={{ fontSize: "28px", marginBottom: "10px" }}>💪</div>
                                <div style={{ fontWeight: "700", fontSize: "16px" }}>New Session</div>
                                <div style={{ fontSize: "13px", opacity: 0.8, marginTop: "3px" }}>Log your workout</div>
                            </button>

                            <button
                                onClick={() => setPage("history")}
                                style={{
                                    background: "#FFFFFF",
                                    border: "none",
                                    color: "#000",
                                    padding: "20px",
                                    borderRadius: "16px",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
                                    transition: "transform 0.15s ease",
                                }}
                                onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
                                onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                            >
                                <div style={{ fontSize: "28px", marginBottom: "10px" }}>📋</div>
                                <div style={{ fontWeight: "700", fontSize: "16px" }}>History</div>
                                <div style={{ fontSize: "13px", color: "#8E8E93", marginTop: "3px" }}>View past sessions</div>
                            </button>
                        </div>

                        {/* AI Coach hint */}
                        <div style={{
                            background: "#FFFFFF",
                            borderRadius: "16px",
                            padding: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        }}>
                            <div style={{
                                width: "44px", height: "44px", borderRadius: "12px",
                                background: "linear-gradient(135deg, #34C759, #007AFF)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "22px", flexShrink: 0,
                            }}>🤖</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: "600", fontSize: "15px", color: "#000" }}>AI Fitness Coach</div>
                                <div style={{ color: "#8E8E93", fontSize: "13px", marginTop: "2px" }}>
                                    Tap the button at the bottom right to chat
                                </div>
                            </div>
                            <div style={{
                                width: "8px", height: "8px", borderRadius: "50%",
                                background: "#34C759", flexShrink: 0,
                            }} />
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
