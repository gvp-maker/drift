# Drift

> Every search engine converges. This one diverges.

Drift is a curiosity engine that finds what your curiosity is adjacent to — before you knew the adjacency existed. Enter any topic and Drift builds a chain of surprising cross-domain connections, revealing hidden patterns between seemingly unrelated fields.

Built for the AI Engineer Hackathon 2026.

## How It Works

1. **Enter a topic** — anything you're curious about
2. **Drift extracts abstract concepts** — not keywords, but transferable structural patterns (e.g., from "sourdough baking" it might extract "iterative feedback between simple agents creating emergent complexity")
3. **Exa semantic search finds cross-domain connections** — jumping across content categories like research papers, blogs, companies, and news
4. **AI narrates each bridge** — explaining the surprising conceptual link between each hop
5. **A treasure card reveals the hidden pattern** — summarizing the deeper thread connecting the entire journey

## Features

### Weirdness Slider

Control how far Drift travels from your starting topic:

- **Nearby** — practical, closely related connections
- **Cross-domain** — abstract parallels across different fields
- **Deep strange** — hidden structural patterns expressed without domain-specific language
- **Beautifully unhinged** — wildly unexpected, "wait... that IS the same thing" connections

### Drift Modes

Steer the kind of connections the system pursues:

- **Auto** — let the algorithm decide
- **Scientific** — mechanisms and natural laws
- **Historical** — parallels and cycles across time
- **Cultural** — social patterns and cultural resonance
- **Startup Ideas** — market patterns and unmet needs
- **Contrarian** — assumptions that could be inverted

### Serendipity Scores

Each hop is scored on three dimensions:

- **Surprise** — how unexpected the connection is
- **Bridge** — how strong the conceptual link is
- **Quality** — how credible and interesting the source is

### Branch From Any Hop

Click any result to start a new drift from that point, turning a linear path into an exploratory curiosity graph.

### Keep Drifting

Extend your path with more hops without losing your existing journey.

## Tech Stack

- **Next.js 16** — React framework
- **Exa AI** — semantic search across the web
- **OpenAI (GPT-4o-mini)** — concept extraction, bridge narration, scoring
- **Framer Motion** — animations
- **Tailwind CSS 4** — styling

## Getting Started

### Prerequisites

- Node.js 18+
- An [Exa AI](https://exa.ai) API key
- An [OpenAI](https://platform.openai.com) API key

### Setup

```bash
git clone git@github.com:gvp-maker/drift.git
cd drift
npm install
```

Create a `.env.local` file:

```
EXA_API_KEY=your_exa_api_key
OPENAI_API_KEY=your_openai_api_key
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start drifting.
