import { runSourcingAgent } from "./agent";
import { RateLimiterDO } from "./rateLimiterDO";
import { CORS_HEADERS, withCors } from "./cors";

export { RateLimiterDO };

export interface Env {
  ANTHROPIC_API_KEY: string;
  FIRECRAWL_API_KEY: string;
  RATE_LIMITER: DurableObjectNamespace<RateLimiterDO>;
}

// A real job description is a few thousand characters. This ceiling is well clear of
// any legitimate JD while bounding what one request can cost: the body is billed as
// Opus input tokens, and the whole conversation is resent on every one of the up-to-12
// agent turns, so unbounded input grows spend quadratically in turns.
const MAX_JD_CHARS = 20_000;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    if (url.pathname !== "/api/source" || request.method !== "POST") {
      return withCors(new Response("Not found", { status: 404 }));
    }

    const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
    const stub = env.RATE_LIMITER.get(env.RATE_LIMITER.idFromName(ip));
    const { allowed, remaining } = await stub.checkAndIncrement();
    if (!allowed) {
      return withCors(
        new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Try again in an hour.",
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json" },
          },
        ),
      );
    }

    let jobDescription: string;
    try {
      const body = (await request.json()) as { jobDescription?: string };
      jobDescription = (body.jobDescription ?? "").trim();
    } catch {
      return withCors(
        new Response(JSON.stringify({ error: "Invalid JSON body" }), {
          status: 400,
        }),
      );
    }

    if (!jobDescription) {
      return withCors(
        new Response(JSON.stringify({ error: "jobDescription is required" }), {
          status: 400,
        }),
      );
    }

    if (jobDescription.length > MAX_JD_CHARS) {
      return withCors(
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
      return withCors(
        new Response(
          JSON.stringify({ result, rateLimitRemaining: remaining }),
          {
            headers: { "Content-Type": "application/json" },
          },
        ),
      );
    } catch (err) {
      return withCors(
        new Response(
          JSON.stringify({
            error: err instanceof Error ? err.message : "Unknown error",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        ),
      );
    }
  },
};
