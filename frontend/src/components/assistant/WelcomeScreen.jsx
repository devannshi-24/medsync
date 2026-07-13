import { FaHeartbeat } from "react-icons/fa";
import { FiActivity, FiHeart, FiMoon, FiClipboard } from "react-icons/fi";

// SuggestedPrompts merged directly here — no need for a separate file
const suggestions = [
  { icon: <FiActivity />,  text: "What does Atorvastatin do?" },
  { icon: <FiHeart />,     text: "Explain my blood pressure medicine" },
  { icon: <FiMoon />,      text: "Suggest a better sleep routine" },
  { icon: <FiClipboard />, text: "Summarize today's medications" },
];

function WelcomeScreen({ onSuggestionClick }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-8 py-12 text-center">

      {/* Logo with pulse ring */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
          <FaHeartbeat className="text-white text-3xl" />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-4xl font-bold text-slate-800 mb-3">
        Hi, I'm MedSync AI
      </h1>
      <p className="max-w-xl text-slate-500 text-base leading-relaxed mb-10">
        Ask me anything about your medicines, symptoms, side effects,
        medication schedules, or general health. I'm here to help you
        understand your health better.
      </p>

      {/* Suggestions */}
      <div className="w-full max-w-3xl text-left">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
          Try asking
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((item) => (
            <button
              key={item.text}
              onClick={() => onSuggestionClick(item.text)}
              className="flex items-center gap-4 bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl px-5 py-4 text-left transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-500 text-lg shrink-0 transition">
                {item.icon}
              </div>
              <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition">
                {item.text}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

export default WelcomeScreen;