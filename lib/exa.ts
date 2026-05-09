import Exa from "exa-js";

const exa = new Exa(process.env.EXA_API_KEY);

type Category =
  | "company"
  | "research paper"
  | "news"
  | "pdf"
  | "personal site"
  | "financial report"
  | "people";

export async function searchTopic(
  query: string,
  options?: { category?: Category; numResults?: number }
) {
  const response = await exa.search(query, {
    numResults: options?.numResults ?? 5,
    category: options?.category,
    contents: {
      highlights: { numSentences: 3 },
      text: { maxCharacters: 1500 },
    },
  });

  return response.results.map((r) => ({
    title: r.title ?? "Untitled",
    url: r.url,
    text: r.text ?? "",
    highlights: r.highlights ?? [],
    domain: new URL(r.url).hostname.replace("www.", ""),
  }));
}

export async function findSimilarContent(
  url: string,
  options?: { numResults?: number; category?: Category }
) {
  const response = await exa.findSimilar(url, {
    numResults: options?.numResults ?? 5,
    excludeSourceDomain: true,
    category: options?.category,
    contents: {
      highlights: { numSentences: 3 },
      text: { maxCharacters: 1500 },
    },
  });

  return response.results.map((r) => ({
    title: r.title ?? "Untitled",
    url: r.url,
    text: r.text ?? "",
    highlights: r.highlights ?? [],
    domain: new URL(r.url).hostname.replace("www.", ""),
  }));
}

export const CATEGORIES: Category[] = [
  "company",
  "research paper",
  "news",
  "personal site",
  "financial report",
  "people",
];
