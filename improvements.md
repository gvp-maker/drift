# Drift Improvement Ideas

## Current Prototype Snapshot

Drift already has a strong hackathon demo spine:

- User enters an interest.
- The app extracts abstract transferable concepts.
- Exa searches across contrasting content categories.
- The UI presents a 3-hop drift path.
- Each hop includes source cards, related links, and a narrated conceptual bridge.

The strongest opportunity is to make the drift feel less random and more intentionally controllable. Right now the product is compelling when the path lands well, but judges will understand it faster if the app exposes the mechanics of serendipity.

## Highest-Impact Hackathon Features

### 1. Weirdness Slider

Add a control that lets users tune how far the drift should travel from the original topic.

Example levels:

- Nearby
- Cross-domain
- Deep strange
- Beautifully unhinged

This could influence:

- How abstract the extracted concepts are.
- How aggressively categories differ from the source domain.
- Whether results are selected for relevance, surprise, or obscurity.
- How far each hop is allowed to move from the previous one.

Why it stands out:

Judges immediately understand that Drift is not just random semantic search. It is controlled serendipity.

Likely files:

- `components/DriftInput.tsx`
- `app/page.tsx`
- `app/api/drift/route.ts`
- `lib/drift-algorithm.ts`

### 2. Drift Modes

Let users choose the kind of connection they want the system to pursue.

Useful modes:

- Scientific
- Historical
- Cultural
- Design
- Contrarian
- Startup Ideas

Example:

The same input, `sourdough baking`, could drift into:

- microbiology in Scientific mode
- ancient grain trade in Historical mode
- ritual and domestic culture in Cultural mode
- fermentation-inspired product systems in Startup Ideas mode

Why it stands out:

It makes the same starting point produce meaningfully different journeys, which is excellent for live demos.

Likely files:

- `components/DriftInput.tsx`
- `lib/llm.ts`
- `lib/drift-algorithm.ts`

### 3. Branch From Any Hop

Each hop card should include a small action to continue drifting from that result.

Possible labels:

- Drift from here
- Follow this thread
- Go deeper

Why it stands out:

The current app creates a single path. Branching turns it into an exploratory curiosity interface. Users can steer the journey without needing to type a new search.

Likely files:

- `components/HopCard.tsx`
- `components/DriftPath.tsx`
- `app/page.tsx`

### 4. Serendipity Score

Add simple per-hop scoring so the app can explain why a result was selected.

Possible dimensions:

- Surprise
- Bridge strength
- Source quality
- Distance from origin

Example display:

`Surprise 84 · Bridge 91 · Source 76`

Why it stands out:

It gives Drift a visible decision model. Even if the first version uses LLM-generated scores, it makes the product feel more deliberate and defensible.

Likely files:

- `lib/llm.ts`
- `lib/drift-algorithm.ts`
- `components/HopCard.tsx`

### 5. Final Treasure Card

At the end of the drift path, add a summary card that explains the whole journey.

Possible fields:

- You started with
- You ended at
- The hidden pattern was
- Why this is worth opening
- Continue drifting

Why it stands out:

It gives the demo a satisfying ending. Instead of stopping after Hop 3, the app reveals the meaning of the path.

Likely files:

- `components/DriftPath.tsx`
- `lib/llm.ts`
- `lib/drift-algorithm.ts`

## Product Positioning

The clearest way to pitch Drift:

> Google finds what you asked for. Drift finds what your curiosity is adjacent to, before you knew the adjacency existed.

The product should feel like a curiosity engine, not a normal search engine. A normal search engine converges on the best answer. Drift should expose the hidden bridge from a familiar interest to an unfamiliar but fascinating destination.

## Suggested Build Priority

### Must Build

1. Weirdness slider
2. Drift modes
3. Branch from any hop

These three features make the prototype feel interactive, intentional, and memorable.

### Nice To Build

4. Serendipity score
5. Final treasure card
6. Shareable drift path URL
7. Saved curiosity graph

### Later

8. User taste memory
9. Collaborative drift rooms
10. Browser extension: "drift from this page"

## Implementation Notes

### Make Drift Less Random

The current algorithm uses random category and result selection. That helps create variety, but it can make the path feel arbitrary.

Good next step:

- Generate candidate categories.
- Search multiple candidate paths.
- Ask the LLM to rank candidates by surprise, bridge strength, and source quality.
- Return the best path.

This would make the output feel more curated while preserving the magic.

### Use Structured LLM Output

The current concept extraction asks the model for a JSON array and then manually parses the response. For a live demo, structured output would be more reliable.

Useful structured fields:

- extracted concepts
- selected drift mode
- bridge explanation
- surprise score
- bridge strength score
- final treasure summary
- suggested next query

### Make Exa More Visible

Since this is likely for an AI/search hackathon, make the Exa usage obvious in the product:

- Show category hops: `Origin -> Research -> Blog -> Company`
- Show source domains clearly.
- Show related Exa results under each hop.
- Add a small "powered by Exa semantic search" cue near the path, not only in the footer.

## Demo Script

1. Start with a familiar input like `sourdough baking`.
2. Set Weirdness to `Deep strange`.
3. Choose `Scientific` mode.
4. Generate a drift path.
5. Explain that Drift extracts abstract concepts rather than keywords.
6. Show the category jumps and bridge explanations.
7. Branch from an interesting hop.
8. End on the treasure card.

This demonstrates the core thesis in under two minutes: Drift helps people discover things they would never have known to search for.
