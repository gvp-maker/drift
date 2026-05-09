"use client";

import { motion } from "framer-motion";

interface BridgeLabelProps {
  text: string;
  index: number;
  fromColor: string;
  toColor: string;
}

export default function BridgeLabel({
  text,
}: BridgeLabelProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="relative py-6 flex flex-col items-center"
    >
      {/* Thin connecting line */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px">
        <motion.div
          className="w-full h-full origin-top bg-gradient-to-b from-white/[0.06] to-white/[0.04]"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Small dot */}
      <motion.div
        className="relative z-10 w-1.5 h-1.5 rounded-full bg-white/20"
        animate={{
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Bridge text */}
      <motion.p
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="relative z-10 mt-3 text-[11px] text-center max-w-xs leading-relaxed
                   text-white/25 tracking-wide"
      >
        {text}
      </motion.p>
    </motion.div>
  );
}
