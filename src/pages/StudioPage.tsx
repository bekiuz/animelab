import React, { useRef, useState, useEffect } from 'react';
import {
  Pencil,
  Paintbrush,
  Eraser,
  RotateCcw,
  RotateCw,
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
  Eye,
  EyeOff,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Award,
  Trash2,
  Layers,
  Hand,
  Check,
  CheckCircle2,
  Info,
  Play,
  Pause,
} from 'lucide-react';
import { ANIMATED_DEMO_STROKES, AnimeVectorStroke } from '../data/strokeSequence';
import { AnimatedArtistCanvas } from '../components/AnimatedArtistCanvas';
import { useAuth } from '../context/AuthContext';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

const PRESET_SWATCHES = [
  '#000000', '#1e1b4b', '#7c3aed', '#a855f7', '#ec4899',
  '#06b6d4', '#38bdf8', '#10b981', '#f59e0b', '#ef4444',
  '#fca5a5', '#fde047', '#ffffff'
];

export const StudioPage: React.FC = () => {
  const { user, profile, addXP } = useAuth();

  const [currentStrokeIndex, setCurrentStrokeIndex] = useState<number>(0);
  const activeStroke: AnimeVectorStroke = ANIMATED_DEMO_STROKES[currentStrokeIndex] || ANIMATED_DEMO_STROKES[0];

  // Student Canvas Studio State
  const studentCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState<'pencil' | 'brush' | 'eraser' | 'pan'>('pencil');
  const [color, setColor] = useState('#06b6d4');
  const [brushSize, setBrushSize] = useState(3);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showGhostOverlay, setShowGhostOverlay] = useState(true);
  const [ghostOpacity, setGhostOpacity] = useState(0.3);

  const [history, setHistory] = useState<ImageData[]>([]);
  const [redoList, setRedoList] = useState<ImageData[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync recommended tool and color when stroke step changes
  useEffect(() => {
    if (activeStroke) {
      setActiveTool(activeStroke.tool);
      setColor(activeStroke.color);
      setBrushSize(activeStroke.lineWidth);
    }
  }, [currentStrokeIndex]);

  // Init blank student canvas once on mounted
  useEffect(() => {
    initCanvas();
  }, []);

  const initCanvas = () => {
    const canvas = studentCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#110d29';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const saveState = () => {
    const canvas = studentCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-30), data]);
    setRedoList([]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = studentCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    const currentState = newHistory.pop();
    if (currentState) setRedoList((prev) => [...prev, currentState]);

    const prevState = newHistory[newHistory.length - 1];
    setHistory(newHistory);
    if (prevState) ctx.putImageData(prevState, 0, 0);
  };

  const handleRedo = () => {
    if (redoList.length === 0) return;
    const canvas = studentCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newRedo = [...redoList];
    const nextState = newRedo.pop();
    setRedoList(newRedo);

    if (nextState) {
      ctx.putImageData(nextState, 0, 0);
      setHistory((prev) => [...prev, nextState]);
    }
  };

  const handleClear = () => {
    if (!confirm("Rasm chizmalaringizni tozalashni xohlaysizmi?")) return;
    const canvas = studentCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#110d29';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  // Drawing event handlers for student canvas
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (activeTool === 'pan') return;
    setIsDrawing(true);

    const canvas = studentCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) / zoomLevel;
    const y = (clientY - rect.top) / zoomLevel;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTool === 'pan') return;
    const canvas = studentCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) / zoomLevel;
    const y = (clientY - rect.top) / zoomLevel;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeTool === 'eraser') {
      ctx.strokeStyle = '#110d29';
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
    const canvas = studentCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `animelab-character-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleSaveToPortfolio = async () => {
    const canvas = studentCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');

    try {
      setIsSaving(true);
      const newArtwork = {
        title: "Animated Character Study",
        description: "AnimeLab Chizish Studiyasida virtual artist bilan birga stroke-by-stroke chizilgan anime xarakteri.",
        imageUrl: dataUrl,
        authorId: user?.uid || 'guest-artist',
        authorName: profile?.displayName || 'Anime Artist',
        authorAvatar: profile?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        category: 'Animated Practice',
        likesCount: 1,
        likes: [user?.uid || 'guest-artist'],
        viewsCount: 1,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'artworks'), newArtwork);

      if (user) {
        await setDoc(
          doc(db, 'userProgress', `${user.uid}_animated_demo`),
          {
            userId: user.uid,
            completedStrokeIndex: currentStrokeIndex,
            lastAccessedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }

      await addXP(150); // Award 150 XP
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'artworks');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      
      {/* Title Header */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Real-Time Vector Animation
              </span>
              <span className="text-xs text-purple-300 font-bold">
                Virtual Artist Namoyishi
              </span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
              Chizish Studiyasi: Interaktiv Animated Darslar
            </h1>
          </div>

          <button
            onClick={handleSaveToPortfolio}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-purple-600/30 transition-all"
          >
            {isSaving ? (
              <span>Saqlanmoqda...</span>
            ) : savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Portfolioga Saqlandi! (+150 XP)</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-cyan-300" />
                <span>Portfolioga Saqlash (+150 XP)</span>
              </>
            )}
          </button>
        </div>

        {/* 15 Stroke Step Progress Indicator */}
        <div className="pt-2">
          <div className="flex items-center justify-between pb-1 text-xs text-purple-300 font-bold">
            <span>Progress: {currentStrokeIndex + 1} / {ANIMATED_DEMO_STROKES.length} Chiziq</span>
            <span className="text-pink-300">{activeStroke.title}</span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-15 gap-1.5">
            {ANIMATED_DEMO_STROKES.map((st, i) => {
              const isActive = i === currentStrokeIndex;
              const isDone = i < currentStrokeIndex;

              return (
                <button
                  key={st.id}
                  onClick={() => setCurrentStrokeIndex(i)}
                  className={`py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                    isActive
                      ? 'bg-purple-600 border-purple-300 text-white shadow-lg'
                      : isDone
                      ? 'bg-purple-950 border-purple-500/40 text-purple-200'
                      : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                  }`}
                  title={st.title}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Main Studio Grid: Top Demonstration + Bottom Student Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Area: Animated Artist Demonstration (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel p-5 rounded-3xl border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <Pencil className="w-4 h-4 text-pink-400" />
                <span>1. Virtual Artist Namoyishi (Animatsiya)</span>
              </h3>
              <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded">
                Stroke {currentStrokeIndex + 1}/{ANIMATED_DEMO_STROKES.length}
              </span>
            </div>

            {/* Render Animated Vector Demonstration Canvas */}
            <AnimatedArtistCanvas
              currentStrokeIndex={currentStrokeIndex}
              setCurrentStrokeIndex={setCurrentStrokeIndex}
            />

            {/* Live Instruction Box */}
            <div className="p-3.5 rounded-2xl bg-purple-950/80 border border-purple-500/30 text-xs text-purple-200 space-y-1">
              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                <span>Qadam Ko'rsatmasi:</span>
              </div>
              <p className="text-slate-100 font-semibold text-sm leading-relaxed">
                "{activeStroke.instructionUz}"
              </p>
            </div>
          </div>
        </div>

        {/* Right Area: Student Practice Canvas (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="glass-panel p-5 rounded-3xl border border-purple-500/30 space-y-3">
            
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <Paintbrush className="w-4 h-4 text-cyan-400" />
                <span>2. Sizning Amaliy Kenevasingiz</span>
              </h3>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowGhostOverlay(!showGhostOverlay)}
                  className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold flex items-center gap-1 ${
                    showGhostOverlay ? 'bg-purple-600 border-purple-400 text-white' : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  {showGhostOverlay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{showGhostOverlay ? "Namuna Shaffofligi On" : "Namuna Off"}</span>
                </button>
              </div>
            </div>

            {/* Student Canvas Tools Bar */}
            <div className="glass-panel p-2.5 rounded-2xl border border-purple-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
              
              {/* Tools */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-purple-500/20">
                <button
                  onClick={() => setActiveTool('pencil')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    activeTool === 'pencil' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Qalam
                </button>

                <button
                  onClick={() => setActiveTool('brush')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    activeTool === 'brush' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Mo'hqalam
                </button>

                <button
                  onClick={() => setActiveTool('eraser')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    activeTool === 'eraser' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  O'chirg'ich
                </button>
              </div>

              {/* Preset Color Swatches */}
              <div className="flex items-center gap-1 overflow-x-auto max-w-[160px] py-0.5">
                {PRESET_SWATCHES.map((sw) => (
                  <button
                    key={sw}
                    onClick={() => {
                      setColor(sw);
                      if (activeTool === 'eraser') setActiveTool('pencil');
                    }}
                    className={`w-4 h-4 rounded-full border transition-transform shrink-0 ${
                      color === sw && activeTool !== 'eraser' ? 'scale-125 border-cyan-400' : 'border-white/20'
                    }`}
                    style={{ backgroundColor: sw }}
                  />
                ))}
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-4 h-4 rounded-full bg-transparent cursor-pointer border-none"
                />
              </div>

              {/* Undo, Redo, Clear */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleUndo}
                  disabled={history.length <= 1}
                  className="p-1 rounded bg-white/5 text-slate-300 disabled:opacity-30"
                  title="Undo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleRedo}
                  disabled={redoList.length === 0}
                  className="p-1 rounded bg-white/5 text-slate-300 disabled:opacity-30"
                  title="Redo"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleClear}
                  className="p-1 rounded bg-red-500/20 text-red-400"
                  title="Tozalash"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Student Canvas Element */}
            <div className="relative rounded-3xl overflow-hidden glass-panel border border-purple-500/30 shadow-2xl min-h-[480px] flex items-center justify-center bg-[#110d29] p-2">
              
              {/* Optional Demo Vector Ghost Overlay */}
              {showGhostOverlay && (
                <div
                  className="absolute inset-0 pointer-events-none select-none z-10 flex items-center justify-center p-2"
                  style={{ opacity: ghostOpacity }}
                >
                  {/* Ghost Reference Image Overlay */}
                  <div className="w-full h-full bg-contain bg-center bg-no-repeat" />
                </div>
              )}

              <canvas
                ref={studentCanvasRef}
                width={800}
                height={550}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="block w-full h-auto bg-[#110d29] rounded-2xl border border-purple-500/20 touch-none cursor-crosshair"
              />
            </div>

            {/* Navigation CTA Bar */}
            <div className="pt-2 flex items-center justify-between gap-3 text-xs">
              <button
                disabled={currentStrokeIndex === 0}
                onClick={() => {
                  setCurrentStrokeIndex((p) => Math.max(0, p - 1));
                }}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold disabled:opacity-30"
              >
                ← Oldingi Chiziq
              </button>

              {currentStrokeIndex < ANIMATED_DEMO_STROKES.length - 1 ? (
                <button
                  onClick={() => {
                    setCurrentStrokeIndex((p) => Math.min(ANIMATED_DEMO_STROKES.length - 1, p + 1));
                  }}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg"
                >
                  Keyingi Chiziqqa O'tish →
                </button>
              ) : (
                <button
                  onClick={handleSaveToPortfolio}
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:opacity-95 text-white font-bold shadow-xl"
                >
                  {isSaving ? "Saqlanmoqda..." : "Portfolioga Saqlash (+150 XP)"}
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
