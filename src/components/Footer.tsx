import React from 'react';
import { Sparkles, Heart, Shield, Award, Send, Instagram, Youtube, MessageSquare } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="mt-20 border-t border-purple-500/20 bg-[#090616] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[2px]">
                <div className="w-full h-full bg-[#0d0922] rounded-[14px] flex items-center justify-center">
                  <span className="font-extrabold text-lg text-purple-400">AL</span>
                </div>
              </div>
              <span className="font-heading font-black text-2xl text-white">
                Anime<span className="text-purple-400">Lab</span>
              </span>
            </div>
            
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              O'zbekistondagi yoshlar va havaskorlar uchun professional anime hamda manga chizish bo'yicha maxsus yaratilgan interaktiv ta'lim va ijodiy hamjamiyat platformasi.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 rounded-xl bg-white/5 hover:bg-purple-600/30 text-purple-300 hover:text-white transition-colors" title="Telegram">
                <Send className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-white/5 hover:bg-purple-600/30 text-purple-300 hover:text-white transition-colors" title="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-white/5 hover:bg-purple-600/30 text-purple-300 hover:text-white transition-colors" title="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-white/5 hover:bg-purple-600/30 text-purple-300 hover:text-white transition-colors" title="Discord">
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4">Bo'limlar</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setActiveTab('courses')} className="hover:text-purple-300 transition-colors">
                  Chizish darslari
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('practice')} className="hover:text-purple-300 transition-colors">
                  Bosqichma-bosqich mashqlar
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('gallery')} className="hover:text-purple-300 transition-colors">
                  Rassomlar galereyasi
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('competitions')} className="hover:text-purple-300 transition-colors">
                  Rassomlar tanlovlari
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('mentorship')} className="hover:text-purple-300 transition-colors">
                  Mentorlik va Tahlil
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4">Yo'nalishlar</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="hover:text-purple-300 cursor-pointer">Yuz va Sochlar</li>
              <li className="hover:text-purple-300 cursor-pointer">Anatomiya & Pozalar</li>
              <li className="hover:text-purple-300 cursor-pointer">Raqamli Art (Digital)</li>
              <li className="hover:text-purple-300 cursor-pointer">Soya va Yorug'lik</li>
              <li className="hover:text-purple-300 cursor-pointer">Anime Fon va Osmon</li>
            </ul>
          </div>

          {/* Platform Features */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4">Afsalliklar</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-purple-300">
                <Award className="w-4 h-4 text-pink-400" />
                <span>Sertifikatli Ta'lim</span>
              </div>
              <div className="flex items-center gap-2 text-purple-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI San'at Tahlilchisi</span>
              </div>
              <div className="flex items-center gap-2 text-purple-300">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Xavfsiz Hamjamiyat</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-purple-500/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 AnimeLab. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>O'zbekistonda yosh rassomlar uchun</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" />
            <span>bilan yaratilgan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
