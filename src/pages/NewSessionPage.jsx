import { useState } from "react";
import { createSession } from "../api/sessions";

const TEMPLATES = {
    push: {
        label: "Push Day",
        emoji: "💪",
        subtitle: "Chest + Shoulders + Triceps",
        color: "#FF6B6B",
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
        subtitle: "Back + Rear Delt + Biceps",
        color: "#4ECDC4",
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
        subtitle: "Quads + Hamstrings + Glutes + Calves",
        color: "#A78BFA",
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
    const [step, setStep] = useState("template"); // template | logging
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
        setExercises(prev => {
            const updated = prev.map((ex, i) => {
                if (i !== exIdx) return ex;
                const newSets = ex.sets.map((s, j) =>
                    j === setIdx ? { ...s, [field]: value } : s
                );
                return { ...ex, sets: newSets };
            });
            return updated;
        });
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

    const styles = {
        page: {
            minHeight: "100vh",
            background: "#0a0a0f",
            color: "white",
            fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
            padding: "2rem",
        },
        header: {
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2rem",
        },
        backBtn: {
            background: "rgba(255,255,255,0.08)",
            border: "none",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            cursor: "pointer",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            backdropFilter: "blur(10px)",
        },
        title: {
            fontSize: "1.8rem",
            fontWeight: "700",
            letterSpacing: "-0.5px",
        },
        subtitle: {
            color: "#aaa",
            fontSize: "1rem",
            marginTop: "0.3rem",
        },
        templateGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
            marginBottom: "1.5rem",
        },
        templateCard: (color) => ({
            background: `linear-gradient(135deg, ${color}15, ${color}08)`,
            border: `1px solid ${color}30`,
            borderRadius: "16px",
            padding: "1.5rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
        }),
        blankCard: {
            background: "rgba(255,255,255,0.03)",
            border: "1px dashed rgba(255,255,255,0.15)",
            borderRadius: "16px",
            padding: "1.5rem",
            cursor: "pointer",
            textAlign: "center",
            transition: "all 0.2s ease",
        },
        exerciseCard: {
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "1.2rem",
            marginBottom: "1rem",
        },
        input: {
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            color: "white",
            padding: "0.6rem 0.9rem",
            fontSize: "0.9rem",
            outline: "none",
            width: "100%",
        },
        setRow: {
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            marginBottom: "0.5rem",
        },
        setNum: {
            color: "#666",
            fontSize: "0.8rem",
            width: "40px",
            flexShrink: 0,
        },
        smallInput: {
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "white",
            padding: "0.5rem 0.7rem",
            fontSize: "0.9rem",
            outline: "none",
            width: "80px",
            textAlign: "center",
        },
        tag: (active, color = "#4CAF50") => ({
            padding: "0.4rem 0.9rem",
            borderRadius: "20px",
            fontSize: "0.85rem",
            cursor: "pointer",
            border: active ? `1px solid ${color}` : "1px solid rgba(255,255,255,0.1)",
            background: active ? `${color}20` : "transparent",
            color: active ? color : "#888",
            transition: "all 0.15s ease",
        }),
        saveBtn: {
            background: "linear-gradient(135deg, #4CAF50, #45a049)",
            color: "white",
            border: "none",
            padding: "1rem 2.5rem",
            borderRadius: "14px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            width: "100%",
            marginTop: "1.5rem",
            letterSpacing: "0.3px",
        },
        addBtn: {
            background: "transparent",
            border: "1px dashed rgba(255,255,255,0.2)",
            color: "#888",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.85rem",
            transition: "all 0.15s ease",
        },
        noteText: {
            color: "#555",
            fontSize: "0.8rem",
            marginTop: "0.4rem",
            fontStyle: "italic",
        },
        sectionLabel: {
            color: "white",
            fontSize: "1rem",
            fontWeight: "600",
            letterSpacing: "-0.2px",
            marginBottom: "0.8rem",
        },
    };

    if (saved) return (
        <div style={{ ...styles.page, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "0.5rem" }}>Session Saved!</h2>
            <p style={{ color: "#666", marginBottom: "2rem" }}>Great work today. Keep it up!</p>
            <button onClick={onBack} style={{ ...styles.saveBtn, width: "auto", padding: "0.8rem 2rem" }}>
                Back to Dashboard
            </button>
        </div>
    );

    if (step === "template") return (
        <div style={styles.page}>
            <div style={styles.header}>
                <button onClick={onBack} style={styles.backBtn}>← Back</button>
            </div>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <h1 style={styles.title}>New Session</h1>
                <p style={styles.subtitle}>Choose a template or start from scratch</p>

                <div style={{ marginTop: "2rem", marginBottom: "0.8rem" }}>
                    <p style={styles.sectionLabel}>3-Day Split Templates</p>
                </div>

                <div style={styles.templateGrid}>
                    {Object.entries(TEMPLATES).map(([key, t]) => (
                        <div
                            key={key}
                            style={styles.templateCard(t.color)}
                            onClick={() => loadTemplate(key)}
                            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                        >
                            <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>{t.emoji}</div>
                            <div style={{ fontWeight: "700", fontSize: "1.1rem", marginBottom: "0.3rem", color: t.color }}>{t.label}</div>
                            <div style={{ color: "#888", fontSize: "0.85rem", marginBottom: "1rem" }}>{t.subtitle}</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                                {t.exercises.slice(0, 3).map((ex, i) => (
                                    <span key={i} style={{
                                        background: `${t.color}15`,
                                        color: t.color,
                                        padding: "0.2rem 0.6rem",
                                        borderRadius: "20px",
                                        fontSize: "0.75rem"
                                    }}>{ex.name}</span>
                                ))}
                                <span style={{ color: "#555", fontSize: "0.75rem", padding: "0.2rem 0.4rem" }}>
                                    +{t.exercises.length - 3} more
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    style={styles.blankCard}
                    onClick={startBlank}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}
                >
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>✏️</div>
                    <div style={{ fontWeight: "600", marginBottom: "0.3rem" }}>Custom Session</div>
                    <div style={{ color: "#555", fontSize: "0.85rem" }}>Build your own workout from scratch</div>
                </div>
            </div>
        </div>
    );

    const activeTemplate = selectedTemplate ? TEMPLATES[selectedTemplate] : null;

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <button onClick={() => setStep("template")} style={styles.backBtn}>← Templates</button>
                {activeTemplate && (
                    <span style={{
                        background: `${activeTemplate.color}20`,
                        color: activeTemplate.color,
                        padding: "0.3rem 0.8rem",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: "600"
                    }}>
                        {activeTemplate.emoji} {activeTemplate.label}
                    </span>
                )}
            </div>

            <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                <h1 style={styles.title}>Log Session</h1>
                <p style={styles.subtitle}>Fill in your weights and reps</p>

                {/* Notes */}
                <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                    <p style={styles.sectionLabel}>Session Notes</p>
                    <input
                        style={styles.input}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="How are you feeling today?"
                    />
                </div>

                {/* Muscle Groups */}
                <div style={{ marginBottom: "1.5rem" }}>
                    <p style={styles.sectionLabel}>Muscle Groups</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {MUSCLE_OPTIONS.map(m => (
                            <button
                                key={m}
                                onClick={() => toggleMuscle(m)}
                                style={styles.tag(muscleGroups.includes(m), activeTemplate?.color || "#4CAF50")}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Exercises */}
                <div>
                    <p style={styles.sectionLabel}>Exercises</p>
                    {exercises.map((ex, exIdx) => (
                        <div key={exIdx} style={styles.exerciseCard}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                                <input
                                    style={{ ...styles.input, fontWeight: "600", fontSize: "1rem" }}
                                    value={ex.name}
                                    onChange={e => updateExerciseName(exIdx, e.target.value)}
                                    placeholder="Exercise name"
                                />
                                <button
                                    onClick={() => removeExercise(exIdx)}
                                    style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "1.2rem", marginLeft: "0.5rem", flexShrink: 0 }}
                                >
                                    ×
                                </button>
                            </div>

                            {ex.note && <p style={styles.noteText}>💡 {ex.note}</p>}

                            {/* Set Headers */}
                            <div style={{ display: "flex", gap: "0.6rem", marginBottom: "0.4rem", marginTop: "0.8rem" }}>
                                <span style={{ ...styles.setNum }}></span>
                                <span style={{ color: "#555", fontSize: "0.75rem", width: "80px", textAlign: "center" }}>REPS</span>
                                <span style={{ color: "#555", fontSize: "0.75rem", width: "80px", textAlign: "center" }}>WEIGHT (kg)</span>
                            </div>

                            {ex.sets.map((set, setIdx) => (
                                <div key={setIdx} style={styles.setRow}>
                                    <span style={styles.setNum}>Set {setIdx + 1}</span>
                                    <input
                                        type="number"
                                        style={styles.smallInput}
                                        value={set.reps}
                                        onChange={e => updateSet(exIdx, setIdx, "reps", e.target.value)}
                                        placeholder="—"
                                    />
                                    <input
                                        type="number"
                                        style={styles.smallInput}
                                        value={set.weight}
                                        onChange={e => updateSet(exIdx, setIdx, "weight", e.target.value)}
                                        placeholder="—"
                                    />
                                    {ex.sets.length > 1 && (
                                        <button
                                            onClick={() => removeSet(exIdx, setIdx)}
                                            style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: "1rem" }}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button onClick={() => addSet(exIdx)} style={{ ...styles.addBtn, marginTop: "0.5rem" }}>
                                + Add Set
                            </button>
                        </div>
                    ))}

                    <button onClick={addExercise} style={{ ...styles.addBtn, width: "100%", padding: "0.8rem", marginTop: "0.5rem" }}>
                        + Add Exercise
                    </button>
                </div>

                <button onClick={handleSave} disabled={saving} style={styles.saveBtn}>
                    {saving ? "Saving..." : "Save Session"}
                </button>
            </div>
        </div>
    );
}
