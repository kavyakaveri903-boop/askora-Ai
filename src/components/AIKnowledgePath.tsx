import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { MessageSquareText, Brain, Search, Target, CheckCircle2 } from 'lucide-react';

interface AIKnowledgePathProps {
  activeStep?: number;
}

export const AIKnowledgePath: React.FC<AIKnowledgePathProps> = ({ activeStep = 2 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  const steps = [
    { title: 'USER QUESTION', subtitle: 'Natural query', icon: MessageSquareText, color: '#38bdf8' },
    { title: 'INTENT', subtitle: 'NLP extraction', icon: Brain, color: '#818cf8' },
    { title: 'FAQ MATCH', subtitle: 'TF-IDF + Cosine', icon: Search, color: '#a855f7' },
    { title: 'CONFIDENCE', subtitle: 'Strength filter', icon: Target, color: '#10b981' },
    { title: 'ANSWER', subtitle: 'Best result', icon: CheckCircle2, color: '#06b6d4' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = 70);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 70;
    };

    window.addEventListener('resize', handleResize);

    const isDark = theme === 'dark';

    // Particle streams
    const particles = Array.from({ length: 18 }, () => ({
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.003,
      size: 2 + Math.random() * 2,
      opacity: 0.4 + Math.random() * 0.6,
      color: isDark ? '#38bdf8' : '#6366f1'
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const y = height / 2;
      const startX = 30;
      const endX = width - 30;

      // Draw base glowing track
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.strokeStyle = isDark ? 'rgba(99, 102, 241, 0.22)' : 'rgba(99, 102, 241, 0.15)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Draw inner pulse track
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(79, 70, 229, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Render flowing glowing particles along the line
      particles.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
        }

        const px = startX + (endX - startX) * p.progress;
        const py = y + Math.sin(p.progress * Math.PI * 4) * 2; // subtle wave

        // Glow
        const glow = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3.5);
        glow.addColorStop(0, isDark ? 'rgba(56, 189, 248, 0.8)' : 'rgba(99, 102, 241, 0.8)');
        glow.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(px, py, p.size * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#ffffff' : '#4f46e5';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className="w-full relative my-8 p-6 rounded-3xl bg-gradient-to-b from-white/90 via-slate-50/80 to-slate-100/60 dark:from-slate-900/90 dark:via-[#0c1220]/90 dark:to-slate-950/90 border border-slate-200/80 dark:border-slate-800 shadow-lg">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-xs font-bold tracking-widest uppercase text-slate-700 dark:text-cyan-300">
            AI KNOWLEDGE PATH
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
          Continuous Flow • Real-time NLP
        </span>
      </div>

      {/* Canvas particle stream layer */}
      <div className="relative w-full h-[70px] overflow-hidden hidden md:block">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Nodes grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 relative z-10">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          const isSelected = activeStep === idx;
          return (
            <div
              key={idx}
              className={`flex flex-col items-center text-center p-3.5 rounded-2xl transition-all duration-300 ${
                isSelected
                  ? 'bg-white dark:bg-slate-800/95 border-2 border-indigo-500 dark:border-cyan-400 shadow-md shadow-indigo-500/15 scale-[1.02]'
                  : 'bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80'
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 shadow-xs transition-colors"
                style={{
                  backgroundColor: `${st.color}20`,
                  color: st.color
                }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold tracking-wider text-slate-900 dark:text-white">
                {st.title}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {st.subtitle}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
