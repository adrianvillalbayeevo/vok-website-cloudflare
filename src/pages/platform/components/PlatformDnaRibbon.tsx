import { useEffect, useRef, useCallback } from "react";

/*
  Platform DNA Ribbon
  A delicate double-helix ribbon that flows from top to bottom, left to right,
  weaving around the content. Two interlaced strands of particles with faint
  rungs between them — very light and tenue, but still clearly visible.
*/
export default function PlatformDnaRibbon({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  // Centerline path: flows from top-left down to lower-right, with a gentle weave
  const getPathPoint = useCallback((t: number, w: number, h: number) => {
    const x = w * 0.18 + (w * 0.44) * t + Math.sin(t * Math.PI * 6) * w * 0.06;
    const y = 12 + (h - 24) * t;
    return { x, y };
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
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const animate = () => {
      if (!canvas || !ctx) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const time = Date.now() * 0.00055;
      const helixTurns = 4.5;
      const amp = Math.min(34, w * 0.05);
      const samples = Math.floor(h / 5);
      const tStep = 1 / samples;

      // Faint glow along the path to soften the ribbon
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(255, 90, 31, 0)");
      grad.addColorStop(0.5, "rgba(255, 90, 31, 0.03)");
      grad.addColorStop(1, "rgba(255, 90, 31, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const strandAColor = "#FF5A1F";
      const strandBColor = "#ffffff";
      const strandASize = 2.0;
      const strandBSize = 1.5;

      for (let i = 0; i < samples; i++) {
        const t = i * tStep;
        const center = getPathPoint(t, w, h);
        // phase moves forward over time → ribbon appears to flow downward
        const phase = t * Math.PI * 2 * helixTurns - time * 2.2;

        const offA = Math.cos(phase) * amp;
        const offB = Math.cos(phase + Math.PI) * amp;

        const ax = center.x + offA;
        const ay = center.y;
        const bx = center.x + offB;
        const by = center.y;

        // Rung between the two strands (every other sample to keep it light)
        if (i % 2 === 0) {
          ctx.globalAlpha = 0.06;
          ctx.strokeStyle = strandAColor;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }

        // Strand A (coral)
        const breatheA = 0.5 + Math.sin(t * Math.PI * 14 - time * 2.5) * 0.2;
        ctx.globalAlpha = (0.22 + breatheA * 0.1) * Math.sin(Math.PI * t) * 0.9 + 0.04;
        ctx.fillStyle = strandAColor;
        ctx.beginPath();
        ctx.arc(ax, ay, strandASize * breatheA, 0, Math.PI * 2);
        ctx.fill();

        // Strand B (white)
        const breatheB = 0.5 + Math.sin(t * Math.PI * 14 - time * 2.5 + Math.PI) * 0.2;
        ctx.globalAlpha = (0.14 + breatheB * 0.08) * Math.sin(Math.PI * t) * 0.9 + 0.03;
        ctx.fillStyle = strandBColor;
        ctx.beginPath();
        ctx.arc(bx, by, strandBSize * breatheB, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animRef.current);
    };
  }, [getPathPoint]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ display: "block" }}
    />
  );
}