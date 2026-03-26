import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_URL } from "../aws-config";

export default function ChatBot({ userId }) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi! 👋 I'm your AI fitness coach. Ask me anything about your workouts or request a personalised training plan!"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await axios.post(`${API_URL}/recommend`, {
                userId,
                message: input,
                history: messages
            });
            setMessages(prev => [...prev, {
                role: "assistant",
                content: res.data.recommendation
            }]);
        } catch {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Sorry, I couldn't process that. Please try again."
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Overlay */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.4)",
                        zIndex: 998,
                        backdropFilter: "blur(2px)"
                    }}
                />
            )}

            {/* Side Panel */}
            <div style={{
                position: "fixed",
                top: 0,
                right: open ? 0 : "-420px",
                width: "400px",
                height: "100vh",
                background: "#0f0f1a",
                borderLeft: "1px solid rgba(255,255,255,0.08)",
                zIndex: 999,
                display: "flex",
                flexDirection: "column",
                transition: "right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                boxShadow: open ? "-20px 0 60px rgba(0,0,0,0.5)" : "none"
            }}>
                {/* Header */}
                <div style={{
                    padding: "1.2rem 1.5rem",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "rgba(255,255,255,0.02)"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                        <div style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #4CAF50, #2196F3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.1rem"
                        }}>🤖</div>
                        <div>
                            <div style={{ fontWeight: "700", fontSize: "0.95rem", color: "white" }}>AI Fitness Coach</div>
                            <div style={{ fontSize: "0.75rem", color: "#4CAF50", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4CAF50", display: "inline-block" }}></span>
                                Online
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                            onClick={() => setMessages([{ role: "assistant", content: "Hi! 👋 I'm your AI fitness coach. Ask me anything about your workouts or request a personalised training plan!" }])}
                            style={{
                                background: "rgba(255,255,255,0.06)",
                                border: "none",
                                color: "#888",
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                            title="Clear chat"
                        >🗑</button>
                        <button
                            onClick={() => setOpen(false)}
                            style={{
                                background: "rgba(255,255,255,0.06)",
                                border: "none",
                                color: "#888",
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "1rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >×</button>
                    </div>
                </div>

                {/* Messages */}
                <div style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.8rem"
                }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{
                            display: "flex",
                            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                            alignItems: "flex-end",
                            gap: "0.5rem"
                        }}>
                            {msg.role === "assistant" && (
                                <div style={{
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "8px",
                                    background: "linear-gradient(135deg, #4CAF50, #2196F3)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.75rem",
                                    flexShrink: 0
                                }}>🤖</div>
                            )}
                            <div style={{
                                maxWidth: "80%",
                                padding: "0.75rem 1rem",
                                borderRadius: msg.role === "user"
                                    ? "16px 16px 4px 16px"
                                    : "16px 16px 16px 4px",
                                background: msg.role === "user"
                                    ? "linear-gradient(135deg, #4CAF50, #45a049)"
                                    : "rgba(255,255,255,0.06)",
                                color: "white",
                                fontSize: "0.9rem",
                                lineHeight: "1.5",
                                whiteSpace: "pre-wrap",
                                border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.08)" : "none"
                            }}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
                            <div style={{
                                width: "28px", height: "28px", borderRadius: "8px",
                                background: "linear-gradient(135deg, #4CAF50, #2196F3)",
                                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem"
                            }}>🤖</div>
                            <div style={{
                                padding: "0.75rem 1rem",
                                borderRadius: "16px 16px 16px 4px",
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                display: "flex", gap: "4px", alignItems: "center"
                            }}>
                                {[0, 1, 2].map(i => (
                                    <span key={i} style={{
                                        width: "6px", height: "6px", borderRadius: "50%",
                                        background: "#4CAF50",
                                        animation: "bounce 1.2s infinite",
                                        animationDelay: `${i * 0.2}s`,
                                        display: "inline-block"
                                    }} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts */}
                {messages.length === 1 && (
                    <div style={{ padding: "0 1rem 0.8rem" }}>
                        <p style={{ color: "#555", fontSize: "0.75rem", marginBottom: "0.5rem" }}>Quick questions:</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                            {[
                                "What should I train today?",
                                "Give me a 30-min workout",
                                "I want to build bigger chest",
                                "How do I recover faster?"
                            ].map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setInput(q); }}
                                    style={{
                                        background: "rgba(76,175,80,0.1)",
                                        border: "1px solid rgba(76,175,80,0.2)",
                                        color: "#4CAF50",
                                        padding: "0.3rem 0.7rem",
                                        borderRadius: "20px",
                                        fontSize: "0.78rem",
                                        cursor: "pointer"
                                    }}
                                >{q}</button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div style={{
                    padding: "1rem",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    gap: "0.6rem",
                    alignItems: "flex-end"
                }}>
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask your coach..."
                        rows={2}
                        style={{
                            flex: 1,
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                            color: "white",
                            padding: "0.7rem 1rem",
                            fontSize: "0.9rem",
                            resize: "none",
                            outline: "none",
                            fontFamily: "inherit"
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        style={{
                            background: input.trim() ? "linear-gradient(135deg, #4CAF50, #45a049)" : "rgba(255,255,255,0.06)",
                            border: "none",
                            color: input.trim() ? "white" : "#555",
                            width: "42px",
                            height: "42px",
                            borderRadius: "12px",
                            cursor: input.trim() ? "pointer" : "default",
                            fontSize: "1.1rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                            flexShrink: 0
                        }}
                    >➤</button>
                </div>

                {/* Bounce animation */}
                <style>{`
                    @keyframes bounce {
                        0%, 60%, 100% { transform: translateY(0); }
                        30% { transform: translateY(-6px); }
                    }
                `}</style>
            </div>

            {/* Floating Button */}
            <button
                onClick={() => setOpen(!open)}
                style={{
                    position: "fixed",
                    bottom: "2rem",
                    right: "2rem",
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: open ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #4CAF50, #2196F3)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    zIndex: 1000,
                    boxShadow: "0 8px 32px rgba(76,175,80,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: open ? "rotate(0deg) scale(0.9)" : "rotate(0deg) scale(1)"
                }}
            >
                {open ? "×" : "🤖"}
            </button>
        </>
    );
}