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
    const [pos, setPos] = useState(() => ({
        x: window.innerWidth - 80,
        y: window.innerHeight - 100,
    }));
    const messagesEndRef = useRef(null);
    const dragRef = useRef({
        dragging: false,
        offsetX: 0,
        offsetY: 0,
        startX: 0,
        startY: 0,
        moved: false,
    });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    const clampPos = (x, y) => ({
        x: Math.max(8, Math.min(x, window.innerWidth - 60)),
        y: Math.max(8, Math.min(y, window.innerHeight - 80)),
    });

    const snapToEdge = (x, y) => {
        const snapX = x < window.innerWidth / 2 ? 16 : window.innerWidth - 68;
        return clampPos(snapX, y);
    };

    // Touch handlers
    const onTouchStart = (e) => {
        const touch = e.touches[0];
        dragRef.current = {
            dragging: true,
            offsetX: touch.clientX - pos.x,
            offsetY: touch.clientY - pos.y,
            startX: touch.clientX,
            startY: touch.clientY,
            moved: false,
        };
    };

    const onTouchMove = (e) => {
        if (!dragRef.current.dragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        const dx = Math.abs(touch.clientX - dragRef.current.startX);
        const dy = Math.abs(touch.clientY - dragRef.current.startY);
        if (dx > 5 || dy > 5) dragRef.current.moved = true;
        setPos(clampPos(
            touch.clientX - dragRef.current.offsetX,
            touch.clientY - dragRef.current.offsetY,
        ));
    };

    const onTouchEnd = () => {
        if (!dragRef.current.dragging) return;
        dragRef.current.dragging = false;
        if (dragRef.current.moved) {
            setPos(prev => snapToEdge(prev.x, prev.y));
        } else {
            setOpen(o => !o);
        }
    };

    // Mouse handlers (desktop drag)
    const onMouseDown = (e) => {
        dragRef.current = {
            dragging: true,
            offsetX: e.clientX - pos.x,
            offsetY: e.clientY - pos.y,
            startX: e.clientX,
            startY: e.clientY,
            moved: false,
        };

        const onMouseMove = (e) => {
            if (!dragRef.current.dragging) return;
            const dx = Math.abs(e.clientX - dragRef.current.startX);
            const dy = Math.abs(e.clientY - dragRef.current.startY);
            if (dx > 5 || dy > 5) dragRef.current.moved = true;
            setPos(clampPos(
                e.clientX - dragRef.current.offsetX,
                e.clientY - dragRef.current.offsetY,
            ));
        };

        const onMouseUp = () => {
            dragRef.current.dragging = false;
            if (!dragRef.current.moved) setOpen(o => !o);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

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
                        background: "rgba(0,0,0,0.5)",
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
                background: "#1C1C1E",
                borderLeft: "1px solid #38383A",
                zIndex: 999,
                display: "flex",
                flexDirection: "column",
                transition: "right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif",
                boxShadow: open ? "-12px 0 40px rgba(0,0,0,0.6)" : "none",
            }}>
                {/* Header */}
                <div style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid #38383A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "rgba(28,28,30,0.9)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                            width: "36px", height: "36px", borderRadius: "10px",
                            background: "linear-gradient(135deg, #30D158, #0A84FF)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "18px",
                        }}>🤖</div>
                        <div>
                            <p style={{ fontWeight: "700", fontSize: "15px", color: "#FFFFFF" }}>AI Fitness Coach</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "1px" }}>
                                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#30D158", display: "inline-block" }} />
                                <span style={{ fontSize: "12px", color: "#30D158", fontWeight: "500" }}>Online</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                        <button
                            onClick={clearChat}
                            title="Clear chat"
                            style={{
                                background: "#2C2C2E", border: "none", color: "#8E8E93",
                                width: "32px", height: "32px", borderRadius: "8px",
                                cursor: "pointer", fontSize: "14px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                        >🗑</button>
                        <button
                            onClick={() => setOpen(false)}
                            style={{
                                background: "#2C2C2E", border: "none", color: "#8E8E93",
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
                    background: "#000000",
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
                                    background: "linear-gradient(135deg, #30D158, #0A84FF)",
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
                                background: msg.role === "user" ? "#0A84FF" : "#2C2C2E",
                                color: "#FFFFFF",
                                fontSize: "15px",
                                lineHeight: "1.45",
                                whiteSpace: "pre-wrap",
                            }}>
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
                            <div style={{
                                width: "26px", height: "26px", borderRadius: "8px",
                                background: "linear-gradient(135deg, #30D158, #0A84FF)",
                                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px",
                            }}>🤖</div>
                            <div style={{
                                padding: "12px 16px", borderRadius: "18px 18px 18px 4px",
                                background: "#2C2C2E",
                                display: "flex", gap: "4px", alignItems: "center",
                            }}>
                                {[0, 1, 2].map(i => (
                                    <span key={i} style={{
                                        width: "6px", height: "6px", borderRadius: "50%",
                                        background: "#48484A", display: "inline-block",
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
                    <div style={{ padding: "10px 12px 4px", background: "#000000" }}>
                        <p style={{ color: "#48484A", fontSize: "12px", fontWeight: "500", marginBottom: "6px" }}>
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
                                        background: "#1C1C1E", border: "1px solid #38383A",
                                        color: "#0A84FF", padding: "6px 12px",
                                        borderRadius: "20px", fontSize: "13px",
                                        fontWeight: "500", cursor: "pointer",
                                    }}
                                >{q}</button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div style={{
                    padding: "10px 12px",
                    borderTop: "1px solid #38383A",
                    display: "flex", gap: "8px", alignItems: "flex-end",
                    background: "#1C1C1E",
                }}>
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Message your coach..."
                        rows={2}
                        style={{
                            flex: 1, background: "#2C2C2E", border: "none",
                            borderRadius: "12px", color: "#FFFFFF",
                            padding: "9px 12px", fontSize: "15px",
                            resize: "none", outline: "none",
                            fontFamily: "inherit", lineHeight: "1.4",
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        style={{
                            background: input.trim() ? "#0A84FF" : "#2C2C2E",
                            border: "none",
                            color: input.trim() ? "white" : "#48484A",
                            width: "36px", height: "36px", borderRadius: "10px",
                            cursor: input.trim() ? "pointer" : "default",
                            fontSize: "16px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.15s ease", flexShrink: 0,
                        }}
                    >↑</button>
                </div>
            </div>

            {/* Floating Button */}
            <button
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onMouseDown={onMouseDown}
                style={{
                    position: "fixed",
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    width: "52px", height: "52px", borderRadius: "16px",
                    background: open ? "#2C2C2E" : "linear-gradient(135deg, #30D158, #0A84FF)",
                    border: open ? "1px solid #38383A" : "none",
                    cursor: "grab",
                    fontSize: open ? "22px" : "24px",
                    zIndex: 1000,
                    boxShadow: open ? "none" : "0 4px 20px rgba(10,132,255,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.25s, box-shadow 0.25s",
                    color: open ? "#8E8E93" : "white",
                    touchAction: "none",
                    userSelect: "none",
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
