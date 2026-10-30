import React, { useRef, useState, useEffect } from 'react';
import { X, Pencil, Eraser, RotateCcw, Download, Share2, Grid, Layers, Eye, Sparkles, Check, Paintbrush } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { DEFAULT_ANIME_GIRL_AVATAR } from '../data/initialData';

interface InteractiveCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGuideImage?: string;
  guideTitle?: string;
}

const PRESET_COLORS = [
  '#000000', '#1e1b4b', '#7c3aed', '#a855f7', '#ec4899', 
  '#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#fca5a5', '#fde047', '#ffffff'
];

export const InteractiveCanvasModal: React.FC<InteractiveCanvasModalProps> = ({
  isOpen,
  onClose,
  initialGuideImage,
  guideTitle,
}) => {
  const { user, profile, addXP } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState<'pencil' | 'brush' | 'eraser'>('pencil');
  const [color, setColor] = useState('#7c3aed');
  const [brushSize, setBrushSize] = useState(4);
  const [showGrid, setShowGrid] = useState(true);
  const [guideOpacity, setGuideOpacity] = useState(0.35);
  const [guideImage, setGuideImage] = useState<string | null>(initialGuideImage || null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [artworkTitle, setArtworkTitle] = useState(guideTitle ? `${guideTitle} (Mening Ishim)` : 'Anime Eskiz Mashqi');

  useEffect(() => {
    if (initialGuideImage) {
      setGuideImage(initialGuideImage);
    }
  }, [initialGuideImage]);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#120d2a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();
      }
    }
  }, [isOpen]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), data]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const newHistory = [...history];
    newHistory.pop(); // Remove current
    const previousState = newHistory[newHistory.length - 1];
    setHistory(newHistory);

    const canvas = canvasRef.current;
    if (canvas && previousState) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.putImageData(previousState, 0, 0);
      }
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#120d2a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveState();
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeTool === 'eraser') {
      ctx.strokeStyle = '#120d2a';
      ctx.lineWidth = brushSize * 3;
    } else if (activeTool === 'brush') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize * 2;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `animelab-artwork-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handlePublishToGallery = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');

    try {
      setIsPublishing(true);
      const newArtwork = {
        title: artworkTitle || 'Anime Studio Mashqi',
        description: guideTitle ? `${guideTitle} dars mashqi asosida yaratilgan canvas asari.` : 'AnimeLab Interaktiv Canvas Studiyasida chizilgan mashq asari.',
        imageUrl: dataUrl,
        authorId: user?.uid || 'guest-artist',
        authorName: profile?.displayName || 'Anime Artist',
        authorAvatar: profile?.photoURL || DEFAULT_ANIME_GIRL_AVATAR,
        category: 'Interaktiv Mashq',
        likesCount: 1,
        likes: [user?.uid || 'guest-artist'],
        viewsCount: 12,
        isFeatured: false,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'artworks'), newArtwork);
      await addXP(50); // Award 50 XP for completing practice!

      setPublishSuccess(true);
      setTimeout(() => {
        setPublishSuccess(false);
      }, 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'artworks');
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-[#0f0b24] border border-purple-500/30 rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-[#140e30]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
              <Paintbrush className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                Interaktiv Chizish Studio
              </h3>
              <p className="text-xs text-purple-300">
                {guideTitle ? `Mavzu: ${guideTitle}` : "Anime eskiz va konturlarini mashq qiling"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-200 transition-colors"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Yuklab olish</span>
            </button>

            <button
              onClick={handlePublishToGallery}
              disabled={isPublishing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-xs font-bold text-white shadow-lg transition-all"
            >
              {isPublishing ? (
                <span>Saqlanmoqda...</span>
              ) : publishSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Galereyada! (+50 XP)</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Galereyaga Ulashish</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Controls Bar */}
        <div className="p-3 bg-[#110c28] border-b border-purple-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Tools */}
          <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-purple-500/20">
            <button
              onClick={() => setActiveTool('pencil')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTool === 'pencil' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Qalam</span>
            </button>

            <button
              onClick={() => setActiveTool('brush')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTool === 'brush' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Paintbrush className="w-3.5 h-3.5" />
              <span>Mo'hqalam</span>
            </button>

            <button
              onClick={() => setActiveTool('eraser')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTool === 'eraser' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>O'chirg'ich</span>
            </button>
          </div>

          {/* Color Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  if (activeTool === 'eraser') setActiveTool('pencil');
                }}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  color === c && activeTool !== 'eraser' ? 'scale-125 border-cyan-400 shadow-md' : 'border-white/20 hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-6 h-6 rounded-full bg-transparent cursor-pointer border-none"
            />
          </div>

          {/* Size & Options */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-300">
              <span>Qalinlik:</span>
              <input
                type="range"
                min="1"
                max="30"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20 accent-purple-500 cursor-pointer"
              />
              <span className="w-4 font-bold text-purple-400">{brushSize}</span>
            </div>

            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-1.5 rounded-lg border transition-colors ${
                showGrid ? 'bg-purple-600/30 border-purple-500 text-purple-300' : 'bg-white/5 border-white/10 text-slate-400'
              }`}
              title="Setka (Grid) Qo'shish"
            >
              <Grid className="w-4 h-4" />
            </button>

            <button
              onClick={handleUndo}
              disabled={history.length <= 1}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30"
              title="Ortga Qaytish (Undo)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleClear}
              className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 text-xs hover:bg-red-500/30"
            >
              Tozalash
            </button>
          </div>

        </div>

        {/* Canvas Area with Optional Trace Guide Overlay */}
        <div className="relative flex-1 bg-[#120d2a] flex items-center justify-center p-4 overflow-auto min-h-[420px]">
          
          <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-purple-500/30">
            
            {/* Optional Trace Guide Overlay */}
            {guideImage && (
              <img
                src={guideImage}
                alt="Guide Overlay"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-10 transition-opacity"
                style={{ opacity: guideOpacity }}
              />
            )}

            {/* Grid Pattern Overlay */}
            {showGrid && (
              <div className="absolute inset-0 drawing-grid pointer-events-none z-20" />
            )}

            {/* Main Interactive HTML5 Canvas */}
            <canvas
              ref={canvasRef}
              width={760}
              height={500}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="cursor-crosshair bg-[#120d2a] block touch-none"
            />
          </div>

          {/* Guide Opacity Slider Control */}
          {guideImage && (
            <div className="absolute bottom-6 right-6 glass-panel px-4 py-2 rounded-2xl flex items-center gap-3 text-xs border border-purple-500/30 z-30">
              <Eye className="w-4 h-4 text-purple-400" />
              <span className="text-slate-300 font-medium">Gid Ko'rinishi:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={guideOpacity}
                onChange={(e) => setGuideOpacity(Number(e.target.value))}
                className="w-24 accent-pink-500 cursor-pointer"
              />
            </div>
          )}

        </div>

        {/* Bottom Title Bar for Publishing */}
        <div className="p-3 bg-[#140e30] border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300 w-full sm:w-auto">
            <span>Nomlash:</span>
            <input
              type="text"
              value={artworkTitle}
              onChange={(e) => setArtworkTitle(e.target.value)}
              className="bg-black/40 border border-purple-500/30 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-purple-400 w-64"
              placeholder="Asar sarlavhasi..."
            />
          </div>
          <div className="text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Chizish orqali tajriba (XP) va rassomlik darajangizni oshiring!</span>
          </div>
        </div>

      </div>
    </div>
  );
};
