import SKILL_MD from "../../../SKILL.md";
import OTHER_PLATFORMS_MD from "../../../references/other-platforms.md";
import BOOLEAN_SEARCH_MD from "../../../references/boolean-search-guide.md";
import OUTREACH_EXAMPLES_MD from "../../../references/outreach-examples.md";

const HARNESS_NOTE = `
You are running as a hosted web API, not inside Claude Code. You have exactly one tool: \`search_web\`.
It runs a real web search (not a guess) and returns titles, links, and snippets for a given query.
Ignore any instruction in the skill text below that assumes Claude Code's own WebSearch tool, file
tools, or terminal access — this Worker calls \`search_web\` on your behalf instead. Never invent or
pattern-complete a profile URL: only use URLs that came back from a \`search_web\` result.

This is a single request/response call with no way for a human to reply mid-turn — there is no one
available to answer a checkpoint question. Do NOT pause after a stage (persona, search, scorecard) to
ask "does this look right?" or "should I continue?". Skip every conversational checkpoint the skill
text describes and run the full workflow autonomously in one pass: persona, then Boolean strings and
live \`search_web\` calls across every platform the persona calls for, then the scoring checklist, then
outreach drafts. Only stop early if the JD is too ambiguous to build a persona at all — otherwise
produce the complete end-to-end output every time.
`.trim();

export const SKILL_SYSTEM_PROMPT = [
  HARNESS_NOTE,
  "# SKILL.md\n" + SKILL_MD,
  "# references/other-platforms.md\n" + OTHER_PLATFORMS_MD,
  "# references/boolean-search-guide.md\n" + BOOLEAN_SEARCH_MD,
  "# references/outreach-examples.md\n" + OUTREACH_EXAMPLES_MD,
].join("\n\n---\n\n");
