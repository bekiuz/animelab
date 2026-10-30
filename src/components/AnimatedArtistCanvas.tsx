import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Gauge, Pencil, Sparkles, CheckCircle2 } from 'lucide-react';
import { ANIMATED_DEMO_STROKES, AnimeVectorStroke } from '../data/strokeSequence';

interface AnimatedArtistCanvasProps {
  currentStrokeIndex: number;
  setCurrentStrokeIndex: (idx: number) => void;
  onStrokeChange?: (stroke: AnimeVectorStroke) => void;
}

export const AnimatedArtistCanvas: React.FC<AnimatedArtistCanvasProps> = ({
  currentStrokeIndex,
  setCurrentStrokeIndex,
  onStrokeChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<number>(1); // 0.5, 1, 2
  const [pointIndex, setPointIndex] = useState<number>(0);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  const activeStroke = ANIMATED_DEMO_STROKES[currentStrokeIndex] || ANIMATED_DEMO_STROKES[0];

  useEffect(() => {
    if (onStrokeChange) onStrokeChange(activeStroke);
  }, [currentStrokeIndex]);

  // Main animation loop
  useEffect(() => {
    let animationFrameId: number;

    const renderCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw paper background
      ctx.fillStyle = '#faf8f5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid texture
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 2. Render all PREVIOUS completed strokes
      for (let i = 0; i < currentStrokeIndex; i++) {
        const str = ANIMATED_DEMO_STROKES[i];
        if (!str || str.points.length < 2) continue;

        ctx.strokeStyle = str.color;
        ctx.lineWidth = str.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(str.points[0].x, str.points[0].y);
        for (let j = 1; j < str.points.length; j++) {
          ctx.lineTo(str.points[j].x, str.points[j].y);
        }
        ctx.stroke();
      }

      // 3. Render CURRENT active stroke up to current pointIndex
      if (activeStroke && activeStroke.points.length > 0) {
        ctx.strokeStyle = activeStroke.color;
        ctx.lineWidth = activeStroke.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const maxPts = Math.min(pointIndex, activeStroke.points.length);
        if (maxPts > 1) {
          ctx.beginPath();
          ctx.moveTo(activeStroke.points[0].x, activeStroke.points[0].y);
          for (let j = 1; j < maxPts; j++) {
            ctx.lineTo(activeStroke.points[j].x, activeStroke.points[j].y);
          }
          ctx.stroke();

          // Set pencil tip cursor position
          const lastPt = activeStroke.points[maxPts - 1];
          if (lastPt) setCursorPos(lastPt);
        }
      }

      // Progress point index if playing
      if (isPlaying && activeStroke) {
        if (pointIndex < activeStroke.points.length) {
          setPointIndex((prev) => prev + 1);
        } else {
          // Completed current stroke, automatically pause or hold
          setIsPlaying(false);
        }
      }
    };

    const intervalTime = 40 / speed;
    const interval = setInterval(() => {
      renderCanvas();
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, currentStrokeIndex, pointIndex, speed]);

  const handlePlayPause = () => {
    if (!isPlaying && pointIndex >= activeStroke.points.length) {
      // If at end, restart current stroke animation
      setPointIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    setPointIndex(0);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (currentStrokeIndex < ANIMATED_DEMO_STROKES.length - 1) {
      setCurrentStrokeIndex(currentStrokeIndex + 1);
      setPointIndex(0);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentStrokeIndex > 0) {
      setCurrentStrokeIndex(currentStrokeIndex - 1);
      setPointIndex(0);
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-3">
      
      {/* Top Demo Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[#140e30] border border-purple-500/30 text-xs">
        
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPause}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isPlaying ? 'Tanaffus' : 'O\'ynatish'}</span>
          </button>

          <button
            onClick={handleReplay}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
            title="Chiziqni Qayta Ijro Etish"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Current Instruction Header */}
        <div className="text-center truncate font-bold text-cyan-300 max-w-[280px] sm:max-w-none">
          {activeStroke.title}: "{activeStroke.instructionUz}"
        </div>

        {/* Speed Controls & Prev/Next */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-purple-500/20">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  speed === s ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={currentStrokeIndex === 0}
              onClick={handlePrev}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30"
              title="Oldingi Chiziq"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-white px-1">
              {currentStrokeIndex + 1}/{ANIMATED_DEMO_STROKES.length}
            </span>
            <button
              disabled={currentStrokeIndex === ANIMATED_DEMO_STROKES.length - 1}
              onClick={handleNext}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30"
              title="Keyingi Chiziq"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Main Animated Demonstration Canvas Container */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-purple-500/40 shadow-2xl bg-[#faf8f5] flex items-center justify-center p-2 min-h-[480px]">
        
        {/* Virtual Pencil Cursor Overlay */}
        {isPlaying && cursorPos && (
          <div
            className="absolute z-30 pointer-events-none transition-all duration-75 flex items-center gap-1"
            style={{
              left: `${(cursorPos.x / 800) * 100}%`,
              top: `${(cursorPos.y / 550) * 100}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="p-1 rounded-full bg-purple-600 text-white shadow-lg animate-bounce">
              <Pencil className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-black/80 text-cyan-300 rounded shadow">
              Virtual Artist
            </span>
          </div>
        )}

        {/* Animated Drawing HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          width={800}
          height={550}
          className="block w-full h-auto bg-[#faf8f5] rounded-2xl"
        />

        {/* Bottom Banner */}
        <div className="absolute bottom-3 left-3 right-3 glass-panel p-2.5 rounded-2xl border border-purple-500/30 flex items-center justify-between text-xs backdrop-blur-md bg-black/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400 animate-spin-slow" />
            <span className="font-bold text-white">Chiziq-ba-chiziq animated namoyish</span>
          </div>
          <span className="text-purple-300 text-[11px]">
            Liniya haqiqiy qalam kabi ekranda paydo bo'lmoqda
          </span>
        </div>

      </div>

    </div>
  );
};
