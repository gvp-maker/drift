import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const STRONG_MODEL = "gpt-5.5";
const FAST_MODEL = "gpt-4o-mini";

const WEIRDNESS_TEMPS = [0.5, 0.9, 1.1, 1.2];

const MODE_CONCEPT_HINTS: Record<string, string> = {
  scientific: "Focus on scientific principles and natural laws.",
  historical: "Focus on historical parallels and cycles.",
  cultural: "Focus on cultural patterns and social dynamics.",
  "startup ideas": "Focus on market patterns and unmet needs.",
  contrarian: "Focus on assumptions that could be inverted.",
};

const MODE_NARRATION_HINTS: Record<string, string> = {
  scientific:
    'Frame the connection in terms of scientific mechanisms, e.g. "the same mechanism..."',
  historical:
    'Frame the connection as a historical parallel, e.g. "just as in..."',
  cultural:
    'Frame the connection in terms of cultural resonance, e.g. "the cultural echo..."',
  "startup ideas":
    'Frame the connection as a market insight, e.g. "this gap in the market..."',
  contrarian:
    'Frame the connection as a contrarian insight, e.g. "the conventional view ignores..."',
};

function getConceptPrompt(weirdness: number, modeHint: string): string {
  if (weirdness <= 0) {
    return `You extract practical, closely related concepts from a topic.
Given a topic and some content about it, identify 3-5 practical principles or patterns that appear in closely related fields.

Focus on direct, useful parallels.
For example, from "competitive chess": "pattern recognition under time pressure", "planning several moves ahead", "resource management".${modeHint}

Return ONLY a JSON array of strings, nothing else.`;
  }

  if (weirdness === 1) {
    return `You extract abstract, transferable concepts from a topic.
Given a topic and some content about it, identify 3-5 abstract principles, patterns, or concepts that ALSO appear in completely unrelated fields.

Focus on structural/conceptual parallels, not surface-level connections.
For example, from "competitive chess": "strategic sacrifice for long-term gain", "positional advantage through constraint", "emergent complexity from simple rules".${modeHint}

Return ONLY a JSON array of strings, nothing else.`;
  }

  if (weirdness === 2) {
    return `You extract deeply hidden structural patterns from a topic, expressed in domain-neutral language.
Given a topic and content, identify 3-5 abstract principles that secretly govern this topic — but express each concept WITHOUT using terminology from the original domain.

The goal: someone reading these concepts should NOT be able to guess the original topic. Express pure structural patterns that could describe many unrelated fields.

Examples of BAD vs GOOD:
From "sourdough baking":
- BAD: "fermentation as biological computation" (still sounds like baking/biology)
- GOOD: "iterative feedback between simple agents creating emergent complexity"

From "competitive chess":
- BAD: "strategic sacrifice for positional advantage" (still sounds like strategy games)
- GOOD: "voluntarily reducing your own options to constrain an opponent's future decision space"${modeHint}

Return ONLY a JSON array of strings, nothing else.`;
  }

  return `You find the most wildly unexpected conceptual bridges between a topic and completely unrelated domains. Express them as pure abstract principles with ZERO domain-specific vocabulary.

Given a topic and content, identify 3-5 provocative, counter-intuitive structural patterns. Each concept MUST:
1. Use ZERO vocabulary from the original domain
2. Sound like it could describe something in a completely different field
3. Be the kind of insight that makes someone say "wait... that IS the same thing"

Push for maximum creative distance. The best concepts feel like revelations.

Examples of BAD vs GOOD:
From "sourdough baking":
- BAD: "cultures need feeding schedules" (obvious, baking-adjacent)
- GOOD: "a population of competing agents reaches equilibrium only through deliberate neglect by the overseer"

From "origami":
- BAD: "geometric folding creates structure" (still sounds like paper craft)
- GOOD: "irreversible topological transformations encode memory into a flat medium"

From "hip hop production":
- BAD: "sampling creates new music from old" (still sounds like music)
- GOOD: "context collapse turns a fragment's meaning into its opposite when the surrounding frame shifts"${modeHint}

Return ONLY a JSON array of strings, nothing else.`;
}

