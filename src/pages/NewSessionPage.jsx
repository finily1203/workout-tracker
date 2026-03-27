import { useState, useEffect, useRef } from "react";
import { createSession } from "../api/sessions";

const TEMPLATES = {
    push: {
        label: "Push Day",
        emoji: "💪",
        subtitle: "Chest · Shoulders · Triceps",
        color: "#FF453A",
        muscleGroups: ["Chest", "Shoulders", "Triceps"],
        exercises: [
            { name: "Barbell Bench Press", sets: [{ reps: "6", weight: "" }, { reps: "6", weight: "" }, { reps: "8", weight: "" }, { reps: "8", weight: "" }], note: "Keep weight in main round, can go 5–10% lighter in round 2" },
            { name: "Incline Dumbbell Press", sets: [{ reps: "8", weight: "" }, { reps: "10", weight: "" }, { reps: "10", weight: "" }], note: "Control the descent, chest engagement" },
            { name: "Shoulder Press (DB/Machine)", sets: [{ reps: "8", weight: "" }, { reps: "10", weight: "" }, { reps: "10", weight: "" }], note: "Brace back, don't shrug" },
            { name: "Lateral Raise", sets: [{ reps: "12", weight: "" }, { reps: "15", weight: "" }, { reps: "15", weight: "" }], note: "Slight elbow bend, control range" },
            { name: "Tricep Pushdown", sets: [{ reps: "12", weight: "" }, { reps: "12", weight: "" }, { reps: "12", weight: "" }], note: "Elbows tucked, squeeze triceps" },
            { name: "Overhead Tricep Extension", sets: [{ reps: "12", weight: "" }, { reps: "12", weight: "" }], note: "Can use dumbbell or rope" },
        ]
    },
    pull: {
        label: "Pull Day",
        emoji: "🏋️",
        subtitle: "Back · Rear Delt · Biceps",
        color: "#0A84FF",
        muscleGroups: ["Back", "Biceps", "Shoulders"],
        exercises: [
            { name: "Pull-Up / Lat Pulldown", sets: [{ reps: "6", weight: "" }, { reps: "8", weight: "" }, { reps: "10", weight: "" }, { reps: "10", weight: "" }], note: "Depress scapula first, hands are just hooks" },
            { name: "Chest Supported Row", sets: [{ reps: "8", weight: "" }, { reps: "10", weight: "" }, { reps: "10", weight: "" }], note: "Control descent, back engagement" },
            { name: "Seated Cable Row", sets: [{ reps: "10", weight: "" }, { reps: "10", weight: "" }, { reps: "10", weight: "" }], note: "Back drives the movement, don't pull with hands" },
            { name: "Face Pull", sets: [{ reps: "12", weight: "" }, { reps: "15", weight: "" }, { reps: "15", weight: "" }], note: "Squeeze rear delts, control the movement" },
            { name: "Barbell or Dumbbell Curl", sets: [{ reps: "10", weight: "" }, { reps: "12", weight: "" }, { reps: "12", weight: "" }], note: "Control the lowering, bicep engagement" },
            { name: "Hammer Curl", sets: [{ reps: "12", weight: "" }, { reps: "12", weight: "" }], note: "Stimulates forearm + biceps" },
        ]
    },
    legs: {
        label: "Leg Day",
        emoji: "🦵",
        subtitle: "Quads · Hamstrings · Glutes · Calves",
        color: "#BF5AF2",
        muscleGroups: ["Legs", "Core"],
        exercises: [
            { name: "Barbell Squat", sets: [{ reps: "6", weight: "" }, { reps: "6", weight: "" }, { reps: "8", weight: "" }, { reps: "8", weight: "" }], note: "Normal weight in main round, can go 5–10% lighter in round 2" },
            { name: "Romanian Deadlift", sets: [{ reps: "8", weight: "" }, { reps: "10", weight: "" }, { reps: "10", weight: "" }], note: "Feel the stretch in hamstrings, keep back straight" },
            { name: "Leg Press", sets: [{ reps: "12", weight: "" }, { reps: "12", weight: "" }, { reps: "12", weight: "" }], note: "Vary foot position to target different areas" },
            { name: "Leg Curl", sets: [{ reps: "12", weight: "" }, { reps: "12", weight: "" }, { reps: "12", weight: "" }], note: "Control the lowering" },
            { name: "Standing Calf Raise", sets: [{ reps: "12", weight: "" }, { reps: "15", weight: "" }, { reps: "15", weight: "" }], note: "Slow up and down" },
        ]
    }
};

