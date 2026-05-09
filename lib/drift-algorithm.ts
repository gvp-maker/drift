import { searchTopic, CATEGORIES } from "./exa";
import {
  extractConcepts,
  generateSearchQuery,
  narrateConnection,
  classifyDomain,
  scoreHop,
} from "./llm";

export interface RelatedArticle {
  title: string;
  url: string;
  domain: string;
}

export interface HopResult {
  title: string;
  url: string;
  highlight: string;
  domain: string;
  category: string;
  related: RelatedArticle[];
  favicon: string;
  scores?: { surprise: number; bridge: number; quality: number };
}

export interface DriftPath {
  anchor: HopResult;
  hops: HopResult[];
  bridges: string[];
  concepts: string[];
}

type Category =
  | "company"
  | "research paper"
  | "news"
  | "pdf"
  | "personal site"
  | "financial report"
  | "people";

const CATEGORY_LABELS: Record<string, string> = {
  company: "Business",
  "research paper": "Research",
  news: "News",
  pdf: "Document",
  "personal site": "Blog",
  "financial report": "Finance",
  people: "People",
};

const DOMAIN_TO_CONTRASTING_CATEGORIES: Record<string, Category[]> = {
  technology: ["personal site", "research paper", "news"],
  science: ["company", "personal site", "news"],
  art: ["research paper", "company", "news"],
  business: ["research paper", "personal site", "news"],
  sports: ["research paper", "company", "personal site"],
  cooking: ["research paper", "company", "news"],
  music: ["research paper", "company", "personal site"],
  philosophy: ["company", "news", "personal site"],
  history: ["company", "research paper", "personal site"],
  politics: ["research paper", "company", "personal site"],
  health: ["company", "personal site", "news"],
  nature: ["company", "research paper", "personal site"],
  education: ["company", "research paper", "news"],
  gaming: ["research paper", "company", "personal site"],
  literature: ["research paper", "company", "news"],
  mathematics: ["company", "personal site", "news"],
  engineering: ["personal site", "research paper", "news"],
  psychology: ["company", "personal site", "news"],
};

interface ModeConfig {
  preferredCategories: Category[];
}

const MODE_CONFIG: Record<string, ModeConfig> = {
  scientific: { preferredCategories: ["research paper", "pdf"] },
  historical: { preferredCategories: ["news", "personal site"] },
  cultural: { preferredCategories: ["personal site", "news"] },
  "startup ideas": { preferredCategories: ["company", "financial report"] },
  contrarian: { preferredCategories: ["personal site", "research paper"] },
};

