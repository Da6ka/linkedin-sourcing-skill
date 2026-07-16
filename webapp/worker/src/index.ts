import { runSourcingAgent } from "./agent";
import { RateLimiterDO } from "./rateLimiterDO";
import { corsHeaders, withCors } from "./cors";

export { RateLimiterDO };

export interface Env {
  ANTHROPIC_API_KEY: string;
  FIRECRAWL_API_KEY: string;
  APOLLO_API_KEY: string;
  RATE_LIMITER: DurableObjectNamespace<RateLimiterDO>;
}

// A real job description is a few thousand characters. This ceiling is well clear of
// any legitimate JD while bounding what one request can cost: the body is billed as
// Opus input tokens, and the whole conversation is resent on every one of the up-to-12
// agent turns, so unbounded input grows spend quadratically in turns.
const MAX_JD_CHARS = 20_000;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const cors = (response: Response) => withCors(response, origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    const url = new URL(request.url);
    if (url.pathname !== "/api/source" || request.method !== "POST") {
      return cors(new Response("Not found", { status: 404 }));
    }

    // The "unknown" fallback is unreachable in practice, and safe if it ever is reached.
    // Cloudflare sets cf-connecting-ip on every request that arrives here and rejects any
    // client that supplies its own with a 403 at the edge, before the Worker runs — so the
    // header cannot be spoofed to mint a fresh bucket. wrangler dev sets it too (::1), so
    // local runs don't hit this either. If it were somehow missing, sharing one bucket is
    // the restrictive direction: those callers would collectively get MAX_REQUESTS_PER_WINDOW
    // per window, not an unlimited one each.
    const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
    const stub = env.RATE_LIMITER.get(env.RATE_LIMITER.idFromName(ip));
    const { allowed, remaining, retryAfterSeconds } =
      await stub.checkAndIncrement();
    if (!allowed) {
      // The sliding window knows exactly when the oldest hit ages out, so report that
      // rather than the old flat "an hour" — which was usually an overestimate.
      const minutes = Math.ceil(retryAfterSeconds / 60);
      return cors(
        new Response(
          JSON.stringify({
            error: `Rate limit exceeded. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": String(retryAfterSeconds),
            },
          },
        ),
      );
    }

    let jobDescription: string;
    try {
      const body = (await request.json()) as { jobDescription?: string };
      jobDescription = (body.jobDescription ?? "").trim();
    } catch {
      return cors(
        new Response(JSON.stringify({ error: "Invalid JSON body" }), {
          status: 400,
        }),
      );
    }

    if (!jobDescription) {
      return cors(
        new Response(JSON.stringify({ error: "jobDescription is required" }), {
          status: 400,
        }),
      );
    }

    if (jobDescription.length > MAX_JD_CHARS) {
      return cors(
        new Response(
          JSON.stringify({
            error: `jobDescription is too long (${jobDescription.length} characters, max ${MAX_JD_CHARS}).`,
          }),
          { status: 413, headers: { "Content-Type": "application/json" } },
        ),
      );
    }

    try {
      const result = await runSourcingAgent(env, jobDescription);
      return cors(
        new Response(
          JSON.stringify({ result, rateLimitRemaining: remaining }),
          {
            headers: { "Content-Type": "application/json" },
          },
        ),
      );
    } catch (err) {
      // Log the detail, return a generic message. Upstream failures reach here with
      // their raw bodies attached — searchWeb interpolates Firecrawl's response text
      // into its error, and Anthropic SDK errors carry request detail — none of which
      // should be echoed to an unauthenticated caller.
      console.error("Sourcing run failed:", err);
      return cors(
        new Response(
          JSON.stringify({
            error: "Sourcing run failed. Please try again.",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        ),
      );
    }
  },
};
