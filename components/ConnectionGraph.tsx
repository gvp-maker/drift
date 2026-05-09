"use client";

import { motion } from "framer-motion";

const COLORS = [
  "#94a3b8",
  "#78716c",
  "#a1a1aa",
  "#9ca3af",
  "#a78bfa",
  "#6ee7b7",
  "#fbbf24",
  "#f87171",
];

function shortenTitle(title: string): string {
  const segment = title.split(/\s*[|–—]\s*/)[0].trim();
  return segment.length > 28 ? segment.slice(0, 26) + "..." : segment;
}

interface ConnectionGraphProps {
  hops: { title: string }[];
  bridges: string[];
}

export default function ConnectionGraph({
  hops,
  bridges,
}: ConnectionGraphProps) {
  const count = hops.length;
  if (count < 2) return null;

  const positions = hops.map((_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return {
      x: 50 + 34 * Math.cos(angle),
      y: 50 + 34 * Math.sin(angle),
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7 }}
      className="mt-12"
    >
      <p className="text-[10px] text-white/15 uppercase tracking-[0.25em] mb-6 font-medium text-center">
        Journey Map
      </p>

      <div className="relative w-full" style={{ height: 360 }}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {bridges.map((_, i) => {
            if (i + 1 >= positions.length) return null;
            const from = positions[i];
            const to = positions[i + 1];
            const mx = (from.x + to.x) / 2;
            const my = (from.y + to.y) / 2;
            const cx = mx + (50 - mx) * 0.3;
            const cy = my + (50 - my) * 0.3;
            return (
              <motion.path
                key={i}
                d={`M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
                fill="none"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.3 + i * 0.12,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              />
            );
          })}

          {count > 2 && (
            <motion.path
              d={`M ${positions[count - 1].x} ${positions[count - 1].y} Q 50 50 ${positions[0].x} ${positions[0].y}`}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
              strokeDasharray="2 3"
              fill="none"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.3 + count * 0.12,
                duration: 0.6,
              }}
            />
          )}
        </svg>

        {hops.map((hop, i) => {
          const pos = positions[i];
          const isOrigin = i === 0;
          const color = COLORS[i % COLORS.length];

          return (
            <motion.div
              key={i}
              className="absolute flex flex-col items-center"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
            >
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: isOrigin ? 40 : 28,
                  height: isOrigin ? 40 : 28,
                  backgroundColor: color,
                  opacity: 0.1,
                }}
                animate={{
                  opacity: [0.06, 0.15, 0.06],
                  scale: [1, 1.4, 1],
                }}
                transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.4 }}
              />

              <div
                className="rounded-full mb-2 shrink-0 relative z-10"
                style={{
                  width: isOrigin ? 14 : 10,
                  height: isOrigin ? 14 : 10,
                  backgroundColor: color,
                  opacity: isOrigin ? 0.9 : 0.6,
                  boxShadow: `0 0 ${isOrigin ? 12 : 8}px ${color}40`,
                }}
              />

              <div
                className={`rounded-lg border backdrop-blur-sm ${
                  isOrigin
                    ? "border-white/15 bg-white/[0.08] px-3 py-1.5"
                    : "border-white/[0.08] bg-white/[0.05] px-2.5 py-1"
                }`}
              >
                <p
                  className={`text-center tracking-wider leading-tight line-clamp-1 ${
                    isOrigin
                      ? "text-xs text-white/50"
                      : "text-[11px] text-white/35"
                  }`}
                  style={{ maxWidth: 120 }}
                >
                  {shortenTitle(hop.title)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
