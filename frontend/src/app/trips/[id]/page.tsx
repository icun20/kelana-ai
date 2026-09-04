"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_BASE, getAuthHeaders } from "@/lib/auth";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";

interface TripData {
  id: number;
  destination: string;
  days: number;
  budget: number;
  category: string;
  ai_recommendation: string | null;
}

interface MessageData {
  id: number;
  role: string;
  content: string;
  created_at: string;
}

export default function ChatPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  
  const [trip, setTrip] = useState<TripData | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (!id) return;
    const fetchTripAndChat = async () => {
      try {
        const headers = getAuthHeaders();
        // Fetch trip info
        const tripRes = await fetch(`${API_BASE}/api/v1/trips/${id}`, { headers });
        if (!tripRes.ok) {
          router.push("/dashboard");
          return;
        }
        const tripData = await tripRes.json();
        setTrip(tripData);

        let initialMessages: MessageData[] = [];
        if (tripData.ai_recommendation) {
          initialMessages.push({
            id: -1,
            role: "assistant",
            content: tripData.ai_recommendation,
            created_at: new Date().toISOString()
          });
        }

        // Fetch chat history
        const chatRes = await fetch(`${API_BASE}/api/v1/trips/${id}/chat`, { headers });
        if (chatRes.ok) {
          const chatData = await chatRes.json();
          setMessages([...initialMessages, ...chatData]);
        } else {
          setMessages(initialMessages);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTripAndChat();
  }, [id, router]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !id) return;

    const userMsg = input.trim();
    setInput("");
    
    const tempUserMsg: MessageData = {
      id: Date.now(),
      role: "user",
      content: userMsg,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsTyping(true);

    try {
      const chatRes = await fetch(`${API_BASE}/api/v1/trips/${id}/chat`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMsg }),
      });
      
      if (chatRes.ok) {
        const aiMsg = await chatRes.json();
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen bg-slate-50 font-sans">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-slate-500 hover:text-slate-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Rencana Perjalanan ke {trip?.destination}
              </h1>
              <p className="text-xs text-slate-500">{trip?.days} Hari - Kategori {trip?.category}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-slate-400 text-sm italic">
              Belum ada percakapan. Sapa asisten AI Anda!
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative group ${msg.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"}`}>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap markdown-content" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>').replace(/## (.*?)(<br\/>|$)/g, '<strong>$1</strong><br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  
                  <div className={`text-[10px] mt-2 opacity-70 ${msg.role === "user" ? "text-blue-100 text-right" : "text-slate-400 text-left"}`}>
                    {formatTime(msg.created_at)}
                  </div>
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </main>

        <footer className="bg-white border-t border-slate-200 p-4">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya rekomendasi tempat..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-full pl-6 pr-14 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 -rotate-90 transform" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </footer>
      </div>
    </AuthGuard>
  );
}
