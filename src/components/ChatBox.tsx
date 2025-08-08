"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { LoaderOne } from "./ui/loader";
import { FaRegUser } from "react-icons/fa";
import { Moon, Sun, MessageCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Message type
type Message = {
  role: "user" | "assistant";
  content: string;
  links?: { text: string; url: string }[];
};

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Show welcome toast on component mount
    toast.success(
      "Welcome to Hitesh Sir's Persona Chat! Ask me anything about programming, technology, or any topic you want to learn about.",
      {
        duration: 6000,
        position: "top-center",
        style: {
          background: darkMode ? '#374151' : '#fff',
          color: darkMode ? '#fff' : '#000',
          border: darkMode ? '1px solid #4B5563' : '1px solid #E5E7EB',
        },
      }
    );
  }, []);

  useEffect(() => {
    toast.success("Theme Toggled");
    // setDarkMode(localStorage.getItem("darkMode") === "true");
  }, [darkMode]);

  const reloadPage = () => {
    window.location.reload();
  }


  const sendMessage = async () => {

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000";

    if (!input.trim()) return;

    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Message copied to clipboard!");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-200`}>
      <Toaster />
      
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
            <Image src="/logo.jpeg" alt="Hitesh Sir" width={40} height={40} className="rounded-full" />
          </div>
          <div>
            <h1 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Hitesh Sir AI Persona
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Your programming mentor and guide
            </p>
          </div>
        </div>
        
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg transition-colors ${
            darkMode 
              ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className={`w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden`}>
              <Image src="/logo.jpeg" alt="Hitesh Sir" width={64} height={64} className="rounded-full" />
            </div>
            <div className="text-center">
              <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Welcome to Hitesh Sir's AI Persona
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-md`}>
                Hi! I'm Hitesh Sir's AI persona. Ask me anything about programming, technology, 
                web development, or any topic you want to learn about. I'm here to help you grow!
              </p>
            </div>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start space-x-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                <Image src="/logo.jpeg" alt="Hitesh Sir" width={32} height={32} className="rounded-full" />
              </div>
            )}
            
            <div className={`max-w-md ${msg.role === "user" ? "order-first" : ""}`}>
              <div
                className={`px-4 py-3 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : darkMode 
                      ? "bg-gray-800 text-white border border-gray-700"
                      : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
                {msg.links && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium">Here're some links to get started:</p>
                    {msg.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        className="block text-blue-600 hover:text-blue-700 text-sm underline"
                      >
                        {link.text}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              
              {msg.role === "assistant" && (
                <div className="flex items-center space-x-2 mt-2">                  
                  <button 
                    onClick={() => copyMessage(msg.content)}
                    className={`text-xs hover:text-gray-700 p-1 rounded-sm font-semibold ${darkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200 '}`}
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => reloadPage()}
                    className={`p-1 rounded hover:bg-gray-200 ${darkMode ? 'hover:bg-gray-700' : ''}`}>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <FaRegUser className="text-white text-lg" />
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image src="/logo.jpeg" alt="Hitesh Sir" width={32} height={32} className="rounded-full" />
            </div>
            <div className={`px-4 py-3 rounded-2xl ${
              darkMode 
                ? "bg-gray-800 text-white border border-gray-700" 
                : "bg-gray-100 text-gray-900"
            }`}>
              <LoaderOne />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={`border-t p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <div className={`flex items-center space-x-2 px-3 py-2 border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 ${
              darkMode 
                ? 'border-gray-600 bg-gray-800' 
                : 'border-gray-300 bg-white'
            }`}>
              <button className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Hitesh Sir anything..."
                className={`flex-1 bg-transparent outline-none placeholder-gray-500 ${
                  darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900'
                }`}
              />
            </div>
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <button className={`text-sm font-medium transition-colors ${
            darkMode 
              ? 'text-blue-400 hover:text-blue-300' 
              : 'text-blue-600 hover:text-blue-700'
          }`}>
            + New chat
          </button>
          {loading && (
            <button className={`text-sm transition-colors ${
              darkMode 
                ? 'text-gray-400 hover:text-gray-300' 
                : 'text-gray-600 hover:text-gray-700'
            }`}>
              Stop generating
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
