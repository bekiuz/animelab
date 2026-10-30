import React, { useState } from 'react';
import { User, Award, Sparkles, BookOpen, Heart, LogIn, Edit2, Shield, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Artwork, Course } from '../types';
import { DEFAULT_ANIME_GIRL_AVATAR } from '../data/initialData';

interface ProfilePageProps {
  artworks: Artwork[];
  courses: Course[];
  onOpenUpload: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ artworks, courses, onOpenUpload }) => {
  const { user, profile, loginWithGoogle, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'artworks' | 'liked' | 'courses'>('artworks');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(profile?.bio || '');

  if (!user || !profile) {
    return (
      <div className="py-20 text-center glass-panel rounded-3xl p-8 max-w-md mx-auto space-y-4 my-12 border border-purple-500/30">
        <div className="w-16 h-16 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="font-heading font-bold text-xl text-white">Shaxsiy Kabinetga Kirish</h2>
        <p className="text-xs text-slate-300">
          O'z darajangiz va progressni kuzatish, san'at asarlaringizni saqlash uchun tizimga kiring.
        </p>
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-all shadow-lg"
        >
          <LogIn className="w-4 h-4 text-purple-600" />
          <span>Google Bilan Kirish</span>
        </button>
      </div>
    );
  }

  const userArtworks = artworks.filter((a) => a.authorId === user.uid);
  const likedArtworks = artworks.filter((a) => a.likes?.includes(user.uid));

  const handleSaveBio = async () => {
    await updateProfile({ bio: bioInput });
    setIsEditingBio(false);
  };

  const maxXPForLevel = profile.level * 300;
  const xpProgressPercent = Math.min(Math.round((profile.xp / maxXPForLevel) * 100), 100);

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      
      {/* Profile Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 relative overflow-hidden space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-purple-500/20">
          
          <div className="flex items-center gap-4">
            <img
              src={profile.photoURL || DEFAULT_ANIME_GIRL_AVATAR}
              alt={profile.displayName}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-purple-500/40 shadow-xl"
            />
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-black text-2xl text-white">
                  {profile.displayName}
                </h1>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40">
                  {profile.role === 'admin' ? '🛡️ Admin' : profile.role === 'mentor' ? '👨‍🎨 Mentor' : "🎨 O'quvchi"}
                </span>
              </div>

              <p className="text-xs text-slate-400">{profile.email}</p>

              {/* Bio */}
              {isEditingBio ? (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    className="bg-black/50 border border-purple-500/30 rounded-lg px-2 py-1 text-xs text-white"
                  />
                  <button onClick={handleSaveBio} className="p-1 rounded bg-emerald-600 text-white">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-purple-200">
                  <span>"{profile.bio || "AnimeLab a'zosi"}"</span>
                  <button onClick={() => setIsEditingBio(true)} className="text-slate-400 hover:text-white">
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

          </div>

          <button
            onClick={onOpenUpload}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-lg"
          >
            + San'at Asarini Yuklash
          </button>

        </div>

        {/* XP and Level Bar */}
        <div className="space-y-2 bg-black/30 p-4 rounded-2xl border border-purple-500/20">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Daraja: Level {profile.level}</span>
            </span>
            <span className="text-purple-300">
              {profile.xp} / {maxXPForLevel} XP
            </span>
          </div>

          <div className="w-full h-3 bg-purple-950 rounded-full overflow-hidden p-0.5 border border-purple-500/30">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${xpProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Badges Collection */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs text-white flex items-center gap-1.5">
            <Award className="w-4 h-4 text-pink-400" />
            <span>Nishonlar (Badges):</span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {profile.badges?.map((bdg, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-xl bg-purple-900/40 text-purple-200 border border-purple-500/30 text-xs font-bold"
              >
                🏅 {bdg}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-500/20 pb-3">
        <button
          onClick={() => setActiveTab('artworks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'artworks'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          Mening Artlarim ({userArtworks.length})
        </button>

        <button
          onClick={() => setActiveTab('liked')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'liked'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          Yoqtirganlarim ({likedArtworks.length})
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'courses'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          O'rganilayotgan Kurslar ({courses.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'artworks' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {userArtworks.map((art) => (
            <div key={art.id} className="glass-panel rounded-2xl overflow-hidden h-48 relative group">
              <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-black/80 text-xs font-bold text-white truncate backdrop-blur-md">
                {art.title}
              </div>
            </div>
          ))}
          {userArtworks.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs">
              Hali artlar yuklamagansiz. "San'at Asarini Yuklash" tugmasini bosing!
            </div>
          )}
        </div>
      )}

      {activeTab === 'liked' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {likedArtworks.map((art) => (
            <div key={art.id} className="glass-panel rounded-2xl overflow-hidden h-48 relative">
              <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-black/80 text-xs font-bold text-white truncate backdrop-blur-md">
                {art.title}
              </div>
            </div>
          ))}
          {likedArtworks.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs">
              Hali biror artga yurakcha bosmagansiz. Galereyaga o'tib yoqtirgan asarlaringizni saqlang!
            </div>
          )}
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((c) => (
            <div key={c.id} className="glass-panel p-4 rounded-2xl flex items-center gap-4">
              <img src={c.thumbnail} alt={c.title} className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="font-bold text-xs text-white truncate">{c.title}</h4>
                <div className="text-[10px] text-purple-300">{c.category} • {c.duration}</div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
