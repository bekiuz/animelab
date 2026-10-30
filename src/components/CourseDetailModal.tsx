import React, { useState, useEffect } from 'react';
import { X, PlayCircle, CheckCircle, Lock, BookOpen, Clock, Award, Brush, Sparkles } from 'lucide-react';
import { Course, Lesson } from '../types';
import { INITIAL_LESSONS_MAP } from '../data/initialData';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface CourseDetailModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCanvasWithGuide: (guideImage?: string, guideTitle?: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  isOpen,
  onClose,
  onOpenCanvasWithGuide,
}) => {
  const { user, addXP } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course) {
      const courseLessons = INITIAL_LESSONS_MAP[course.id] || [
        {
          id: `${course.id}-l1`,
          courseId: course.id,
          title: "1-dars: Kirish va Asosiy Konsepsiya",
          duration: '15 min',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content: `${course.title} bo'yicha asosiy darslik materiallari va mashq ko'rsatmalari.`,
          order: 1,
          isFree: true,
          createdAt: new Date().toISOString(),
        },
      ];
      setLessons(courseLessons);
      setActiveLesson(courseLessons[0] || null);

      if (user) {
        fetchUserProgress(course.id);
      }
    }
  }, [course, user]);

  const fetchUserProgress = async (courseId: string) => {
    if (!user) return;
    const progressId = `${user.uid}_${courseId}`;
    try {
      const snap = await getDoc(doc(db, 'userProgress', progressId));
      if (snap.exists()) {
        const data = snap.data();
        setCompletedLessonIds(data.completedLessonIds || []);
      }
    } catch (error) {
      console.warn('Progress fetch error:', error);
    }
  };

  const handleMarkCompleted = async (lessonId: string) => {
    if (!course || !user) return;
    if (completedLessonIds.includes(lessonId)) return;

    const newCompleted = [...completedLessonIds, lessonId];
    setCompletedLessonIds(newCompleted);

    const progressPercent = Math.round((newCompleted.length / (lessons.length || 1)) * 100);
    const progressId = `${user.uid}_${course.id}`;

    try {
      setLoading(true);
      await setDoc(
        doc(db, 'userProgress', progressId),
        {
          userId: user.uid,
          courseId: course.id,
          completedLessonIds: newCompleted,
          progressPercent,
          lastAccessedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      await addXP(50); // Award 50 XP
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `userProgress/${progressId}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-[#0f0b24] border border-purple-500/30 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-[#140e30]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {course.category}
              </span>
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-md">
                {course.difficulty}
              </span>
            </div>
            <h3 className="font-heading font-bold text-lg text-white mt-1">
              {course.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Video/Player + Lesson List Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-purple-500/20">
          
          {/* Main Video & Lesson Detail Area (2 Cols) */}
          <div className="lg:col-span-2 p-4 space-y-4">
            
            {/* Embedded Video Frame */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/60 border border-purple-500/30 shadow-lg">
              {activeLesson ? (
                <iframe
                  src={activeLesson.videoUrl}
                  title={activeLesson.title}
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  Dars tanlanmagan
                </div>
              )}
            </div>

            {/* Active Lesson Info */}
            {activeLesson && (
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-heading font-bold text-base text-white">
                      {activeLesson.title}
                    </h4>
                    <p className="text-xs text-purple-300 mt-0.5 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{activeLesson.duration}</span>
                      <span>•</span>
                      <span>O'qituvchi: {course.instructor}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleMarkCompleted(activeLesson.id)}
                    disabled={completedLessonIds.includes(activeLesson.id) || loading}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      completedLessonIds.includes(activeLesson.id)
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {completedLessonIds.includes(activeLesson.id) ? "Tamomlangan (+50 XP)" : "Tamomladim deb belgilash"}
                    </span>
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-purple-500/20 text-xs text-slate-300 leading-relaxed">
                  <p>{activeLesson.content}</p>
                </div>

                {/* Steps if available */}
                {activeLesson.steps && activeLesson.steps.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      <span>Bosqichma-bosqich qo'llanma:</span>
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {activeLesson.steps.map((st) => (
                        <div key={st.stepNumber} className="p-2.5 rounded-xl bg-purple-900/30 border border-purple-500/20 text-[11px]">
                          <div className="font-bold text-purple-200">
                            {st.stepNumber}-Bosqich: {st.title}
                          </div>
                          <p className="text-slate-400 mt-1">{st.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interactive Practice Button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCanvasWithGuide(course.thumbnail, activeLesson.title);
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-xl"
                  >
                    <Brush className="w-4 h-4 text-cyan-300" />
                    <span>Ushbu dars bo'yicha Studio-da mashq qilish</span>
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Lesson List Navigation (1 Col) */}
          <div className="p-4 bg-[#110c28] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
              <h5 className="font-heading font-bold text-sm text-white">
                Darslar Mundarijasi ({lessons.length})
              </h5>
              <span className="text-[11px] text-purple-300">
                {completedLessonIds.length}/{lessons.length} Tamomlandi
              </span>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {lessons.map((ls, index) => {
                const isSelected = activeLesson?.id === ls.id;
                const isDone = completedLessonIds.includes(ls.id);

                return (
                  <button
                    key={ls.id}
                    onClick={() => setActiveLesson(ls)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-purple-600/30 border-purple-500 text-white shadow-md'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    <div className="pt-0.5">
                      {isDone ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <PlayCircle className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-slate-500'}`} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">
                        {index + 1}. {ls.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                        <span>{ls.duration}</span>
                        {ls.isFree && (
                          <span className="text-emerald-400 font-bold bg-emerald-950 px-1.5 rounded">
                            BEPUL
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