const MUSCLE_OPTIONS = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs", "Core"];

const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export default function NewSessionPage({ userId, onBack }) {
    const STORAGE_KEY = `activeSession_${userId}`;

    const [step, setStep] = useState("template");
    const [notes, setNotes] = useState("");
    const [muscleGroups, setMuscleGroups] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [elapsed, setElapsed] = useState(0);
    const [savedSession, setSavedSession] = useState(null);
    const startTimeRef = useRef(null);
    const intervalRef = useRef(null);

    // Check for saved session on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setSavedSession(JSON.parse(raw));
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    // Auto-save session to localStorage whenever relevant state changes
    useEffect(() => {
        if (step === "logging" || step === "active") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                step,
                exercises,
                muscleGroups,
                notes,
                selectedTemplate,
                startTimestamp: startTimeRef.current,
            }));
        }
    }, [step, exercises, muscleGroups, notes, selectedTemplate]);

    // Timer
    useEffect(() => {
        if (step === "active") {
            if (!startTimeRef.current) startTimeRef.current = Date.now();
            setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
            intervalRef.current = setInterval(() => {
                setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [step]);

    const resumeSession = () => {
        const s = savedSession;
        startTimeRef.current = s.startTimestamp;
        setSelectedTemplate(s.selectedTemplate);
        setMuscleGroups(s.muscleGroups);
        setNotes(s.notes);
        setExercises(s.exercises);
        setSavedSession(null);
        setStep(s.step);
    };

    const discardSaved = () => {
        localStorage.removeItem(STORAGE_KEY);
        setSavedSession(null);
    };

    const loadTemplate = (key) => {
        const t = TEMPLATES[key];
        setSelectedTemplate(key);
        setMuscleGroups(t.muscleGroups);
        setExercises(t.exercises.map(ex => ({ ...ex, sets: ex.sets.map(s => ({ ...s })) })));
        setNotes("");
        setStep("logging");
    };

    const startBlank = () => {
        setSelectedTemplate(null);
        setMuscleGroups([]);
        setExercises([{ name: "", sets: [{ reps: "", weight: "" }], note: "" }]);
        setNotes("");
        setStep("logging");
    };

    const startSession = () => {
        startTimeRef.current = Date.now();
        setExercises(prev => prev.map(ex => ({
            ...ex,
            sets: ex.sets.map(s => ({ ...s, done: false }))
        })));
        setElapsed(0);
        setStep("active");
    };

    const toggleMuscle = (m) => {
        setMuscleGroups(prev =>
            prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
        );
    };

    const updateSet = (exIdx, setIdx, field, value) => {
        setExercises(prev => prev.map((ex, i) => {
            if (i !== exIdx) return ex;
            return { ...ex, sets: ex.sets.map((s, j) => j === setIdx ? { ...s, [field]: value } : s) };
        }));
    };

    const addSet = (exIdx) => {
        const newSet = step === "active"
            ? { reps: "", weight: "", done: false }
            : { reps: "", weight: "" };
        setExercises(prev => prev.map((ex, i) =>
            i === exIdx ? { ...ex, sets: [...ex.sets, newSet] } : ex
        ));
    };

    const removeSet = (exIdx, setIdx) => {
        setExercises(prev => prev.map((ex, i) =>
            i === exIdx ? { ...ex, sets: ex.sets.filter((_, j) => j !== setIdx) } : ex
        ));
    };

    const addExercise = () => {
        const newEx = step === "active"
            ? { name: "", sets: [{ reps: "", weight: "", done: false }], note: "" }
            : { name: "", sets: [{ reps: "", weight: "" }], note: "" };
        setExercises(prev => [...prev, newEx]);
    };

    const removeExercise = (idx) => {
        setExercises(prev => prev.filter((_, i) => i !== idx));
    };

    const updateExerciseName = (idx, value) => {
        setExercises(prev => prev.map((ex, i) => i === idx ? { ...ex, name: value } : ex));
    };

    const handleSave = async () => {
        clearInterval(intervalRef.current);
        localStorage.removeItem(STORAGE_KEY);
        setSaving(true);
        try {
            await createSession({ userId, muscleGroups, notes, exercises, duration: elapsed });
            setSaved(true);
        } catch {
            alert("Error saving session");
        } finally {
            setSaving(false);
        }
    };

    const activeTemplate = selectedTemplate ? TEMPLATES[selectedTemplate] : null;
    const accentColor = activeTemplate?.color || "#0A84FF";

    const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const doneSets = exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.done).length, 0);

    const inputStyle = {
        background: "#2C2C2E", border: "none", borderRadius: "10px",
        color: "#FFFFFF", padding: "10px 12px", fontSize: "15px",
        outline: "none", width: "100%",
    };

    const smallInputStyle = {
        background: "#2C2C2E", border: "none", borderRadius: "8px",
        color: "#FFFFFF", padding: "8px 6px", fontSize: "15px",
        outline: "none", width: "72px", textAlign: "center",
    };

    const sectionLabel = {
        fontSize: "12px", fontWeight: "600", color: "#8E8E93",
        textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px",
    };

    // ── Saved screen ──────────────────────────────────────────────────────────
    if (saved) return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", gap: "12px" }}>
            <div style={{
                width: "72px", height: "72px", borderRadius: "20px",
                background: "linear-gradient(135deg, #30D158, #0A84FF)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "36px", boxShadow: "0 8px 24px rgba(48,209,88,0.3)",
            }}>✓</div>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#FFFFFF" }}>Session Saved!</h2>
            <p style={{ color: "#8E8E93", fontSize: "15px" }}>Great work today. Keep it up!</p>
            <p style={{ color: "#30D158", fontSize: "20px", fontWeight: "700" }}>⏱ {formatTime(elapsed)}</p>
            <button
                onClick={onBack}
                style={{
                    background: "#0A84FF", color: "white", border: "none",
                    padding: "14px 32px", borderRadius: "12px", fontSize: "16px",
                    fontWeight: "600", cursor: "pointer", marginTop: "8px",
                }}
            >Back to Dashboard</button>
        </div>
    );

    // ── Template selection ────────────────────────────────────────────────────
    if (step === "template") return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <button onClick={onBack} style={{
                    background: "#2C2C2E", border: "none", color: "#FFFFFF",
                    padding: "7px 14px", borderRadius: "10px", cursor: "pointer",
                    fontSize: "14px", fontWeight: "500",
                }}>← Back</button>
            </div>

            {/* Resume banner */}
            {savedSession && (
                <div style={{
                    background: "#1C1C1E", border: "1px solid #FF9F0A",
                    borderRadius: "14px", padding: "14px 16px",
                    marginBottom: "20px", display: "flex",
                    alignItems: "center", justifyContent: "space-between", gap: "12px",
                }}>
                    <div>
                        <p style={{ fontWeight: "600", fontSize: "14px", color: "#FF9F0A", marginBottom: "2px" }}>
                            ⚡ Unfinished session
                        </p>
                        <p style={{ color: "#8E8E93", fontSize: "13px" }}>
                            {savedSession.step === "active" ? "Session was in progress" : "Setup was not completed"}
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                        <button
                            onClick={discardSaved}
                            style={{
                                background: "none", border: "1px solid #38383A",
                                color: "#8E8E93", padding: "7px 12px",
                                borderRadius: "8px", cursor: "pointer", fontSize: "13px",
                            }}
                        >Discard</button>
                        <button
                            onClick={resumeSession}
                            style={{
                                background: "#FF9F0A", border: "none",
                                color: "#000000", padding: "7px 14px",
                                borderRadius: "8px", cursor: "pointer",
                                fontSize: "13px", fontWeight: "600",
                            }}
                        >Resume</button>
                    </div>
                </div>
            )}

            <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "4px", color: "#FFFFFF" }}>New Session</h2>
            <p style={{ color: "#8E8E93", fontSize: "15px", marginBottom: "24px" }}>Choose a template or start from scratch</p>

            <p style={sectionLabel}>3-Day Split Templates</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "12px" }}>
                {Object.entries(TEMPLATES).map(([key, t]) => (
                    <div
                        key={key}
                        onClick={() => loadTemplate(key)}
                        style={{
                            background: "#1C1C1E", border: `1px solid ${t.color}30`,
                            borderTop: `3px solid ${t.color}`, borderRadius: "16px",
                            padding: "20px", cursor: "pointer", transition: "transform 0.15s ease",
                        }}
                        onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
                        onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    >
                        <div style={{ fontSize: "28px", marginBottom: "10px" }}>{t.emoji}</div>
                        <div style={{ fontWeight: "700", fontSize: "16px", color: t.color, marginBottom: "3px" }}>{t.label}</div>
                        <div style={{ color: "#8E8E93", fontSize: "13px", marginBottom: "14px" }}>{t.subtitle}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                            {t.exercises.slice(0, 3).map((ex, i) => (
                                <span key={i} style={{
                                    background: `${t.color}18`, color: t.color,
                                    padding: "3px 8px", borderRadius: "20px",
                                    fontSize: "12px", fontWeight: "500",
                                }}>{ex.name}</span>
                            ))}
                            <span style={{ color: "#48484A", fontSize: "12px", padding: "3px 4px" }}>
                                +{t.exercises.length - 3} more
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div
                onClick={startBlank}
                style={{
                    background: "#1C1C1E", border: "1.5px dashed #48484A",
                    borderRadius: "16px", padding: "20px", cursor: "pointer",
                    textAlign: "center", transition: "transform 0.15s ease",
                }}
                onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
                <div style={{ fontSize: "24px", marginBottom: "6px" }}>✏️</div>
                <div style={{ fontWeight: "600", fontSize: "15px", color: "#FFFFFF", marginBottom: "3px" }}>Custom Session</div>
                <div style={{ color: "#8E8E93", fontSize: "13px" }}>Build your own workout from scratch</div>
            </div>
        </div>
    );

    // ── Active live session ───────────────────────────────────────────────────
    if (step === "active") return (
        <div>
            {/* Timer bar */}
            <div style={{
                background: "#1C1C1E", border: "1px solid #38383A",
                borderRadius: "16px", padding: "16px 20px",
                marginBottom: "16px", display: "flex",
                alignItems: "center", justifyContent: "space-between",
            }}>
                <div>
                    <p style={{ color: "#8E8E93", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Session Time</p>
                    <p style={{ color: "#30D158", fontSize: "36px", fontWeight: "700", fontVariantNumeric: "tabular-nums", letterSpacing: "-1px" }}>
                        {formatTime(elapsed)}
                    </p>
                </div>
                <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#8E8E93", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Sets Done</p>
                    <p style={{ fontSize: "28px", fontWeight: "700", color: "#FFFFFF" }}>
                        <span style={{ color: accentColor }}>{doneSets}</span>
                        <span style={{ color: "#48484A" }}> / {totalSets}</span>
                    </p>
                </div>
            </div>

            {/* Progress bar */}
            <div style={{ background: "#2C2C2E", borderRadius: "4px", height: "4px", marginBottom: "20px", overflow: "hidden" }}>
                <div style={{
                    height: "100%", borderRadius: "4px", background: accentColor,
                    width: totalSets > 0 ? `${(doneSets / totalSets) * 100}%` : "0%",
                    transition: "width 0.3s ease",
                }} />
            </div>

            {exercises.map((ex, exIdx) => {
                const exDone = ex.sets.every(s => s.done);
                return (
                    <div key={exIdx} style={{
                        background: "#1C1C1E", borderRadius: "14px", padding: "16px",
                        marginBottom: "10px",
                        border: exDone ? `1px solid ${accentColor}60` : "1px solid #38383A",
                        transition: "border-color 0.2s ease",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                            <div style={{
                                width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                                background: exDone ? accentColor : "#2C2C2E",
                                border: exDone ? "none" : "2px solid #48484A",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "13px", transition: "all 0.2s ease",
                            }}>
                                {exDone && "✓"}
                            </div>
                            <span style={{
                                fontWeight: "700", fontSize: "16px",
                                color: exDone ? "#8E8E93" : "#FFFFFF",
                                textDecoration: exDone ? "line-through" : "none",
                                transition: "all 0.2s ease",
                            }}>
                                {ex.name || "Unnamed Exercise"}
                            </span>
                        </div>

                        {ex.note && (
                            <p style={{ color: "#48484A", fontSize: "12px", fontStyle: "italic", marginBottom: "12px" }}>
                                💡 {ex.note}
                            </p>
                        )}

                        <div style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                            <span style={{ width: "52px", flexShrink: 0 }} />
                            <span style={{ color: "#8E8E93", fontSize: "11px", width: "72px", textAlign: "center", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.3px" }}>Reps</span>
                            <span style={{ color: "#8E8E93", fontSize: "11px", width: "72px", textAlign: "center", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.3px" }}>kg</span>
                        </div>

                        {ex.sets.map((set, setIdx) => (
                            <div key={setIdx} style={{
                                display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px",
                                opacity: set.done ? 0.45 : 1, transition: "opacity 0.2s ease",
                            }}>
                                <span style={{ color: "#48484A", fontSize: "13px", width: "52px", flexShrink: 0, fontWeight: "500" }}>
                                    Set {setIdx + 1}
                                </span>
                                <input
                                    type="number"
                                    style={{ ...smallInputStyle, textDecoration: set.done ? "line-through" : "none" }}
                                    value={set.reps}
                                    onChange={e => updateSet(exIdx, setIdx, "reps", e.target.value)}
                                    placeholder="—"
                                />
                                <input
                                    type="number"
                                    style={{ ...smallInputStyle, textDecoration: set.done ? "line-through" : "none" }}
                                    value={set.weight}
                                    onChange={e => updateSet(exIdx, setIdx, "weight", e.target.value)}
                                    placeholder="—"
                                />
                                <button
                                    onClick={() => updateSet(exIdx, setIdx, "done", !set.done)}
                                    style={{
                                        width: "36px", height: "36px", borderRadius: "50%", border: "none",
                                        background: set.done ? "#30D158" : "#2C2C2E",
                                        color: set.done ? "#FFFFFF" : "#48484A",
                                        cursor: "pointer", fontSize: "16px", flexShrink: 0,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        transition: "all 0.2s ease",
                                        boxShadow: set.done ? "0 2px 8px rgba(48,209,88,0.4)" : "none",
                                    }}
                                >✓</button>
                            </div>
                        ))}

                        <button
                            onClick={() => addSet(exIdx)}
                            style={{
                                background: "none", border: "none", color: accentColor,
                                cursor: "pointer", fontSize: "14px", fontWeight: "500",
                                padding: "6px 0", marginTop: "4px",
                            }}
                        >+ Add Set</button>
                    </div>
                );
            })}

            <button
                onClick={addExercise}
                style={{
                    background: "#1C1C1E", border: "1.5px dashed #48484A",
                    color: "#8E8E93", padding: "14px", borderRadius: "14px",
                    cursor: "pointer", fontSize: "15px", fontWeight: "500",
                    width: "100%", marginBottom: "12px",
                }}
            >+ Add Exercise</button>

            <button
                onClick={handleSave}
                disabled={saving}
                style={{
                    background: saving ? "#48484A" : "#30D158",
                    color: "white", border: "none", padding: "16px", borderRadius: "14px",
                    fontSize: "16px", fontWeight: "600",
                    cursor: saving ? "default" : "pointer", width: "100%",
                    boxShadow: saving ? "none" : "0 4px 16px rgba(48,209,88,0.3)",
                    transition: "all 0.2s ease",
                }}
            >{saving ? "Saving..." : "End Session"}</button>
        </div>
    );

    // ── Setup / logging ───────────────────────────────────────────────────────
    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                <button onClick={() => setStep("template")} style={{
                    background: "#2C2C2E", border: "none", color: "#FFFFFF",
                    padding: "7px 14px", borderRadius: "10px", cursor: "pointer",
                    fontSize: "14px", fontWeight: "500",
                }}>← Templates</button>
                {activeTemplate && (
                    <span style={{
                        background: `${accentColor}18`, color: accentColor,
                        padding: "5px 12px", borderRadius: "20px",
                        fontSize: "14px", fontWeight: "600",
                    }}>
                        {activeTemplate.emoji} {activeTemplate.label}
                    </span>
                )}
            </div>

            <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "4px", color: "#FFFFFF" }}>Set Up Session</h2>
            <p style={{ color: "#8E8E93", fontSize: "15px", marginBottom: "24px" }}>Add your exercises, then start when ready</p>

            <div style={{ background: "#1C1C1E", borderRadius: "14px", padding: "16px", marginBottom: "12px", border: "1px solid #38383A" }}>
                <p style={sectionLabel}>Session Notes</p>
                <input
                    style={inputStyle}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="How are you feeling today?"
                />
            </div>

            <div style={{ background: "#1C1C1E", borderRadius: "14px", padding: "16px", marginBottom: "12px", border: "1px solid #38383A" }}>
                <p style={sectionLabel}>Muscle Groups</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {MUSCLE_OPTIONS.map(m => {
                        const active = muscleGroups.includes(m);
                        return (
                            <button
                                key={m}
                                onClick={() => toggleMuscle(m)}
                                style={{
                                    padding: "6px 14px", borderRadius: "20px",
                                    fontSize: "14px", fontWeight: "500", cursor: "pointer", border: "none",
                                    background: active ? accentColor : "#2C2C2E",
                                    color: active ? "white" : "#8E8E93",
                                    transition: "all 0.15s ease",
                                }}
                            >{m}</button>
                        );
                    })}
                </div>
            </div>

            <div style={{ marginBottom: "12px" }}>
                <p style={sectionLabel}>Exercises</p>

                {exercises.map((ex, exIdx) => (
                    <div key={exIdx} style={{
                        background: "#1C1C1E", borderRadius: "14px", padding: "16px",
                        marginBottom: "10px", border: "1px solid #38383A",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <input
                                style={{ ...inputStyle, fontWeight: "600", fontSize: "16px", flex: 1 }}
                                value={ex.name}
                                onChange={e => updateExerciseName(exIdx, e.target.value)}
                                placeholder="Exercise name"
                            />
                            <button
                                onClick={() => removeExercise(exIdx)}
                                style={{
                                    background: "rgba(255,69,58,0.15)", border: "none",
                                    color: "#FF453A", width: "32px", height: "32px",
                                    borderRadius: "8px", cursor: "pointer", fontSize: "16px",
                                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                }}
                            >×</button>
                        </div>

                        {ex.note && (
                            <p style={{ color: "#48484A", fontSize: "12px", fontStyle: "italic", marginBottom: "12px", marginTop: "6px" }}>
                                💡 {ex.note}
                            </p>
                        )}

                        <div style={{ display: "flex", gap: "8px", marginBottom: "6px", marginTop: "12px" }}>
                            <span style={{ width: "52px", flexShrink: 0 }} />
                            <span style={{ color: "#8E8E93", fontSize: "11px", width: "72px", textAlign: "center", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.3px" }}>Reps</span>
                            <span style={{ color: "#8E8E93", fontSize: "11px", width: "72px", textAlign: "center", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.3px" }}>kg</span>
                        </div>

                        {ex.sets.map((set, setIdx) => (
                            <div key={setIdx} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                                <span style={{ color: "#48484A", fontSize: "13px", width: "52px", flexShrink: 0, fontWeight: "500" }}>
                                    Set {setIdx + 1}
                                </span>
                                <input
                                    type="number"
                                    style={smallInputStyle}
                                    value={set.reps}
                                    onChange={e => updateSet(exIdx, setIdx, "reps", e.target.value)}
                                    placeholder="—"
                                />
                                <input
                                    type="number"
                                    style={smallInputStyle}
                                    value={set.weight}
                                    onChange={e => updateSet(exIdx, setIdx, "weight", e.target.value)}
                                    placeholder="—"
                                />
                                {ex.sets.length > 1 && (
                                    <button
                                        onClick={() => removeSet(exIdx, setIdx)}
                                        style={{
                                            background: "none", border: "none",
                                            color: "#48484A", cursor: "pointer", fontSize: "18px", padding: "0 4px",
                                        }}
                                    >×</button>
                                )}
                            </div>
                        ))}

                        <button
                            onClick={() => addSet(exIdx)}
                            style={{
                                background: "none", border: "none", color: accentColor,
                                cursor: "pointer", fontSize: "14px", fontWeight: "500",
                                padding: "6px 0", marginTop: "4px",
                            }}
                        >+ Add Set</button>
                    </div>
                ))}

                <button
                    onClick={addExercise}
                    style={{
                        background: "#1C1C1E", border: "1.5px dashed #48484A",
                        color: "#8E8E93", padding: "14px", borderRadius: "14px",
                        cursor: "pointer", fontSize: "15px", fontWeight: "500",
                        width: "100%", transition: "all 0.15s ease",
                    }}
                >+ Add Exercise</button>
            </div>

            <button
                onClick={startSession}
                style={{
                    background: accentColor, color: "white", border: "none",
                    padding: "16px", borderRadius: "14px", fontSize: "16px", fontWeight: "600",
                    cursor: "pointer", width: "100%", marginTop: "8px",
                    boxShadow: `0 4px 16px ${accentColor}50`,
                    transition: "all 0.2s ease",
                }}
            >Start Session</button>
        </div>
    );
}
