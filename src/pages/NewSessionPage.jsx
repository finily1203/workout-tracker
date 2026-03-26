import { useState } from "react";
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

export default function NewSessionPage({ userId, onBack }) {
    const [step, setStep] = useState("template");
    const [notes, setNotes] = useState("");
    const [muscleGroups, setMuscleGroups] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

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
        setExercises(prev => prev.map((ex, i) =>
            i === exIdx ? { ...ex, sets: [...ex.sets, { reps: "", weight: "" }] } : ex
        ));
    };

    const removeSet = (exIdx, setIdx) => {
        setExercises(prev => prev.map((ex, i) =>
            i === exIdx ? { ...ex, sets: ex.sets.filter((_, j) => j !== setIdx) } : ex
        ));
    };

    const addExercise = () => {
        setExercises(prev => [...prev, { name: "", sets: [{ reps: "", weight: "" }], note: "" }]);
    };

    const removeExercise = (idx) => {
        setExercises(prev => prev.filter((_, i) => i !== idx));
    };

    const updateExerciseName = (idx, value) => {
        setExercises(prev => prev.map((ex, i) => i === idx ? { ...ex, name: value } : ex));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await createSession({ userId, muscleGroups, notes, exercises });
            setSaved(true);
        } catch {
            alert("Error saving session");
        } finally {
            setSaving(false);
        }
    };

    const activeTemplate = selectedTemplate ? TEMPLATES[selectedTemplate] : null;
    const accentColor = activeTemplate?.color || "#0A84FF";

    const inputStyle = {
        background: "#2C2C2E",
        border: "none",
        borderRadius: "10px",
        color: "#FFFFFF",
        padding: "10px 12px",
        fontSize: "15px",
        outline: "none",
        width: "100%",
    };

    const smallInputStyle = {
        background: "#2C2C2E",
        border: "none",
        borderRadius: "8px",
        color: "#FFFFFF",
        padding: "8px 6px",
        fontSize: "15px",
        outline: "none",
        width: "72px",
        textAlign: "center",
    };

    const sectionLabel = {
        fontSize: "12px", fontWeight: "600", color: "#8E8E93",
        textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px",
    };

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

    if (step === "template") return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <button onClick={onBack} style={{
                    background: "#2C2C2E", border: "none", color: "#FFFFFF",
                    padding: "7px 14px", borderRadius: "10px", cursor: "pointer",
                    fontSize: "14px", fontWeight: "500",
                }}>← Back</button>
            </div>

            <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "4px", color: "#FFFFFF" }}>New Session</h2>
            <p style={{ color: "#8E8E93", fontSize: "15px", marginBottom: "24px" }}>Choose a template or start from scratch</p>

            <p style={sectionLabel}>3-Day Split Templates</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "12px" }}>
                {Object.entries(TEMPLATES).map(([key, t]) => (
                    <div
                        key={key}
                        onClick={() => loadTemplate(key)}
                        style={{
                            background: "#1C1C1E",
                            border: `1px solid ${t.color}30`,
                            borderTop: `3px solid ${t.color}`,
                            borderRadius: "16px",
                            padding: "20px",
                            cursor: "pointer",
                            transition: "transform 0.15s ease",
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
                    background: "#1C1C1E",
                    border: "1.5px dashed #48484A",
                    borderRadius: "16px",
                    padding: "20px",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "transform 0.15s ease",
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

    return (
        <div>
            {/* Header */}
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

            <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "4px", color: "#FFFFFF" }}>Log Session</h2>
            <p style={{ color: "#8E8E93", fontSize: "15px", marginBottom: "24px" }}>Fill in your weights and reps</p>

            {/* Notes */}
            <div style={{ background: "#1C1C1E", borderRadius: "14px", padding: "16px", marginBottom: "12px", border: "1px solid #38383A" }}>
                <p style={sectionLabel}>Session Notes</p>
                <input
                    style={inputStyle}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="How are you feeling today?"
                />
            </div>

            {/* Muscle Groups */}
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

            {/* Exercises */}
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
                onClick={handleSave}
                disabled={saving}
                style={{
                    background: saving ? "#48484A" : "#0A84FF",
                    color: "white", border: "none",
                    padding: "16px", borderRadius: "14px",
                    fontSize: "16px", fontWeight: "600",
                    cursor: saving ? "default" : "pointer",
                    width: "100%", marginTop: "8px",
                    boxShadow: saving ? "none" : "0 4px 16px rgba(10,132,255,0.3)",
                    transition: "all 0.2s ease",
                }}
            >{saving ? "Saving..." : "Save Session"}</button>
        </div>
    );
}
