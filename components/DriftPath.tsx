"use client";

import { motion } from "framer-motion";
import HopCard from "./HopCard";
import BridgeLabel from "./BridgeLabel";
import TreasureCard from "./TreasureCard";
import ConnectionGraph from "./ConnectionGraph";

interface RelatedArticle {
  title: string;
  url: string;
  domain: string;
}

interface HopResult {
  title: string;
  url: string;
  highlight: string;
  domain: string;
  category: string;
  favicon: string;
  related: RelatedArticle[];
  scores?: { surprise: number; bridge: number; quality: number };
}

interface DriftPathData {
  anchor: HopResult;
  hops: HopResult[];
  bridges: string[];
  concepts: string[];
  treasure?: { summary: string; hiddenPattern: string; whyOpen: string };
}

interface DriftPathProps {
  data: DriftPathData;
  onDriftAgain: () => void;
  onBranchFromHop: (topic: string) => void;
  onKeepDrifting: () => void;
  isLoading: boolean;
  isExtending: boolean;
  animationOffset: number;
}

const HOP_COLORS = ["#94a3b8", "#78716c", "#a1a1aa", "#9ca3af", "#a78bfa", "#6ee7b7", "#fbbf24", "#f87171"];

export default function DriftPath({
  data,
  onDriftAgain,
  onBranchFromHop,
  onKeepDrifting,
  isLoading,
  isExtending,
}: DriftPathProps) {
  const allHops = [data.anchor, ...data.hops];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drift path with connecting line */}
      <div className="relative">
        {/* Vertical connecting line */}
        <motion.div
          className="absolute left-[17px] top-0 w-px bg-gradient-to-b from-white/[0.08] via-white/[0.05] to-white/[0.02]"
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 2, ease: "easeOut" }}
        />

        <div className="space-y-0">
          {allHops.map((hop, i) => (
            <div key={`${hop.url}-${i}`}>
              {/* Hop label */}
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3.5 mb-3"
              >
                {/* Node dot on the line */}
                <motion.div
                  className="relative z-10 w-[35px] h-[35px] rounded-full flex items-center justify-center shrink-0
                             border border-white/[0.08] bg-white/[0.03]"
                  animate={{
                    borderColor: [
                      "rgba(255,255,255,0.08)",
                      "rgba(255,255,255,0.14)",
                      "rgba(255,255,255,0.08)",
                    ],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                >
                  <span className="text-[11px] font-medium text-white/35">
                    {i === 0 ? "O" : i}
                  </span>
                </motion.div>

                <div>
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/25">
                    {i === 0 ? "Origin" : `Hop ${i}`}
                  </span>
                  {i > 0 && (
                    <span className="ml-2.5 text-[10px] text-white/12">
                      via {hop.category}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Card */}
              <div className="ml-[47px]">
                <HopCard
                  title={hop.title}
                  highlight={hop.highlight}
                  domain={hop.domain}
                  url={hop.url}
                  category={hop.category}
                  favicon={hop.favicon}
                  related={hop.related}
                  index={i}
                  color={HOP_COLORS[i % HOP_COLORS.length]}
                  isAnchor={i === 0}
                  scores={hop.scores}
                  onBranch={
                    i > 0 ? () => onBranchFromHop(hop.title) : undefined
                  }
                />
              </div>

              {/* Bridge */}
              {i < data.bridges.length && (
                <div className="ml-[47px]">
                  <BridgeLabel
                    text={data.bridges[i]}
                    index={i}
                    fromColor={HOP_COLORS[i % HOP_COLORS.length]}
                    toColor={HOP_COLORS[(i + 1) % HOP_COLORS.length]}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Treasure Card */}
      {data.treasure && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="mt-12 ml-[47px]"
        >
          <TreasureCard
            treasure={data.treasure}
            startTopic={data.anchor.title}
            endTopic={
              data.hops[data.hops.length - 1]?.title ?? data.anchor.title
            }
          />
        </motion.div>
      )}

      {/* Connection Graph */}
      <div className="ml-[47px]">
        <ConnectionGraph
          hops={allHops.map((h) => ({ title: h.title }))}
          bridges={data.bridges}
        />
      </div>

      {/* Bottom Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-16 flex flex-col items-center gap-4"
      >
        {/* Keep Drifting - Primary */}
        <button
          onClick={onKeepDrifting}
          disabled={isLoading}
          className="group relative px-8 py-3.5 rounded-xl font-medium text-sm
                     overflow-hidden transition-all duration-500
                     disabled:opacity-20 border border-white/[0.08]
                     hover:border-white/[0.16] hover:bg-white/[0.03]
                     tracking-wide"
        >
          <span className="relative text-white/40 group-hover:text-white/70 transition-colors duration-500">
            {isExtending ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-3.5 h-3.5 border-[1.5px] border-white/20 border-t-white/60 rounded-full animate-spin" />
                Drifting deeper...
              </span>
            ) : (
              "Keep Drifting →"
            )}
          </span>
        </button>

        {/* Drift Again - Secondary */}
        <button
          onClick={onDriftAgain}
          disabled={isLoading}
          className="text-[11px] text-white/15 hover:text-white/30 transition-colors duration-300
                     tracking-wider disabled:opacity-40"
        >
          Start over &middot; same origin, different path
        </button>
      </motion.div>
    </div>
  );
}
