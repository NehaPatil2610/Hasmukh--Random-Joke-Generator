import { NextResponse } from "next/server";
import { type Language, jokesData } from "@/data/jokes";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") as Language;

  if (!lang || !jokesData[lang]) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  const pool = jokesData[lang];
  if (!pool || pool.length === 0) {
    return NextResponse.json({ error: "No jokes available" }, { status: 404 });
  }

  // We could implement the filtering here, but since the frontend holds the viewed history,
  // we'll return a random joke and let the server return it. The frontend's fetchJoke
  // could handle the recursive retry. Or the frontend passes the history string.
  // Let's allow frontend to pass a comma-separated list of viewed IDs.
  const viewedIdsString = searchParams.get("viewedIds");
  let viewedIds = new Set<string>();
  if (viewedIdsString) {
    viewedIdsString.split(",").forEach(id => viewedIds.add(id));
  }

  // Try to find a non-viewed joke (up to 5 retries to avoid infinite loops)
  for (let attempt = 0; attempt < 5; attempt++) {
    const joke = pool[Math.floor(Math.random() * pool.length)];
    if (!viewedIds.has(joke.id)) {
      return NextResponse.json(joke);
    }
  }

  // Fallback: return any random joke
  const fallbackJoke = pool[Math.floor(Math.random() * pool.length)];
  return NextResponse.json(fallbackJoke);
}
