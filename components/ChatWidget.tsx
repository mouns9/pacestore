'use client';
import { useState, useRef, useEffect } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

const WELCOME: Message = {
  role: 'assistant',
  content:
    'Bonjour ! Je suis l\'assistant PaceStore. Je peux vous conseiller sur nos chaussures trail, compétition, montres GPS, et répondre à vos questions sur la livraison et les retours. Comment puis-je vous aider ?',
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: 'assistant', content: data.content }]);
    } catch {
      setMessages([
        ...next,
        { role: 'assistant', content: 'Désolé, une erreur est survenue. Réessayez dans un instant.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-30 flex flex-col items-start gap-3 pointer-events-none">
      {/* Chat panel */}
      <div
        className={`flex flex-col bg-[#111111] border border-white/10 w-[360px] max-w-[calc(100vw-3rem)] shadow-[0_24px_60px_rgba(0,0,0,0.6)] transition-all duration-300 origin-bottom-left ${
          open
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{ height: '480px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF5C00] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h7l-2 8 10-12h-7l2-8z" />
              </svg>
            </div>
            <div>
              <p className="text-white text-xs font-black uppercase tracking-widest">Expert PaceStore</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wide">En ligne</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white/25 hover:text-white transition-colors p-1"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#FF5C00] text-white'
                    : 'bg-[#1A1A1A] text-white/80 border border-white/5'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#1A1A1A] border border-white/5 px-4 py-3 flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 border-t border-white/5 p-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Posez votre question..."
            className="flex-1 bg-[#0A0A0A] border border-white/10 text-white text-xs placeholder-white/20 px-3 py-2.5 focus:outline-none focus:border-[#FF5C00]/50 transition-colors"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="bg-[#FF5C00] hover:bg-white hover:text-[#0A0A0A] disabled:opacity-30 disabled:cursor-not-allowed text-white px-3.5 py-2.5 transition-all duration-200 flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`pointer-events-auto w-14 h-14 rounded-full shadow-[0_8px_32px_rgba(255,92,0,0.4)] flex items-center justify-center transition-all duration-300 ${
          open
            ? 'bg-white text-[#0A0A0A] rotate-0'
            : 'bg-[#FF5C00] text-white hover:scale-110'
        }`}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
