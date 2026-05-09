"use client";

interface TreasureCardProps {
  treasure: {
    summary: string;
    hiddenPattern: string;
    whyOpen: string;
  };
  startTopic: string;
  endTopic: string;
}

export default function TreasureCard({
  treasure,
  startTopic,
  endTopic,
}: TreasureCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md">
      {/* Top glow accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/[0.04] blur-xl" />

      <div className="relative p-6 space-y-4">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-medium">
          The Hidden Pattern
        </p>

        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-white/15 uppercase tracking-wider mb-1">
              You started with
            </p>
            <p className="text-sm text-white/50">{startTopic}</p>
          </div>

          <div>
            <p className="text-[10px] text-white/15 uppercase tracking-wider mb-1">
              You ended at
            </p>
            <p className="text-sm text-white/50">{endTopic}</p>
          </div>

          <div className="pt-2 border-t border-white/[0.05]">
            <p className="text-[10px] text-white/15 uppercase tracking-wider mb-1">
              The connection
            </p>
            <p className="text-sm text-white/40 leading-relaxed">
              {treasure.hiddenPattern}
            </p>
          </div>

          <div>
            <p className="text-[10px] text-white/15 uppercase tracking-wider mb-1">
              Why this matters
            </p>
            <p className="text-sm text-white/35 leading-relaxed italic">
              {treasure.whyOpen}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
