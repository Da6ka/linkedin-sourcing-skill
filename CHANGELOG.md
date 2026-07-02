# Changelog

## 2026-07-02 — UX review fixes

Fixes from a UX pass over onboarding, wording, confirmations, formatting, accessibility, dead
ends, error messages, and consistency:

- **Consistency (spelling):** aligned the README to British spelling to match `SKILL.md`
  (personalised, synthesises, behaviour) — the README had mixed US/UK forms
- **Formatting:** added an explicit note that the fenced blocks in each module are format
  templates to render as Markdown, not to be echoed back as raw ``` code blocks
- **Wording:** glossed "X-ray search" on first use in Module 2 Part B, and "Cowork" in the
  user-facing opt-in offer, so neither term assumes prior familiarity
- **Dead ends:** Module 2 Part B now handles the zero-results case explicitly (say the searches
  came back empty and offer a concrete next move) instead of only covering "fewer than target"

Structural naming (Module / Part / Stage / Checkpoint / Scenario) was reviewed and left as-is
by design.

## 2026-07-02 — repo polish for public sharing

- **README fix:** the connection-requests row of the rate-limit table listed the paid cap
  (~100/week) as no higher than the free range (~80–100/week), which read as if paying lowered
  the limit. Corrected to ~100/week for both tiers, with a note that LinkedIn's weekly invitation
  limit is account-wide and a paid tier doesn't lift it (Premium raises the profile-view and
  messaging ceilings, not invites)
- **README:** added a "confirm it loaded" tip to the install section (`/skills` or paste a JD)
- **Contributor onboarding:** added `CONTRIBUTING.md`, GitHub issue templates (bug report,
  triggering issue) and a pull-request template

## 2026-07-02 — staged delivery with two checkpoints

- The full run no longer arrives as one giant response. It now pauses twice: after the
  persona (confirm or correct it before any web searches are spent) and after the profile
  table (another search round / continue to scorecard + outreach / stop). Scorecard and
  outreach still ship together — both are cheap. An escape hatch preserves the old
  behaviour: users who explicitly ask to "run it all, no questions" get the single-response
  full run

## 2026-07-02 — outreach language follows the candidate, not the JD

- A live test with a Russian JD surfaced a gap: the top candidate had an English-only
  profile, and the "match the JD language" rule would have produced outreach he couldn't
  read. Outreach messages (Module 4) are now written in the candidate's likely language,
  inferred from their profile, with a note whenever it differs from the rest of the output.
  Persona, tables, and scorecard still follow the JD/user language
- Non-English output should use native terms instead of English calques («наблюдение»,
  not «финдинг»)

## 2026-07-02 — missing company name in outreach (E2E test finding)

- An end-to-end test run surfaced a gap in Module 4: the "name the company and role clearly"
  rule assumed the company name is always in the input. The rule now covers all three cases —
  name it when known; use a [Company] placeholder plus a fill-in-before-sending note when the
  user simply didn't include it; and for agency or confidential searches, where the recruiter
  can't disclose the client, be candid in a human voice ("a company I can't name yet: a
  ~120-person Series B AI startup in Amsterdam") instead of a made-up name or vague filler

## 2026-07-02 — compliance review (GDPR, EU AI Act, 152-ФЗ)

Reviewed the workflow against GDPR, the EU AI Act (as amended by the May 2026 Digital
Omnibus agreement), and Russia's 152-ФЗ. The skill is assistive-only, which is the right
shape for all three regimes; five fixes landed from the review:

- **Outreach (GDPR Art. 14):** every message must now mention the source ("your LinkedIn
  profile") once, mid-message — the first message to a sourced candidate doubles as the
  legally required notice of where their data came from. The "I came across your profile"
  opener stays banned; the reference guide explains the distinction
- **Retention:** the Cowork tracker instruction now includes a reminder to delete or
  anonymise candidate rows once the search closes
- **README:** new "Human in the loop by design" disclaimer bullet (no auto-sending, no
  automated decisions); new EU AI Act bullet (recruitment AI is Annex III high-risk;
  deployer obligations expected from 2 December 2027); new Russia/152-ФЗ bullet (public
  profile ≠ consent, data-localization requirement, Roskomnadzor notification before
  cross-border transfers — including pasting Russian candidates' data into foreign-hosted
  AI services)

## 2026-07-02 — Cowork step is now opt-in

- Split the workflow into a safe default and an explicit opt-in: the Google X-ray search
  (Part B) is the complete deliverable and involves no LinkedIn account activity; the Cowork
  profile-collection instruction is no longer printed automatically. After the profile table,
  the skill now offers the Cowork step with a plain risk disclaimer (mirroring the README's
  account-restriction warnings) and generates the instruction block only if the user says yes

## 2026-07-02 — greeting and scenario menu

- The skill now opens every run with a short greeting. If the user already pasted a JD or
  profiles, it names the path it's taking and runs it in the same response (no added
  friction). If the input isn't enough to start, it shows a five-scenario menu (full run /
  search strings only / outreach only / score profiles / another round) instead of asking
  open-ended questions, with each scenario routed to the matching modules

## 2026-07-02 — behavioral test round (6 live headless runs)

Tested the skill end-to-end in fresh Claude Code sessions: default JD run, rare-role honesty,
positive/negative triggering, non-English JD with no web search tool, and a prompt-injection
attempt embedded in a pasted profile. All six passed — no fabricated URLs (every profile link
was verified to appear verbatim in the live search results), search budget respected, honest
under-target reporting, correct language matching, graceful no-search fallback, and the
injection was flagged and ignored. One fix from the round:

- **Quota hygiene:** the Cowork collection block previously included every profile from the
  table, Low-confidence rows included. It now lists only High/Medium-confidence profiles by
  default, so profile-view quota isn't spent on likely mismatches

## 2026-07-02 — post-publication review fixes

Fixes from a team-lead-style review of the published repo:

- **Consistency:** resolved the Module 2 Part B contradiction (8–12 URLs *per string* vs
  15–20 *total*) — the target is now stated once: 15–20 profiles total across all strings
- **Reliability:** added a hard "never invent URLs" rule — only profile URLs literally
  returned by the search tool may appear in the table; fewer results are presented honestly
- **Cost/latency:** capped the web-search budget at 4–6 searches per sourcing run
- **Robustness:** added a fallback for environments with no web search tool (deliver Boolean
  strings only, user runs them manually)
- **Behavior:** defined Module 4's default output — three variants for the single
  highest-confidence profile as a demonstration, more on request
- **Cleanup:** removed the screenshot mention from the Cowork step prose (the instruction
  never took one), and clarified that Claude fills the URL placeholder in the Cowork block
- **README:** fixed the safe-daily-pace figures that exceeded the weekly caps they cite
  (now 10–15/day, max 5 days/week); documented the Cowork dependency for Part C; corrected
  the "operates your browser" claim (only the optional Cowork step does); added update
  instructions and a usage example

## 2026-07-02

Pre-release validation before sharing the skill publicly:

- **Behavioral run:** exercised the full workflow end-to-end with a sample JD and live web
  search. Real profile URLs come back when the search tool is actually called (verified), but
  two defects surfaced and were fixed in `SKILL.md`:
  - search results mix in `/jobs/`, `/posts/`, `/company/` URLs — added an explicit step to
    keep only `/in/` profile URLs
  - built-in web search can be region-limited (e.g. US-only) and skews non-US roles — added a
    search-tool caveat and tied geographic match to the confidence rating
- **Trigger accuracy:** tightened the `description` frontmatter — removed over-broad catch-alls
  ("any recruiting research", "any variation of recruiting/headhunting workflow") that could
  false-fire on adjacent tasks (interview prep, offers, own-profile editing), and added an
  explicit "do NOT use for" clause
- **Repo hygiene:** added an MIT `LICENSE`; softened the README's account-safety guarantee into
  a disclaimer; marked the rate-limit figures as approximate/unofficial; added a
  responsible-use section covering LinkedIn ToS and candidate-PII/GDPR responsibility

## 2026-07-01

Fixed 8 issues found in a QA review of the skill (#1–#8), addressed in commit
[f825797](https://github.com/Da6ka/linkedin-sourcing-skill/commit/f825797):

- **Safety:** capped profile lookups per run (~15–20) and Cowork batch size to match the
  README's own LinkedIn rate-limit guidance (#1)
- **Security:** scraped/pasted LinkedIn profile text is now treated as untrusted data, not
  instructions, in the Cowork step and Module 4 (#2)
- **Bug fix:** replaced the literal `web_search` tool reference with generic "your available
  web search tool" wording (#3)
- **Bug fix:** defined the High/Medium/Low confidence scale and added it as a column in the
  profile table output (#4)
- **Clarity:** capped Module 4 outreach generation to named/shortlisted candidates instead of
  implying output for every profile found (#5)
- **Cleanup:** removed the Russia-specific "export direction" business logic from Module 1 and
  Module 3 (#6)
- **Localization:** output language now matches the user/JD instead of being hardcoded; all
  templates and reference examples were translated to English as the new default (#7)
- **Cleanup:** added a de-duplication step across overlapping search variants in Module 2 (#8)
