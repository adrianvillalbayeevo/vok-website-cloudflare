import { useEffect, useRef, useCallback } from "react";

/* ============================================================
   VOK PARTICLE LAPTOP — 2D artistic perspective
   Each laptop part positioned manually for realistic grounded look
   ============================================================ */

const DALA_COLORS = [
  "#8052ff", "#ffb829", "#15846e", "#e052ff",
  "#52e0ff", "#b8ff52", "#FF5A1F", "#FF7A4F",
  "#ff52a0", "#52a0ff", "#a052ff", "#ff8c52",
];

interface Particle {
  x: number; y: number; tx: number; ty: number;
  size: number; color: string; speed: number;
  opacity: number; targetOpacity: number;
  rotation: number; groupIndex: number; snapBounce: number;
}

interface Props { className?: string }

/* ============================================================
   ARTISTIC 2D LAPTOP BUILDER — manual perspective points
   ============================================================ */
function buildLaptopCloud(w: number, h: number) {
  const T: Array<{ tx: number; ty: number; color: string; size: number; groupIndex: number }> = [];
  const cx = w * 0.65;
  const cy = h * 0.58;
  const scale = Math.min(w, h) * 0.00115;

  const addPt = (dx: number, dy: number, color: string, size: number, group: number) => {
    T.push({ tx: cx + dx * scale, ty: cy + dy * scale, color, size, groupIndex: group });
  };

  const addLine = (x1: number, y1: number, x2: number, y2: number, n: number, color: string, size: number, group: number) => {
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      addPt(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, color, size, group);
    }
  };

  const addRegion = (x1: number, y1: number, x2: number, y2: number, n: number, color: string, size: number, group: number) => {
    for (let i = 0; i < n; i++) {
      addPt(x1 + Math.random() * (x2 - x1), y1 + Math.random() * (y2 - y1), color, size, group);
    }
  };

  // === KEYBOARD BASE (grounded, wider at front, narrower at back) ===
  // Front edge (closer to viewer)
  const fL = [-220, 80];
  const fR = [220, 80];
  // Back edge (where hinge is)
  const bL = [-160, -20];
  const bR = [160, -20];

  // Base outline — thick white/silver
  addLine(fL[0], fL[1], fR[0], fR[1], 90, "#d0d0e0", 3.5, 0);   // front
  addLine(bL[0], bL[1], bR[0], bR[1], 70, "#a0a0b8", 3.0, 0);   // back
  addLine(fL[0], fL[1], bL[0], bL[1], 50, "#b0b0c8", 3.2, 0);  // left
  addLine(fR[0], fR[1], bR[0], bR[1], 50, "#b0b0c8", 3.2, 0);  // right
  // Thickness (front face dropping down)
  addLine(fL[0], fL[1] + 12, fR[0], fR[1] + 12, 80, "#e8e8f0", 3.5, 0);
  addLine(fL[0], fL[1], fL[0], fL[1] + 12, 18, "#c8c8d8", 3.0, 0);
  addLine(fR[0], fR[1], fR[0], fR[1] + 12, 18, "#c8c8d8", 3.0, 0);

  // Base fill
  addRegion(-210, -15, 210, 75, 250, "#b8b8c8", 2.2, 1);

  // === KEYS (reduced density per key) ===
  const kRows = 4, kCols = 11;
  const kX0 = -180, kY0 = 0;
  const kW = 360, kH = 50;
  for (let r = 0; r < kRows; r++) {
    for (let c = 0; c < kCols; c++) {
      const u0 = kX0 + (c / kCols) * kW;
      const u1 = kX0 + ((c + 1) / kCols) * kW - 4;
      const v0 = kY0 + (r / kRows) * kH;
      const v1 = v0 + (kH / kRows) - 4;
      // Key outline (fewer points)
      addLine(u0, v0, u1, v0, 3, "#f0f0f8", 2.2, 1);
      addLine(u0, v1, u1, v1, 3, "#f0f0f8", 2.2, 1);
      addLine(u0, v0, u0, v1, 2, "#f0f0f8", 2.2, 1);
      addLine(u1, v0, u1, v1, 2, "#f0f0f8", 2.2, 1);
      // Key fill (fewer points)
      addRegion(u0 + 1, v0 + 1, u1 - 1, v1 - 1, 2, "#e0e0f0", 1.8, 1);
    }
  }

  // === TRACKPAD ===
  const tpW = 100, tpH = 60, tpX = 0, tpY = 45;
  addLine(tpX - tpW / 2, tpY, tpX + tpW / 2, tpY, 20, "#d0d0e0", 2.6, 1);
  addLine(tpX - tpW / 2, tpY + tpH, tpX + tpW / 2, tpY + tpH, 20, "#d0d0e0", 2.6, 1);
  addLine(tpX - tpW / 2, tpY, tpX - tpW / 2, tpY + tpH, 14, "#d0d0e0", 2.6, 1);
  addLine(tpX + tpW / 2, tpY, tpX + tpW / 2, tpY + tpH, 14, "#d0d0e0", 2.6, 1);
  addRegion(tpX - tpW / 2 + 2, tpY + 2, tpX + tpW / 2 - 2, tpY + tpH - 2, 18, "#c0c0d0", 2, 1);

  // === HINGE ===
  addLine(bL[0], bL[1], bR[0], bR[1], 55, "#505068", 2.8, 0);
  addLine(bL[0], bL[1] - 6, bR[0], bR[1] - 6, 55, "#404058", 2.5, 0);

  // === SCREEN (leaning back from hinge line) ===
  // Screen outer bezel (dark)
  const sBL = [-170, -20];    // bottom left (at hinge)
  const sBR = [170, -20];     // bottom right
  const sTL = [-185, -280];   // top left (leaned back)
  const sTR = [185, -280];    // top right

  // Outer dark bezel
  addLine(sBL[0], sBL[1], sBR[0], sBR[1], 80, "#2a2a40", 3.2, 2);
  addLine(sTL[0], sTL[1], sTR[0], sTR[1], 80, "#2a2a40", 3.2, 2);
  addLine(sBL[0], sBL[1], sTL[0], sTL[1], 60, "#2a2a40", 3.0, 2);
  addLine(sBR[0], sBR[1], sTR[0], sTR[1], 60, "#2a2a40", 3.0, 2);

  // Inner coral accent bezel
  const siBL = [-160, -30];
  const siBR = [160, -30];
  const siTL = [-172, -268];
  const siTR = [172, -268];
  addLine(siBL[0], siBL[1], siBR[0], siBR[1], 70, "#FF5A1F", 2.8, 2);
  addLine(siTL[0], siTL[1], siTR[0], siTR[1], 70, "#FF5A1F", 2.8, 2);
  addLine(siBL[0], siBL[1], siTL[0], siTL[1], 50, "#FF7A4F", 2.6, 2);
  addLine(siBR[0], siBR[1], siTR[0], siTR[1], 50, "#FF7A4F", 2.6, 2);

  // Screen interior fill (dark) — no face elements
  addRegion(-155, -258, 155, -32, 350, "#0a0a18", 2.2, 3);

  // === SIDEBAR (left of screen) ===
  const sbW = 55;
  addRegion(-152, -250, -152 + sbW, -38, 80, "#121224", 2.2, 3);
  // Sidebar divider
  addLine(-152 + sbW, -245, -152 + sbW, -42, 35, "#1a1a30", 1.8, 3);

  // Sidebar horizontal lines
  for (let i = 0; i < 6; i++) {
    const yy = -235 + i * 35;
    addLine(-148, yy, -152 + sbW - 4, yy, 10, i === 0 ? "#FF5A1F" : "#5a5a70", 2, 3);
  }

  // Logo "V" only in sidebar — removed circle (O) and line below (K) to avoid eye/mouth face appearance
  const logoX = -148;
  const logoY = -190;
  const vPts = [[0, 0], [0.9, 1.4], [1.8, 2.8], [2.7, 4.2], [3.6, 5.6], [4.5, 7.0], [5.4, 5.1], [6.3, 3.2], [7.2, 1.4], [8.1, 0]];
  for (const [du, dv] of vPts) {
    addPt(logoX + du * 0.038, logoY + dv * 0.038, "#ffffff", 7.0, 3);
  }

  // === DASHBOARD WIDGETS ===
  // Registrations card (no circle to avoid face-like appearance)
  const regX0 = -88, regX1 = 10;
  const regY0 = -245, regY1 = -175;
  addLine(regX0, regY0, regX1, regY0, 18, "#2a2a40", 1.8, 4);
  addLine(regX0, regY1, regX1, regY1, 18, "#2a2a40", 1.8, 4);
  addLine(regX0, regY0, regX0, regY1, 12, "#2a2a40", 1.8, 4);
  addLine(regX1, regY0, regX1, regY1, 12, "#2a2a40", 1.8, 4);
  addRegion(regX0 + 2, regY0 + 2, regX1 - 2, regY1 - 2, 40, "#141428", 2, 4);

  // Chart card (removed coral smile-line to avoid face-like appearance)
  const chartX0 = -88, chartX1 = 75;
  const chartY0 = -165, chartY1 = -95;
  addLine(chartX0, chartY0, chartX1, chartY0, 22, "#2a2a40", 1.6, 4);
  addLine(chartX0, chartY1, chartX1, chartY1, 22, "#2a2a40", 1.6, 4);
  addLine(chartX0, chartY0, chartX0, chartY1, 14, "#2a2a40", 1.6, 4);
  addLine(chartX1, chartY0, chartX1, chartY1, 14, "#2a2a40", 1.6, 4);
  addRegion(chartX0 + 2, chartY0 + 2, chartX1 - 2, chartY1 - 2, 50, "#141428", 2, 4);
  // Grid lines only
  for (let i = 1; i < 3; i++) {
    const gy = chartY0 + (i / 3) * (chartY1 - chartY0);
    addLine(chartX0, gy, chartX1, gy, 20, "#1a1a30", 1.3, 4);
  }

  // Modular cards (right side)
  const cards = [
    [95, -245], [95, -195], [95, -145],
    [145, -245], [145, -195],
  ];
  cards.forEach(([rx, ry]) => {
    const cX0 = rx;
    const cX1 = rx + 42;
    const cY0 = ry;
    const cY1 = ry + 38;
    addLine(cX0, cY0, cX1, cY0, 10, "#3a3a50", 1.6, 4);
    addLine(cX0, cY1, cX1, cY1, 10, "#3a3a50", 1.6, 4);
    addLine(cX0, cY0, cX0, cY1, 8, "#3a3a50", 1.6, 4);
    addLine(cX1, cY0, cX1, cY1, 8, "#3a3a50", 1.6, 4);
    addRegion(cX0 + 1, cY0 + 1, cX1 - 1, cY1 - 1, 15, "#181830", 1.8, 4);
  });

  // === FLOATING BLOCKS ===
  // Black blocks
  const blackBlocks = [
    [-280, -100, 55], [-140, -340, 48], [220, -80, 52],
    [-320, 20, 58], [-180, 100, 48],
  ];
  blackBlocks.forEach(([bx, by, bs]) => {
    const h = bs / 2;
    // Top face
    addLine(bx - h, by - h, bx + h, by - h, 10, "#3a3a55", 2.6, 5);
    addLine(bx - h, by + h, bx + h, by + h, 10, "#3a3a55", 2.6, 5);
    addLine(bx - h, by - h, bx - h, by + h, 8, "#3a3a55", 2.6, 5);
    addLine(bx + h, by - h, bx + h, by + h, 8, "#3a3a55", 2.6, 5);
    // Front face
    addLine(bx - h, by + h, bx + h, by + h, 8, "#2a2a40", 2.4, 5);
    addLine(bx - h, by + h, bx - h, by + h + bs * 0.4, 6, "#2a2a40", 2.4, 5);
    addLine(bx + h, by + h, bx + h, by + h + bs * 0.4, 6, "#2a2a40", 2.4, 5);
    // Studs
    for (let gx = -h + 5; gx < h; gx += bs * 0.35) {
      for (let gz = -h + 5; gz < h; gz += bs * 0.35) {
        for (let a = 0; a < 5; a++) {
          const ang = (a / 5) * Math.PI * 2;
          addPt(bx + gx + Math.cos(ang) * 3, by - h - 4, "#4a4a60", 2, 5);
        }
      }
    }
    addRegion(bx - h + 2, by - h + 2, bx + h - 2, by + h - 2, 20, "#222238", 1.8, 5);
  });

  // Coral blocks
  const coralBlocks = [
    [240, -220, 58], [260, 60, 52], [340, -160, 48],
  ];
  coralBlocks.forEach(([bx, by, bs]) => {
    const h = bs / 2;
    addLine(bx - h, by - h, bx + h, by - h, 10, "#FF5A1F", 2.8, 5);
    addLine(bx - h, by + h, bx + h, by + h, 10, "#FF5A1F", 2.8, 5);
    addLine(bx - h, by - h, bx - h, by + h, 8, "#FF7A4F", 2.6, 5);
    addLine(bx + h, by - h, bx + h, by + h, 8, "#FF7A4F", 2.6, 5);
    addLine(bx - h, by + h, bx + h, by + h, 8, "#c44418", 2.4, 5);
    addLine(bx - h, by + h, bx - h, by + h + bs * 0.35, 6, "#c44418", 2.4, 5);
    addLine(bx + h, by + h, bx + h, by + h + bs * 0.35, 6, "#c44418", 2.4, 5);
    for (let gx = -h + 4; gx < h; gx += bs * 0.35) {
      for (let gz = -h + 4; gz < h; gz += bs * 0.35) {
        for (let a = 0; a < 5; a++) {
          const ang = (a / 5) * Math.PI * 2;
          addPt(bx + gx + Math.cos(ang) * 3, by - h - 4, "#FF7A4F", 2, 5);
        }
      }
    }
    addRegion(bx - h + 2, by - h + 2, bx + h - 2, by + h - 2, 20, "#a83814", 1.8, 5);
  });

  // === AMBIENT STARS ===
  for (let i = 0; i < 250; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = 200 + Math.random() * 400;
    T.push({
      tx: cx + Math.cos(a) * d,
      ty: cy + Math.sin(a) * d,
      color: DALA_COLORS[Math.floor(Math.random() * DALA_COLORS.length)] + "28",
      size: 2 + Math.random() * 2,
      groupIndex: 6,
    });
  }

  return T;
}

