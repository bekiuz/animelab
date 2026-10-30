import React, { useState, useEffect } from 'react';
import { Search, Heart, Eye, Upload, Filter, Sparkles, X, MessageSquare, Share2, Download, Check } from 'lucide-react';
import { Artwork } from '../types';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_ANIME_GIRL_AVATAR } from '../data/initialData';
import { doc, updateDoc, arrayUnion, arrayRemove, increment, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface GalleryPageProps {
  artworks: Artwork[];
  onOpenUpload: () => void;
}

const CATEGORIES = ['Barchasi', 'Digital Art', 'Anatomiya', 'Yuz va Sochlar', 'Manga Panel', 'Kompozitsiya'];

export const GalleryPage: React.FC<GalleryPageProps> = ({ artworks: initialArtworks, onOpenUpload }) => {
  const { user, profile } = useAuth();
  const [artworksList, setArtworksList] = useState<Artwork[]>(initialArtworks);
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArtwork, setActiveArtwork] = useState<Artwork | null>(null);
  const [comments, setComments] = useState<Array<{ name: string; text: string; date: string }>>([
    { name: 'Sardor Manga', text: "Liniyalar va ranglar simfoniyasi juda chiroyli chiqibdi! Ayniqsa sochni porlashi super.", date: '2 soat oldin' },
    { name: 'Akira Sensei', text: "Ajoyib ish! Kelgusi safar fondagi soya kontrastini biroz oshirsangiz art yanada 3D shakl oladi.", date: '5 soat oldin' }
  ]);
  const [newComment, setNewComment] = useState('');

  // Subscribe to real-time Firestore updates for artwork gallery
  useEffect(() => {
    const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: Artwork[] = [];
        snapshot.forEach((docSnap) => {
          fetched.push({ id: docSnap.id, ...docSnap.data() } as Artwork);
        });
        if (fetched.length > 0) {
          setArtworksList(fetched);
        }
      },
      (error) => {
        console.warn('Artwork snapshot error, using initial dataset:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLike = async (art: Artwork, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!user) return;

    const isLiked = art.likes?.includes(user.uid);
    const artRef = doc(db, 'artworks', art.id);

    try {
      if (isLiked) {
        await updateDoc(artRef, {
          likes: arrayRemove(user.uid),
          likesCount: increment(-1),
        });
      } else {
        await updateDoc(artRef, {
          likes: arrayUnion(user.uid),
          likesCount: increment(1),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `artworks/${art.id}`);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        name: profile?.displayName || 'Anime Artist',
        text: newComment,
        date: 'Hozirgincha',
      },
    ]);
    setNewComment('');
  };

  const filteredArtworks = artworksList.filter((a) => {
    const matchesCategory = selectedCategory === 'Barchasi' || a.category === selectedCategory;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 py-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-pink-400 bg-pink-950 border border-pink-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
            Talaba va Rassomlar Portfoliosi
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white mt-2">
            Rassomlar Galereyasi
          </h1>
        </div>

        <button
          onClick={onOpenUpload}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all transform hover:-translate-y-0.5"
        >
          <Upload className="w-4 h-4" />
          <span>O'z San'at Asaringizni Yuklang</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="glass-panel p-4 rounded-3xl space-y-4 border border-purple-500/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-purple-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rassom yoki art nomi bo'yicha..."
              className="w-full bg-black/40 border border-purple-500/30 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredArtworks.map((art) => {
          const isLiked = user && art.likes?.includes(user.uid);

          return (
            <div
              key={art.id}
              onClick={() => setActiveArtwork(art)}
              className="group glass-panel rounded-3xl overflow-hidden border border-purple-500/20 cursor-pointer flex flex-col justify-between hover:border-purple-500/40 transition-all transform hover:-translate-y-1 shadow-lg"
            >
              <div className="relative h-64 overflow-hidden bg-black/50">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-black/70 text-cyan-300 backdrop-blur-md">
                    {art.category}
                  </span>
                </div>

                <button
                  onClick={(e) => handleLike(art, e)}
                  className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
                    isLiked ? 'bg-pink-600 text-white shadow-lg' : 'bg-black/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                </button>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-heading font-bold text-sm text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
                  {art.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <img
                      src={art.authorAvatar || DEFAULT_ANIME_GIRL_AVATAR}
                      alt={art.authorName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="truncate max-w-[100px] text-slate-300">@{art.authorName}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="flex items-center gap-1 text-pink-400">
                      <Heart className="w-3 h-3 fill-pink-400" />
                      <span>{art.likesCount || 0}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Artwork Lightbox Detail Modal */}
      {activeArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-[#0f0b24] border border-purple-500/30 rounded-3xl shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-hidden">
            
            {/* Image Left */}
            <div className="md:w-3/5 bg-black/80 flex items-center justify-center p-4 relative min-h-[300px]">
              <img
                src={activeArtwork.imageUrl}
                alt={activeArtwork.title}
                className="max-h-[80vh] w-auto object-contain rounded-xl"
              />
            </div>

            {/* Details & Comments Right */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between bg-[#130d30] border-t md:border-t-0 md:border-l border-purple-500/20 space-y-4 overflow-y-auto">
              
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <img
                      src={activeArtwork.authorAvatar || DEFAULT_ANIME_GIRL_AVATAR}
                      alt={activeArtwork.authorName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{activeArtwork.authorName}</div>
                      <div className="text-[10px] text-purple-300">Rassom</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveArtwork(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  <h3 className="font-heading font-bold text-lg text-white">
                    {activeArtwork.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeArtwork.description || "Ushbu asar AnimeLab platformasida talaba tomonidan yaratilgan."}
                  </p>
                </div>

                {/* Like Button */}
                <div className="mt-4 pt-4 border-t border-purple-500/20 flex items-center justify-between">
                  <button
                    onClick={() => handleLike(activeArtwork)}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/30 font-bold text-xs"
                  >
                    <Heart className="w-4 h-4 fill-pink-400 text-pink-400" />
                    <span>{activeArtwork.likesCount || 0} Yoqtirildi</span>
                  </button>

                  <a
                    href={activeArtwork.imageUrl}
                    download="animelab-artwork.png"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>

                {/* Comments List */}
                <div className="mt-6 space-y-3">
                  <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <span>Izohlar ({comments.length})</span>
                  </h4>

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {comments.map((cm, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white/5 text-xs space-y-0.5">
                        <div className="flex items-center justify-between font-bold text-purple-200">
                          <span>{cm.name}</span>
                          <span className="text-[10px] text-slate-500">{cm.date}</span>
                        </div>
                        <p className="text-slate-300 text-[11px]">{cm.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="pt-2 border-t border-purple-500/20 flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Izoh qoldiring..."
                  className="flex-1 bg-black/40 border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  Yuborish
                </button>
              </form>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
