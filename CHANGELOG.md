# Changelog

## v2.0.1 — Edge-case hardening

## 2026-07-04 — Fix stale 15-minute CTA and missing walkthrough reference ([PR #40](https://github.com/Da6ka/tech-sourcing-skill/pull/40))

Module 4's outreach CTA rule in SKILL.md still said "15-minute call" after
`references/outreach-examples.md` was rewritten to 30-minute — the rule now matches its own
worked examples. `references/example-walkthrough.md` is now listed in SKILL.md's References
section, so it's read for ambiguous scoring/verification judgment calls mid-run rather than
only known about indirectly. `validate-skill.mjs`'s leading-blank-line strip now handles more
than one blank line before frontmatter.

No functional changes to the skill's default happy path — a self-consistency fix and a
validator hardening fix.

## 2026-07-13 — Tooling: exclude Markdown and JS from Prettier ([PR #42](https://github.com/Da6ka/tech-sourcing-skill/pull/42), [PR #44](https://github.com/Da6ka/tech-sourcing-skill/pull/44))

Prettier was rewriting emphasis style (`_x_` ↔ `*x*`) in shipped Markdown on every format run;
`.prettierignore` now excludes `*.md`, then `*.js`/`*.mjs` for consistency with the other repos.
No content or behavior changes.

## 2026-07-04 — Fix remaining edge cases across SKILL.md, references, and the validator ([PR #38](https://github.com/Da6ka/tech-sourcing-skill/pull/38))

Found via a follow-up subagent edge-case review of the same five files covered in #36, closing
out every item left open from both review passes. SKILL.md: the escape hatch now explicitly
covers Checkpoint 0 (with a stated default when it fires), Checkpoint 0 option 7's promise to
suggest a platform once the persona is seen is now always checked rather than incidentally, and
Scenario 5 ("another round") asks for the persona/JD instead of fabricating one when none exists
in context. `references/boolean-search-guide.md` gains non-Latin transliteration guidance, a
query-length ceiling, and special-character (`&`, `/`, `+`) handling.
`references/outreach-examples.md` gains edge cases for no-contact-path candidates,
already-contacted candidates, and non-English formality register.
`references/example-walkthrough.md` now illustrates a persona-correction-and-re-delivery cycle
and clarifies that its 72-candidate/dozen-round total is cumulative across multiple runs, not a
single-run budget violation. `validate-skill.mjs` guards against symlink-cycle infinite
recursion and adds best-effort `#anchor` validation for internal `.md` links.

No functional changes to the skill's happy path — these are guardrails, guidance, and validator
robustness fixes for edge cases, not changes to default behavior.

## 2026-07-04 — Add malformed-JD guardrails and fix two validator false-fail bugs ([PR #36](https://github.com/Da6ka/tech-sourcing-skill/pull/36))

Found via a follow-up subagent edge-case review of the remaining skill files (SKILL.md,
`references/boolean-search-guide.md`, `references/outreach-examples.md`,
`references/example-walkthrough.md`, `validate-skill.mjs`), after `references/other-platforms.md`
was already covered in #32/#34. SKILL.md now tells the agent to ask rather than silently pick a
role or blend requirements when the input describes multiple roles or is internally
contradictory, and to ask one clarifying question when both seniority and location are absent
rather than guess and cascade the error into every later module. `validate-skill.mjs` no longer
false-fails "no frontmatter" on a BOM/leading-blank-line file, and no longer false-fails a
"broken link" on literal `[link]` placeholder text inside fenced code blocks.

No functional changes to the CI gate's actual failure modes — both validator fixes only remove
false positives.

## 2026-07-04 — Clarify region-trigger ambiguity and Telegram consent gap ([PR #34](https://github.com/Da6ka/tech-sourcing-skill/pull/34))

Found via a follow-up subagent edge-case review of `references/other-platforms.md`, after the
geekjob.ru/Twitter-X fixes in #32. The region caveat for the hh.ru/geekjob/Telegram branch now
defines what counts as an "explicit" Russia/CIS signal — Cyrillic language alone isn't
sufficient, and the agent should ask the user rather than guess, since hh.ru/geekjob now carry
criminal-liability framing. The Telegram section now flags that manually copying names/handles
out of a private chat is GDPR-relevant personal-data processing even without scraping, and
shouldn't be treated as pre-cleared just because it's manual.

No functional changes — documentation only.

## 2026-07-04 — Strengthen geekjob.ru and Twitter/X legal/safety notes ([PR #32](https://github.com/Da6ka/tech-sourcing-skill/pull/32))

