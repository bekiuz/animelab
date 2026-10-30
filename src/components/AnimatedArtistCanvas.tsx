import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Sparkles,
} from 'lucide-react';
import { ANIMATED_DEMO_STROKES, AnimeVectorStroke } from '../data/strokeSequence';

interface AnimatedArtistCanvasProps {
  currentStrokeIndex: number;
  setCurrentStrokeIndex: (idx: number) => void;
  onStrokeChange?: (stroke: AnimeVectorStroke) => void;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 550;

function drawStroke(
  ctx: CanvasRenderingContext2D,
  stroke: AnimeVectorStroke,
  pointCount: number,
) {
  const count = Math.min(pointCount, stroke.points.length);
  if (count < 2) return;

  ctx.save();
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

  for (let i = 1; i < count; i += 1) {
    ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
  }

  ctx.stroke();
  ctx.restore();
}

export const AnimatedArtistCanvas: React.FC<AnimatedArtistCanvasProps> = ({
  currentStrokeIndex,
  setCurrentStrokeIndex,
  onStrokeChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [pointIndex, setPointIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  const activeStroke =
    ANIMATED_DEMO_STROKES[currentStrokeIndex] || ANIMATED_DEMO_STROKES[0];

  // Reset the line whenever the parent selects a different drawing step.
  useEffect(() => {
    progressRef.current = 0;
    setPointIndex(0);
    setCursorPos(null);
    setIsPlaying(true);
    onStrokeChange?.(activeStroke);
  }, [currentStrokeIndex]);

  // Render the paper and strokes continuously. Progress is kept in a ref,
  // so React does not restart the animation loop after every point.
  useEffect(() => {
    let frameId = 0;
    let previousTime = 0;
    let timeBank = 0;

    const render = (time: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      if (isPlaying && previousTime > 0) {
        timeBank += Math.min(time - previousTime, 80);
        const pointInterval = 1000 / (48 * speed);
        const pointsToAdd = Math.floor(timeBank / pointInterval);

        if (pointsToAdd > 0) {
          timeBank -= pointsToAdd * pointInterval;
          const next = Math.min(
            activeStroke.points.length,
            progressRef.current + pointsToAdd,
          );

          if (next !== progressRef.current) {
            progressRef.current = next;
            setPointIndex(next);
            const tip = activeStroke.points[next - 1];
            if (tip) setCursorPos(tip);
          }

          if (next >= activeStroke.points.length) {
            setIsPlaying(false);
          }
        }
      }
      previousTime = time;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#fbfaf7';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Subtle drawing-paper grid.
      ctx.save();
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.055)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= CANVAS_WIDTH; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y <= CANVAS_HEIGHT; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }
      ctx.restore();

      // Keep every previously completed stroke visible.
      for (let i = 0; i < currentStrokeIndex; i += 1) {
        const previousStroke = ANIMATED_DEMO_STROKES[i];
        if (previousStroke) {
          drawStroke(ctx, previousStroke, previousStroke.points.length);
        }
      }

      // Draw the active line progressively, point by point.
      drawStroke(ctx, activeStroke, progressRef.current);

      frameId = window.requestAnimationFrame(render);
    };

    frameId = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(frameId);
  }, [currentStrokeIndex, activeStroke, isPlaying, speed]);

  const handlePlayPause = () => {
    if (!isPlaying && progressRef.current >= activeStroke.points.length) {
      progressRef.current = 0;
      setPointIndex(0);
      setCursorPos(null);
    }
    setIsPlaying((playing) => !playing);
  };

  const handleReplay = () => {
    progressRef.current = 0;
    setPointIndex(0);
    setCursorPos(null);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (currentStrokeIndex < ANIMATED_DEMO_STROKES.length - 1) {
      setCurrentStrokeIndex(currentStrokeIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStrokeIndex > 0) {
      setCurrentStrokeIndex(currentStrokeIndex - 1);
    }
  };

  const progressPercent = activeStroke.points.length
    ? Math.round((pointIndex / activeStroke.points.length) * 100)
    : 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-500/30 bg-[#140e30] p-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPause}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-2 font-bold text-white shadow-md hover:bg-purple-500"
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5 fill-white" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-white" />
            )}
            <span>{isPlaying ? 'Pauza' : 'Davom ettirish'}</span>
          </button>

          <button
            onClick={handleReplay}
            className="rounded-xl bg-white/5 p-2 text-slate-300 hover:bg-white/10"
            title="Joriy chiziqni qayta chizish"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="min-w-0 flex-1 text-center">
          <p className="truncate font-bold text-cyan-300">{activeStroke.title}</p>
          <p className="mt-1 text-[11px] text-slate-300">
            {pointIndex}/{activeStroke.points.length} nuqta · {progressPercent}%
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-purple-500/20 bg-black/40 p-1">
          {[0.5, 1, 2].map((value) => (
            <button
              key={value}
              onClick={() => setSpeed(value)}
              className={`rounded px-2 py-1 text-[10px] font-bold ${
                speed === value
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {value}x
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            disabled={currentStrokeIndex === 0}
            onClick={handlePrevious}
            className="rounded-xl bg-white/5 p-2 text-slate-300 hover:bg-white/10 disabled:opacity-30"
            title="Oldingi chiziq"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-1 font-bold text-white">
            {currentStrokeIndex + 1}/{ANIMATED_DEMO_STROKES.length}
          </span>
          <button
            disabled={currentStrokeIndex === ANIMATED_DEMO_STROKES.length - 1}
            onClick={handleNext}
            className="rounded-xl bg-white/5 p-2 text-slate-300 hover:bg-white/10 disabled:opacity-30"
            title="Keyingi chiziq"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border-2 border-purple-500/40 bg-[#fbfaf7] p-2 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block h-auto w-full rounded-2xl bg-[#fbfaf7]"
          aria-label="Rassom anime personajini chiziqma-chiziq chizayotgan namoyish"
        />

        {isPlaying && cursorPos && (
          <div
            className="pointer-events-none absolute z-20 flex items-center gap-1"
            style={{
              left: `calc(8px + ${(cursorPos.x / CANVAS_WIDTH) * 100}% - 10px)`,
              top: `calc(8px + ${(cursorPos.y / CANVAS_HEIGHT) * 100}% - 12px)`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span className="rounded-full bg-purple-600 p-1 text-white shadow-lg">
              <Pencil className="h-3.5 w-3.5" />
            </span>
            <span className="rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-cyan-200">
              Rassom
            </span>
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 rounded-xl border border-purple-500/25 bg-black/75 p-2 text-[10px] backdrop-blur-md">
          <span className="flex items-center gap-1.5 font-bold text-white">
            <Sparkles className="h-3.5 w-3.5 text-pink-400" />
            Rasm tayyor turmaydi — chiziqlar navbat bilan chiziladi
          </span>
          <span className="hidden text-purple-200 sm:inline">
            {activeStroke.instructionUz}
          </span>
        </div>
      </div>
    </div>
  );
};
