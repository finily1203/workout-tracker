import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

function LoginPage({ onLogin }) {
    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
            <Authenticator>
                {({ user }) => {
                    if (user) onLogin();
                    return null;
                }}
            </Authenticator>
        </div>
    );
}

export default LoginPage;