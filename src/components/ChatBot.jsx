import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_URL } from "../aws-config";

export default function ChatBot({ userId }) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi! I'm your AI fitness coach. Ask me anything about your workouts or request a personalised training plan!"
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

    const clearChat = () => setMessages([{
        role: "assistant",
        content: "Hi! I'm your AI fitness coach. Ask me anything about your workouts or request a personalised training plan!"
    }]);

    return (
        <>
            {/* Backdrop */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    style={{
                        position: "fixed", inset: 0,
                        background: "rgba(0,0,0,0.2)",
                        backdropFilter: "blur(4px)",
                        WebkitBackdropFilter: "blur(4px)",
                        zIndex: 998,
                    }}
                />
            )}

            {/* Side Panel */}
            <div style={{
                position: "fixed",
                top: 0,
                right: open ? 0 : "-420px",
                width: "min(400px, 100vw)",
                height: "100vh",
                background: "#FFFFFF",
                borderLeft: "1px solid #E5E5EA",
                zIndex: 999,
                display: "flex",
                flexDirection: "column",
                transition: "right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif",
                boxShadow: open ? "-12px 0 40px rgba(0,0,0,0.12)" : "none",
            }}>
                {/* Header */}
                <div style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid #E5E5EA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "rgba(242,242,247,0.8)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                            width: "36px", height: "36px", borderRadius: "10px",
                            background: "linear-gradient(135deg, #34C759, #007AFF)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "18px",
                        }}>🤖</div>
                        <div>
                            <p style={{ fontWeight: "700", fontSize: "15px", color: "#000" }}>AI Fitness Coach</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "1px" }}>
                                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34C759", display: "inline-block" }} />
                                <span style={{ fontSize: "12px", color: "#34C759", fontWeight: "500" }}>Online</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                        <button
                            onClick={clearChat}
                            title="Clear chat"
                            style={{
                                background: "#F2F2F7", border: "none", color: "#8E8E93",
                                width: "32px", height: "32px", borderRadius: "8px",
                                cursor: "pointer", fontSize: "14px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                        >🗑</button>
                        <button
                            onClick={() => setOpen(false)}
                            style={{
                                background: "#F2F2F7", border: "none", color: "#8E8E93",
                                width: "32px", height: "32px", borderRadius: "8px",
                                cursor: "pointer", fontSize: "18px", fontWeight: "300",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                        >×</button>
                    </div>
                </div>

                {/* Messages */}
                <div style={{
                    flex: 1, overflowY: "auto",
                    padding: "16px 12px",
                    display: "flex", flexDirection: "column", gap: "10px",
                    background: "#F2F2F7",
                }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{
                            display: "flex",
                            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                            alignItems: "flex-end",
                            gap: "6px",
                        }}>
                            {msg.role === "assistant" && (
                                <div style={{
                                    width: "26px", height: "26px", borderRadius: "8px",
                                    background: "linear-gradient(135deg, #34C759, #007AFF)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "13px", flexShrink: 0,
                                }}>🤖</div>
                            )}
                            <div style={{
                                maxWidth: "78%",
                                padding: "10px 14px",
                                borderRadius: msg.role === "user"
                                    ? "18px 18px 4px 18px"
                                    : "18px 18px 18px 4px",
                                background: msg.role === "user" ? "#007AFF" : "#FFFFFF",
                                color: msg.role === "user" ? "white" : "#000",
                                fontSize: "15px",
                                lineHeight: "1.45",
                                whiteSpace: "pre-wrap",
                                boxShadow: msg.role === "assistant" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                            }}>
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
                            <div style={{
                                width: "26px", height: "26px", borderRadius: "8px",
                                background: "linear-gradient(135deg, #34C759, #007AFF)",
                                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px",
                            }}>🤖</div>
                            <div style={{
                                padding: "12px 16px", borderRadius: "18px 18px 18px 4px",
                                background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                display: "flex", gap: "4px", alignItems: "center",
                            }}>
                                {[0, 1, 2].map(i => (
                                    <span key={i} style={{
                                        width: "6px", height: "6px", borderRadius: "50%",
                                        background: "#C7C7CC",
                                        display: "inline-block",
                                        animation: "typingBounce 1.2s infinite",
                                        animationDelay: `${i * 0.2}s`,
                                    }} />
                                ))}
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts */}
                {messages.length === 1 && (
                    <div style={{ padding: "10px 12px 4px", background: "#F2F2F7" }}>
                        <p style={{ color: "#8E8E93", fontSize: "12px", fontWeight: "500", marginBottom: "6px" }}>
                            Suggestions
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {[
                                "What should I train today?",
                                "Give me a 30-min workout",
                                "How do I build a bigger chest?",
                                "How do I recover faster?"
                            ].map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(q)}
                                    style={{
                                        background: "#FFFFFF", border: "1px solid #E5E5EA",
                                        color: "#007AFF", padding: "6px 12px",
                                        borderRadius: "20px", fontSize: "13px",
                                        fontWeight: "500", cursor: "pointer",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                                    }}
                                >{q}</button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div style={{
                    padding: "10px 12px",
                    borderTop: "1px solid #E5E5EA",
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-end",
                    background: "#FFFFFF",
                }}>
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Message your coach..."
                        rows={2}
                        style={{
                            flex: 1,
                            background: "#F2F2F7",
                            border: "none",
                            borderRadius: "12px",
                            color: "#000",
                            padding: "9px 12px",
                            fontSize: "15px",
                            resize: "none",
                            outline: "none",
                            fontFamily: "inherit",
                            lineHeight: "1.4",
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        style={{
                            background: input.trim() ? "#007AFF" : "#E5E5EA",
                            border: "none",
                            color: input.trim() ? "white" : "#C7C7CC",
                            width: "36px", height: "36px",
                            borderRadius: "10px",
                            cursor: input.trim() ? "pointer" : "default",
                            fontSize: "16px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.15s ease",
                            flexShrink: 0,
                        }}
                    >↑</button>
                </div>
            </div>

            {/* Floating Button */}
            <button
                onClick={() => setOpen(!open)}
                style={{
                    position: "fixed",
                    bottom: "28px",
                    right: "28px",
                    width: "52px",
                    height: "52px",
                    borderRadius: "16px",
                    background: open ? "#F2F2F7" : "linear-gradient(135deg, #34C759, #007AFF)",
                    border: open ? "1px solid #E5E5EA" : "none",
                    cursor: "pointer",
                    fontSize: open ? "22px" : "24px",
                    zIndex: 1000,
                    boxShadow: open ? "0 2px 8px rgba(0,0,0,0.1)" : "0 4px 20px rgba(0,122,255,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
            >
                {open ? "×" : "🤖"}
            </button>

            <style>{`
                @keyframes typingBounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-5px); }
                }
            `}</style>
        </>
    );
}
