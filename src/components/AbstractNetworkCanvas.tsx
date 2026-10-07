import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  label?: string;
  category?: string;
  color: string;
  pulseSpeed: number;
  pulsePhase: number;
}

export const AbstractNetworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const isDark = theme === 'dark';

    // Knowledge clusters
    const nodeLabels = [
      { text: 'Password Recovery', cat: 'Tech', color: isDark ? '#38bdf8' : '#0284c7' },
      { text: 'Admission Criteria', cat: 'Edu', color: isDark ? '#a78bfa' : '#7c3aed' },
      { text: '2FA Auth', cat: 'Tech', color: isDark ? '#22d3ee' : '#0891b2' },
      { text: 'Tuition Payment', cat: 'Edu', color: isDark ? '#c084fc' : '#9333ea' },
      { text: 'Refund Policy', cat: 'Prod', color: isDark ? '#34d399' : '#059669' },
      { text: 'Campus Wi-Fi', cat: 'Tech', color: isDark ? '#38bdf8' : '#2563eb' },
      { text: 'Grade Scale', cat: 'Edu', color: isDark ? '#818cf8' : '#4f46e5' },
      { text: 'Support Desk', cat: 'Prod', color: isDark ? '#4ade80' : '#16a34a' },
      { text: 'TF-IDF Embedding', cat: 'Core', color: isDark ? '#f43f5e' : '#e11d48' },
      { text: 'Cosine Similarity', cat: 'Core', color: isDark ? '#fb7185' : '#be123c' },
      { text: 'Subscription Manage', cat: 'Prod', color: isDark ? '#2dd4bf' : '#0d9488' },
      { text: 'Academic Records', cat: 'Edu', color: isDark ? '#93c5fd' : '#1d4ed8' },
    ];

    const nodes: Node[] = [];
    const count = Math.min(22, Math.max(12, Math.floor(width / 35)));

    for (let i = 0; i < count; i++) {
      const info = nodeLabels[i % nodeLabels.length];
      const radius = 3.5 + Math.random() * 3.5;
      nodes.push({
        x: Math.random() * (width - 60) + 30,
        y: Math.random() * (height - 60) + 30,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius,
        baseRadius: radius,
        label: i < 7 ? info.text : undefined,
        category: info.cat,
        color: info.color,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Draw background glow center
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        20,
        width / 2,
        height / 2,
        width * 0.6
      );
      if (isDark) {
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
        gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.04)');
        gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(14, 165, 233, 0.07)');
        gradient.addColorStop(0.5, 'rgba(124, 58, 237, 0.03)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Connect nodes with lines based on distance
      const maxDistance = width < 500 ? 110 : 145;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isDark ? 0.35 : 0.22);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);

            ctx.strokeStyle = isDark
              ? `rgba(129, 140, 248, ${alpha})`
              : `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Animated knowledge pulse along connection
            if ((i + j + Math.floor(frame / 60)) % 7 === 0) {
              const t = (Math.sin(frame * 0.03 + i) + 1) / 2;
              const px = nodes[i].x + (nodes[j].x - nodes[i].x) * t;
              const py = nodes[i].y + (nodes[j].y - nodes[i].y) * t;
              ctx.beginPath();
              ctx.arc(px, py, 1.8, 0, Math.PI * 2);
              ctx.fillStyle = isDark ? '#38bdf8' : '#2563eb';
              ctx.shadowColor = isDark ? '#38bdf8' : '#3b82f6';
              ctx.shadowBlur = 6;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      }

      // Update and draw nodes
      for (const node of nodes) {
        // Move
        node.x += node.vx;
        node.y += node.vy;

        // Bounce from walls
        if (node.x < 25) {
          node.x = 25;
          node.vx *= -1;
        } else if (node.x > width - 25) {
          node.x = width - 25;
          node.vx *= -1;
        }
        if (node.y < 25) {
          node.y = 25;
          node.vy *= -1;
        } else if (node.y > height - 25) {
          node.y = height - 25;
          node.vy *= -1;
        }

        // Slight mouse attraction / repulsion
        const mdx = mouseX - node.x;
        const mdy = mouseY - node.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 120 && mDist > 0) {
          node.x -= (mdx / mDist) * 0.6;
          node.y -= (mdy / mDist) * 0.6;
        }

        // Pulse
        node.pulsePhase += node.pulseSpeed;
        const currentRadius = node.baseRadius + Math.sin(node.pulsePhase) * 1.2;

        // Outer glow
        const glowRadius = currentRadius * 3.5;
        const glowGrad = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          glowRadius
        );
        glowGrad.addColorStop(
          0,
          isDark ? `${node.color}55` : `${node.color}33`
        );
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Core circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isDark ? 10 : 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Node label
        if (node.label) {
          ctx.font = '500 11px system-ui, -apple-system, sans-serif';
          ctx.fillStyle = isDark ? '#cbd5e1' : '#475569';
          ctx.fillText(node.label, node.x + currentRadius + 7, node.y + 4);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className="relative w-full h-[320px] md:h-[400px] overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-gradient-to-b from-slate-100/50 via-slate-50/50 to-white/80 dark:from-slate-900/50 dark:via-slate-950/70 dark:to-[#080d1a] shadow-inner backdrop-blur-sm">
      <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />
      {/* Floating Status Badge on Canvas */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Neural Knowledge Graph • 36 FAQs Active</span>
      </div>
      <div className="absolute bottom-4 right-4 text-[11px] font-mono text-slate-400 dark:text-slate-500 hidden sm:block">
        TF-IDF • Cosine Similarity Vector Space
      </div>
    </div>
  );
};
