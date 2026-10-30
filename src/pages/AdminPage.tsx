import React, { useState, useEffect } from 'react';
import { Shield, BookOpen, Trophy, Users, Image as ImageIcon, Plus, Trash2, Edit, CheckCircle, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Course, Competition, Artwork, UserProfile } from '../types';
import { addDoc, collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface AdminPageProps {
  courses: Course[];
  competitions: Competition[];
  artworks: Artwork[];
  onRefreshCourses?: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  courses: initialCourses,
  competitions: initialCompetitions,
  artworks: initialArtworks,
  onRefreshCourses,
}) => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'courses' | 'competitions' | 'users' | 'artworks' | 'stats'>('courses');
  
  const [coursesList, setCoursesList] = useState<Course[]>(initialCourses);
  const [competitionsList, setCompetitionsList] = useState<Competition[]>(initialCompetitions);
  const [artworksList, setArtworksList] = useState<Artwork[]>(initialArtworks);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);

  // Add Course Modal State
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Yuz va Sochlar');
  const [newCourseDifficulty, setNewCourseDifficulty] = useState<"Boshlang'ich" | "O'rta" | "Yuqori">("Boshlang'ich");
  const [newCourseInstructor, setNewCourseInstructor] = useState('AnimeLab Master');
  const [newCourseThumbnail, setNewCourseThumbnail] = useState('https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  // Add Competition Modal State
  const [showAddComp, setShowAddComp] = useState(false);
  const [newCompTitle, setNewCompTitle] = useState('');
  const [newCompTheme, setNewCompTheme] = useState('');
  const [newCompPrize, setNewCompPrize] = useState('');
  const [newCompEndDate, setNewCompEndDate] = useState('2026-12-31');
  const [newCompDesc, setNewCompDesc] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const snap = await getDocs(collection(db, 'users'));
      const fetched: UserProfile[] = [];
      snap.forEach((d) => fetched.push({ uid: d.id, ...d.data() } as UserProfile));
      setUsersList(fetched);
    } catch (error) {
      console.warn('Users fetch error:', error);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle) return;

    try {
      const newCourse: Omit<Course, 'id'> = {
        title: newCourseTitle,
        description: newCourseDesc || 'AnimeLab mualliflik darsi.',
        category: newCourseCategory,
        difficulty: newCourseDifficulty,
        instructor: newCourseInstructor,
        thumbnail: newCourseThumbnail,
        duration: '2 soat',
        lessonsCount: 4,
        rating: 5.0,
        enrolledCount: 1,
        isPublished: true,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'courses'), newCourse);
      setCoursesList([{ id: docRef.id, ...newCourse }, ...coursesList]);
      setShowAddCourse(false);
      setNewCourseTitle('');
      setNewCourseDesc('');
      if (onRefreshCourses) onRefreshCourses();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'courses');
    }
  };

  const handleCreateCompetition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompTitle) return;

    try {
      const newComp: Omit<Competition, 'id'> = {
        title: newCompTitle,
        description: newCompDesc || 'Rassomlar uchun navbatdagi qiziqarli anime tanlovi.',
        theme: newCompTheme || 'Anime',
        prize: newCompPrize || 'Graphic Tablet + Sertifikat',
        startDate: new Date().toISOString().split('T')[0],
        endDate: newCompEndDate,
        rules: ["Mustaqil chizilgan bo'lishi lozim.", "AI man etiladi."],
        coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
        status: 'active',
        entriesCount: 0,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'competitions'), newComp);
      setCompetitionsList([{ id: docRef.id, ...newComp }, ...competitionsList]);
      setShowAddComp(false);
      setNewCompTitle('');
      setNewCompPrize('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'competitions');
    }
  };

  const handleChangeRole = async (userId: string, newRole: 'student' | 'mentor' | 'admin') => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      setUsersList(usersList.map((u) => (u.uid === userId ? { ...u, role: newRole } : u)));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const handleDeleteArtwork = async (artId: string) => {
    if (!confirm("Ushbu artni galereyadan o'chirmoqchimisiz?")) return;
    try {
      await deleteDoc(doc(db, 'artworks', artId));
      setArtworksList(artworksList.filter((a) => a.id !== artId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `artworks/${artId}`);
    }
  };

  if (!isAdmin) {
    return (
      <div className="py-20 text-center glass-panel rounded-3xl p-8 max-w-md mx-auto space-y-3 my-12 border border-red-500/30">
        <Shield className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="font-heading font-bold text-xl text-white">Ruxsat Cheklangan</h2>
        <p className="text-xs text-slate-300">
          Ushbu sahifa faqat AnimeLab platformasi administratorlari uchun ochiq.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-600/30 border border-purple-500/40 text-purple-300">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-black text-2xl text-white">
              Admin Boshqaruv Paneli
            </h1>
            <p className="text-xs text-purple-300">
              Kurslar, tanlovlar, foydalanuvchilar va kontent moderatsiyasi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddCourse(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Kurs</span>
          </button>

          <button
            onClick={() => setShowAddComp(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Tanlov</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-purple-500/20">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'courses' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Kurslar ({coursesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('competitions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'competitions' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Tanlovlar ({competitionsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Foydalanuvchilar ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('artworks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'artworks' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Galereya ({artworksList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'stats' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Statistika</span>
        </button>
      </div>

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coursesList.map((c) => (
            <div key={c.id} className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={c.thumbnail} alt={c.title} className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-xs text-white line-clamp-1">{c.title}</h4>
                  <div className="text-[10px] text-purple-300">{c.category} • {c.difficulty}</div>
                  <div className="text-[10px] text-slate-400">👨‍🎨 {c.instructor}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Competitions Tab */}
      {activeTab === 'competitions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {competitionsList.map((comp) => (
            <div key={comp.id} className="glass-panel p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded">
                  {comp.status}
                </span>
                <span className="text-[10px] text-slate-400">Muddat: {comp.endDate}</span>
              </div>
              <h4 className="font-bold text-sm text-white">{comp.title}</h4>
              <p className="text-xs text-slate-300">{comp.prize}</p>
            </div>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="glass-panel rounded-2xl p-4 overflow-x-auto space-y-2">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-purple-500/20 text-purple-300 uppercase text-[10px]">
              <tr>
                <th className="p-2">Foydalanuvchi</th>
                <th className="p-2">Email</th>
                <th className="p-2">Rol</th>
                <th className="p-2">Level / XP</th>
                <th className="p-2 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {usersList.map((u) => (
                <tr key={u.uid} className="hover:bg-white/5">
                  <td className="p-2 font-bold text-white flex items-center gap-2">
                    <img src={u.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} className="w-6 h-6 rounded-full" />
                    <span>{u.displayName}</span>
                  </td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2 font-bold text-cyan-400">{u.role}</td>
                  <td className="p-2">Lvl {u.level || 1} ({u.xp || 100} XP)</td>
                  <td className="p-2 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleChangeRole(u.uid, e.target.value as any)}
                      className="bg-black/50 border border-purple-500/30 rounded px-2 py-1 text-[11px] text-white"
                    >
                      <option value="student">Student</option>
                      <option value="mentor">Mentor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Artworks Moderation Tab */}
      {activeTab === 'artworks' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {artworksList.map((art) => (
            <div key={art.id} className="glass-panel rounded-2xl overflow-hidden p-2 space-y-2">
              <img src={art.imageUrl} alt={art.title} className="w-full h-32 object-cover rounded-xl" />
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white truncate">{art.title}</span>
                <button
                  onClick={() => handleDeleteArtwork(art.id)}
                  className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  title="O'chirish"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl text-center space-y-1">
            <div className="text-2xl font-black text-white">{coursesList.length}</div>
            <div className="text-xs text-purple-300">Jami Kurslar</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl text-center space-y-1">
            <div className="text-2xl font-black text-purple-400">{competitionsList.length}</div>
            <div className="text-xs text-purple-300">Tanlovlar</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl text-center space-y-1">
            <div className="text-2xl font-black text-pink-400">{artworksList.length}</div>
            <div className="text-xs text-purple-300">Yuklangan Artlar</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl text-center space-y-1">
            <div className="text-2xl font-black text-cyan-400">{usersList.length || 1}</div>
            <div className="text-xs text-purple-300">Foydalanuvchilar</div>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0f0b24] border border-purple-500/30 rounded-3xl p-6 space-y-3">
            <h3 className="font-bold text-white text-base">Yangi Kurs Qo'shish</h3>
            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <input
                type="text"
                required
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
                placeholder="Kurs nomi..."
                className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-3 py-2 text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newCourseCategory}
                  onChange={(e) => setNewCourseCategory(e.target.value)}
                  className="bg-black/50 border border-purple-500/30 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Yuz va Sochlar">Yuz va Sochlar</option>
                  <option value="Anatomiya">Anatomiya</option>
                  <option value="Raqamli Art">Raqamli Art</option>
                  <option value="Kiyim-kechak">Kiyim-kechak</option>
                  <option value="Kompozitsiya">Kompozitsiya</option>
                </select>
                <select
                  value={newCourseDifficulty}
                  onChange={(e) => setNewCourseDifficulty(e.target.value as any)}
                  className="bg-black/50 border border-purple-500/30 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Boshlang'ich">Boshlang'ich</option>
                  <option value="O'rta">O'rta</option>
                  <option value="Yuqori">Yuqori</option>
                </select>
              </div>
              <input
                type="text"
                value={newCourseInstructor}
                onChange={(e) => setNewCourseInstructor(e.target.value)}
                placeholder="O'qituvchi nomi..."
                className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-3 py-2 text-white"
              />
              <textarea
                rows={2}
                value={newCourseDesc}
                onChange={(e) => setNewCourseDesc(e.target.value)}
                placeholder="Tavsif..."
                className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-3 py-2 text-white"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddCourse(false)} className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300">
                  Bekor qilish
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-purple-600 text-white font-bold">
                  Qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Competition Modal */}
      {showAddComp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0f0b24] border border-amber-500/30 rounded-3xl p-6 space-y-3">
            <h3 className="font-bold text-white text-base">Yangi Tanlov Yaratish</h3>
            <form onSubmit={handleCreateCompetition} className="space-y-3 text-xs">
              <input
                type="text"
                required
                value={newCompTitle}
                onChange={(e) => setNewCompTitle(e.target.value)}
                placeholder="Tanlov nomi..."
                className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-3 py-2 text-white"
              />
              <input
                type="text"
                value={newCompPrize}
                onChange={(e) => setNewCompPrize(e.target.value)}
                placeholder="Sovrinlar (masalan: Planchet HUION)..."
                className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-3 py-2 text-white"
              />
              <input
                type="date"
                value={newCompEndDate}
                onChange={(e) => setNewCompEndDate(e.target.value)}
                className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-3 py-2 text-white"
              />
              <textarea
                rows={2}
                value={newCompDesc}
                onChange={(e) => setNewCompDesc(e.target.value)}
                placeholder="Tanlov haqida..."
                className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-3 py-2 text-white"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddComp(false)} className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300">
                  Bekor qilish
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-amber-600 text-slate-950 font-black">
                  Chop etish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
