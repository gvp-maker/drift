"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DriftInput from "@/components/DriftInput";
import DriftPath from "@/components/DriftPath";
import ParticleBackground from "@/components/ParticleBackground";
import LoadingAnimation from "@/components/LoadingAnimation";

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
}

export default function Home() {
  const [driftData, setDriftData] = useState<DriftPathData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [animationOffset, setAnimationOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>("");
  const [weirdness, setWeirdness] = useState(1);
  const [mode, setMode] = useState<string | null>(null);

  const handleDrift = async (topic: string) => {
    setIsLoading(true);
    setIsExtending(false);
    setAnimationOffset(0);
    setError(null);
    setDriftData(null);
    setCurrentTopic(topic);

    try {
      const res = await fetch("/api/drift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, weirdness, mode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setDriftData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setDriftData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDriftAgain = () => {
    if (currentTopic) {
      handleDrift(currentTopic);
    }
  };

  const handleBranchFromHop = (topic: string) => {
    handleDrift(topic);
  };

  const handleKeepDrifting = async () => {
    if (!driftData || isLoading) return;

    const allHops = [driftData.anchor, ...driftData.hops];
    const lastHop = allHops[allHops.length - 1];
    const seenUrls = allHops.map((h) => h.url);

    setIsExtending(true);
    setIsLoading(true);
    setAnimationOffset(allHops.length);

    try {
      const res = await fetch("/api/drift/extend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastTitle: lastHop.title,
          lastHighlight: lastHop.highlight,
          seenUrls,
          weirdness,
          mode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (data.hops.length > 0) {
        setDriftData((prev) =>
          prev
            ? {
                ...prev,
                hops: [...prev.hops, ...data.hops],
                bridges: [...prev.bridges, ...data.bridges],
              }
            : null
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
      setIsExtending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <ParticleBackground />

      {/* Nebula gradient */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 20% 80%, rgba(40, 30, 80, 0.5) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 80% 20%, rgba(20, 40, 80, 0.4) 0%, transparent 45%), " +
            "radial-gradient(ellipse at 50% 50%, rgba(15, 15, 40, 0.3) 0%, transparent 60%)",
        }}
      />
      {/* Edge vignette */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.6)_100%)] pointer-events-none z-[1]" />

      <main className="relative z-10 flex flex-col items-center px-6 py-16 min-h-screen">
        {/* Header */}
        <div className="text-center mb-16 mt-12">
          <h1 className="text-7xl sm:text-8xl font-bold tracking-[-0.06em] mb-6">
            {"drift".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 + i * 0.12,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="inline-block bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent"
              >
                {char}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="text-white/30 text-base max-w-md mx-auto leading-relaxed tracking-wide"
          >
            Every search engine converges.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-white/50 text-base font-medium mt-1 tracking-wide"
          >
            This one diverges.
          </motion.p>
        </div>

        {/* Input */}
        <DriftInput
          onSubmit={handleDrift}
          isLoading={isLoading}
          weirdness={weirdness}
          onWeirdnessChange={setWeirdness}
          mode={mode}
          onModeChange={setMode}
        />

        {/* Loading */}
        {isLoading && !isExtending && !driftData && <LoadingAnimation />}

        {/* Error */}
        {error && (
          <div className="mt-10 px-6 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white/50 text-sm max-w-md text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {driftData && (
          <div className="mt-20 w-full max-w-2xl">
            <DriftPath
              data={driftData}
              onDriftAgain={handleDriftAgain}
              onBranchFromHop={handleBranchFromHop}
              onKeepDrifting={handleKeepDrifting}
              isLoading={isLoading}
              isExtending={isExtending}
              animationOffset={animationOffset}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-auto pt-20 pb-8 text-center">
          <p className="text-white/[0.12] text-xs tracking-wider">
            Powered by{" "}
            <a
              href="https://exa.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/20 hover:text-white/40 transition-colors duration-300"
            >
              Exa AI
            </a>
            {" "}&middot;{" "}
            AI Engineer Hackathon 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
