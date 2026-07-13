import { useEffect, useRef,useState } from "react";
import { FaHeartbeat } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ── Custom markdown renderers — full styling without Tailwind Typography ──
const markdownComponents = {

  // Headings
  h1: ({ children }) => (
    <h1 className="text-xl font-bold text-slate-800 mt-4 mb-2 border-b border-slate-200 pb-1">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-bold text-slate-800 mt-4 mb-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-slate-700 mt-3 mb-1">{children}</h3>
  ),

  // Paragraph
  p: ({ children }) => (
    <p className="text-sm text-slate-700 leading-relaxed mb-2">{children}</p>
  ),

  // Bold
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-900">{children}</strong>
  ),

  // Italic
  em: ({ children }) => (
    <em className="italic text-slate-600">{children}</em>
  ),

  // Unordered list
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-1 mb-3 text-sm text-slate-700 pl-2">{children}</ul>
  ),

  // Ordered list
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-1 mb-3 text-sm text-slate-700 pl-2">{children}</ol>
  ),

  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),

  // Horizontal rule
  hr: () => <hr className="border-slate-200 my-3" />,

  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-300 pl-4 italic text-slate-500 my-3 text-sm">
      {children}
    </blockquote>
  ),

  // Inline code
  code: ({ inline, children }) =>
    inline ? (
      <code className="bg-slate-100 text-blue-600 text-xs font-mono px-1.5 py-0.5 rounded">
        {children}
      </code>
    ) : (
      <pre className="bg-slate-900 text-green-300 text-xs font-mono p-4 rounded-xl overflow-x-auto my-3">
        <code>{children}</code>
      </pre>
    ),

  // ── Table — the main fix ──────────────────────────────────
  table: ({ children }) => (
    <div className="overflow-x-auto my-4 rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),

  thead: ({ children }) => (
    <thead className="bg-blue-50">{children}</thead>
  ),

  tbody: ({ children }) => (
    <tbody className="divide-y divide-slate-100">{children}</tbody>
  ),

  tr: ({ children }) => (
    <tr className="hover:bg-slate-50 transition">{children}</tr>
  ),

  th: ({ children }) => (
    <th className="text-left text-xs font-semibold text-blue-700 uppercase tracking-wide px-4 py-3 border-b border-blue-100">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="px-4 py-3 text-slate-700 text-sm align-top">{children}</td>
  ),

  // Link
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:underline"
    >
      {children}
    </a>
  ),
};


function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async() => {
    try{
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
    catch (error) {
        console.error("Failed to copy text: ", error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-slate-300 hover:text-blue-400 transition"
      title="Copy response"
    >
      {copied ? (
        <>
          <LuCopyCheck size={14} className="text-green-500" />
          <span className="text-xs text-green-500 font-medium">Copied!</span>
        </>
      ) : (
        <LuCopy size={14} />
      )}
    </button>
  );
}

function ChatWindow({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex items-end gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >

            {/* AI avatar */}
            {message.role === "assistant" && (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0 shadow-sm self-start mt-1">
                <FaHeartbeat className="text-white text-sm" />
              </div>
            )}

            {/* Bubble */}
            <div
              className={`max-w-[75%] rounded-2xl shadow-sm ${
                message.role === "user"
                  ? "bg-blue-500 text-white rounded-br-sm px-5 py-3"
                  : "bg-white border border-slate-200 rounded-bl-sm px-5 py-4"
              }`}
            >
              {/* Typing indicator */}
              {message.typing ? (
                <div className="flex gap-1.5 py-1 px-1">
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
              ) : message.role === "user" ? (
                // User message — plain text
                <p className="text-sm leading-relaxed">{message.content}</p>
              ) : (
                // AI message — full markdown
                <div>
                  {/* Copy button */}
                  <div className="flex justify-end mb-2">
                    <CopyButton text={message.content} />
                  </div>

                  {/* Rendered markdown */}
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            {/* User avatar */}
            {message.role === "user" && (
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center shrink-0 self-start mt-1">
                <FiUser className="text-slate-500 text-sm" />
              </div>
            )}

          </motion.div>
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default ChatWindow;