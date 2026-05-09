"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const stars: Star[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      if (stars.length === 0) initStars();
    }

    function initStars() {
      stars.length = 0;
      const area = canvas!.width * canvas!.height;
      const count = Math.floor(area / 3000);

      for (let i = 0; i < count; i++) {
        const roll = Math.random();
        let size: number;
        if (roll < 0.7) size = Math.random() * 0.8 + 0.2;
        else if (roll < 0.93) size = Math.random() * 1.2 + 0.8;
        else size = Math.random() * 1.5 + 1.5;

        stars.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          size,
          baseOpacity: Math.random() * 0.6 + 0.15,
          twinkleSpeed: Math.random() * 0.008 + 0.002,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    }

    function drawPlanet(time: number) {
      const cx = canvas!.width * 0.82;
      const cy = canvas!.height * 0.25;
      const r = Math.min(canvas!.width, canvas!.height) * 0.18;

      // Outer atmospheric glow
      const atmo = ctx!.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 2.5);
      atmo.addColorStop(0, "rgba(100, 120, 180, 0.04)");
      atmo.addColorStop(0.4, "rgba(80, 100, 160, 0.02)");
      atmo.addColorStop(1, "transparent");
      ctx!.fillStyle = atmo;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      // Planet body
      const grad = ctx!.createRadialGradient(
        cx - r * 0.3,
        cy - r * 0.3,
        0,
        cx,
        cy,
        r
      );
      grad.addColorStop(0, "rgba(60, 70, 100, 0.25)");
      grad.addColorStop(0.5, "rgba(35, 40, 65, 0.2)");
      grad.addColorStop(0.85, "rgba(20, 22, 40, 0.15)");
      grad.addColorStop(1, "rgba(10, 10, 20, 0.05)");

      ctx!.beginPath();
      ctx!.arc(cx, cy, r, 0, Math.PI * 2);
      ctx!.fillStyle = grad;
      ctx!.fill();

      // Subtle ring/horizon line
      const ringPhase = Math.sin(time * 0.0003) * 0.02 + 0.06;
      ctx!.beginPath();
      ctx!.ellipse(cx, cy, r * 1.6, r * 0.12, -0.15, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(140, 160, 220, ${ringPhase})`;
      ctx!.lineWidth = 1;
      ctx!.stroke();

      // Light edge on planet
      ctx!.beginPath();
      ctx!.arc(cx, cy, r, -0.8, 0.8);
      ctx!.strokeStyle = "rgba(160, 180, 230, 0.08)";
      ctx!.lineWidth = 1.5;
      ctx!.stroke();
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Draw stars
      for (const star of stars) {
        const twinkle =
          Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        const opacity = star.baseOpacity * twinkle;

        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.size, 0, Math.PI * 2);

        if (star.size > 1.5) {
          // Bright stars get a soft glow
          const glow = ctx!.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 3
          );
          glow.addColorStop(0, `rgba(200, 210, 255, ${opacity})`);
          glow.addColorStop(0.4, `rgba(180, 190, 240, ${opacity * 0.3})`);
          glow.addColorStop(1, "transparent");
          ctx!.fillStyle = glow;
          ctx!.fillRect(
            star.x - star.size * 3,
            star.y - star.size * 3,
            star.size * 6,
            star.size * 6
          );

          ctx!.beginPath();
          ctx!.arc(star.x, star.y, star.size * 0.6, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(230, 235, 255, ${opacity})`;
          ctx!.fill();
        } else {
          ctx!.fillStyle = `rgba(220, 225, 255, ${opacity})`;
          ctx!.fill();
        }
      }

      drawPlanet(time);

      animationId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
