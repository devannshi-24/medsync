import { useState } from "react";
import { FiPlus, FiSend } from "react-icons/fi";
import { FaHeartbeat } from "react-icons/fa";
import DashboardLayout from "../components/DashboardLayout";
import WelcomeScreen from "../components/assistant/WelcomeScreen";
import ChatWindow from "../components/assistant/ChatWindow";
import ConfirmModal from "../components/assistant/ConfirmModal";
import { sendMessage,startNewChat } from "../services/assistantService";

function Assistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setMessages((prev) => [...prev, { role: "assistant", typing: true}]);
    setInput("");
    try {
     const data = await sendMessage(text);
     console.log(data);
      setMessages((prev) => {
        const withoutTyping = prev.filter(message => !message.typing);
        return [...withoutTyping, { role: "assistant", content: data.reply }];
      });
      setLoading(false);
    }
    catch (error) {
      setMessages(prev => {
       const withoutTyping = prev.filter(message => !message.typing);
       const errorMessage =
       error.response?.data?.message || "Sorry, I couldn't generate a response right now.";
       return [
        ...withoutTyping,
        {
            role: "assistant",
            content: errorMessage,
        },
       ];
      });
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleNewChat = async () => {
    try {
      await startNewChat();
      setMessages([]);
      setInput("");
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">

        {/* ── Header ── */}
        <div className="shrink-0 flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <FaHeartbeat className="text-white text-base" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">MedSync AI</h1>
              <p className="text-xs text-slate-400">Your Personal Health Assistant</p>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-6 py-3 shadow-md rounded-full transition"
            >
              <FiPlus size={15} />
              New Chat
            </button>
          )}
        </div>

        {/* ── Chat Area ── */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <WelcomeScreen
              onSuggestionClick={(text) => {
                setInput(text);
                handleSend(text);
              }}
            />
          ) : (
            <ChatWindow messages={messages} />
          )}
        </div>

        {/* ── Input ── */}
        <div className="rounded-full shadow-lg shrink-0 bg-white/80 backdrop-blur-md border-t border-slate-200 px-6 py-4">
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto flex items-center gap-3"
          >
            <textarea rows={1} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask MedSync AI anything..." className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"onInput={(e) => {e.target.style.height = "auto"; e.target.style.height = `${e.target.scrollHeight}px`;}}
              onKeyDown={(e) => {
                 if (e.key === "Enter" && !e.shiftKey) {
                 e.preventDefault(); handleSubmit(e);}}}
              disabled={loading}
              placeholder={loading ? "MedSync AI is thinking..." : "Ask MedSync AI anything..."}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-12 h-12 rounded-full shadow-md bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white flex items-center justify-center transition shrink-0"
            >
              <FiSend size={18} />
            </button>
          </form>
        </div>

      </div>

      <ConfirmModal
        open={showModal}
        title="Start New Chat?"
        description="Your current conversation will be cleared permanently."
        onCancel={() => setShowModal(false)}
        onConfirm={handleNewChat}s
      />
    </DashboardLayout>
  );
}

export default Assistant;