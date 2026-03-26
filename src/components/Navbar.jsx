function Navbar({ onSignOut, setPage }) {
    return (
        <nav style={{ background: "#1a1a2e", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ color: "white", cursor: "pointer" }}>💪 Workout Tracker</h2>
            <div>
                <button onClick={() => setPage("dashboard")} style={{ marginRight: "1rem" }}>Home</button>
                <button onClick={() => setPage("new")} style={{ marginRight: "1rem" }}>New Session</button>
                <button onClick={() => setPage("history")} style={{ marginRight: "1rem" }}>History</button>
                <button onClick={onSignOut}>Sign Out</button>
            </div>
        </nav>
    );
}

export default Navbar;