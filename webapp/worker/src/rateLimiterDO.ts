import { DurableObject } from "cloudflare:workers";

const WINDOW_SECONDS = 60 * 60;
const MAX_REQUESTS_PER_WINDOW = 5;
const WINDOW_MS = WINDOW_SECONDS * 1000;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Seconds until the next slot frees. 0 when the request was allowed. */
  retryAfterSeconds: number;
}

// One DO instance per client IP (see idFromName(ip) in index.ts). Durable Objects are
// single-threaded per instance, so this check-and-increment is race-free — unlike the
// original KV-based limiter, which is only eventually consistent and can under-count
// a fast burst from one IP for up to ~60s before writes propagate.
//
// This is a sliding-window log: we keep the timestamp of each allowed request and count
// those newer than one window. The earlier version bucketed on wall-clock hour
// (floor(now / 3600)), which let a caller spend a full quota just before the hour rolled
// and another immediately after — 2x the intended rate in a couple of minutes. Ages are
// measured against each request's own timestamp here, so there is no boundary to exploit.
//
// Storing timestamps rather than a counter is only viable because the quota is small:
// the array is capped at MAX_REQUESTS_PER_WINDOW entries, since we never append once the
// limit is reached. A large quota would want a counter-based approximation instead.
export class RateLimiterDO extends DurableObject {
  async checkAndIncrement(): Promise<RateLimitResult> {
    const now = Date.now();
    const stored = (await this.ctx.storage.get<number[]>("hits")) ?? [];
    const hits = stored.filter((t) => t > now - WINDOW_MS);

    if (hits.length >= MAX_REQUESTS_PER_WINDOW) {
      // hits is ascending, so the oldest is the next to age out.
      const freesAt = hits[0] + WINDOW_MS;
      return {
        allowed: false,
        remaining: 0,
        // Round up, and never advertise 0 — a client honouring Retry-After: 0 would
        // retry immediately and be rejected again.
        retryAfterSeconds: Math.max(1, Math.ceil((freesAt - now) / 1000)),
      };
    }

    hits.push(now);
    await this.ctx.storage.put<number[]>("hits", hits);

    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - hits.length,
      retryAfterSeconds: 0,
    };
  }
}
