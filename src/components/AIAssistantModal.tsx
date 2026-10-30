import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, RefreshCw, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: "Konnichiwa! Men AnimeLab platformasining AI Anime Sensei (Mentor) yordamchisiman! 🎨\n\nSizga anime/manga chizish, yuz va tana nisbatlari, Clip Studio/Photoshop shading, kiyim burmalari yoki o'z xarakteringizni yaratish bo'yicha professional maslahat bera olaman. Savolingizni berishingiz mumkin!",
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    "Anime ko'zlari va nur tushishini to'g'ri chizish usullari?",
    "3/4 burchakda yuz va burun nisbatlari qanday hisoblanadi?",
    "Clip Studio Paint-da tekis va yumshoq soya berish maslahatlari",
    "Anime xarakteri uchun noyob soch uslubi va dinamikasini yaratish",
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const newMessages = [...messages, { sender: 'user' as const, text: textToSend }];
    setMessages(newMessages);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    try {
      // Use standard Gemini SDK initialization
      const apiKey = process.env.GEMINI_API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Siz AnimeLab platformasining professional Anime & Manga Sensei (Mentor) mutaxassisiz. Barcha javoblaringizni do'stona, ilhomlantiruvchi va mutaxassis sifatida O'ZBEK TILIDA (Lotin alifbosida) bering.
                
Mavzu bo'yicha savol: ${textToSend}

Iltimos javobingizda:
1. Qisqa va tushunarli uslubiy bosqichlar (1, 2, 3)
2. Asosiy anime chizish qoidalari (Loomis, Anatomiya, Shading, Highlights)
3. Yosh rassom uchun amaliy maslahat va ruhiy dalda bering.`,
              },
            ],
          },
        ],
      });

      const aiReply = response.text || "Uzr, javob tayyorlashda xatolik yuz berdi. Iltimos, savolni qayta berib ko'ring.";
      setMessages([...newMessages, { sender: 'ai', text: aiReply }]);
    } catch (error) {
      console.error('Gemini API Error:', error);
      setMessages([
        ...newMessages,
        {
          sender: 'ai',
          text: "Anime Sensei tavsiyasi:\n\n1. Anime ko'zlarini chizishda yuqori kiprikni qalinroq va elastik yoy shaklida chizing.\n2. Ko'z qorachig'i (Iris) ustidan nur tushish nuqtasini (Highlight) oq doiracha qilib ajrating.\n3. Har bir dars va mashqda kamida 15-20 daqiqa uzluksiz chizib turing!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0f0b24] border border-purple-500/30 rounded-3xl shadow-2xl flex flex-col h-[80vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-[#140e30]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-400">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                <span>AI Anime Sensei</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                  Gemini AI
                </span>
              </h3>
              <p className="text-xs text-purple-300">
                Anime va manga chizish bo'yicha interaktiv AI ustoz
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-lg'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-white/5 border border-purple-500/20 text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-purple-300">
              <div className="w-8 h-8 rounded-xl bg-purple-600/30 flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 bg-white/5 px-3 py-2 rounded-xl border border-purple-500/20">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-pink-400" />
                <span>Sensei javob tayyorlamoqda...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-[#110c28] border-t border-purple-500/20 overflow-x-auto flex items-center gap-2">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-purple-600/20 text-slate-300 hover:text-purple-200 border border-purple-500/20 text-[11px] whitespace-nowrap shrink-0 transition-colors"
            >
              💡 {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#140e30] border-t border-purple-500/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Chizish bo'yicha savolingizni yozing..."
              className="flex-1 bg-black/40 border border-purple-500/30 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:opacity-40 hover:from-purple-500 hover:to-pink-500 shadow-md transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
