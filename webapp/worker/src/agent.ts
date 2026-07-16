import Anthropic from "@anthropic-ai/sdk";
import { SKILL_SYSTEM_PROMPT } from "./skillPrompt";
import { searchWeb } from "./search";

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

export interface AgentEnv {
  ANTHROPIC_API_KEY: string;
  FIRECRAWL_API_KEY: string;
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
      tools: [SEARCH_TOOL],
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
      if (block.type !== "tool_use" || block.name !== "search_web") continue;

      const input = block.input as { query: string; num_results?: number };
      try {
        const results = await searchWeb(
          env.FIRECRAWL_API_KEY,
          input.query,
          input.num_results,
        );
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: JSON.stringify(results),
        });
      } catch (err) {
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: `Search failed: ${err instanceof Error ? err.message : String(err)}`,
          is_error: true,
        });
      }
    }

    messages.push({ role: "user", content: toolResults });
  }

  throw new Error("Agent exceeded max turns without finishing");
}
