import { useState, useEffect } from "react";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ChatBot from "./components/ChatBot";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        setUser(null);
    };

    if (loading) return (
        <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            minHeight: "100svh", background: "#000000", flexDirection: "column", gap: "12px"
        }}>
            <div style={{
                width: "44px", height: "44px", borderRadius: "12px",
                background: "#0A84FF", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "22px"
            }}>💪</div>
            <p style={{ color: "#8E8E93", fontSize: "15px" }}>Loading...</p>
        </div>
    );

    return (
        <div>
            {user ? (
                <>
                    <DashboardPage user={user} onSignOut={handleSignOut} />
                    <ChatBot userId={user.userId || user.username} />
                </>
            ) : (
                <LoginPage onLogin={checkUser} />
            )}
        </div>
    );
}

export default App;
