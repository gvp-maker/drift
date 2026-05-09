import { NextRequest } from "next/server";
import { drift } from "@/lib/drift-algorithm";

export async function POST(request: NextRequest) {
  const { topic, weirdness, mode } = await request.json();

  if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
    return Response.json(
      { error: "Please provide a topic to drift from." },
      { status: 400 }
    );
  }

  if (topic.length > 200) {
    return Response.json(
      { error: "Topic too long. Keep it under 200 characters." },
      { status: 400 }
    );
  }

  const w =
    typeof weirdness === "number" ? Math.max(0, Math.min(3, weirdness)) : 1;
  const m = typeof mode === "string" && mode.length > 0 ? mode : undefined;

  try {
    const result = await drift(topic.trim(), w, m);
    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong. Try again!";
    return Response.json({ error: message }, { status: 500 });
  }
}
