import { DurableObject } from "cloudflare:workers";

const WINDOW_SECONDS = 60 * 60;
const MAX_REQUESTS_PER_WINDOW = 5;

interface WindowState {
  windowStart: number;
  count: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

// One DO instance per client IP (see idFromName(ip) in index.ts). Durable Objects are
// single-threaded per instance, so this check-and-increment is race-free — unlike the
// previous KV-based limiter, which is only eventually consistent and can under-count
// a fast burst from one IP for up to ~60s before writes propagate.
export class RateLimiterDO extends DurableObject {
  async checkAndIncrement(): Promise<RateLimitResult> {
    const windowStart = Math.floor(Date.now() / 1000 / WINDOW_SECONDS);
    const stored = await this.ctx.storage.get<WindowState>("state");

    const count =
      stored && stored.windowStart === windowStart ? stored.count : 0;

    if (count >= MAX_REQUESTS_PER_WINDOW) {
      return { allowed: false, remaining: 0 };
    }

    await this.ctx.storage.put<WindowState>("state", {
      windowStart,
      count: count + 1,
    });

    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - count - 1 };
  }
}
