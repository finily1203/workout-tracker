import { useState, useEffect } from "react";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

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

    if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;

    return (
        <div>
            {user ? (
                <DashboardPage user={user} onSignOut={handleSignOut} />
            ) : (
                <LoginPage onLogin={checkUser} />
            )}
        </div>
    );
}

export default App;