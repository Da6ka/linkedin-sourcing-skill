# Example: a full sourcing run, start to finish

This is a real (anonymised) run of the skill, kept in full because the interesting part isn't
the initial candidate list — any search tool can produce that. It's what happens _after_: how
many of those "great-looking" profiles fall apart under a second look, and how the skill handles
the judgment calls a search can't make on its own.

Company, role, and every candidate below are fictional. The dynamics — the aspirational-LinkedIn
trap, the stale-snippet trap, the geography exceptions, the overqualification calls — are real
patterns pulled from an actual run.

---

## The ask

> Source candidates for this role: **Content Operations Assistant** (part-time, 20 hrs/week,
> $600–900/month, 3-month pilot) for **Acme Nova**, a small data-consulting firm. Reports to
> the Content Lead. Needs to run Twitter/X and Reddit ops, help with Substack/email sequencing,
> and — critically — be comfortable using AI tools (Claude preferred) in daily work. CIS, LatAm,
> or Southeast Asia preferred for budget reasons.

## Stage 1 — Persona

<details>
<summary>Full persona (click to expand)</summary>

**Must-have**

- C1/native-level English with demonstrated ability to write in someone else's voice from a guide
- Daily, hands-on use of AI tools in actual workflow — Claude specifically preferred
- 1–2 years in content ops, community management, or SMM on English-language/Western platforms
- 2–3+ years as an active personal Twitter/X user with real platform-culture fluency
- Familiarity with Substack, Beehiiv, or ConvertKit, at least as a subscriber
- Comfortable in Notion, spreadsheets, and Typefully or Hypefury
- Executor mindset — this is explicitly not a strategy role

**Red flags to watch for**

- Portfolio is all brand/agency-voice work, no evidence of writing convincingly as someone else
- No concrete numbers in past content-ops work
- Overqualified profiles (ex-Content Lead, ex-agency-owner) likely to chafe at a pure-execution
  scope for this budget

</details>

Checkpoint: the user's first response to the persona above was a correction, not an approval —
"drop the Notion/spreadsheet requirement, that's table stakes for any candidate we'd consider,
not a differentiator." Per SKILL.md's checkpoint rule ("apply corrections and re-deliver only
the affected module"), only the Must-have section was re-delivered with that line removed —
the rest of the persona, and the conversation around it, stayed as-is. The user confirmed the
revised persona on the next turn, and only then did search spending begin.

## Stage 2 — Search turns up a "perfect" match

One Boolean string — `site:linkedin.com/in "content operations" OR "VA" Twitter Substack
Philippines OR Indonesia` — returns a candidate whose headline reads:

> _"Content Operations VA for Coaches & Personal Brands | Systems, Analytics & Consistent
> Content"_ — Philippines

