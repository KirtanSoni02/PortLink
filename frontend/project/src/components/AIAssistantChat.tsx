import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageCircle, Send, X, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      setMessages((msgs) => [...msgs, { from: "ai", text: "AI Assistant is currently offline or connecting to server." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3.5 shadow-xl transition-all hover:scale-105 active:scale-95 border border-blue-400/30 flex items-center justify-center"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Drawer Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white px-4 py-3.5 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm">PortLink AI Assistant</h3>
                  <p className="text-[10px] text-blue-300 font-mono">Online • Maritime Intelligence</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-96 min-h-[260px] text-xs bg-slate-50/50 dark:bg-black/50">
              {messages.length === 0 && (
                <div className="text-center py-8 text-slate-500 dark:text-neutral-400">
                  <Bot className="w-8 h-8 text-blue-500 mx-auto mb-2 opacity-80" />
                  <p className="font-semibold text-slate-800 dark:text-neutral-200">How can I assist you today?</p>
                  <p className="text-[11px] mt-1 text-slate-500 dark:text-neutral-400">Ask about port schedules, contracts, shipment requirements, or weather telemetry.</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      msg.from === "user"
                        ? "bg-blue-600 text-white rounded-br-none shadow-sm"
                        : "bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white rounded-bl-none shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-3.5 py-2 rounded-2xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-500 text-xs flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form
              className="flex items-center border-t border-slate-200 dark:border-neutral-800 p-2 bg-white dark:bg-neutral-900"
              onSubmit={e => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <input
                className="flex-1 px-3 py-2 text-xs bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-xl outline-none focus:border-blue-600 dark:focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500"
                placeholder="Ask AI assistant..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="ml-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-sm shrink-0"
                disabled={loading || !input.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistantChat;