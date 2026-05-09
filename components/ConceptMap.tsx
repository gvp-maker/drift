"use client";

import { motion } from "framer-motion";

interface ConceptMapProps {
  concepts: string[];
}

interface NodePos {
  x: number;
  y: number;
  tier: number;
}

function getLayout(count: number): {
  nodes: NodePos[];
  edges: [number, number][];
} {
  if (count <= 3) {
    return {
      nodes: [
        { x: 50, y: 18, tier: 0 },
        { x: 24, y: 80, tier: 1 },
        { x: 76, y: 80, tier: 1 },
      ],
      edges: [
        [0, 1],
        [0, 2],
      ],
    };
  }
  if (count === 4) {
    return {
      nodes: [
        { x: 50, y: 12, tier: 0 },
        { x: 25, y: 48, tier: 1 },
        { x: 75, y: 48, tier: 1 },
        { x: 50, y: 87, tier: 2 },
      ],
      edges: [
        [0, 1],
        [0, 2],
        [2, 3],
      ],
    };
  }
  return {
    nodes: [
      { x: 50, y: 12, tier: 0 },
      { x: 25, y: 46, tier: 1 },
      { x: 75, y: 46, tier: 1 },
      { x: 14, y: 84, tier: 2 },
      { x: 86, y: 84, tier: 2 },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
    ],
  };
}

const TIERS = [
  {
    dot: 10,
    glow: 30,
    textClass: "text-xs text-white/40",
    pillClass: "px-4 py-2 border-white/[0.1] bg-white/[0.06]",
    maxW: 190,
  },
  {
    dot: 6,
    glow: 18,
    textClass: "text-[11px] text-white/25",
    pillClass: "px-3 py-1.5 border-white/[0.07] bg-white/[0.04]",
    maxW: 155,
  },
  {
    dot: 4,
    glow: 0,
    textClass: "text-[10px] text-white/20",
    pillClass: "px-2.5 py-1 border-white/[0.05] bg-white/[0.03]",
    maxW: 135,
  },
];

export default function ConceptMap({ concepts }: ConceptMapProps) {
  const items = concepts.slice(0, 5);
  const { nodes, edges } = getLayout(items.length);

  return (
    <div className="w-full max-w-lg mx-auto mb-14">
      <p className="text-[10px] text-white/15 uppercase tracking-[0.25em] mb-6 font-medium text-center">
        Concept Map
      </p>

      <div className="relative w-full" style={{ height: 300 }}>
        {/* Connection lines */}
        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {edges.map(([from, to], i) => (
            <motion.path
              key={i}
              d={`M ${nodes[from].x} ${nodes[from].y} L ${nodes[to].x} ${nodes[to].y}`}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
              fill="none"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                delay: 0.3 + i * 0.15,
                duration: 0.6,
                ease: "easeOut",
              }}
            />
          ))}
        </svg>

        {/* Nodes */}
        {items.map((concept, i) => {
          if (i >= nodes.length) return null;
          const pos = nodes[i];
          const t = TIERS[pos.tier];

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.15 + i * 0.13,
                duration: 0.45,
                ease: "easeOut",
              }}
              className="absolute flex flex-col items-center"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Glow pulse */}
              {t.glow > 0 && (
                <motion.div
                  className="absolute rounded-full bg-white/[0.04]"
                  style={{ width: t.glow, height: t.glow }}
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    delay: i * 0.6,
                  }}
                />
              )}

              {/* Dot */}
              <div
                className="rounded-full bg-white/30 mb-2 shrink-0 relative z-10"
                style={{ width: t.dot, height: t.dot }}
              />

              {/* Label */}
              <div
                className={`rounded-lg border backdrop-blur-sm ${t.pillClass}`}
              >
                <p
                  className={`text-center tracking-wider leading-tight line-clamp-2 ${t.textClass}`}
                  style={{ maxWidth: t.maxW }}
                >
                  {concept}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