On paper this is a bullseye: right region, right title, right language ("systems," not "just
posting"). Marked **High confidence** and drafted straight into outreach.

## Stage 3 — Verification catches what search couldn't

The user later shares the candidate's exported LinkedIn PDF. The full profile tells a different
story:

- The "Content Operations VA" tagline is recent freelance branding — no client names, no
  metrics, no employment history in content at all
- Her actual 10-year work history is BPO customer support, ecommerce order processing, and
  insurance admin
- Her only content-related credential is a marketing course completed a few months ago

**Downgraded from High to Low confidence.** This is the single most common failure mode the
skill is built to catch: a LinkedIn headline is a pitch, not a résumé. A second "High
confidence" candidate from the same search round turned out to be the same pattern — a polished
personal-brand-coaching headline sitting on top of a marketing-certificate course completed
weeks earlier, with zero verifiable client work underneath it.

A separate class of failure showed up on manual verification too: candidates whose _search
snippet_ was accurate months ago but stale now. One "data-company Twitter manager, built a
newsletter to 55k subscribers" profile turned out — on the actual current page — to now be a
seed-stage VC investor with 65,000 followers. Google's cache doesn't know someone got promoted
or changed careers; only opening the live profile does.

## Stage 4 — Judgment calls the skill surfaces instead of hiding

**Geography exceptions.** A ghostwriter based in a country outside the stated CIS/LatAm/SEA
budget region turned up with an unusually strong functional match — genuine ghostwriting
specifically for SaaS/AI founders, real peer engagement in that community, no aspirational
branding. Flagged explicitly as _"outside the stated geography — worth a case-by-case exception
given the strength of fit"_ rather than silently included or silently dropped. The user approved
the exception; the reasoning stayed attached to the candidate record either way.

**Overqualification, reconsidered.** A candidate who freelances alongside a part-time ops role,
uses Claude and Claude-based automation in her actual workflow, and organizes industry meetups
was initially flagged as _overqualified for a pure-execution hire._ The user pushed back — the
role fit her rate and working style better than the "junior executor" framing suggested — and
the skill re-classified her as a strong match rather than defending the original read. The
takeaway either way: judgment calls get named and logged, not made silently in either direction.

## Stage 5 — Scored, tiered output

Instead of one flat list, candidates land in a rubric-scored, tiered tracker:

| Criterion                              | What to look for                                      | /3  |
| -------------------------------------- | ----------------------------------------------------- | --- |
| Content ops execution fit              | Verifiable track record, not aspirational branding    |     |
| Twitter/X + Reddit fluency             | Genuine personal habit, not a managed company account |     |
| Substack/email ops exposure            | Actually runs one — ownership beats familiarity       |     |
| AI-tool fluency                        | Names specific tools used in real workflow            |     |
| Junior/executor fit at budget & region | Verifiable English + region (or approved exception)   |     |

| Tier                     | Score band | Meaning                                                                                                                                        | Count (this run) |
| ------------------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| 1 — Priority outreach    | 12–15      | Verified strong match, or explicitly approved exception                                                                                        | 7                |
| 2 — Worth a conversation | 8–11       | Plausible, unverified or partially verified                                                                                                    | 13               |
| 3 — Pass                 | Below 8    | Thin profile, minor concerns, or a verified disqualifier (geography, seniority, language, niche) — unless a strong compensating factor applies | 47               |

67 candidates total, sourced across roughly a dozen search rounds. Fewer than a third survive to
Tier 1 or 2 once verification is applied — which is the point.

**On the numbers:** this reflects several accumulated Scenario-1/Scenario-5 rounds over the
life of this search, not a single sourcing run. One run stays within SKILL.md's per-run budget
(15–20 profiles, 4–6 searches) — the 67-candidate, dozen-round total shown here is the running
total across multiple "another round" cycles, each individually budget-compliant. Read the
tiered counts above as the search's cumulative funnel, not evidence that the per-run guardrails
were relaxed or ignored. The tiers themselves match SKILL.md's Module 3 scorecard exactly —
score 12–15 (priority outreach), 8–11 (worth a conversation), and below 8 (pass unless a strong
compensating factor applies) — rather than a finer-grained split the actual scorecard output
doesn't produce.

## Stage 6 — Outreach, only for the survivors

Three variants (career-growth / recognition / curiosity angles) are drafted only for
Tier 1 candidates — see `references/outreach-examples.md` for the template patterns. Each
message names the real source ("your LinkedIn profile," mentioned mid-message, never as the
opener) and states the actual company, role, and comp band rather than teasing it.

---

## Why this is the example worth keeping

- **Verification is the product, not a nice-to-have.** In this run, roughly half of the
  "High confidence" search-stage candidates didn't survive a second look at the actual profile.
- **Judgment calls get logged, not buried.** Geography exceptions and seniority reconsiderations
  are named explicitly, with reasoning, so a human reviewer can agree or overrule — not silently
  decided either way.
- **The output is a rubric, not a vibe.** The same five criteria apply to every candidate, so two
  people can compare notes on _why_ someone ranked where they did.
- **Nothing gets sent automatically.** The skill drafts; a human sends. Every step above ends
  with a person deciding what happens next.