function pickCategory(
  sourceDomain: string,
  usedCategories: Set<Category>,
  weirdness: number = 1,
  mode?: string
): Category {
  let pool: Category[];

  if (mode && MODE_CONFIG[mode]) {
    const preferred = MODE_CONFIG[mode].preferredCategories.filter(
      (c) => !usedCategories.has(c)
    );
    const rest = CATEGORIES.filter(
      (c) =>
        !usedCategories.has(c) &&
        !MODE_CONFIG[mode].preferredCategories.includes(c)
    );
    pool =
      preferred.length > 0
        ? preferred
        : rest.length > 0
          ? rest
          : [...CATEGORIES];
  } else if (weirdness === 0) {
    const domainCats =
      DOMAIN_TO_CONTRASTING_CATEGORIES[sourceDomain] ??
      DOMAIN_TO_CONTRASTING_CATEGORIES["technology"];
    pool = domainCats.filter((c) => !usedCategories.has(c));
    if (pool.length === 0)
      pool = CATEGORIES.filter((c) => !usedCategories.has(c));
    if (pool.length === 0) pool = [...CATEGORIES];
  } else if (weirdness >= 3) {
    pool = CATEGORIES.filter((c) => !usedCategories.has(c));
    if (pool.length === 0) pool = [...CATEGORIES];
  } else {
    const domainCats =
      DOMAIN_TO_CONTRASTING_CATEGORIES[sourceDomain] ??
      DOMAIN_TO_CONTRASTING_CATEGORIES["technology"];
    pool = domainCats.filter((c) => !usedCategories.has(c));
    if (pool.length === 0) {
      pool = CATEGORIES.filter((c) => !usedCategories.has(c));
      if (pool.length === 0) pool = [...CATEGORIES];
    }
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

function normalizeDomain(domain: string): string {
  const parts = domain.split(".");
  if (parts.length > 2) {
    const base = parts.slice(-2).join(".");
    const platformDomains = [
      "substack.com",
      "medium.com",
      "wordpress.com",
      "blogspot.com",
      "github.io",
    ];
    if (platformDomains.includes(base)) return base;
  }
  return domain;
}

function pickBestResult(
  results: Awaited<ReturnType<typeof searchTopic>>,
  avoidDomains: Set<string>,
  avoidUrls: Set<string>,
  weirdness: number = 1
) {
  const fresh = results.filter(
    (r) =>
      !avoidDomains.has(normalizeDomain(r.domain)) && !avoidUrls.has(r.url)
  );
  const candidates =
    fresh.length > 0 ? fresh : results.filter((r) => !avoidUrls.has(r.url));
  const pool = candidates.length > 0 ? candidates : results;

  if (pool.length === 0) return results[0];

  if (weirdness === 0) {
    return pool[0];
  } else if (weirdness === 1) {
    return pool[Math.floor(Math.random() * Math.min(3, pool.length))];
  } else if (weirdness === 2) {
    return pool[Math.floor(Math.random() * Math.min(5, pool.length))];
  } else {
    const start = Math.floor(pool.length / 2);
    const bottomHalf = pool.slice(start);
    return bottomHalf[Math.floor(Math.random() * bottomHalf.length)];
  }
}

function getRelated(
  results: Awaited<ReturnType<typeof searchTopic>>,
  mainUrl: string
): RelatedArticle[] {
  return results
    .filter((r) => r.url !== mainUrl)
    .slice(0, 3)
    .map((r) => ({ title: r.title, url: r.url, domain: r.domain }));
}

function toHop(
  result: {
    title: string;
    url: string;
    highlights: string[];
    domain: string;
  },
  category: string,
  related: RelatedArticle[]
): HopResult {
  const raw = result.highlights[0] ?? "";
  const cleaned = raw.replace(/\[\.\.\.?\]/g, "").replace(/\s+/g, " ").trim();
  return {
    title: result.title,
    url: result.url,
    highlight: cleaned.length > 250 ? cleaned.slice(0, 250) + "..." : cleaned,
    domain: result.domain,
    category: CATEGORY_LABELS[category] ?? category,
    related,
    favicon: `https://www.google.com/s2/favicons?domain=${result.domain}&sz=64`,
  };
}

export async function drift(
  topic: string,
  weirdness: number = 1,
  mode?: string,
  numHops: number = 5
): Promise<DriftPath> {
  const seenDomains = new Set<string>();
  const seenUrls = new Set<string>();
  const usedCategories = new Set<Category>();

  const anchorResults = await searchTopic(topic, { numResults: 8 });
  if (anchorResults.length === 0) {
    throw new Error("No results found for this topic. Try something else!");
  }
  const anchorResult = anchorResults[0];
  seenDomains.add(normalizeDomain(anchorResult.domain));
  seenUrls.add(anchorResult.url);
  const anchor = toHop(
    anchorResult,
    "origin",
    getRelated(anchorResults, anchorResult.url)
  );

  const [concepts, sourceDomain] = await Promise.all([
    extractConcepts(
      topic,
      anchorResult.text || anchorResult.highlights.join(" "),
      weirdness,
      mode
    ),
    classifyDomain(topic),
  ]);

  const hops: HopResult[] = [];
  const bridges: string[] = [];
  let currentConcepts = concepts;
  let prevHop = anchor;

  for (let i = 0; i < numHops; i++) {
    const cat = pickCategory(sourceDomain, usedCategories, weirdness, mode);
    usedCategories.add(cat);

    const conceptPool =
      weirdness >= 2 && i > 0
        ? [...currentConcepts.slice(0, 2), concepts[i % concepts.length]]
        : currentConcepts.slice(0, 3);

    const query = await generateSearchQuery(
      conceptPool,
      [topic, ...hops.map((h) => h.title)],
      weirdness
    );
    const results = await searchTopic(query, {
      category: cat,
      numResults: 8,
    });

    if (results.length === 0) break;

    const result = pickBestResult(results, seenDomains, seenUrls, weirdness);
    seenDomains.add(normalizeDomain(result.domain));
    seenUrls.add(result.url);
    const hop = toHop(result, cat, getRelated(results, result.url));
    hops.push(hop);

    const [bridge, nextConcepts] = await Promise.all([
      narrateConnection(
        prevHop.title,
        prevHop.highlight,
        hop.title,
        hop.highlight,
        mode
      ),
      i < numHops - 1
        ? extractConcepts(
            hop.title,
            result.text || result.highlights.join(" "),
            weirdness,
            mode
          )
        : Promise.resolve(currentConcepts),
    ]);

    bridges.push(bridge);
    currentConcepts = nextConcepts;
    prevHop = hop;
  }

  if (hops.length === 0) {
    throw new Error(
      "Couldn't find cross-domain connections. Try a different topic!"
    );
  }

  const allHops = [anchor, ...hops];
  const scorePromises = hops.map((hop, i) =>
    scoreHop(allHops[i].title, allHops[i].highlight, hop.title, hop.highlight)
  );

  const scores = await Promise.all(scorePromises);

  hops.forEach((hop, i) => {
    hop.scores = scores[i];
  });

  return { anchor, hops, bridges, concepts };
}

export async function extendDrift(
  lastTitle: string,
  lastHighlight: string,
  seenUrls: string[],
  weirdness: number = 1,
  mode?: string,
  numHops: number = 3
): Promise<{ hops: HopResult[]; bridges: string[] }> {
  const seenUrlSet = new Set(seenUrls);
  const seenDomains = new Set<string>();
  for (const url of seenUrls) {
    try {
      seenDomains.add(new URL(url).hostname);
    } catch {}
  }
  const usedCategories = new Set<Category>();

  const [concepts, sourceDomain] = await Promise.all([
    extractConcepts(lastTitle, lastHighlight, weirdness, mode),
    classifyDomain(lastTitle),
  ]);

  const hops: HopResult[] = [];
  const bridges: string[] = [];
  let currentConcepts = concepts;
  let prevTitle = lastTitle;
  let prevHighlight = lastHighlight;

  for (let i = 0; i < numHops; i++) {
    const cat = pickCategory(sourceDomain, usedCategories, weirdness, mode);
    usedCategories.add(cat);

    const conceptPool =
      weirdness >= 2 && i > 0
        ? [...currentConcepts.slice(0, 2), concepts[i % concepts.length]]
        : currentConcepts.slice(0, 3);

    const query = await generateSearchQuery(
      conceptPool,
      [lastTitle, ...hops.map((h) => h.title)],
      weirdness
    );
    const results = await searchTopic(query, {
      category: cat,
      numResults: 8,
    });

    if (results.length === 0) break;

    const result = pickBestResult(results, seenDomains, seenUrlSet, weirdness);
    seenDomains.add(normalizeDomain(result.domain));
    seenUrlSet.add(result.url);
    const hop = toHop(result, cat, getRelated(results, result.url));

    const [bridge, nextConcepts] = await Promise.all([
      narrateConnection(
        prevTitle,
        prevHighlight,
        hop.title,
        hop.highlight,
        mode
      ),
      i < numHops - 1
        ? extractConcepts(
            hop.title,
            result.text || result.highlights.join(" "),
            weirdness,
            mode
          )
        : Promise.resolve(currentConcepts),
    ]);

    hops.push(hop);
    bridges.push(bridge);
    currentConcepts = nextConcepts;
    prevTitle = hop.title;
    prevHighlight = hop.highlight;
  }

  if (hops.length === 0) {
    return { hops: [], bridges: [] };
  }

  const hopChain = [
    { title: lastTitle, highlight: lastHighlight },
    ...hops,
  ];
  const scores = await Promise.all(
    hops.map((hop, i) =>
      scoreHop(
        hopChain[i].title,
        hopChain[i].highlight,
        hop.title,
        hop.highlight
      )
    )
  );
  hops.forEach((hop, i) => {
    hop.scores = scores[i];
  });

  return { hops, bridges };
}
