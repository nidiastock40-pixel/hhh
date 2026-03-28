import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, X } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function Chatbot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm your FinPortal AI Assistant. I can help you check loan eligibility, suggest the best NBFCs, or guide you through Govt schemes like PM Mudra. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a helpful financial assistant for an Indian financial portal. 
        You help users with:
        - Loan eligibility (Personal, Home, Business)
        - Suggesting aggregators (Paisabazaar, BankBazaar, Wishfin)
        - Suggesting NBFCs (Bajaj Finserv, Tata Capital, Lendingkart, KreditBee)
        - Govt Schemes (PM Mudra, PMEGP, Stand-Up India)
        - Opening bank accounts
        
        Keep your answers concise, professional, and helpful. Use bullet points where appropriate.
        
        User: ${userMessage}`
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || 'Sorry, I could not process that.' }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex items-center justify-between p-4 bg-indigo-600 text-white shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold">FinAssist AI</span>
        </div>
        <button onClick={onClose} className="text-indigo-200 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
            }`}>
              {/* Simple markdown rendering for bold text and newlines */}
              {msg.text.split('\n').map((line, i) => (
                <p key={i} className="mb-1 last:mb-0">
                  {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                </p>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span className="text-sm text-slate-500">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about loans, eligibility..."
            className="flex-1 px-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
