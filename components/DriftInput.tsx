"use client";

import { useState } from "react";

const WEIRDNESS_LEVELS = [
  { value: 0, label: "Nearby" },
  { value: 1, label: "Cross-domain" },
  { value: 2, label: "Deep strange" },
  { value: 3, label: "Beautifully unhinged" },
];

const DRIFT_MODES = [
  { value: null, label: "Auto" },
  { value: "scientific", label: "Scientific" },
  { value: "historical", label: "Historical" },
  { value: "cultural", label: "Cultural" },
  { value: "startup ideas", label: "Startup Ideas" },
  { value: "contrarian", label: "Contrarian" },
];

interface DriftInputProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
  weirdness: number;
  onWeirdnessChange: (weirdness: number) => void;
  mode: string | null;
  onModeChange: (mode: string | null) => void;
}

export default function DriftInput({
  onSubmit,
  isLoading,
  weirdness,
  onWeirdnessChange,
  mode,
  onModeChange,
}: DriftInputProps) {
  const [topic, setTopic] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onSubmit(topic.trim());
      setTopic("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What are you into?"
          disabled={isLoading}
          className="w-full px-6 py-4.5 text-base bg-white/[0.04] border border-white/[0.08] rounded-xl
                     text-white placeholder-white/25 outline-none
                     focus:border-white/[0.16] input-glow
                     transition-all duration-500 disabled:opacity-40
                     tracking-wide"
          autoFocus
        />
        <button
          type="submit"
          aria-disabled={!topic.trim() || isLoading}
          className={`absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5
                     bg-white text-black rounded-lg
                     text-sm font-medium tracking-wide transition-all duration-300
                     ${!topic.trim() || isLoading ? "opacity-20 pointer-events-none" : "hover:bg-white/90"}`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-3.5 h-3.5 border-[1.5px] border-black/20 border-t-black rounded-full animate-spin" />
              <span>Drifting</span>
            </span>
          ) : (
            "Drift"
          )}
        </button>
      </div>

      {/* Weirdness Slider */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <p className="text-[10px] text-white/15 uppercase tracking-[0.25em] font-medium">
          Weirdness
        </p>
        <div className="flex bg-white/[0.03] rounded-lg border border-white/[0.06] overflow-hidden">
          {WEIRDNESS_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => onWeirdnessChange(level.value)}
              disabled={isLoading}
              className={`px-4 py-2 text-xs transition-all duration-300 tracking-wide
                ${
                  weirdness === level.value
                    ? "bg-white/[0.1] text-white/70"
                    : "text-white/25 hover:text-white/40 hover:bg-white/[0.04]"
                }
                disabled:opacity-40`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Selector */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <p className="text-[10px] text-white/15 uppercase tracking-[0.25em] font-medium">
          Drift Mode
        </p>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {DRIFT_MODES.map((m) => (
            <button
              key={m.label}
              type="button"
              onClick={() => onModeChange(m.value)}
              disabled={isLoading}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-300 tracking-wider
                ${
                  mode === m.value
                    ? "border-white/[0.15] bg-white/[0.08] text-white/60"
                    : "border-white/[0.05] bg-white/[0.02] text-white/25 hover:bg-white/[0.05] hover:text-white/40"
                }
                disabled:opacity-40`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

    </form>
  );
}
