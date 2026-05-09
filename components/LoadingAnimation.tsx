"use client";

import { motion } from "framer-motion";

const MESSAGES = [
  "Extracting abstract concepts...",
  "Teleporting across domains...",
  "Mapping conceptual wormholes...",
  "Discovering unexpected connections...",
];

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center gap-10 mt-20">
      {/* Expanding rings */}
      <div className="relative w-24 h-24">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-white/20"
            initial={{ scale: 0.6, opacity: 0.6 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "easeOut",
            }}
          />
        ))}
        {/* Center dot */}
        <motion.div
          className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-white/50"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Cycling messages */}
      <div className="h-7 overflow-hidden">
        <motion.div
          animate={{ y: [0, -28, -56, -84, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        >
          {MESSAGES.map((msg, i) => (
            <p
              key={i}
              className="h-7 text-sm text-white/40 text-center tracking-wider"
            >
              {msg}
            </p>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
