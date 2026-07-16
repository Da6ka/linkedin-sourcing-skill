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
    throw new Error(
      `Firecrawl search failed: ${response.status} ${await response.text()}`,
    );
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
