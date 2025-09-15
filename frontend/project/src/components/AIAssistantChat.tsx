import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageCircle, Send } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const AIAssistantChat: React.FC = () => {
  const [messages, setMessages] = useState<{ from: "user" | "ai"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((msgs) => [...msgs, { from: "user", text: userMsg }]);
    setInput("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/ai/chat`, {
        messages: [...messages.filter(m => m.from === "user").map(m => m.text), userMsg],
      });
      setMessages((msgs) => [...msgs, { from: "ai", text: res.data.text }]);
    } catch {
      setMessages((msgs) => [...msgs, { from: "ai", text: "AI is currently unavailable." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-sky-600 hover:bg-sky-700 text-white rounded-full p-4 shadow-lg"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
          <div className="bg-sky-600 text-white px-4 py-3 font-bold flex justify-between items-center">
            <span>AI Assistant</span>
            <button onClick={() => setOpen(false)} className="text-white font-bold text-xl">&times;</button>
          </div>
          <div className="flex-1 p-4 space-y-2 overflow-y-auto max-h-96" style={{ minHeight: 200 }}>
            {messages.length === 0 && (
              <div className="text-slate-400 text-sm text-center">Ask me anything about PortLink!</div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${msg.from === "user"
                  ? "bg-sky-100 text-sky-900"
                  : "bg-emerald-100 text-emerald-900"
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form
            className="flex border-t border-slate-200"
            onSubmit={e => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <input
              className="flex-1 px-3 py-2 outline-none"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="p-2 text-sky-600 hover:text-sky-800 disabled:opacity-50"
              disabled={loading}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIAssistantChat;