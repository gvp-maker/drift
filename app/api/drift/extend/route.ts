import { NextRequest } from "next/server";
import { extendDrift } from "@/lib/drift-algorithm";

export async function POST(request: NextRequest) {
  const { lastTitle, lastHighlight, seenUrls, weirdness, mode } =
    await request.json();

  if (
    !lastTitle ||
    typeof lastTitle !== "string" ||
    !lastHighlight ||
    typeof lastHighlight !== "string"
  ) {
    return Response.json(
      { error: "Missing context for extension." },
      { status: 400 }
    );
  }

  const w =
    typeof weirdness === "number" ? Math.max(0, Math.min(3, weirdness)) : 1;
  const m = typeof mode === "string" && mode.length > 0 ? mode : undefined;
  const urls = Array.isArray(seenUrls) ? seenUrls : [];

  try {
    const result = await extendDrift(lastTitle, lastHighlight, urls, w, m);
    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong. Try again!";
    return Response.json({ error: message }, { status: 500 });
  }
}
