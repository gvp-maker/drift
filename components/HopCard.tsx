"use client";

import { motion } from "framer-motion";

interface RelatedArticle {
  title: string;
  url: string;
  domain: string;
}

interface HopCardProps {
  title: string;
  highlight: string;
  domain: string;
  url: string;
  category: string;
  favicon: string;
  related: RelatedArticle[];
  index: number;
  color: string;
  isAnchor?: boolean;
  scores?: { surprise: number; bridge: number; quality: number };
  onBranch?: () => void;
}

export default function HopCard({
  title,
  highlight,
  domain,
  url,
  category,
  favicon,
  related,
  index,
  color,
  isAnchor,
  scores,
  onBranch,
}: HopCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="w-full"
    >
      {/* Main card */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden rounded-xl border border-white/[0.06]
                   bg-white/[0.02] backdrop-blur-md
                   transition-all duration-500 hover:border-white/[0.12]
                   hover:bg-white/[0.04] group"
      >
        {/* Thin accent line at top */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-20"
          style={{
            background: `linear-gradient(to right, transparent, ${color}, transparent)`,
          }}
        />

        <div className="relative p-6">
          {/* Header row */}
          <div className="flex items-start gap-4 mb-4">
            {/* Favicon */}
            <div className="shrink-0 w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center overflow-hidden border border-white/[0.04]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={favicon}
                alt=""
                width={20}
                height={20}
                className="w-5 h-5 opacity-60"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-white/90 font-medium leading-snug line-clamp-2 group-hover:text-white transition-colors duration-300 text-[15px]">
                {title}
              </h3>
              <div className="flex items-center gap-2.5 mt-1.5">
                <span className="text-[11px] text-white/20 font-mono truncate">
                  {domain}
                </span>
                <span className="text-white/10">&middot;</span>
                <span className="text-[11px] text-white/25 uppercase tracking-wider">
                  {category}
                </span>
              </div>
            </div>

            {/* Hop number */}
            <div className="shrink-0 w-7 h-7 rounded-full border border-white/[0.08] flex items-center justify-center text-[11px] font-medium text-white/30">
              {isAnchor ? "O" : index}
            </div>
          </div>

          {/* Highlight text */}
          <p className="text-sm text-white/35 leading-relaxed line-clamp-3">
            {highlight}
          </p>

          {/* Serendipity scores */}
          {scores && !isAnchor && (
            <div className="mt-3 flex items-center gap-3 text-[10px] text-white/20 tracking-wider font-mono">
              <span>S {scores.surprise}</span>
              <span className="text-white/10">&middot;</span>
              <span>B {scores.bridge}</span>
              <span className="text-white/10">&middot;</span>
              <span>Q {scores.quality}</span>
            </div>
          )}
        </div>
      </a>

      {/* Branch button */}
      {onBranch && !isAnchor && (
        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          onClick={onBranch}
          className="mt-2 text-[11px] text-white/15 hover:text-white/40 transition-colors duration-300 tracking-wider"
        >
          Drift from here &rarr;
        </motion.button>
      )}

      {/* Related articles */}
      {related.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          whileInView={{ opacity: 1, height: "auto" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-2 flex gap-1.5 overflow-x-auto pb-1 px-0.5"
        >
          {related.map((article, i) => (
            <a
              key={i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg
                         bg-white/[0.02] border border-white/[0.04]
                         hover:bg-white/[0.05] hover:border-white/[0.08]
                         transition-all duration-300 max-w-[220px] group/related"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://www.google.com/s2/favicons?domain=${article.domain}&sz=32`}
                alt=""
                width={12}
                height={12}
                className="w-3 h-3 shrink-0 opacity-30 group-hover/related:opacity-50 transition-opacity duration-300"
              />
              <span className="text-[11px] text-white/20 truncate group-hover/related:text-white/40 transition-colors duration-300">
                {article.title}
              </span>
            </a>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