export async function extractConcepts(
  topic: string,
  contentSnippet: string,
  weirdness: number = 1,
  mode?: string
): Promise<string[]> {
  const modeHint =
    mode && MODE_CONCEPT_HINTS[mode]
      ? `\n${MODE_CONCEPT_HINTS[mode]}`
      : "";

  const response = await openai.chat.completions.create({
    model: STRONG_MODEL,
    messages: [
      {
        role: "system",
        content: getConceptPrompt(weirdness, modeHint),
      },
      {
        role: "user",
        content: `Topic: "${topic}"\n\nContent:\n${contentSnippet.slice(0, 2000)}`,
      },
    ],
  });

  const raw = response.choices[0].message.content ?? "[]";
  try {
    return JSON.parse(raw);
  } catch {
    const matches = raw.match(/"([^"]+)"/g);
    return matches ? matches.map((m) => m.replace(/"/g, "")) : [topic];
  }
}

export async function generateSearchQuery(
  concepts: string[],
  avoidTopics: string[],
  weirdness: number
): Promise<string> {
  if (weirdness <= 1) {
    return concepts.slice(0, 3).join(", ");
  }

  const response = await openai.chat.completions.create({
    model: STRONG_MODEL,
    max_tokens: 40,
    messages: [
      {
        role: "system",
        content:
          weirdness === 2
            ? `Generate a search query to find content in a COMPLETELY different field that shares deep structural parallels with the given concepts. The query must NOT use any words from the original topic. Write a natural search phrase, not a keyword list. Return ONLY the query.`
            : `Generate the most surprising, unexpected search query that connects the given concepts to a wildly different domain. Be creative and specific — the query should find content that creates a "what?!" reaction. Do NOT use any words related to the original topics. Write a natural search phrase. Return ONLY the query.`,
      },
      {
        role: "user",
        content: `Concepts: ${concepts.join("; ")}\nDo NOT reference anything related to: ${avoidTopics.join(", ")}`,
      },
    ],
  });

  return (
    response.choices[0].message.content?.trim() ??
    concepts.slice(0, 2).join(", ")
  );
}

export async function narrateConnection(
  fromTitle: string,
  fromHighlight: string,
  toTitle: string,
  toHighlight: string,
  mode?: string
): Promise<string> {
  const modeHint =
    mode && MODE_NARRATION_HINTS[mode]
      ? `\n${MODE_NARRATION_HINTS[mode]}`
      : "";

  const response = await openai.chat.completions.create({
    model: FAST_MODEL,
    temperature: 0.7,
    max_tokens: 100,
    messages: [
      {
        role: "system",
        content: `You write a single, punchy sentence explaining the surprising conceptual connection between two pieces of content from different domains.
Be specific and insightful. Start with a lowercase letter. No period at the end.${modeHint}
Example: "the same feedback loops that make ant colonies efficient also power modern load balancers"`,
      },
      {
        role: "user",
        content: `FROM: "${fromTitle}"\n${fromHighlight}\n\nTO: "${toTitle}"\n${toHighlight}`,
      },
    ],
  });

  return response.choices[0].message.content ?? "an unexpected connection";
}

export async function classifyDomain(topic: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: FAST_MODEL,
    temperature: 0,
    max_tokens: 30,
    messages: [
      {
        role: "system",
        content: `Classify the user's topic into one broad domain. Return ONLY one word from: technology, science, art, business, sports, cooking, music, philosophy, history, politics, health, nature, education, gaming, literature, mathematics, engineering, psychology.`,
      },
      { role: "user", content: topic },
    ],
  });

  return (
    (response.choices[0].message.content ?? "technology").toLowerCase().trim()
  );
}

export async function scoreHop(
  fromTitle: string,
  fromHighlight: string,
  toTitle: string,
  toHighlight: string
): Promise<{ surprise: number; bridge: number; quality: number }> {
  const response = await openai.chat.completions.create({
    model: FAST_MODEL,
    temperature: 0,
    max_tokens: 60,
    messages: [
      {
        role: "system",
        content: `Score the conceptual connection between two pieces of content. Return ONLY a JSON object with three numbers (0-100):
- "surprise": how unexpected is this connection?
- "bridge": how strong is the conceptual link?
- "quality": how credible/interesting is the destination source?
Example: {"surprise":84,"bridge":91,"quality":76}`,
      },
      {
        role: "user",
        content: `FROM: "${fromTitle}"\n${fromHighlight}\n\nTO: "${toTitle}"\n${toHighlight}`,
      },
    ],
  });

  const raw =
    response.choices[0].message.content ??
    '{"surprise":50,"bridge":50,"quality":50}';
  try {
    return JSON.parse(raw);
  } catch {
    return { surprise: 50, bridge: 50, quality: 50 };
  }
}

