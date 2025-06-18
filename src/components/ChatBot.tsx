import { useEffect, useRef, useState } from "react";

// Props for the ChatbotModal when used inside a Modal
interface ChatbotModalProps {
  onClose: () => void;
}

export default function ChatBot({ onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the chat window whenever messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo(0, chatRef.current.scrollHeight);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user" as const, text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const chatHistory = [{ role: "user", parts: [{ text: userMsg.text }] }];
      const payload = { contents: chatHistory };
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        console.error("❌ Gemini API key not found. Check your .env file.");
        setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ API key is missing or misconfigured." }]);
        setLoading(false);
        return;
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API HTTP error data:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      let botRawText = "⚠️ Sorry, I couldn't get a response.";
      if (
        result.candidates?.[0]?.content?.parts?.[0]?.text
      ) {
        botRawText = result.candidates[0].content.parts[0].text;
      } else {
        console.warn("Unexpected Gemini API response structure:", result);
      }

      const cleanedText = formatBotResponse(botRawText);

      setMessages((prev) => [...prev, { sender: "bot", text: cleanedText }]);

    } catch (error) {
      console.error("Gemini API fetch error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Cleans and shortens bot responses
 const formatBotResponse = (text: string): string => {
  const clean = text
    .replace(/[*#>`~_\-]/g, "")           
    .replace(/\n{2,}/g, "\n")             
    .replace(/\s{2,}/g, " ")              
    .trim();

  // Take first 2 sentences max
  const sentences = clean.split(/(?<=[.?!])\s+/).slice(0, 2).join(" ");

  return sentences.length > 0 ? sentences : clean.slice(0, 200) + "...";
};

  return (
    <div className="bg-white rounded-xl shadow-lg w-full h-[500px] flex flex-col overflow-hidden border border-gray-300">
      {/* Header */}
      <div className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between font-semibold rounded-t-xl">
        <span>💬 Loan ChatBot</span>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 text-xl font-bold transition-colors"
          aria-label="Close chatbot"
        >
          &times;
        </button>
      </div>

      {/* Chat messages */}
      <div
        ref={chatRef}
        className="flex-1 px-3 py-2 overflow-y-auto space-y-2 text-sm text-black bg-gray-50 scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-[90%] ${msg.sender === "user"
              ? "bg-indigo-100 self-end text-right ml-auto shadow-sm"
              : "bg-gray-200 self-start shadow-sm"
              }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="p-2 rounded-lg bg-gray-200 self-start max-w-[90%] shadow-sm">
            <p className="text-gray-500 italic animate-pulse">Typing...</p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center border-t border-gray-200 p-2 bg-white rounded-b-xl">
        <input
          type="text"
          className="flex-1 px-3 py-2 text-sm outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-black placeholder-gray-500 transition-colors"
          placeholder="Ask something like: How does loan interest work?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-indigo-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}