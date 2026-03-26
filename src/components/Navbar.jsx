function Navbar({ onSignOut, setPage, currentPage }) {
    const navItems = [
        { id: "dashboard", label: "Home" },
        { id: "new", label: "New Session" },
        { id: "history", label: "History" },
    ];

    return (
        <nav style={{
            background: "rgba(242, 242, 247, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid #E5E5EA",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "52px",
            position: "sticky",
            top: 0,
            zIndex: 100,
        }}>
            <div style={{
                fontWeight: "700",
                fontSize: "17px",
                color: "#000",
                letterSpacing: "-0.3px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
            }}>
                <span style={{ fontSize: "18px" }}>💪</span>
                Workout Tracker
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setPage(item.id)}
                        style={{
                            background: currentPage === item.id ? "rgba(0,122,255,0.1)" : "transparent",
                            border: "none",
                            color: currentPage === item.id ? "#007AFF" : "#8E8E93",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: currentPage === item.id ? "600" : "400",
                            transition: "all 0.15s ease",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {item.label}
                    </button>
                ))}
                <button
                    onClick={onSignOut}
                    style={{
                        background: "transparent",
                        border: "1px solid #E5E5EA",
                        color: "#FF3B30",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "400",
                        marginLeft: "8px",
                        transition: "all 0.15s ease",
                        whiteSpace: "nowrap",
                    }}
                >
                    Sign Out
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
