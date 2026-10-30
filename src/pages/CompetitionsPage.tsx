import React from 'react';
import { Trophy, Calendar, Award, CheckCircle, Upload, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { Competition, Artwork } from '../types';

interface CompetitionsPageProps {
  competitions: Competition[];
  artworks: Artwork[];
  onOpenUpload: () => void;
}

export const CompetitionsPage: React.FC<CompetitionsPageProps> = ({
  competitions,
  artworks,
  onOpenUpload,
}) => {
  const activeComps = competitions.filter((c) => c.status === 'active');
  const upcomingComps = competitions.filter((c) => c.status === 'upcoming');

  return (
    <div className="space-y-10 py-6">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-400 bg-amber-950 border border-amber-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
          Sovrinli Turnirlar
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">
          Rassomlar O'rtasida Anime Tanlovlar
        </h1>
        <p className="text-sm text-slate-300">
          O'z mahoratingizni sinang, qimmatbaho grafik planchetlar hamda sertifikatlarni qo'lga kiriting!
        </p>
      </div>

      {/* Active Competitions Showcase */}
      <div className="space-y-6">
        <h2 className="font-heading font-black text-2xl text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" />
          <span>Faol Tanlovlar</span>
        </h2>

        {activeComps.map((comp) => {
          const compArtworks = artworks.filter((a) => a.competitionId === comp.id);

          return (
            <div
              key={comp.id}
              className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/40 relative overflow-hidden space-y-6 shadow-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-amber-300 bg-amber-950 px-3 py-1 rounded-full border border-amber-500/30">
                      🏆 Faol
                    </span>
                    <span className="text-xs text-purple-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Muddat: {comp.endDate} gacha</span>
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-white">
                    {comp.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {comp.description}
                  </p>

                  <div className="p-4 rounded-2xl bg-amber-900/30 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                    <div className="font-bold text-amber-300 text-sm">🎁 Qimmatbaho Sovrinlar:</div>
                    <p>{comp.prize}</p>
                  </div>

                  {/* Rules list */}
                  <div className="space-y-1 pt-2">
                    <div className="font-bold text-xs text-white">Qoidalar:</div>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {comp.rules.map((rl, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{rl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-4 bg-black/40 p-6 rounded-2xl border border-purple-500/20 text-center">
                  <Trophy className="w-16 h-16 text-amber-400 animate-bounce" />
                  <div>
                    <div className="text-xs text-slate-400">Yuborilgan Ishtirokchilar</div>
                    <div className="font-heading font-black text-3xl text-white">
                      {compArtworks.length || comp.entriesCount} ta Ish
                    </div>
                  </div>

                  <button
                    onClick={onOpenUpload}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 hover:opacity-95 text-slate-950 font-black text-sm shadow-xl transition-all"
                  >
                    O'z Asaringizni Yuboring
                  </button>
                </div>

              </div>

              {/* Submitted Artworks Preview for this competition */}
              {compArtworks.length > 0 && (
                <div className="pt-6 border-t border-purple-500/20 space-y-3">
                  <h4 className="font-bold text-xs text-purple-300">
                    Ushbu Tanlovga Yuborilgan Ishlar ({compArtworks.length}):
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {compArtworks.map((art) => (
                      <div key={art.id} className="relative rounded-2xl overflow-hidden h-36 bg-black/50 border border-purple-500/20">
                        <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-2 right-2 text-[10px] text-white font-bold truncate bg-black/70 px-2 py-0.5 rounded backdrop-blur-md">
                          {art.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Upcoming Competitions */}
      {upcomingComps.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-heading font-black text-xl text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <span>Kutilayotgan Tanlovlar</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingComps.map((comp) => (
              <div key={comp.id} className="glass-panel p-6 rounded-3xl border border-purple-500/20 space-y-3">
                <span className="text-xs font-bold text-cyan-300 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-500/30">
                  📅 Boshlanishi: {comp.startDate}
                </span>
                <h3 className="font-heading font-bold text-xl text-white">{comp.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{comp.description}</p>
                <div className="text-xs text-amber-300 font-bold">🎁 Sovrin: {comp.prize}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
