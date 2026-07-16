import Anthropic from "@anthropic-ai/sdk";
import { SKILL_SYSTEM_PROMPT } from "./skillPrompt";
import { searchWeb } from "./search";
import { fetchProfile } from "./enrich";

const MODEL = "claude-opus-4-8";
const MAX_TOKENS = 8192;
const MAX_AGENT_TURNS = 12;

const SEARCH_TOOL: Anthropic.Tool = {
  name: "search_web",
  description:
    "Run a real web search (X-ray / site: queries work) and return the top results. " +
    "This is the only way to find live profile URLs — never invent or pattern-complete a URL yourself.",
  input_schema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The full search query, e.g. a site: X-ray string.",
      },
      num_results: {
        type: "integer",
        description: "How many results to return (default 10, max 20).",
      },
    },
    required: ["query"],
  },
};

const FETCH_PROFILE_TOOL: Anthropic.Tool = {
  name: "fetch_profile",
  description:
    "Enrich a single profile URL you already found with search_web, returning structured " +
    "data for scoring. LinkedIn URLs return dated employment history from Apollo (falling " +
    "back to a search snippet if Apollo has no match); other URLs (GitHub, Stack Overflow, " +
    "hh.ru, personal sites) return the scraped page text. Returns no personal email or phone. " +
    "Costs money per call — only enrich High-confidence LinkedIn profiles, at most ~5 per run.",
  input_schema: {
    type: "object",
    properties: {
      url: {
        type: "string",
        description:
          "A profile URL returned by a prior search_web result. Never a URL you constructed yourself.",
      },
    },
    required: ["url"],
  },
};

export interface AgentEnv {
  ANTHROPIC_API_KEY: string;
  FIRECRAWL_API_KEY: string;
  APOLLO_API_KEY: string;
}

export async function runSourcingAgent(
  env: AgentEnv,
  jobDescription: string,
): Promise<string> {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: jobDescription },
  ];

  for (let turn = 0; turn < MAX_AGENT_TURNS; turn++) {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: [
        {
          type: "text",
          text: SKILL_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral", ttl: "1h" },
        },
      ],
      tools: [SEARCH_TOOL, FETCH_PROFILE_TOOL],
      messages,
    });

    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason !== "tool_use") {
      const finalText = response.content.find((block) => block.type === "text");
      if (!finalText || finalText.type !== "text") {
        throw new Error(
          `No text in final response (stop_reason: ${response.stop_reason})`,
        );
      }
      return finalText.text;
    }

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type !== "tool_use") continue;

      // Each tool runs in its own try/catch so a single failed call comes back as an
      // is_error tool_result the model can react to, rather than aborting the whole run.
      try {
        let content: string;
        switch (block.name) {
          case "search_web": {
            const input = block.input as {
              query: string;
              num_results?: number;
            };
            content = JSON.stringify(
              await searchWeb(
                env.FIRECRAWL_API_KEY,
                input.query,
                input.num_results,
              ),
            );
            break;
          }
          case "fetch_profile": {
            const input = block.input as { url: string };
            content = JSON.stringify(await fetchProfile(env, input.url));
            break;
          }
          default:
            continue;
        }
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content,
        });
      } catch (err) {
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: `Tool ${block.name} failed: ${err instanceof Error ? err.message : String(err)}`,
          is_error: true,
        });
      }
    }

    messages.push({ role: "user", content: toolResults });
  }

  throw new Error("Agent exceeded max turns without finishing");
}
