# linkedin-sourcing-skill

A [Claude Code](https://claude.com/claude-code) skill for LinkedIn candidate sourcing — turns a job description or briefing into a candidate persona, finds matching LinkedIn profiles, scores them, and drafts personalized outreach in one pass.

## What it does

When triggered (e.g. by pasting a JD, asking to "find candidates", "source for this role", or "write outreach"), the skill walks through a full sourcing workflow:

1. Synthesizes the role/briefing into a candidate persona
2. Finds real LinkedIn profiles via web search
3. Scores candidates against the persona
4. Drafts personalized outreach messages

See [SKILL.md](SKILL.md) for the full instructions, and [references/](references/) for the boolean search guide and outreach examples used by the skill.

## Install

Copy this folder into your Claude Code skills directory:

```bash
git clone https://github.com/Da6ka/linkedin-sourcing-skill.git ~/.claude/skills/linkedin-sourcing
```

Restart Claude Code (or start a new session) and the skill will be available automatically — Claude triggers it when you paste a JD or ask to source/outreach on LinkedIn.
