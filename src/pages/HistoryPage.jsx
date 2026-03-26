import { useEffect, useState } from "react";
import { getSessions, deleteSession } from "../api/sessions";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from "recharts";

const CHART_COLORS = ["#007AFF", "#FF3B30", "#FF9500", "#34C759", "#AF52DE"];

function HistoryPage({ userId, onBack }) {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedSession, setExpandedSession] = useState(null);

    useEffect(() => { fetchSessions(); }, []);

    const fetchSessions = async () => {
        try {
            const res = await getSessions(userId);
            setSessions(res.data.sessions);
        } catch {
            alert("Error fetching sessions");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (sessionId) => {
        if (!confirm("Delete this session?")) return;
        await deleteSession(userId, sessionId);
        setSessions(sessions.filter(s => s.sessionId !== sessionId));
    };

    const buildChartData = () => {
        const exerciseMap = {};
        sessions.forEach(session => {
            if (!session.exercises) return;
            session.exercises.forEach(ex => {
                if (!exerciseMap[ex.name]) exerciseMap[ex.name] = [];
                const maxWeight = Math.max(...ex.sets.map(s => parseFloat(s.weight) || 0));
                exerciseMap[ex.name].push({ date: session.date, weight: maxWeight });
            });
        });
        return exerciseMap;
    };

    const chartData = buildChartData();
    const exerciseNames = Object.keys(chartData);

    const sectionLabel = {
        fontSize: "13px", fontWeight: "600", color: "#8E8E93",
        textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px",
    };

    if (loading) return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "40vh", gap: "12px" }}>
            <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: "#007AFF", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "20px",
                animation: "pulse 1.5s ease-in-out infinite",
            }}>📋</div>
            <p style={{ color: "#8E8E93", fontSize: "15px" }}>Loading sessions...</p>
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <button
                    onClick={onBack}
                    style={{
                        background: "#E5E5EA", border: "none", color: "#000",
                        padding: "7px 14px", borderRadius: "10px", cursor: "pointer",
                        fontSize: "14px", fontWeight: "500",
                    }}
                >
                    ← Back
                </button>
                <h2 style={{ fontSize: "28px", fontWeight: "700" }}>History</h2>
            </div>

            {/* Progress Charts */}
            {exerciseNames.length > 0 && (
                <div style={{ marginBottom: "28px" }}>
                    <p style={sectionLabel}>Progress Charts</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {exerciseNames.map((name, i) => (
                            <div key={name} style={{
                                background: "#FFFFFF",
                                borderRadius: "16px",
                                padding: "16px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                            }}>
                                <p style={{ fontWeight: "600", fontSize: "15px", color: "#000", marginBottom: "12px" }}>{name}</p>
                                <ResponsiveContainer width="100%" height={180}>
                                    <LineChart data={chartData[name]}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F7" />
                                        <XAxis dataKey="date" stroke="#C7C7CC" tick={{ fontSize: 11 }} />
                                        <YAxis stroke="#C7C7CC" unit="kg" tick={{ fontSize: 11 }} width={40} />
                                        <Tooltip
                                            contentStyle={{
                                                background: "#FFFFFF", border: "none",
                                                borderRadius: "10px", color: "#000",
                                                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                                                fontSize: "13px",
                                            }}
                                            formatter={(val) => [`${val} kg`, "Max Weight"]}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="weight"
                                            stroke={CHART_COLORS[i % CHART_COLORS.length]}
                                            strokeWidth={2.5}
                                            dot={{ r: 4, strokeWidth: 2, fill: "#FFFFFF" }}
                                            activeDot={{ r: 6 }}
                                            name="Max Weight (kg)"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Session List */}
            <p style={sectionLabel}>Session Log</p>

            {sessions.length === 0 ? (
                <div style={{
                    background: "#FFFFFF", borderRadius: "16px", padding: "40px 20px",
                    textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏋️</div>
                    <p style={{ fontWeight: "600", fontSize: "16px", color: "#000", marginBottom: "6px" }}>No sessions yet</p>
                    <p style={{ color: "#8E8E93", fontSize: "14px" }}>Start your first workout to see your history here.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {sessions.map(s => {
                        const isExpanded = expandedSession === s.sessionId;
                        return (
                            <div key={s.sessionId} style={{
                                background: "#FFFFFF",
                                borderRadius: "16px",
                                overflow: "hidden",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                            }}>
                                {/* Session header — tappable to expand */}
                                <div
                                    onClick={() => setExpandedSession(isExpanded ? null : s.sessionId)}
                                    style={{
                                        padding: "16px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        cursor: "pointer",
                                    }}
                                >
                                    <div>
                                        <p style={{ fontWeight: "600", fontSize: "15px", color: "#000", marginBottom: "4px" }}>
                                            {new Date(s.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                        </p>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                            {s.muscleGroups?.map((mg, i) => (
                                                <span key={i} style={{
                                                    background: "#F2F2F7", color: "#3C3C43",
                                                    padding: "2px 8px", borderRadius: "20px",
                                                    fontSize: "12px", fontWeight: "500",
                                                }}>{mg}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <span style={{ color: "#8E8E93", fontSize: "13px" }}>
                                            {s.exercises?.length || 0} exercises
                                        </span>
                                        <span style={{
                                            color: "#C7C7CC", fontSize: "12px",
                                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                            transition: "transform 0.2s ease",
                                            display: "inline-block",
                                        }}>▼</span>
                                    </div>
                                </div>

                                {/* Expanded details */}
                                {isExpanded && (
                                    <div style={{ borderTop: "1px solid #F2F2F7", padding: "14px 16px" }}>
                                        {s.notes && (
                                            <p style={{ color: "#8E8E93", fontSize: "13px", marginBottom: "12px", fontStyle: "italic" }}>
                                                "{s.notes}"
                                            </p>
                                        )}
                                        {s.exercises?.map((ex, i) => (
                                            <div key={i} style={{ marginBottom: "10px" }}>
                                                <p style={{ fontWeight: "600", fontSize: "14px", color: "#000", marginBottom: "4px" }}>{ex.name}</p>
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                                    {ex.sets?.map((set, j) => (
                                                        <span key={j} style={{
                                                            background: "#F2F2F7", color: "#3C3C43",
                                                            padding: "3px 10px", borderRadius: "20px",
                                                            fontSize: "12px", fontWeight: "500",
                                                        }}>
                                                            {set.reps} × {set.weight}kg
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => handleDelete(s.sessionId)}
                                            style={{
                                                background: "rgba(255,59,48,0.08)", border: "none",
                                                color: "#FF3B30", padding: "8px 14px",
                                                borderRadius: "8px", cursor: "pointer",
                                                fontSize: "13px", fontWeight: "500",
                                                marginTop: "4px",
                                            }}
                                        >
                                            Delete Session
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default HistoryPage;
