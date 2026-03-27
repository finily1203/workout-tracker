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

    const storageKey = `displayName_${userId}`;
    const [displayName, setDisplayName] = useState(
        () => localStorage.getItem(storageKey) || ""
    );
    const [editingName, setEditingName] = useState(!localStorage.getItem(storageKey));
    const [nameInput, setNameInput] = useState(displayName);

    const saveName = () => {
        const trimmed = nameInput.trim();
        if (!trimmed) return;
        localStorage.setItem(storageKey, trimmed);
        setDisplayName(trimmed);
        setEditingName(false);
    };

    const handleNameKeyDown = (e) => {
        if (e.key === "Enter") saveName();
        if (e.key === "Escape" && displayName) setEditingName(false);
    };

    return (
        <div style={{ background: "#000000", minHeight: "100vh" }}>
            <Navbar onSignOut={onSignOut} setPage={setPage} currentPage={page} />

            <div style={{ padding: "28px 20px 100px", maxWidth: "680px", margin: "0 auto" }}>
                {page === "dashboard" && (
                    <div>
                        {/* Greeting */}
                        <div style={{ marginBottom: "28px" }}>
                            <p style={{ color: "#8E8E93", fontSize: "15px", marginBottom: "4px" }}>
                                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                            </p>
                            {editingName ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                    <h1 style={{ fontSize: "34px", fontWeight: "700", letterSpacing: "-0.5px", color: "#FFFFFF", whiteSpace: "nowrap" }}>
                                        {getGreeting()},
                                    </h1>
                                    <input
                                        autoFocus
                                        value={nameInput}
                                        onChange={e => setNameInput(e.target.value)}
                                        onKeyDown={handleNameKeyDown}
                                        placeholder="Your name"
                                        style={{
                                            fontSize: "28px", fontWeight: "700", letterSpacing: "-0.5px",
                                            border: "none", borderBottom: "2px solid #0A84FF",
                                            outline: "none", background: "transparent",
                                            color: "#FFFFFF", width: "200px", padding: "2px 0",
                                        }}
                                    />
                                    <button
                                        onClick={saveName}
                                        disabled={!nameInput.trim()}
                                        style={{
                                            background: "#0A84FF", color: "white", border: "none",
                                            padding: "8px 16px", borderRadius: "10px",
                                            cursor: nameInput.trim() ? "pointer" : "default",
                                            fontSize: "14px", fontWeight: "600",
                                            opacity: nameInput.trim() ? 1 : 0.4,
                                        }}
                                    >Save</button>
                                </div>
                            ) : (
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <h1 style={{ fontSize: "34px", fontWeight: "700", letterSpacing: "-0.5px", color: "#FFFFFF" }}>
                                        {getGreeting()}, {displayName}
                                    </h1>
                                    <button
                                        onClick={() => { setNameInput(displayName); setEditingName(true); }}
                                        title="Edit name"
                                        style={{
                                            background: "rgba(255,255,255,0.08)", border: "none",
                                            color: "#8E8E93", padding: "4px 10px",
                                            borderRadius: "8px", cursor: "pointer", fontSize: "13px",
                                        }}
                                    >Edit</button>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                            <button
                                onClick={() => setPage("new")}
                                style={{
                                    background: "#0A84FF",
                                    border: "none",
                                    color: "white",
                                    padding: "20px",
                                    borderRadius: "16px",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    boxShadow: "0 4px 16px rgba(10,132,255,0.3)",
                                    transition: "transform 0.15s ease",
                                }}
                                onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
                                onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                            >
                                <div style={{ fontSize: "28px", marginBottom: "10px" }}>💪</div>
                                <div style={{ fontWeight: "700", fontSize: "16px" }}>New Session</div>
                                <div style={{ fontSize: "13px", opacity: 0.75, marginTop: "3px" }}>Log your workout</div>
                            </button>

                            <button
                                onClick={() => setPage("history")}
                                style={{
                                    background: "#1C1C1E",
                                    border: "1px solid #38383A",
                                    color: "#FFFFFF",
                                    padding: "20px",
                                    borderRadius: "16px",
                                    cursor: "pointer",
                                    textAlign: "left",
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
                            background: "#1C1C1E",
                            border: "1px solid #38383A",
                            borderRadius: "16px",
                            padding: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                        }}>
                            <div style={{
                                width: "44px", height: "44px", borderRadius: "12px",
                                background: "linear-gradient(135deg, #30D158, #0A84FF)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "22px", flexShrink: 0,
                            }}>🤖</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: "600", fontSize: "15px", color: "#FFFFFF" }}>AI Fitness Coach</div>
                                <div style={{ color: "#8E8E93", fontSize: "13px", marginTop: "2px" }}>
                                    Tap the button at the bottom right to chat
                                </div>
                            </div>
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#30D158", flexShrink: 0 }} />
                        </div>
                    </div>
                )}

                {page === "new" && <NewSessionPage userId={userId} onBack={() => setPage("dashboard")} />}
                {page === "history" && <HistoryPage userId={userId} onBack={() => setPage("dashboard")} />}
            </div>
        </div>
    );
}

export default DashboardPage;
