import React, { useState } from 'react';
import { Sparkles, BookOpen, Brush, Palette, Trophy, Users, User, Shield, LogIn, LogOut, Menu, X, Bell, Paintbrush } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_ANIME_GIRL_AVATAR } from '../data/initialData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCanvas: () => void;
  onOpenUpload: () => void;
  onOpenAI: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCanvas,
  onOpenUpload,
  onOpenAI,
}) => {
  const { user, profile, loginWithGoogle, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { id: 'home', label: 'Bosh sahifa', icon: Sparkles },
    { id: 'studio', label: 'Chizish studiyasi', icon: Paintbrush },
    { id: 'courses', label: 'Chizish darslari', icon: BookOpen },
    { id: 'practice', label: 'Bosqichma-bosqich', icon: Brush },
    { id: 'gallery', label: 'Galereya', icon: Palette },
    { id: 'competitions', label: 'Tanlovlar', icon: Trophy },
    { id: 'mentorship', label: 'Mentorlik', icon: Users },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin panel', icon: Shield });
  }

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-purple-500/20 bg-[#0c081e]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-violet-500 to-cyan-400 p-[2px] shadow-lg shadow-purple-600/30">
              <div className="w-full h-full bg-[#0d0922] rounded-[14px] flex items-center justify-center">
                <span className="font-extrabold text-xl bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">
                  AL
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-2xl tracking-wide text-white">
                  Anime<span className="text-purple-400">Lab</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  UZ
                </span>
              </div>
              <p className="text-[11px] text-purple-300/70 -mt-1 font-medium">
                Anime Ta'lim Platformasi
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-600/25 text-purple-200 border border-purple-500/40 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons & Auth */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Quick Interactive Studio Button */}
            <button
              onClick={onOpenCanvas}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-purple-600/20 border border-purple-400/30 transition-all transform hover:-translate-y-0.5"
            >
              <Brush className="w-4 h-4 text-cyan-300 animate-pulse" />
              <span>Chizish Studio</span>
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAI}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-purple-900/40 hover:bg-purple-800/50 text-purple-200 border border-purple-500/30 transition-all"
              title="AI San'at Tahlilchisi"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>AI Tahlil</span>
            </button>

            {/* Notifications toggle */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl bg-white/5 border border-purple-500/20 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500" />
              </button>

              {/* Notifications Popup */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 glass-panel p-4 rounded-2xl shadow-2xl z-50 text-xs border border-purple-500/30">
                  <div className="flex items-center justify-between pb-2 border-b border-purple-500/20 mb-3">
                    <span className="font-bold text-white">Xabarnomalar</span>
                    <span className="text-[10px] text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-full">Yangi</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-2 rounded-lg bg-purple-900/30 border border-purple-500/20">
                      <p className="font-semibold text-purple-200">🏆 "Kuzgi Anime Qahramoni" Tanlovi!</p>
                      <p className="text-slate-400 mt-0.5">Asarlarni qabul qilish ochiq. O'z ijodingizni ulashing.</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <p className="font-semibold text-slate-200">📚 Yangi Dars Qo'shildi</p>
                      <p className="text-slate-400 mt-0.5">"Digital Art: Clip Studio Shading" moduli tayyor.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile or Login */}
            {user && profile ? (
              <div className="flex items-center gap-2 pl-2 border-l border-purple-500/20">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl transition-all ${
                    activeTab === 'profile' ? 'bg-purple-600/30 border border-purple-500/40' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <img
                    src={profile.photoURL || DEFAULT_ANIME_GIRL_AVATAR}
                    alt={profile.displayName}
                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-purple-500/50"
                  />
                  <div className="text-left">
                    <div className="text-xs font-bold text-white max-w-[100px] truncate">
                      {profile.displayName}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded">
                        Lvl {profile.level}
                      </span>
                      <span className="text-[10px] text-purple-300">{profile.xp} XP</span>
                    </div>
                  </div>
                </button>

                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                  title="Chiqish"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-950 hover:bg-slate-200 transition-all shadow-md"
              >
                <LogIn className="w-4 h-4 text-purple-600" />
                <span>Google Bilan Kirish</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={onOpenCanvas}
              className="p-2 rounded-xl bg-purple-600 text-white"
              title="Chizish Studio"
            >
              <Brush className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white/5 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="xl:hidden glass-panel border-b border-purple-500/20 px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-purple-500/20 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenAI();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-purple-900/50 text-purple-200 border border-purple-500/30"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>AI San'at Tahlili</span>
            </button>

            {user && profile ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-purple-500/20 mt-2">
                <div className="flex items-center gap-3">
                  <img
                    src={profile.photoURL || DEFAULT_ANIME_GIRL_AVATAR}
                    alt={profile.displayName}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <div className="text-sm font-bold text-white">{profile.displayName}</div>
                    <div className="text-xs text-purple-400">Level {profile.level} • {profile.xp} XP</div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg bg-red-500/20 text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-white text-slate-950"
              >
                <LogIn className="w-4 h-4 text-purple-600" />
                <span>Google Bilan Kirish</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
