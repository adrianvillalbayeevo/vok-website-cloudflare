import { useEffect, useRef, useCallback } from "react";

interface FlowParticle {
  x: number;
  y: number;
  progress: number;
  speed: number;
  size: number;
  color: string;
  opacity: number;
  phase: number;
}

/*
  AI Particle Ribbon
  Particles flow in a smooth loop/ribbon from top-left (above "AI")
  across the section and down to the bottom-right corner.
  Now more visible — brighter, denser, larger particles and lines.
*/
export default function AiParticleRibbon({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<FlowParticle[]>([]);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const isActiveRef = useRef(false);

  // Define the ribbon path: start top-left → arc across → bottom-right
  const getPathPoint = useCallback((t: number, w: number, h: number) => {
    const startX = w * 0.08;
    const startY = h * 0.12;
    const cp1x = w * 0.45;
    const cp1y = h * 0.02;
    const cp2x = w * 0.75;
    const cp2y = h * 0.35;
    const endX = w * 0.92;
    const endY = h * 0.88;

    const mt = 1 - t;
    const x = mt * mt * mt * startX + 3 * mt * mt * t * cp1x + 3 * mt * t * t * cp2x + t * t * t * endX;
    const y = mt * mt * mt * startY + 3 * mt * mt * t * cp1y + 3 * mt * t * t * cp2y + t * t * t * endY;

    return { x, y };
  }, []);

  const initParticles = useCallback((w: number, h: number) => {
    const particles: FlowParticle[] = [];
    const count = Math.floor((w * h) / 12000); // increased density

    const colors = [
      "#FF5A1F",
      "#FF7A4F",
      "#ffb899",
      "#ffffff",
      "#a0a0ff",
      "#52e0ff",
    ];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: 0,
        y: 0,
        progress: Math.random(),
        speed: 0.0005 + Math.random() * 0.0015,
        size: 1.6 + Math.random() * 3.0,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0,
        phase: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(rect.width, rect.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isActiveRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const animate = () => {
      if (!canvas || !ctx) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      if (!isActiveRef.current) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
          p.phase = Math.random() * Math.PI * 2;
        }

        const base = getPathPoint(p.progress, w, h);

        const wiggleAmp = 22 + Math.sin(p.phase) * 10;
        const wiggleFreq = 3.5;
        const wiggle = Math.sin(p.progress * wiggleFreq * Math.PI * 2 + p.phase) * wiggleAmp;

        const dt = 0.01;
        const nextP = getPathPoint(Math.min(p.progress + dt, 1), w, h);
        const prevP = getPathPoint(Math.max(p.progress - dt, 0), w, h);
        const dx = nextP.x - prevP.x;
        const dy = nextP.y - prevP.y;
        const len = Math.hypot(dx, dy) || 1;
        const perpX = (-dy / len);
        const perpY = (dx / len);

        p.x = base.x + perpX * wiggle;
        p.y = base.y + perpY * wiggle;

        // Brighter opacity — much more visible
        const fadeIn = Math.min(1, p.progress * 6);
        const fadeOut = Math.min(1, (1 - p.progress) * 6);
        const baseOpacity = 0.35 + Math.sin(Date.now() * 0.001 + p.phase) * 0.15;
        p.opacity = baseOpacity * fadeIn * fadeOut;

        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.hypot(mdx, mdy);
        if (mDist < 60 && mDist > 0) {
          const force = ((60 - mDist) / 60) * 0.6;
          p.x += (mdx / mDist) * force;
          p.y += (mdy / mDist) * force;
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Brighter connecting lines
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = "#FF5A1F";
      ctx.lineWidth = 0.9;
      for (let i = 0; i < particles.length; i += 2) {
        const p1 = particles[i];
        if (p1.opacity < 0.05) continue;
        for (let j = i + 1; j < Math.min(i + 6, particles.length); j++) {
          const p2 = particles[j];
          if (p2.opacity < 0.05) continue;
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
      cancelAnimationFrame(animRef.current);
    };
  }, [initParticles, getPathPoint]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
      style={{ display: "block" }}
    />
  );
}