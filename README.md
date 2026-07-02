# linkedin-sourcing-skill

[![CI](https://github.com/Da6ka/linkedin-sourcing-skill/actions/workflows/ci.yml/badge.svg)](https://github.com/Da6ka/linkedin-sourcing-skill/actions/workflows/ci.yml)

A [Claude Code](https://claude.com/claude-code) skill for LinkedIn candidate sourcing — turns a job description or briefing into a candidate persona, finds matching LinkedIn profiles, scores them, and drafts personalized outreach in one pass.

## What it does

When triggered (e.g. by pasting a JD, asking to "find candidates", "source for this role", or "write outreach"), the skill walks through a full sourcing workflow:

1. Synthesizes the role/briefing into a candidate persona
2. Finds real LinkedIn profiles via web search
3. Offers an optional, opt-in step to collect full profile text into a candidate tracker via the [Cowork](https://claude.com/product/cowork) browser — presented with a risk disclaimer and only generated if you say yes (requires Cowork and a logged-in LinkedIn session; see Part C in `SKILL.md` and "Avoiding LinkedIn account restrictions" below)
4. Scores candidates against the persona
5. Drafts personalized outreach messages

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

To update an existing install (the clone above fails if the folder already exists):

```bash
cd ~/.claude/skills/linkedin-sourcing && git pull
```

## Example

Paste a job description and ask:

> Source candidates for this role: [JD text]

The skill responds in one pass with a candidate persona, 3–5 Boolean search strings (for LinkedIn, Google, and Sales Navigator), a table of ~15–20 real LinkedIn profiles with confidence ratings, a scorecard tailored to the role's must-haves, and three outreach drafts for the top match.


## Avoiding LinkedIn account restrictions

LinkedIn monitors for automated or bot-like behavior. To keep your account safe while using this skill, follow these precautions:

**Use it moderately and naturally.** Avoid running large-scale or repetitive tasks in a short period (e.g., sending hundreds of connection requests or messages in one session).

**Don't violate LinkedIn's Terms of Service.** The skill itself only runs web searches — your browser is touched only if you run the optional Cowork collection step, where it clicks, types, and navigates like a human would. Even so, LinkedIn prohibits automated scraping and mass actions.

**Avoid high-volume actions in bulk.** LinkedIn does not publish exact limits and changes them over time — the figures below are approximate, community-reported ballparks (circa 2025), not official numbers. Treat them as directional and stay well under them:

| Action | Free account | Paid account | Safe daily pace |
|---|---|---|---|
| Connection requests | ~80–100/week | ~100/week | 10–15/day, max 5 days/week (~50–75/week) |
| Messages to connections | ~100/week | ~150/week | 10–15/day, max 5 days/week (~50–75/week) |
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
- **Human in the loop by design.** The skill never sends messages, never contacts candidates, and never makes hiring decisions — it drafts searches, scores, and message text for a human to review, edit, and send. Keep it that way: don't wire its output into anything that acts automatically.
- **Candidate data is personal data.** The skill collects and stores individuals' names, roles, and work history. If you retain or process this data, you are the data controller and are responsible for lawful handling — including any consent, notice, and retention obligations under GDPR or other applicable law. Two habits cover most of it: mention the source (their LinkedIn profile) in your first message to a candidate (GDPR Article 14 notice at first communication), and delete or anonymise tracker data once a search closes.
- **EU AI Act.** AI used for recruitment and candidate evaluation is a designated high-risk category (Annex III). Under the "Digital Omnibus" agreement (May 2026), deployer obligations for such standalone systems are expected to apply from 2 December 2027. This skill is assistive-only (see "human in the loop" above), but if you deploy it in the EU as part of your recruiting workflow, track that timeline — deployer duties will include human oversight and informing candidates about AI use.
- **Russia (152-ФЗ).** Russian data-protection law is consent-centric and stricter than GDPR on several points relevant to sourcing: a public profile does not imply consent to processing (Art. 10.1); Russian citizens' personal data must be initially collected into a database located in Russia (Art. 18(5) — keep the tracker on a machine in-country, not in foreign cloud storage); and any cross-border transfer — which includes pasting Russian candidates' data into a foreign-hosted AI service — requires prior notification to Roskomnadzor (Art. 12, in force since March 2023). If you source Russian candidates, get specific legal advice; fines are now turnover-based for data leaks.
