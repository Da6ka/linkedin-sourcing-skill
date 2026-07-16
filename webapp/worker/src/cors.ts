// Origins allowed to call this API from a browser.
//
// Note on what this does and doesn't buy: CORS is enforced by browsers, so this stops
// another site from spending our Anthropic/Firecrawl budget via its visitors' browsers
// and IPs. It does nothing against a direct scripted caller (curl ignores CORS entirely)
// — the rate limiter is the control for that.
const ALLOWED_ORIGIN_PATTERNS: RegExp[] = [
  // The Pages frontend, plus its per-deploy preview subdomains
  // (e.g. https://ff62c26e.tech-sourcing-webapp.pages.dev).
  /^https:\/\/(?:[a-z0-9-]+\.)?tech-sourcing-webapp\.pages\.dev$/,
  // Local development: index.html is served from a static server on an arbitrary
  // port and calls the worker on :8799.
  /^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/,
];

export function isAllowedOrigin(origin: string | null): boolean {
  return (
    origin !== null && ALLOWED_ORIGIN_PATTERNS.some((re) => re.test(origin))
  );
}

export function corsHeaders(origin: string | null): Record<string, string> {
  // Always vary on Origin: the response differs by origin, so a cache must not hand
  // an allowed origin's headers to a disallowed one.
  const headers: Record<string, string> = { Vary: "Origin" };

  if (isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin as string;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Max-Age"] = "86400";
  }

  return headers;
}

export function withCors(response: Response, origin: string | null): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders(origin))) {
    headers.set(key, value);
  }
  return new Response(response.body, { status: response.status, headers });
}
