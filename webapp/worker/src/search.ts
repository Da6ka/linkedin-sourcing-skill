export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

export async function searchWeb(
  apiKey: string,
  query: string,
  numResults = 10,
): Promise<SearchResult[]> {
  const response = await fetch("https://api.firecrawl.dev/v2/search", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      limit: Math.min(numResults, 20),
      sources: ["web"],
    }),
  });

  if (!response.ok) {
    // Keep the raw body out of the thrown error: this message is surfaced to the model
    // as a tool_result, and the model's text is returned to the caller — so an
    // interpolated body could reach a client through a 200, not just a 500. The status
    // alone is enough for the model to decide whether to retry or move on.
    console.error(
      `Firecrawl search failed: ${response.status}`,
      await response.text(),
    );
    throw new Error(`Firecrawl search failed with status ${response.status}`);
  }

  const data = (await response.json()) as {
    success: boolean;
    data?: {
      web?: Array<{ title?: string; url?: string; description?: string }>;
    };
  };

  return (data.data?.web ?? []).map((r) => ({
    title: r.title ?? "",
    link: r.url ?? "",
    snippet: r.description ?? "",
  }));
}
