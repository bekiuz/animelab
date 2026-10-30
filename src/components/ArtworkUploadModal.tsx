import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Competition } from '../types';
import { DEFAULT_ANIME_GIRL_AVATAR } from '../data/initialData';

interface ArtworkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  competitions?: Competition[];
  onUploadSuccess?: () => void;
}

export const ArtworkUploadModal: React.FC<ArtworkUploadModalProps> = ({
  isOpen,
  onClose,
  competitions = [],
  onUploadSuccess,
}) => {
  const { user, profile, addXP } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Digital Art');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedCompetitionId, setSelectedCompetitionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl || !title) return;

    try {
      setIsSubmitting(true);
      const newArtwork = {
        title,
        description,
        imageUrl,
        authorId: user?.uid || 'guest-user',
        authorName: profile?.displayName || 'Anime Artist',
        authorAvatar: profile?.photoURL || DEFAULT_ANIME_GIRL_AVATAR,
        category,
        likesCount: 0,
        likes: [],
        viewsCount: 1,
        competitionId: selectedCompetitionId || null,
        isFeatured: false,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'artworks'), newArtwork);
      await addXP(100); // Award 100 XP for publishing artwork

      setSuccessMsg("San'at asaringiz muvaffaqiyatli chop etildi va +100 XP berildi!");
      if (onUploadSuccess) onUploadSuccess();

      setTimeout(() => {
        setSuccessMsg('');
        setTitle('');
        setDescription('');
        setImageUrl('');
        setSelectedCompetitionId('');
        onClose();
      }, 2000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'artworks');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0f0b24] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden p-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-purple-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">
              San'at Asarini Yuklash
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="font-heading font-bold text-xl text-white">Muvaffaqiyatli!</h4>
            <p className="text-sm text-purple-300 max-w-xs mx-auto">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            
            {/* Title */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Asar Sarlavhasi *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masalan: Kuzgi Nur ostidagi Ninja"
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Category & Competition */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Kategoriya
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="Digital Art">Digital Art</option>
                  <option value="Anatomiya">Anatomiya & Pozalar</option>
                  <option value="Yuz va Sochlar">Yuz va Sochlar</option>
                  <option value="Manga Panel">Manga Panel</option>
                  <option value="Kompozitsiya">Kompozitsiya & Fon</option>
                  <option value="Tratitsion (Qog'oz)">Traditsion (Qog'oz)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Tanlovga Yuborish
                </label>
                <select
                  value={selectedCompetitionId}
                  onChange={(e) => setSelectedCompetitionId(e.target.value)}
                  className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="">Oddiy Galereya</option>
                  {competitions.map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      🏆 {comp.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Upload or URL */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Rasm (Fayl yoki URL) *
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600/30 file:text-purple-200 hover:file:bg-purple-600/50 cursor-pointer"
                />
                <div className="text-center text-slate-500 text-[11px]">- YOKI -</div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Rasm havola URL (https://...)"
                  className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              {imageUrl && (
                <div className="mt-3 relative rounded-xl overflow-hidden border border-purple-500/30 max-h-40 bg-black/50 flex items-center justify-center">
                  <img src={imageUrl} alt="Preview" className="max-h-40 object-contain" />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Tavsif va Izoh
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Chizishda qanday dastur yoki qalamlardan foydalandingiz? Necha soat vaqt ketdi?"
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !imageUrl || !title}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-lg shadow-purple-600/20 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>{isSubmitting ? 'Joylanmoqda...' : 'Galereyada Chop Etish'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
