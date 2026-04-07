import { type Language, type Joke, jokesData } from "@/data/jokes";

const ENGLISH_API = "https://v2.jokeapi.dev/joke/Any?type=single&safe-mode";

/**
 * Fetches a joke for the given language using a recursive no-repeat engine.
 * - English: fetches from JokeAPI.
 * - Regional: fetches from our internal API route.
 *
 * @param lang        Target language code
 * @param viewedIds   Array/Set of recently-viewed joke IDs
 * @param attempt     Current recursion depth (limit to prevent infinite loops)
 */
export async function fetchJoke(
  lang: Language,
  viewedIds: Set<number | string>,
  attempt = 0
): Promise<Joke> {
  // Hard limit on recursion
  if (attempt >= 5) {
    return { id: "-1", text: "No fresh jokes found. Please try another language!" };
  }

  let joke: Joke | null = null;

  if (lang === "en") {
    try {
      const res = await fetch(ENGLISH_API);
      const data = await res.json();
      if (res.ok && !data.error && data.joke) {
        joke = { id: `en-${data.id}`, text: data.joke };
      }
    } catch {
      // Network error, handle locally for now
      joke = { id: `en-fallback`, text: "Why couldn't the API cross the road? Because it had a connection error." };
    }
  } else {
    try {
      // Use internal API route for regional languages
      const viewedIdsParam = Array.from(viewedIds).join(',');
      const res = await fetch(`/api/jokes?lang=${lang}&viewedIds=${viewedIdsParam}`);
      if (res.ok) {
        joke = await res.json();
      }
    } catch {
      // Internal error fallback
      joke = { id: `region-fallback`, text: "ഒരു എറർ സംഭവിച്ചു. (An error occurred.)" };
    }
  }

  if (!joke) {
    return { id: "-1", text: "Wait, the joke vanished into the void... Try again!" };
  }

  // The "No-Repeat" Engine
  // If the fetched joke has already been viewed, recursively fetch a new one
  if (viewedIds.has(joke.id)) {
    return fetchJoke(lang, viewedIds, attempt + 1);
  }

  return joke;
}
