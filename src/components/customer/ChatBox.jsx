import React, { useState } from "react";

const ChatBox = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" }
  ]);

  const summarizeText = async (text) => {
    const res = await fetch("https://f366aa481e1d.ngrok-free.app/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    return data;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");
    // Gọi API tóm tắt
    const res = await summarizeText(input);
    setMessages((prev) => [...prev, { from: "bot", text: res.summary || "Không có kết quả" }]);
  };

  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      right: 24,
      zIndex: 1000,
      fontFamily: "inherit"
    }}>
      {open ? (
        <div style={{
          width: 320,
          height: 400,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          <div style={{
            background: "#2563eb",
            color: "#fff",
            padding: "12px 16px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span>Hỗ trợ trực tuyến</span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: 20,
                cursor: "pointer"
              }}
              aria-label="Đóng"
            >×</button>
          </div>
          <div style={{
            flex: 1,
            padding: 16,
            overflowY: "auto",
            background: "#f9fafb"
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: 10,
                  textAlign: msg.from === "user" ? "right" : "left"
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    background: msg.from === "user" ? "#2563eb" : "#e5e7eb",
                    color: msg.from === "user" ? "#fff" : "#111",
                    borderRadius: 16,
                    padding: "8px 14px",
                    maxWidth: 220,
                    wordBreak: "break-word"
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <form
            onSubmit={handleSend}
            style={{
              display: "flex",
              borderTop: "1px solid #e5e7eb",
              background: "#fff"
            }}
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: 12,
                fontSize: 15,
                background: "transparent"
              }}
            />
            <button
              type="submit"
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                padding: "0 18px",
                fontWeight: "bold",
                cursor: "pointer",
                borderRadius: 0
              }}
            >Gửi</button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
            fontSize: 28,
            cursor: "pointer"
          }}
          aria-label="Mở chat"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default ChatBox;