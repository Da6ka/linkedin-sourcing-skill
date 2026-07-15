# tech-sourcing-skill

[![CI](https://github.com/Da6ka/tech-sourcing-skill/actions/workflows/ci.yml/badge.svg)](https://github.com/Da6ka/tech-sourcing-skill/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/Da6ka/tech-sourcing-skill)](https://github.com/Da6ka/tech-sourcing-skill/releases/tag/v2.1.0)

> Renamed from `linkedin-sourcing-skill` in v2.0.0 to reflect the broader, mostly-tech multi-platform scope. The old repo name now redirects here automatically.

A [Claude Code](https://claude.com/claude-code) skill for candidate sourcing — turns a job description or briefing into a candidate persona, finds matching profiles on LinkedIn and (when the role calls for it) other platforms, scores them, and drafts personalised outreach in one pass.

## What it does

When triggered (e.g. by pasting a JD, asking to "find candidates", "source for this role", or "write outreach"), the skill walks through a full sourcing workflow:

1. Asks what type of candidates you're sourcing (tech, design, data/ML, algorithm-heavy, commercial/general, RU/CIS market) and picks the right source mix accordingly — LinkedIn always runs; GitHub, Stack Overflow, Kaggle, Codeforces, Dribbble, Behance, hh.ru, geekjob.ru, Reddit, Twitter/X, Telegram, or Threads are added when they fit the role (see `references/other-platforms.md`)
2. Synthesises the role/briefing into a candidate persona
3. Finds real profiles via web search across the selected sources
4. Offers an optional, opt-in step to collect full LinkedIn profile text into a candidate tracker via the [Cowork](https://claude.com/product/cowork) browser — presented with a risk disclaimer and only generated if you say yes (requires Cowork and a logged-in LinkedIn session; see Part C in `SKILL.md` and "Avoiding LinkedIn account restrictions" below)
5. Scores candidates against the persona
6. Drafts personalised outreach messages
7. Lists which other sources weren't used, in case you want another round on a different platform

See [SKILL.md](SKILL.md) for the full instructions, and [references/](references/) for the boolean search guide and outreach examples used by the skill.

**Note:** outreach messages, profile tables, and other templates default to English, but the
skill matches whatever language you or the JD are written in; see "Output language" in
`SKILL.md`.

## Install

Copy this folder into your Claude Code skills directory:

```bash
git clone https://github.com/Da6ka/tech-sourcing-skill.git ~/.claude/skills/tech-sourcing
```

Restart Claude Code (or start a new session) and the skill will be available automatically — Claude triggers it when you paste a JD or ask to source candidates or write outreach, on LinkedIn or any of the other supported platforms.

To confirm it loaded, start a new session and check that `tech-sourcing` shows up among your available skills — or just paste a job description and ask "source candidates for this role" — the skill should pick it up on its own.

To update an existing install (the clone above fails if the folder already exists):

```bash
cd ~/.claude/skills/tech-sourcing && git pull
```

**Upgrading from `linkedin-sourcing`:** if you have the old folder installed, rename it —
`mv ~/.claude/skills/linkedin-sourcing ~/.claude/skills/tech-sourcing` — then `git pull` inside
it; the old remote URL still resolves via GitHub's redirect, but running
`git remote set-url origin https://github.com/Da6ka/tech-sourcing-skill.git` afterward keeps
things tidy.

## Example

> **Manual sourcing:** hours of Boolean-string tinkering, tab-switching across LinkedIn, GitHub,
> and whatever else the role calls for, then building a scorecard from scratch.
> **This skill:** one prompt in → persona, search strings, a scored candidate table, and
> outreach drafts — in one pass.

One prompt:

> Source candidates for this role: **Backend Engineer**, remote, $80–110k. Series A fintech
> startup. Needs 3+ years of Go and Postgres in production, and has to be comfortable owning
> infra decisions solo — no platform team yet.

Here's the shape of what comes back, in one pass:

**Persona** (abridged)
- 3–5+ years backend, Go + Postgres in production, not just coursework or a side project
- Has personally owned an infra or deploy decision, not just executed one someone else made
- Comfortable in an early-stage, ambiguous environment without a platform team backstop

**Boolean search strings** (2 of 5)
```
LinkedIn: "backend engineer" OR "software engineer" Go Postgres "series a" OR "seed"
GitHub:   language:go stars:>50 location:remote
```

**Candidate table** (4 of 17 rows)
| # | Name | Current role | Confidence | Why included |
|---|---|---|---|---|
| 1 | [Name] | Backend Eng @ [seed-stage fintech] | High | 4 yrs Go, owns the deploy pipeline solo |
| 2 | [Name] | Senior SWE @ [Series B SaaS] | Medium | Go + Postgres, no solo-infra evidence yet |
| 3 | [Name] | Founding Engineer @ [YC startup] | High | Built and owns infra from day one |
| 4 | [Name] | Backend Eng @ [Series C, larger team] | Low-Medium | Right stack, likely used to a platform team |

**Scorecard**
| Criterion | Score |
|---|---|
| Go/Postgres in production | /3 |
| Solo infra ownership | /3 |
| Early-stage comfort | /3 |

**Outreach** (Variant 1 of 3 — Career growth)
> Hi [Name] — building the founding backend team at a Series A fintech, and your work owning
> [specific infra decision from their profile] at [Company] is exactly the kind of ownership
> we need without a platform team behind you yet...

That's the whole loop from one message — no manual Boolean-string writing, no building a
scorecard by hand, no drafting outreach from scratch.

For the deeper story — what happens when a "High confidence" result turns out to be a stale
LinkedIn snippet, and how the skill handles judgment calls like geography exceptions — see
[`references/example-walkthrough.md`](references/example-walkthrough.md).


## Live demo

**[tech-sourcing-webapp.pages.dev](https://tech-sourcing-webapp.pages.dev)** — a small web app
wrapping this skill, so anyone can try it without installing Claude Code. Paste a JD, get the full
pipeline back in the browser: persona → live search across LinkedIn and adjacent platforms →
scorecard → outreach drafts. Same skill, same rules (real X-ray search, no invented URLs) — just a
different harness (a Cloudflare Worker calling the Claude API instead of Claude Code itself).

Verified live: a "Senior Backend Engineer (Go), remote, fintech" JD returned 17 real LinkedIn
profiles and 3 GitHub profiles matching the persona (Go 4+ years, distributed systems, Kubernetes,
Postgres, fintech/payments), a 5-criterion scorecard, and 3 outreach variants — end to end in about
two minutes. Real candidate names aren't reproduced here since they're live strangers' public
profiles, not illustrative placeholders — run it yourself to see full results for any role.


## Avoiding LinkedIn account restrictions

LinkedIn monitors for automated or bot-like behaviour. To keep your account safe while using this skill, follow these precautions:

**Use it moderately and naturally.** Avoid running large-scale or repetitive tasks in a short period (e.g., sending hundreds of connection requests or messages in one session).

**Don't violate LinkedIn's Terms of Service.** The skill itself only runs web searches — your browser is touched only if you run the optional Cowork collection step, where it clicks, types, and navigates like a human would. Even so, LinkedIn prohibits automated scraping and mass actions.

**Avoid high-volume actions in bulk.** LinkedIn does not publish exact limits and changes them over time — the figures below are approximate, community-reported ballparks (circa 2025), not official numbers. Treat them as directional and stay well under them:

| Action | Free account | Paid account | Safe daily pace |
|---|---|---|---|
| Connection requests | ~100/week | ~100/week | 10–15/day, max 5 days/week (~50–75/week) |
| Messages to connections | ~100/week | ~150/week | 10–15/day, max 5 days/week (~50–75/week) |
| Profile views | 500/day | 2,000/day | Stay under 50% (~250/day free, ~1,000/day paid) |
| Pending unaccepted invites | 2,500 total | 2,500 total | Withdraw old ones regularly |

Note on connection requests: LinkedIn's weekly invitation limit is applied account-wide and a
paid tier (Premium, Sales Navigator, Recruiter Lite) does **not** raise it — the cap is roughly
the same whether or not you pay. Premium mainly lifts the *profile view* and *messaging* ceilings,
which is why those two rows differ by tier and this one doesn't. Some community writeups advise
free accounts to stay under ~80/week specifically (vs. ~100/week for paid) as an extra margin of
safety — the skill's own safe-pace figure (50–75/week) already sits below both, so this doesn't
change the guidance, just the source of the number.

Sending requests or messages in rapid bursts (even within these caps) can trigger spam filters. Space actions out and avoid running long uninterrupted sessions.

The skill itself caps Cowork profile-visit batches at 15–20 per instruction (see `SKILL.md` Part C) to line up with the "safe daily pace" figures above — if your search turns up more candidates than that, run the Cowork collection step in separate batches rather than all at once.

**Don't scrape or export data at scale.** Extracting large amounts of profile data, contact lists, or company information is a primary reason LinkedIn blocks accounts. Use the skill only for targeted, purposeful lookups.

**Keep sessions realistic.** Very long uninterrupted sessions with constant activity can look suspicious. Stick to focused, human-scale tasks.

**Respect CAPTCHAs.** If LinkedIn presents a CAPTCHA or verification challenge, the skill will stop and let you handle it yourself — this is by design and protects your account.

Using the skill for reasonable, human-scale tasks (researching a specific candidate, sending a message, reviewing a profile) keeps you within these guidelines, but nothing here is a guarantee — see the disclaimer below.


## FAQ

### Why did I get only 7 profiles instead of 20?

The skill aims for roughly **15–20 profiles**, but quality comes first. If only a few relevant profiles are found, it returns fewer rather than inventing results.

Try:
- Broadening the Boolean strings (remove less-important keywords)
- Removing or relaxing the location requirement
- Running another round with different search strings
- Refining the candidate persona

### Why didn't the skill search LinkedIn directly?

By default, the skill uses **X-ray search** (`site:linkedin.com/in`) through a search engine. This avoids unnecessary LinkedIn account activity while still finding public profiles.

### Why are some profile URLs missing?

The skill never invents LinkedIn URLs. It only includes URLs actually returned by the search tool. If no URL is found, none is generated.

### Can the skill send messages or connection requests?

No. The skill is **assistive only**. It drafts outreach messages but never sends messages, connection requests, or performs actions on your behalf.

### Why wasn't the Cowork step offered?

Cowork is optional and only appears when appropriate. If your environment doesn't support it, or if you haven't opted in, the skill skips browser automation and continues with the rest of the workflow.

### Can I ask for another batch of candidates?

Yes. Simply ask for another round. The skill will generate additional search variants and look for more matching profiles instead of repeating the previous results.

### How does the skill decide which platforms to search besides LinkedIn?

It asks upfront what type of candidates you're sourcing (tech, design, data/ML, algorithm-heavy,
commercial/general, or RU/CIS market) and maps that to a source set — see
`references/other-platforms.md` for the full decision table and per-platform search recipes
(GitHub, Stack Overflow, Kaggle, Codeforces, Dribbble, Behance, hh.ru, geekjob.ru, Reddit,
Twitter/X, Telegram, Threads). LinkedIn always runs regardless of the answer; if the JD already
makes the candidate type obvious, the skill states its inference instead of asking. You can also
name a platform directly ("also check Reddit") to override the automatic pick.

### Is it safe to search hh.ru the way this skill does?

Only via the X-ray method the skill uses (a Google `site:hh.ru/resume` search) — never a direct
scraper. hh.ru's User Agreement explicitly bans automated parsing, and unauthorized data
collection carries criminal exposure under Russian law (ст. 272.1 УК РФ, in force since
11.12.2024) on top of 152-ФЗ fines — materially higher risk than LinkedIn's civil-ToS-only
exposure. See the hh.ru section of `references/other-platforms.md` for the full note.


## Disclaimer and responsible use

The points below focus on LinkedIn since it's the platform every run touches. When a run also
searches GitHub, Stack Overflow, Kaggle, Codeforces, Dribbble, Behance, hh.ru, geekjob.ru,
Reddit, Twitter/X, Telegram, or Threads, the same principles apply — the skill uses public search
(X-ray or each platform's native search) rather than scraping, but each platform has its own
terms of service, and hh.ru's carries a materially stronger legal risk (see the FAQ above and
`references/other-platforms.md`). You are responsible for complying with each platform's terms.

- **No warranty or guarantee.** This skill is provided as-is (see [LICENSE](LICENSE)). It cannot guarantee your LinkedIn account won't be restricted — you use it at your own risk.
- **Terms of Service are your responsibility.** LinkedIn's [User Agreement](https://www.linkedin.com/legal/user-agreement) prohibits automated scraping and bulk actions. Automating profile access (including the Cowork step) may breach it. You are responsible for deciding whether and how to use this skill within LinkedIn's terms and the laws that apply to you.
- **Human in the loop by design.** The skill never sends messages, never contacts candidates, and never makes hiring decisions — it drafts searches, scores, and message text for a human to review, edit, and send. Keep it that way: don't wire its output into anything that acts automatically.
- **Candidate data is personal data.** The skill collects and stores individuals' names, roles, and work history. If you retain or process this data, you are the data controller and are responsible for lawful handling — including any consent, notice, and retention obligations under GDPR or other applicable law. Two habits cover most of it: mention the source (their LinkedIn profile) in your first message to a candidate (GDPR Article 14 notice at first communication), and delete or anonymise tracker data once a search closes.
- **EU AI Act.** AI used for recruitment and candidate evaluation is a designated high-risk category (Annex III). Under the "Digital Omnibus" agreement (May 2026), deployer obligations for such standalone systems are expected to apply from 2 December 2027. This skill is assistive-only (see "human in the loop" above), but if you deploy it in the EU as part of your recruiting workflow, track that timeline — deployer duties will include human oversight and informing candidates about AI use.
- **Russia (152-ФЗ).** Russian data-protection law is consent-centric and stricter than GDPR on several points relevant to sourcing: a public profile does not imply consent to processing (Art. 10.1); Russian citizens' personal data must be initially collected into a database located in Russia (Art. 18(5) — keep the tracker on a machine in-country, not in foreign cloud storage); and any cross-border transfer — which includes pasting Russian candidates' data into a foreign-hosted AI service — requires prior notification to Roskomnadzor (Art. 12, in force since March 2023). If you source Russian candidates, get specific legal advice; fines are now turnover-based for data leaks.
