import { useEffect, useState, useRef } from "react";
const API = import.meta.env.VITE_API_URL;
const API_CONVERSATION_URL = `${API}/api/llm/conversation`;
const API_CHAT_URL = `${API}/api/llm/chat`;

function getAccessToken() {
  return localStorage.getItem("token");
}

const ChatBox = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load hội thoại khi mở chat
  const loadConversation = () => {
    const token = getAccessToken();
    if (token) {
      fetch(API_CONVERSATION_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.conversation && data.conversation.messages) {
            const loaded = data.conversation.messages.map(m => ({
              from: m.role === "assistant" ? "bot" : m.role,
              text: m.content
            }));
            setMessages(loaded.length > 0 ? loaded : [
              { from: "bot", text: `Xin chào ${data.name}! Tôi có thể giúp gì cho bạn?` }
            ]);
          } else {
            setMessages([
              { from: "bot", text: `Xin chào ${data.name}! Tôi có thể giúp gì cho bạn?` }
            ]);
          }
        })
        .catch(() => {
          setMessages([
            { from: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" }
          ]);
        });
    }
  };

  // Gửi tin nhắn
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setLoading(true);
    setMessages((prev) => [...prev, { from: "bot", text: "Đang suy nghĩ...", typing: true }]);

    const token = getAccessToken();
    try {
      const response = await fetch(API_CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await response.json();
      let botResponse = "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.";
      if (data.success && data.reply) {
        botResponse = data.reply;
      } else if (data.message) {
        botResponse = data.message;
      }
      setMessages((prev) => {
        const filtered = prev.filter(msg => !msg.typing);
        return [...filtered, { from: "bot", text: botResponse }];
      });
      loadConversation();
    } catch (error) {
      setMessages((prev) => {
        const filtered = prev.filter(msg => !msg.typing);
        return [...filtered, { from: "bot", text: "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau." }];
      });
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (text) => {
    let formatted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<div style="background: #1e293b; color: #e2e8f0; padding: 12px; border-radius: 8px; margin: 8px 0; overflow-x: auto; font-family: 'Courier New', monospace; font-size: 13px;"><div style="color: #94a3b8; font-size: 11px; margin-bottom: 6px;">${lang || 'code'}</div><pre style="margin: 0; white-space: pre-wrap;">${code.trim()}</pre></div>`;
    });
    formatted = formatted.replace(/`([^`]+)`/g, '<code style="background: #f1f5f9; color: #e11d48; padding: 2px 6px; border-radius: 4px; font-family: \'Courier New\', monospace; font-size: 13px;">$1</code>');
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight: 600;">$1</strong>');
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em style="font-style: italic;">$1</em>');
    formatted = formatted.replace(/^\d+\.\s+(.+)$/gm, '<div style="margin: 4px 0; padding-left: 8px;">• $1</div>');
    formatted = formatted.replace(/^[-*]\s+(.+)$/gm, '<div style="margin: 4px 0; padding-left: 8px;">• $1</div>');
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #2563eb; text-decoration: underline;">$1</a>');
    formatted = formatted.replace(/\n/g, '<br/>');
    formatted = formatted.replace(/^### (.+)$/gm, '<div style="font-size: 15px; font-weight: 600; margin: 10px 0 6px 0;">$1</div>');
    formatted = formatted.replace(/^## (.+)$/gm, '<div style="font-size: 16px; font-weight: 700; margin: 12px 0 8px 0;">$1</div>');
    formatted = formatted.replace(/^# (.+)$/gm, '<div style="font-size: 17px; font-weight: 700; margin: 14px 0 10px 0;">$1</div>');
    return formatted;
  };

  // Reset messages khi đóng chat
  useEffect(() => {
    if (!open) {
      setMessages([{ from: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" }]);
    }
  }, [open]);

  // Gọi loadConversation khi mở chat
  const handleOpen = () => {
    setOpen(true);
    loadConversation();
  };

  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      right: 24,
      zIndex: 1000,
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {open ? (
        <div style={{
          width: 360,
          height: 500,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            color: "#fff",
            padding: "16px 20px",
            fontWeight: "600",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <div style={{ fontSize: 16 }}>Hỗ trợ trực tuyến</div>
              <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>
                {loading ? "Đang trả lời..." : "Sẵn sàng hỗ trợ"}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "#fff",
                width: 32,
                height: 32,
                borderRadius: "50%",
                fontSize: 20,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.3)"}
              onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
              aria-label="Đóng"
            >×</button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: "16px 20px",
            overflowY: "auto",
            background: "#f8fafc"
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: 12,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.from === "user" ? "flex-end" : "flex-start"
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background: msg.from === "user"
                      ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
                      : "#ffffff",
                    color: msg.from === "user" ? "#fff" : "#1e293b",
                    borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    padding: "12px 16px",
                    maxWidth: 260,
                    wordBreak: "break-word",
                    fontSize: 14,
                    lineHeight: 1.6,
                    boxShadow: msg.from === "user"
                      ? "0 2px 8px rgba(37,99,235,0.3)"
                      : "0 2px 8px rgba(0,0,0,0.08)",
                    animation: msg.typing ? "pulse 1.5s infinite" : "none",
                    whiteSpace: "pre-wrap"
                  }}
                  dangerouslySetInnerHTML={{
                    __html: formatMessage(msg.text)
                  }}
                />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            display: "flex",
            borderTop: "1px solid #e2e8f0",
            background: "#fff",
            padding: "12px 16px",
            gap: 8
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn..."
              disabled={loading}
              style={{
                flex: 1,
                border: "1px solid #e2e8f0",
                outline: "none",
                padding: "10px 14px",
                fontSize: 14,
                borderRadius: 20,
                background: loading ? "#f8fafc" : "#fff",
                transition: "border 0.2s"
              }}
              onFocus={(e) => e.target.style.border = "1px solid #2563eb"}
              onBlur={(e) => e.target.style.border = "1px solid #e2e8f0"}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim()
                  ? "#94a3b8"
                  : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                fontWeight: "600",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                borderRadius: 20,
                fontSize: 14,
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 2px 8px rgba(37,99,235,0.3)"
              }}
              onMouseEnter={(e) => {
                if (!loading && input.trim()) {
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(37,99,235,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 8px rgba(37,99,235,0.3)";
              }}
            >
              {loading ? "..." : "Gửi"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleOpen}
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            color: "#fff",
            border: "none",
            boxShadow: "0 4px 16px rgba(37,99,235,0.4)",
            fontSize: 32,
            cursor: "pointer",
            transition: "transform 0.3s, box-shadow 0.3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.boxShadow = "0 6px 20px rgba(37,99,235,0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 16px rgba(37,99,235,0.4)";
          }}
          aria-label="Mở chat"
        >
          💬
        </button>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px);}
          to { opacity: 1; transform: translateY(0);}
        }
        div::-webkit-scrollbar { width: 6px;}
        div::-webkit-scrollbar-track { background: transparent;}
        div::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px;}
        div::-webkit-scrollbar-thumb:hover { background: #94a3b8;}
      `}</style>
    </div>
  );
};

export default ChatBox;