/* ============================================================
   COMPONENT
   ============================================================ */
export default function ParticleConstellation({ className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const phaseRef = useRef<"scattered" | "assembling" | "formed" | "disassembling">("scattered");
  const phaseTimeRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const initParticles = useCallback((w: number, h: number) => {
    const targets = buildLaptopCloud(w, h);
    if (!targets.length) return;
    const cx = w * 0.5, cy = h * 0.5;
    const particles: Particle[] = targets.map((td) => {
      const a = Math.random() * Math.PI * 2;
      const d = 40 + Math.random() * 550;
      return {
        x: cx + Math.cos(a) * d,
        y: cy + Math.sin(a) * d,
        tx: td.tx, ty: td.ty,
        size: td.size, color: td.color,
        speed: 0.006 + Math.random() * 0.014,
        opacity: 0.05 + Math.random() * 0.12,
        targetOpacity: 0.55 + Math.random() * 0.45,
        rotation: Math.random() * Math.PI * 2,
        groupIndex: td.groupIndex,
        snapBounce: 0,
      };
    });
    particlesRef.current = particles;
    phaseRef.current = "scattered";
    phaseTimeRef.current = 0;
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
    const handleMouseLeave = () => { mouseRef.current = { x: -1000, y: -1000 }; };

    handleResize();
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    setTimeout(() => { phaseRef.current = "assembling"; phaseTimeRef.current = 0; }, 300);

    const animate = () => {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const phase = phaseRef.current;
      phaseTimeRef.current += 1;

      if (phase === "scattered" && phaseTimeRef.current > 120) {
        phaseRef.current = "assembling"; phaseTimeRef.current = 0;
      } else if (phase === "assembling" && phaseTimeRef.current > 300) {
        phaseRef.current = "formed"; phaseTimeRef.current = 0;
      } else if (phase === "formed" && phaseTimeRef.current > 550) {
        phaseRef.current = "disassembling"; phaseTimeRef.current = 0;
      } else if (phase === "disassembling" && phaseTimeRef.current > 160) {
        phaseRef.current = "scattered"; phaseTimeRef.current = 0;
      }

      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (phase === "scattered") {
          p.x += (Math.random() - 0.5) * 2.2;
          p.y += (Math.random() - 0.5) * 2.2;
          p.opacity = 0.04 + Math.random() * 0.1;
          p.rotation += 0.025;
          const dx = p.x - w / 2, dy = p.y - h / 2;
          const dist = Math.hypot(dx, dy);
          if (dist > 550) { p.x -= dx * 0.004; p.y -= dy * 0.004; }
        } else if (phase === "assembling") {
          const stagger = p.groupIndex * 12;
          let t = Math.max(0, (phaseTimeRef.current - stagger) / 140);
          t = Math.min(t, 1);
          const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          const dx = p.tx - p.x, dy = p.ty - p.y;
          p.x += dx * p.speed * 3.5 * ease;
          p.y += dy * p.speed * 3.5 * ease;
          p.opacity = 0.1 + ease * 0.9;
          p.rotation += (Math.random() * Math.PI * 2 - p.rotation) * 0.15 * ease;
          if (Math.hypot(dx, dy) < 4 && p.snapBounce === 0) p.snapBounce = 1;
          if (p.snapBounce > 0) {
            p.snapBounce -= 0.035;
            p.x += (Math.random() - 0.5) * 3.5 * p.snapBounce;
            p.y += (Math.random() - 0.5) * 3.5 * p.snapBounce;
          }
        } else if (phase === "formed") {
          const breathe = Math.sin(phaseTimeRef.current * 0.01 + i * 0.05) * 0.35;
          p.x = p.tx + breathe;
          p.y = p.ty + breathe;
          p.opacity = p.targetOpacity + Math.sin(phaseTimeRef.current * 0.015 + i * 0.08) * 0.06;
          p.rotation += 0.008;
          const mdx = p.x - mouse.x, mdy = p.y - mouse.y;
          const mDist = Math.hypot(mdx, mdy);
          if (mDist < 55 && mDist > 0) {
            const force = ((55 - mDist) / 55) * 0.5;
            p.x += (mdx / mDist) * force;
            p.y += (mdy / mDist) * force;
          }
        } else if (phase === "disassembling") {
          const stagger = (6 - p.groupIndex) * 10;
          let t = Math.max(0, (phaseTimeRef.current - stagger) / 100);
          t = Math.min(t, 1);
          const ease = t * t;
          const angle = Math.random() * Math.PI * 2;
          const dist = 80 + Math.random() * 450;
          p.x += Math.cos(angle) * dist * 0.006 * ease;
          p.y += Math.sin(angle) * dist * 0.006 * ease;
          p.rotation += 0.022 * ease;
          p.opacity = p.targetOpacity * (1 - ease * 0.65);
          p.snapBounce = 0;
        }

        // Draw triangle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
        const sz = p.size;
        ctx.beginPath();
        ctx.moveTo(0, -sz);
        ctx.lineTo(sz * 0.866, sz * 0.5);
        ctx.lineTo(-sz * 0.866, sz * 0.5);
        ctx.closePath();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.fillStyle = p.color + "18";
        ctx.fill();
        ctx.restore();
      }

      // Dense constellation lines
      if (phase === "formed" || phase === "assembling") {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < Math.min(particles.length, 600); i += 2) {
          const p1 = particles[i];
          if (p1.opacity < 0.2) continue;
          for (let j = i + 1; j < Math.min(i + 4, particles.length); j++) {
            const p2 = particles[j];
            if (p2.opacity < 0.2) continue;
            const dx = p1.x - p2.x, dy = p1.y - p2.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 20) {
              const a = (1 - dist / 20) * 0.14 * Math.min(p1.opacity, p2.opacity);
              ctx.strokeStyle = `rgba(128, 82, 255, ${a})`;
              ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            }
          }
        }
      }

      // Glow
      if (phase === "formed") {
        const glow = 0.1 + Math.sin(phaseTimeRef.current * 0.03) * 0.05;
        const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, 340);
        grad.addColorStop(0, `rgba(255, 90, 31, ${glow})`);
        grad.addColorStop(0.5, `rgba(128, 82, 255, ${glow * 0.35})`);
        grad.addColorStop(1, "rgba(255, 90, 31, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(w * 0.5, h * 0.5, 340, 0, Math.PI * 2); ctx.fill();
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animRef.current);
    };
  }, [initParticles]);

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} style={{ display: "block" }} />;
}