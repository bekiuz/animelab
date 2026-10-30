import React, { useState } from 'react';
import { Users, Sparkles, MessageSquare, Star, Send, CheckCircle, Plus } from 'lucide-react';
import { MentorshipRequest } from '../types';
import { INITIAL_MENTOR_REQUESTS } from '../data/initialData';
import { useAuth } from '../context/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface MentorshipPageProps {
  onOpenAI: () => void;
}

export const MentorshipPage: React.FC<MentorshipPageProps> = ({ onOpenAI }) => {
  const { user, profile } = useAuth();
  const [requests, setRequests] = useState<MentorshipRequest[]>(INITIAL_MENTOR_REQUESTS);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [artworkUrl, setArtworkUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artworkUrl || !title) return;

    try {
      setIsSubmitting(true);
      const newReq = {
        userId: user?.uid || 'guest',
        userName: profile?.displayName || 'Bekzod Student',
        userAvatar: profile?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        artworkUrl,
        title,
        description,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'mentorshipRequests'), newReq);
      setRequests([{ id: `mr-${Date.now()}`, ...newReq }, ...requests]);
      setShowRequestModal(false);
      setTitle('');
      setArtworkUrl('');
      setDescription('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'mentorshipRequests');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 py-6">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-pink-400 bg-pink-950 border border-pink-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
          Professional Feedback & Tahlil
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">
          Mentorlik va San'at Tahlili
        </h1>
        <p className="text-sm text-slate-300">
          Chizgan asarlaringiz bo'yicha professional anime illustratorlardan yoki sun'iy intellekt AI ustozidan shaxsiy ko'rsatma va maslahat oling.
        </p>
      </div>

      {/* AI Assistant Callout Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/30 bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-purple-900/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin-slow" />
            <span>Tezkor AI Tahlilchi</span>
          </div>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">
            Savol-javob Qilmoqchimisiz? AI Anime Sensei Tayyor!
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Anatomiya, ko'z nisbatlari, soya berish va Clip Studio dasturi sirlari haqida Gemini AI Tahlilchidan darhol tushuntirish oling.
          </p>
        </div>

        <button
          onClick={onOpenAI}
          className="shrink-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-pink-700 hover:opacity-95 text-white font-bold text-xs shadow-xl transition-all transform hover:scale-105"
        >
          AI Sensei Bilan Muloqot
        </button>
      </div>

      {/* Requests Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-black text-2xl text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            <span>Mentorlar Sharhlari & So'rovlar</span>
          </h2>

          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Tahlil So'rash</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <div key={req.id} className="glass-panel p-6 rounded-3xl border border-purple-500/20 space-y-4">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={req.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt={req.userName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{req.userName}</div>
                    <div className="text-[10px] text-slate-400">{req.title}</div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    req.status === 'reviewed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {req.status === 'reviewed' ? '✅ Tahlil Qilindi' : '⏳ Kutilmoqda'}
                </span>
              </div>

              <div className="relative h-48 rounded-2xl overflow-hidden bg-black/50 border border-purple-500/20">
                <img src={req.artworkUrl} alt={req.title} className="w-full h-full object-cover" />
              </div>

              <p className="text-xs text-slate-300 italic bg-white/5 p-3 rounded-xl">
                "{req.description}"
              </p>

              {req.feedback && (
                <div className="p-4 rounded-2xl bg-purple-900/30 border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-200">
                    <span>👨‍🎨 Mentor Sharhi ({req.mentorName}):</span>
                    <span className="text-amber-400">★ {req.rating}/5</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{req.feedback}</p>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>

      {/* Request Form Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0f0b24] border border-purple-500/30 rounded-3xl p-6 space-y-4">
            <h3 className="font-heading font-bold text-lg text-white">Mentordan Tahlil So'rash</h3>
            
            <form onSubmit={handleSubmitRequest} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Mavzu / Savol *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: Yuz va ko'z nisbatlari tahlili"
                  className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Asar Rasm Havolasi *</label>
                <input
                  type="url"
                  required
                  value={artworkUrl}
                  onChange={(e) => setArtworkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Qanday yordam kerak?</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Qaysi joyida qiynalayotganingizni tushuntiring..."
                  className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold"
                >
                  Yuborish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
