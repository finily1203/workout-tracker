import { useEffect, useState } from "react";
import { getSessions, deleteSession } from "../api/sessions";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from "recharts";

function HistoryPage({ userId, onBack }) {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSessions();
    }, []);

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

    // Build chart data — max weight per exercise per date
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

    const COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#E91E63", "#9C27B0"];

    const chartData = buildChartData();
    const exerciseNames = Object.keys(chartData);

    if (loading) return <div style={{ color: "white", padding: "2rem" }}>Loading sessions...</div>;

    return (
        <div style={{ color: "white" }}>
            <h2>Workout History</h2>
            <button onClick={onBack}>← Back</button>

            {/* Progress Charts */}
            {exerciseNames.length > 0 && (
                <div style={{ marginTop: "2rem" }}>
                    <h3>💹 Progress Charts</h3>
                    {exerciseNames.map((name, i) => (
                        <div key={name} style={{ background: "#1e1e2e", borderRadius: "8px", padding: "1rem", marginBottom: "1.5rem" }}>
                            <h4 style={{ marginBottom: "0.5rem" }}>{name}</h4>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={chartData[name]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="date" stroke="#aaa" />
                                    <YAxis stroke="#aaa" unit="kg" />
                                    <Tooltip
                                        contentStyle={{ background: "#2a2a3e", border: "none", color: "white" }}
                                        formatter={(val) => [`${val}kg`, "Max Weight"]}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="weight"
                                        stroke={COLORS[i % COLORS.length]}
                                        strokeWidth={2}
                                        dot={{ r: 5 }}
                                        name="Max Weight (kg)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ))}
                </div>
            )}

            {/* Session List */}
            <h3 style={{ marginTop: "2rem" }}>📋 Session Log</h3>
            {sessions.length === 0 ? (
                <p>No sessions yet. Start your first workout!</p>
            ) : (
                sessions.map(s => (
                    <div key={s.sessionId} style={{ background: "#1e1e2e", border: "1px solid #333", borderRadius: "8px", padding: "1rem", marginTop: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <strong>{s.date}</strong>
                            <button onClick={() => handleDelete(s.sessionId)}
                                style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>
                                🗑 Delete
                            </button>
                        </div>
                        <div style={{ color: "#aaa", marginTop: "0.3rem" }}>
                            Muscle Groups: {s.muscleGroups?.join(", ") || "—"}
                        </div>
                        <div style={{ color: "#aaa" }}>Notes: {s.notes || "—"}</div>
                        {s.exercises?.length > 0 && (
                            <div style={{ marginTop: "0.5rem" }}>
                                {s.exercises.map((ex, i) => (
                                    <div key={i} style={{ marginTop: "0.3rem" }}>
                                        <strong>{ex.name}</strong>
                                        {ex.sets?.map((set, j) => (
                                            <span key={j} style={{ marginLeft: "0.5rem", color: "#aaa" }}>
                                                Set {j + 1}: {set.reps} reps @ {set.weight}kg
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default HistoryPage;