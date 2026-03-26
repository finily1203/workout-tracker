import { useState } from "react";
import { createSession, updateSession } from "../api/sessions";

function NewSessionPage({ userId, onBack }) {
    const [notes, setNotes] = useState("");
    const [muscleGroups, setMuscleGroups] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [exName, setExName] = useState("");
    const [sets, setSets] = useState([{ reps: "", weight: "" }]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const muscleOptions = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs", "Core"];

    const toggleMuscle = (m) => {
        setMuscleGroups(prev =>
            prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
        );
    };

    const addSet = () => setSets([...sets, { reps: "", weight: "" }]);

    const updateSet = (i, field, value) => {
        const updated = [...sets];
        updated[i][field] = value;
        setSets(updated);
    };

    const addExercise = () => {
        if (!exName) return;
        setExercises([...exercises, { name: exName, sets }]);
        setExName("");
        setSets([{ reps: "", weight: "" }]);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await createSession({ userId, muscleGroups, notes, exercises });
            setSaved(true);
        } catch (err) {
            alert("Error saving session");
        } finally {
            setSaving(false);
        }
    };

    if (saved) return (
        <div>
            <h2>✅ Session Saved!</h2>
            <button onClick={onBack}>Back to Dashboard</button>
        </div>
    );

    return (
        <div>
            <h2>New Workout Session</h2>
            <button onClick={onBack}>← Back</button>

            <div style={{ marginTop: "1rem" }}>
                <label>Notes:</label>
                <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Felt strong today" style={{ display: "block", width: "100%", margin: "0.5rem 0" }} />
            </div>

            <div style={{ marginTop: "1rem" }}>
                <label>Muscle Groups:</label>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                    {muscleOptions.map(m => (
                        <button key={m} onClick={() => toggleMuscle(m)}
                            style={{ background: muscleGroups.includes(m) ? "#4CAF50" : "#ddd", color: muscleGroups.includes(m) ? "white" : "black", border: "none", padding: "0.4rem 0.8rem", borderRadius: "1rem", cursor: "pointer" }}>
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
                <h3>Add Exercise</h3>
                <input value={exName} onChange={e => setExName(e.target.value)} placeholder="Exercise name (e.g. Bench Press)" style={{ display: "block", marginBottom: "0.5rem", width: "100%" }} />
                {sets.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <input type="number" placeholder="Reps" value={s.reps} onChange={e => updateSet(i, "reps", e.target.value)} style={{ width: "80px" }} />
                        <input type="number" placeholder="Weight (kg)" value={s.weight} onChange={e => updateSet(i, "weight", e.target.value)} style={{ width: "100px" }} />
                    </div>
                ))}
                <button onClick={addSet}>+ Add Set</button>
                <button onClick={addExercise} style={{ marginLeft: "0.5rem" }}>+ Add Exercise</button>
            </div>

            {exercises.length > 0 && (
                <div style={{ marginTop: "1.5rem" }}>
                    <h3>Exercises this session:</h3>
                    {exercises.map((ex, i) => (
                        <div key={i} style={{ background: "#f5f5f5", padding: "0.5rem", marginBottom: "0.5rem", borderRadius: "4px" }}>
                            <strong>{ex.name}</strong>
                            {ex.sets.map((s, j) => (
                                <div key={j}>Set {j + 1}: {s.reps} reps @ {s.weight}kg</div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            <button onClick={handleSave} disabled={saving} style={{ marginTop: "1.5rem", background: "#1a1a2e", color: "white", padding: "0.7rem 2rem" }}>
                {saving ? "Saving..." : "Save Session"}
            </button>
        </div>
    );
}

export default NewSessionPage;