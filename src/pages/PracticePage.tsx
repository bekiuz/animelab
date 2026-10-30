import React, { useState } from 'react';
import { Brush, Sparkles, Check, Play, ArrowRight, Eye, Layers } from 'lucide-react';
import { PracticeTutorial } from '../types';
import { INITIAL_PRACTICE_TUTORIALS } from '../data/initialData';

interface PracticePageProps {
  onOpenCanvasWithGuide: (guideImage?: string, guideTitle?: string) => void;
}

export const PracticePage: React.FC<PracticePageProps> = ({ onOpenCanvasWithGuide }) => {
  const [tutorials] = useState<PracticeTutorial[]>(INITIAL_PRACTICE_TUTORIALS);
  const [activeTutorial, setActiveTutorial] = useState<PracticeTutorial>(INITIAL_PRACTICE_TUTORIALS[0]);

  return (
    <div className="space-y-10 py-6">
      
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-cyan-400 bg-cyan-950 border border-cyan-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
          Interaktiv Qo'llanmalar & Eskiz Studiyasi
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">
          Bosqichma-Bosqich Chizish Mashqlari
        </h1>
        <p className="text-sm text-slate-300">
          Ushbu qo'llanmalar yordamida qadam-baqadam anime konturlarini chizishni o'rganing va darhol ekranda sinab ko'ring.
        </p>
      </div>

      {/* Tutorial Selection Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tutorials.map((tut) => {
          const isSelected = activeTutorial.id === tut.id;
          return (
            <div
              key={tut.id}
              onClick={() => setActiveTutorial(tut)}
              className={`p-5 rounded-3xl cursor-pointer border transition-all flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-purple-600/25 border-purple-500 shadow-xl shadow-purple-600/20'
                  : 'glass-panel border-purple-500/20 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {tut.category}
                </span>
                <span className="text-[10px] font-bold text-cyan-400">
                  {tut.steps.length} Bosqich
                </span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-base text-white">
                  {tut.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {tut.description}
                </p>
              </div>

              <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between text-xs font-bold text-purple-300">
                <span>Qo'llanmani Ochish</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Practice Showcase */}
      {activeTutorial && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 space-y-6">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-purple-500/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-md">
                  {activeTutorial.difficulty}
                </span>
                <span className="text-xs text-purple-300">{activeTutorial.category}</span>
              </div>
              <h2 className="font-heading font-black text-2xl text-white mt-1">
                {activeTutorial.title}
              </h2>
            </div>

            <button
              onClick={() =>
                onOpenCanvasWithGuide(
                  activeTutorial.steps[0]?.overlayImage || activeTutorial.thumbnail,
                  activeTutorial.title
                )
              }
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <Brush className="w-4 h-4 text-cyan-300" />
              <span>Studio-da Amaliy Chizish</span>
            </button>
          </div>

          {/* Steps Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeTutorial.steps.map((st) => (
              <div
                key={st.number}
                className="bg-black/40 rounded-2xl border border-purple-500/20 p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                      {st.number}
                    </span>
                    <span className="text-[10px] text-purple-400 font-bold uppercase">
                      Bosqich {st.number}
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-sm text-white">
                    {st.title}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {st.description}
                  </p>
                </div>

                {st.tips && st.tips.length > 0 && (
                  <div className="pt-2 border-t border-purple-500/20 space-y-1">
                    {st.tips.map((tp, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[10px] text-pink-300">
                        <Sparkles className="w-3 h-3 shrink-0 mt-0.5 text-pink-400" />
                        <span>{tp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
