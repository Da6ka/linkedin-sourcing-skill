# linkedin-sourcing-skill

A [Claude Code](https://claude.com/claude-code) skill for LinkedIn candidate sourcing — turns a job description or briefing into a candidate persona, finds matching LinkedIn profiles, scores them, and drafts personalized outreach in one pass.

## What it does

When triggered (e.g. by pasting a JD, asking to "find candidates", "source for this role", or "write outreach"), the skill walks through a full sourcing workflow:

1. Synthesizes the role/briefing into a candidate persona
2. Finds real LinkedIn profiles via web search
3. Scores candidates against the persona
4. Drafts personalized outreach messages

See [SKILL.md](SKILL.md) for the full instructions, and [references/](references/) for the boolean search guide and outreach examples used by the skill.

**Note:** outreach messages, profile tables, and other templates default to English, but the
skill matches whatever language you or the JD are written in; see "Output language" in
`SKILL.md`.

## Install

Copy this folder into your Claude Code skills directory:

```bash
git clone https://github.com/Da6ka/linkedin-sourcing-skill.git ~/.claude/skills/linkedin-sourcing
```

Restart Claude Code (or start a new session) and the skill will be available automatically — Claude triggers it when you paste a JD or ask to source/outreach on LinkedIn.


## Avoiding LinkedIn account restrictions

LinkedIn monitors for automated or bot-like behavior. To keep your account safe while using this skill, follow these precautions:

**Use it moderately and naturally.** Avoid running large-scale or repetitive tasks in a short period (e.g., sending hundreds of connection requests or messages in one session).

**Don't violate LinkedIn's Terms of Service.** The skill operates your browser just like a human would — it clicks, types, and navigates. However, LinkedIn still prohibits automated scraping and mass actions.

**Avoid high-volume actions in bulk.** LinkedIn does not publish exact limits and changes them over time — the figures below are approximate, community-reported ballparks (circa 2025), not official numbers. Treat them as directional and stay well under them:

| Action | Free account | Paid account | Safe daily pace |
|---|---|---|---|
| Connection requests | ~80–100/week | ~100/week | 15–20/day |
| Messages to connections | ~100/week | ~150/week | 15–20/day |
| Profile views | 500/day | 2,000/day | Stay under 50% (~250/day free, ~1,000/day paid) |
| Pending unaccepted invites | 2,500 total | 2,500 total | Withdraw old ones regularly |

Sending requests or messages in rapid bursts (even within these caps) can trigger spam filters. Space actions out and avoid running long uninterrupted sessions.

The skill itself caps Cowork profile-visit batches at 15–20 per instruction (see `SKILL.md` Part C) to line up with the "safe daily pace" figures above — if your search turns up more candidates than that, run the Cowork collection step in separate batches rather than all at once.

**Don't scrape or export data at scale.** Extracting large amounts of profile data, contact lists, or company information is a primary reason LinkedIn blocks accounts. Use the skill only for targeted, purposeful lookups.

**Keep sessions realistic.** Very long uninterrupted sessions with constant activity can look suspicious. Stick to focused, human-scale tasks.

**Respect CAPTCHAs.** If LinkedIn presents a CAPTCHA or verification challenge, the skill will stop and let you handle it yourself — this is by design and protects your account.

Using the skill for reasonable, human-scale tasks (researching a specific candidate, sending a message, reviewing a profile) keeps you within these guidelines, but nothing here is a guarantee — see the disclaimer below.

## Disclaimer and responsible use

- **No warranty or guarantee.** This skill is provided as-is (see [LICENSE](LICENSE)). It cannot guarantee your LinkedIn account won't be restricted — you use it at your own risk.
- **Terms of Service are your responsibility.** LinkedIn's [User Agreement](https://www.linkedin.com/legal/user-agreement) prohibits automated scraping and bulk actions. Automating profile access (including the Cowork step) may breach it. You are responsible for deciding whether and how to use this skill within LinkedIn's terms and the laws that apply to you.
- **Candidate data is personal data.** The skill collects and stores individuals' names, roles, and work history. If you retain or process this data, you are the data controller and are responsible for lawful handling — including any consent, notice, and retention obligations under GDPR or other applicable law.