Found via a subagent edge-case review of the skill. `references/other-platforms.md`'s
geekjob.ru note previously read as lower-risk than hh.ru ("terms haven't been reviewed as
closely") despite being the same RU jurisdiction and data type — it now explicitly inherits
hh.ru's ст. 272.1 УК РФ / 152-ФЗ exposure. Twitter/X's note only referenced generic ToS
territory — now cites the _X Corp. v. Bright Data_ CFAA enforcement precedent and states
hard no-login/no-automation rules, matching hh.ru's level of rigor.

No functional changes — documentation only.

## 2026-07-04 — Add full worked example ([PR #30](https://github.com/Da6ka/tech-sourcing-skill/pull/30))

Added `references/example-walkthrough.md`, an anonymised end-to-end sourcing run kept in full
because the interesting part isn't the initial candidate list — it's what happens after:
verification catching aspirational LinkedIn branding and stale search snippets, and how the
skill surfaces judgment calls (geography exceptions, overqualification reconsiderations) instead
of deciding them silently.

Replaced the README's `## Example` section with a one-prompt-to-full-output showcase: an
effort-comparison hook, followed by the actual shape of a one-shot run (persona, search strings,
candidate table, scorecard, one outreach variant) shown directly in the README instead of only
linking out — so "what do I get for one prompt" is answered where a recruiter is already
looking. Still links to the full walkthrough for the deeper verification story.

Also changed the outreach call-to-action in `references/outreach-examples.md` from a 15-minute
to a 30-minute call, across all four occurrences.

No functional changes — documentation only.

## 2026-07-04 — Document bare-word exclusion caveat

Added a tip to the Google `site:linkedin.com` section of `references/boolean-search-guide.md`:
a bare `-word` exclusion (e.g. `-recruiter`) matches anywhere on the indexed page, not just the
title, so it can suppress legitimate candidate profiles alongside the intended exclusions.
Recommends a more specific phrase exclusion instead.

## 2026-07-04 — Document Boolean operator precedence bug

Added a 5th entry to "Common mistakes to avoid" in `references/boolean-search-guide.md`: an
unparenthesized `OR` group combined with `AND` parses incorrectly (`AND` binds tighter than
`OR`), silently widening results to match the first `OR` term alone. Always wrap `OR` groups
in their own parentheses when combined with `AND`.

## 2026-07-04 — v2.0.0: renamed to tech-sourcing-skill (BREAKING)

Renamed the repo, local install folder, and skill frontmatter `name` from
`linkedin-sourcing`/`linkedin-sourcing-skill` to `tech-sourcing`/`tech-sourcing-skill`, to match
the mostly-IT platform mix added in v1.1.0 (GitHub, Stack Overflow, Kaggle, Codeforces, hh.ru,
geekjob.ru, alongside LinkedIn).

- **Repo:** `Da6ka/linkedin-sourcing-skill` → `Da6ka/tech-sourcing-skill`. GitHub redirects the
  old URL automatically, but `git remote set-url` to the new URL is recommended.
- **Local install:** existing checkouts at `~/.claude/skills/linkedin-sourcing` must be renamed
  to `~/.claude/skills/tech-sourcing` — the skill's frontmatter `name:` must match the folder
  name for Claude Code to load it correctly. See the README's "Upgrading from `linkedin-sourcing`"
  note.
- **SKILL.md:** `name: linkedin-sourcing` → `name: tech-sourcing`; title "Candidate Sourcing
  Skill" → "Tech Sourcing Skill".
- **No functional changes** — this is a pure rename; all v1.1.0 behavior (Checkpoint 0, the
  platform recipes, LinkedIn as baseline) is unchanged.

**Breaking** because the folder path and skill name existing users reference change — hence the
major version bump rather than a minor one.

## v1.1.0 — General candidate sourcing, beyond LinkedIn

## 2026-07-03 — Document multi-platform sourcing throughout README ([PR #25](https://github.com/Da6ka/linkedin-sourcing-skill/pull/25))

Trigger phrasing, the example output, the FAQ, and the disclaimer intro still read LinkedIn-only
after the general candidate-sourcing expansion below — brought the rest of README in line. New
FAQ entries cover how the skill picks additional platforms (Checkpoint 0 /
`references/other-platforms.md`) and hh.ru's stronger safety note; the disclaimer intro now
flags that each additional platform carries its own ToS, with hh.ru called out as materially
higher legal risk.

## 2026-07-04 — General candidate-sourcing bot, beyond LinkedIn

Expands the skill from LinkedIn-only to a general candidate-sourcing bot ([PR #23](https://github.com/Da6ka/linkedin-sourcing-skill/pull/23)):

- **SKILL.md:** added Checkpoint 0, asked before Module 1, which finds out what type of
  candidates the user is sourcing (tech, design, data/ML, algorithm-heavy, commercial/general,
  RU/CIS) and maps that to a source set. LinkedIn always runs as the baseline; the answer only
  adds platform(s) on top via the new Module 2 Part D.
- **references/other-platforms.md (new):** decision table and search recipes for GitHub, Stack
  Overflow, Kaggle, Codeforces, Dribbble, Behance, hh.ru, geekjob.ru, Reddit, Twitter/X,
  Telegram, and Threads. hh.ru carries a stronger safety note than the rest — its User
  Agreement explicitly bans parsing (item 12), and unauthorized data collection is now criminal
  under RU law (ст. 272.1 УК РФ since 11.12.2024) with 152-ФЗ fines on top — so the recipe is
  X-ray-search-only, never a scraper or unofficial API wrapper.
- **SKILL.md / README:** run footer now lists sources that weren't used, so a follow-up round
  on a different platform doesn't require re-answering Checkpoint 0.
- **Frontmatter / title:** repositioned from "LinkedIn Sourcing Skill" to "Candidate Sourcing
  Skill" to reflect the broader scope.

## 2026-07-03 — Add release badge to README ([PR #21](https://github.com/Da6ka/linkedin-sourcing-skill/pull/21))

Added a shields.io release badge next to the CI badge, linking to the latest GitHub release.

## 2026-07-04 — Cowork pause + rate-limit footnote

Fixes from a cross-check against a third-party LinkedIn rate-limit breakdown ([PR #19](https://github.com/Da6ka/linkedin-sourcing-skill/pull/19)):

- **README:** added a footnote to the connection-requests row noting the free-tier (~80/week) vs
  paid-tier (~100/week) advisory split some community writeups report, and clarifying the skill's
  own safe-pace figure (50–75/week) already sits below both.
- **SKILL.md:** added an explicit pause before offering the Cowork profile-collection step — the
  profile table is now delivered as a standalone answer first, with the Cowork offer following as
  a separate, deliberate decision point rather than bundled into the same response.
- **SKILL.md:** strengthened the Cowork risk disclaimer so the user is asked to consciously confirm
  they're ready to accept the account risk, rather than treating a quick "ok" as informed consent.

## 2026-07-02 — Guard the validator against spaces-in-path and Windows regressions ([PR #18](https://github.com/Da6ka/linkedin-sourcing-skill/pull/18))

Follow-up to the `fileURLToPath` fix below: CI previously only ran `validate-skill.mjs` on
`ubuntu-latest` at a space-free workspace path, so a regression back to `new URL(...).pathname`
would still have passed green. CI now runs the validator on a `ubuntu-latest` +
`windows-latest` matrix, checking out into a directory named `space dir` so the full path
contains a space — the exact case that used to crash the old validator with an uncaught
`ENOENT`.

## 2026-07-03 — release-audit fixes

Fixes from a pre-release audit; no workflow changes:

- **Validator:** `validate-skill.mjs` now resolves its own path via `fileURLToPath` instead of
  `new URL(...).pathname`. The old form percent-encoded spaces (and mangled Windows drive paths),
  crashing the validator with an uncaught `ENOENT` on any checkout whose path contains a space —
  a case CI never caught because the runner path has none.
- **README:** dropped the `/skills` confirmation command (not a real Claude Code slash command) in
  favour of a version-agnostic "start a new session / just paste a JD" check.
- **SKILL.md:** tightened the `description` frontmatter (kept every trigger phrase and the negative
  scope, trimmed redundancy).
- **Outreach examples:** every example message in `references/outreach-examples.md` now includes the
  mid-message source mention (`your LinkedIn profile`) that Module 4 mandates as the GDPR Article 14
  notice — previously the rule was stated but not modelled by a single example.
- **Length guidance:** reconciled `outreach-examples.md` with SKILL.md so both frame 80–120 words the
  same way, and noted that the examples are skeletons a finished message expands to fill.

## 2026-07-02 — Add FAQ section to README ([PR #16](https://github.com/Da6ka/linkedin-sourcing-skill/pull/16))

Added a "Frequently asked questions" section to README covering common setup and usage
questions.

## [v1.0.0](https://github.com/Da6ka/linkedin-sourcing-skill/releases/tag/v1.0.0) — 2026-07-02

Everything from this line down shipped in the initial public release. Entries above are
post-release, unreleased changes.

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

## 2026-07-02 — Add CI status badge to README ([PR #10](https://github.com/Da6ka/linkedin-sourcing-skill/pull/10))

Added the CI workflow status badge under the README title.

## 2026-07-02 — Add skill validation and CI ([PR #9](https://github.com/Da6ka/linkedin-sourcing-skill/pull/9))

Added `validate-skill.mjs`, a dependency-free Node validator checking that `SKILL.md` has
`name:`/`description:` frontmatter and that every relative Markdown link across the repo
resolves to an existing file, and `.github/workflows/ci.yml` to run it on every push/PR to
`main` — the repo's first CI gate.

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

- **Consistency:** resolved the Module 2 Part B contradiction (8–12 URLs _per string_ vs
  15–20 _total_) — the target is now stated once: 15–20 profiles total across all strings
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
