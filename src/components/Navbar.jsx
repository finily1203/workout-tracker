import { useEffect, useState } from "react";

const NAV_ITEMS = [
    { id: "dashboard", label: "Home", icon: "⊞" },
    { id: "new", label: "Workout", icon: "💪" },
    { id: "history", label: "History", icon: "📋" },
];

function Navbar({ onSignOut, setPage, currentPage }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    if (isMobile) return (
        <>
            {/* Spacer so content doesn't hide behind bottom bar */}
            <div style={{ height: "72px" }} />

            <nav style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                height: "72px",
                background: "rgba(0,0,0,0.92)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderTop: "1px solid #38383A",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                zIndex: 100,
                paddingBottom: "env(safe-area-inset-bottom)",
            }}>
                {NAV_ITEMS.map(item => {
                    const active = currentPage === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setPage(item.id)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "4px",
                                padding: "8px 20px",
                                borderRadius: "12px",
                                transition: "all 0.15s ease",
                            }}
                        >
                            <span style={{ fontSize: "22px", lineHeight: 1 }}>{item.icon}</span>
                            <span style={{
                                fontSize: "11px",
                                fontWeight: active ? "600" : "400",
                                color: active ? "#0A84FF" : "#8E8E93",
                                letterSpacing: "0.2px",
                            }}>{item.label}</span>
                            {active && (
                                <div style={{
                                    position: "absolute",
                                    bottom: "calc(72px - 3px + env(safe-area-inset-bottom))",
                                    width: "4px",
                                    height: "4px",
                                    borderRadius: "50%",
                                    background: "#0A84FF",
                                }} />
                            )}
                        </button>
                    );
                })}

                <button
                    onClick={onSignOut}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                        padding: "8px 20px",
                        borderRadius: "12px",
                    }}
                >
                    <span style={{ fontSize: "22px", lineHeight: 1 }}>↩︎</span>
                    <span style={{ fontSize: "11px", fontWeight: "400", color: "#FF453A", letterSpacing: "0.2px" }}>Sign Out</span>
                </button>
            </nav>
        </>
    );

    // Desktop top navbar
    return (
        <nav style={{
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid #38383A",
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
                color: "#FFFFFF",
                letterSpacing: "-0.3px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
            }}>
                <span style={{ fontSize: "18px" }}>💪</span>
                Workout Tracker
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                {NAV_ITEMS.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setPage(item.id)}
                        style={{
                            background: currentPage === item.id ? "rgba(10,132,255,0.2)" : "transparent",
                            border: "none",
                            color: currentPage === item.id ? "#0A84FF" : "#8E8E93",
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
                        border: "1px solid #38383A",
                        color: "#FF453A",
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
