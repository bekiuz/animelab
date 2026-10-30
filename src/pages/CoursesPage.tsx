import React, { useState } from 'react';
import { Search, BookOpen, Star, Clock, Filter, ArrowRight, Play, CheckCircle } from 'lucide-react';
import { Course } from '../types';

interface CoursesPageProps {
  courses: Course[];
  onOpenCourse: (course: Course) => void;
}

const CATEGORIES = [
  'Barchasi',
  'Yuz va Sochlar',
  'Anatomiya',
  'Raqamli Art',
  'Kiyim-kechak',
  'Kompozitsiya',
];

const DIFFICULTIES = ['Barchasi', "Boshlang'ich", "O'rta", "Yuqori"];

export const CoursesPage: React.FC<CoursesPageProps> = ({ courses, onOpenCourse }) => {
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = selectedCategory === 'Barchasi' || c.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'Barchasi' || c.difficulty === selectedDifficulty;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="space-y-8 py-6">
      
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-purple-400 bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
          O'zbekistondagi Eng Saralangan Kurslar
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">
          Anime Chizish Darslari Katalogi
        </h1>
        <p className="text-sm text-slate-300">
          O'zingizga mos yo'nalish va qiyinchilik darajasini tanlab, hoziroq amaliy video darslarni o'rganishni boshlang.
        </p>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="glass-panel p-4 rounded-3xl space-y-4 border border-purple-500/20">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-purple-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kurs nomi, muallif yoki mavzu bo'yicha qidiruv..."
            className="w-full bg-black/40 border border-purple-500/30 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* Category & Difficulty Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2 text-xs text-slate-300 shrink-0 w-full sm:w-auto justify-end">
            <Filter className="w-3.5 h-3.5 text-purple-400" />
            <span>Daraja:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-black/50 border border-purple-500/30 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-purple-400"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            onClick={() => onOpenCourse(course)}
            className="glass-panel glass-panel-hover rounded-3xl overflow-hidden cursor-pointer flex flex-col group border border-purple-500/20"
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
                <div className="mt-2 text-[11px] text-purple-300 font-medium">
                  👨‍🎨 {course.instructor}
                </div>
              </div>

              <div className="pt-3 border-t border-purple-500/20 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{course.duration} • {course.lessonsCount} dars</span>
                </div>
                <span className="font-bold text-purple-300 flex items-center gap-1">
                  <span>Darsni Boshlash</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-16 glass-panel rounded-3xl p-8 space-y-3">
          <BookOpen className="w-12 h-12 text-purple-400 mx-auto opacity-50" />
          <h3 className="font-heading font-bold text-lg text-white">Ushbu so'rov bo'yicha kurs topilmadi</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Iltimos, qidiruv so'rovini o'zgartiring yoki filtrlarni tozalang.
          </p>
        </div>
      )}

    </div>
  );
};
