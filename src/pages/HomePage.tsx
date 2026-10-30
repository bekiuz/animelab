import React from 'react';
import { Sparkles, BookOpen, Brush, Palette, Trophy, Users, ArrowRight, Play, Star, CheckCircle, Flame, Award } from 'lucide-react';
import { Course, Competition, Artwork } from '../types';
import { HERO_ART_IMAGE } from '../data/initialData';

interface HomePageProps {
  courses: Course[];
  competitions: Competition[];
  artworks: Artwork[];
  setActiveTab: (tab: string) => void;
  onOpenCourse: (course: Course) => void;
  onOpenCanvas: () => void;
  onOpenUpload: () => void;
  onOpenAI: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  courses,
  competitions,
  artworks,
  setActiveTab,
  onOpenCourse,
  onOpenCanvas,
  onOpenUpload,
  onOpenAI,
}) => {
  const activeComp = competitions.find((c) => c.status === 'active') || competitions[0];
  const featuredArtworks = artworks.slice(0, 4);

  return (
    <div className="space-y-16 py-6">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#18113c] via-[#120b2f] to-[#090518] border border-purple-500/25 p-8 sm:p-12 shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-xs font-bold text-purple-300">
              <Sparkles className="w-4 h-4 text-pink-400 animate-spin-slow" />
              <span>O'zbekistondagi #1 Anime & Manga Ta'lim Platformasi</span>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white leading-tight">
              Anime Chizish Sirlarini <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">
                Noldan Professionalgacha
              </span> O'rganing
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              O'zbek tilidagi bosqichma-bosqich darslar, interaktiv chizish studiyasi, xalqaro tanlovlar va professional anime mentorlar ko'magida o'z orzungizdagi xarakterlarni yarating.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActiveTab('courses')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Darslarni Boshlash</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('studio')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-purple-500/30 backdrop-blur-md transition-all"
              >
                <Brush className="w-4 h-4 text-cyan-300" />
                <span>Studio-da Mashq Qilish</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-purple-500/20 max-w-lg">
              <div>
                <div className="font-heading font-black text-2xl text-white">2,400+</div>
                <div className="text-xs text-slate-400">O'quvchilar</div>
              </div>
              <div>
                <div className="font-heading font-black text-2xl text-purple-400">18+</div>
                <div className="text-xs text-slate-400">Maxsus Darslar</div>
              </div>
              <div>
                <div className="font-heading font-black text-2xl text-pink-400">850+</div>
                <div className="text-xs text-slate-400">Talaba Artlari</div>
              </div>
            </div>

          </div>

          {/* Hero Banner Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-purple-500/40 shadow-2xl group">
              <img
                src={HERO_ART_IMAGE}
                alt="Anime Art Masterclass"
                className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c081e] via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 glass-panel p-4 rounded-2xl border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-pink-400 bg-pink-950/80 px-2 py-0.5 rounded">
                      Haftaning Mashhur Darsi
                    </span>
                    <h3 className="font-heading font-bold text-white text-sm mt-1">
                      Anime Yuz va Soch Anatomiyasi
                    </h3>
                  </div>
                  <button
                    onClick={() => courses[0] && onOpenCourse(courses[0])}
                    className="p-3 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-colors shadow-lg"
                  >
                    <Play className="w-4 h-4 fill-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Popular Courses Carousel / Grid */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Mualliflik Darslari
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
              Ommabop Chizish Kurslari
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('courses')}
            className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>Barcha Kurslar ({courses.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 3).map((course) => (
            <div
              key={course.id}
              onClick={() => onOpenCourse(course)}
              className="glass-panel glass-panel-hover rounded-3xl overflow-hidden cursor-pointer flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-black/70 text-purple-300 backdrop-blur-md">
                    {course.category}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-cyan-950/80 text-cyan-300 backdrop-blur-md">
                    {course.difficulty}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/80 px-2.5 py-1 rounded-lg text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{course.rating}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-heading font-bold text-base text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-purple-500/20 flex items-center justify-between text-xs text-slate-400">
                  <span>{course.duration} • {course.lessonsCount} dars</span>
                  <span className="font-bold text-purple-300 flex items-center gap-1">
                    <span>Ko'rish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Practice Banner */}
      <section className="relative rounded-3xl bg-gradient-to-r from-violet-900/60 via-purple-900/40 to-pink-900/40 border border-purple-500/30 p-8 sm:p-10 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold">
            <Brush className="w-3.5 h-3.5" />
            <span>Interaktiv Canvas Studio</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
            Nazariyani To'g'ridan-To'g'ri Ekran Yuzasida Mashq Qiling!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Qalam, mo'hqalam, ranglar palitrasi va maxsus o'quv kontur gidlari yordamida o'z mahoratingizni oshiring hamda darhol galereyaga chop eting.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('studio')}
          className="shrink-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all transform hover:scale-105"
        >
          Studioni Ochish
        </button>
      </section>

      {/* Active Competition Banner */}
      {activeComp && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <h2 className="font-heading font-black text-2xl text-white">
                Faol Rassomlar Tanlovi
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('competitions')}
              className="text-xs font-bold text-purple-400 hover:text-purple-300"
            >
              Tanlov Lentalari →
            </button>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30 relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-4">
              <span className="text-xs font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-3 py-1 rounded-full">
                🏆 {activeComp.status === 'active' ? 'Faol Tanlov' : 'Kutilyapti'}
              </span>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-white">
                {activeComp.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeComp.description}
              </p>
              <div className="p-3 rounded-2xl bg-amber-900/20 border border-amber-500/20 text-xs text-amber-200">
                <span className="font-bold">Sovrin:</span> {activeComp.prize}
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-3">
              <button
                onClick={() => setActiveTab('competitions')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-slate-950 font-black text-sm shadow-lg text-center"
              >
                Tanlovda Qatnashish
              </button>
              <button
                onClick={onOpenUpload}
                className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-purple-500/30 text-center"
              >
                Ishni Yuklash
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Community Gallery */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
              Talabalar Ijodi
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
              Rassomlar Galereyasi
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('gallery')}
            className="text-xs font-bold text-purple-400 hover:text-purple-300"
          >
            Barchasini Ko'rish →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredArtworks.map((art) => (
            <div
              key={art.id}
              onClick={() => setActiveTab('gallery')}
              className="group relative rounded-2xl overflow-hidden glass-panel border border-purple-500/20 cursor-pointer h-64"
            >
              <img
                src={art.imageUrl}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

              <div className="absolute bottom-3 left-3 right-3 text-xs space-y-1">
                <span className="text-[10px] text-cyan-300 font-bold">{art.category}</span>
                <h4 className="font-bold text-white line-clamp-1">{art.title}</h4>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>@{art.authorName}</span>
                  <span className="text-pink-400 font-bold">♥ {art.likesCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
