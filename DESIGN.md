# Design Doc: tech-sourcing Skill

Status: as-built (retrospective) — documents the system as of v2.0.1
Repo: [Da6ka/tech-sourcing-skill](https://github.com/Da6ka/tech-sourcing-skill)
Local install: `~/.claude/skills/tech-sourcing/`

---

## Context and motivation

---

**Problem.** Sourcing candidates is a multi-step manual workflow — read the JD, imagine an ideal
candidate, write Boolean search strings, run searches across several sites, judge which hits are
real matches, and write outreach that doesn't read like a template. Done by hand it's slow and
inconsistent between recruiters; done by an LLM with no structure it produces plausible-sounding
but frequently fabricated results (invented LinkedIn URLs, generic personas, template outreach).

**Goal.** Give Claude Code a repeatable, checkpointed sourcing workflow that a recruiter can drive
from a single pasted JD to persona → live profiles → scorecard → outreach, spanning LinkedIn plus
whichever adjacent platform (GitHub, Kaggle, hh.ru, etc.) fits the role, while keeping the
recruiter in control of the expensive/risky steps (web searches, LinkedIn account activity,
outreach language) via explicit checkpoints rather than running end-to-end unsupervised.

**Non-goals.**

- Not the other side of the hiring funnel — interview prep, scorecards for _interview_ rounds,
  offers, comp, onboarding are explicitly out of scope (stated in the skill's own trigger
  description) and routed to separate workflows.
- Not a resume/profile-improvement tool for the candidate side.
- Not a LinkedIn scraper — Part B (X-ray search) touches no LinkedIn account activity by design;
  actual profile scraping only happens if the user opts into the separate Cowork step, and even
  then it's browser automation on the user's own logged-in session, not a bulk scraping pipeline.
- Not a guarantee of exhaustive coverage — the skill deliberately caps search volume (15–20
  profiles, 4–6 searches) rather than trying to return every possible match.

---

## Implementation considerations

---

**Constraints that shaped the design:**

- **No invented data.** LLMs left unconstrained will pattern-complete a plausible-looking
  `linkedin.com/in/firstname-lastname` URL from a name. This skill treats that as a hard failure
  mode: Module 2 Part B explicitly forbids constructing, guessing, or pattern-completing profile
  URLs — only URLs literally returned by the search tool are used. An empty search result is
  surfaced as empty, with a concrete next move offered, rather than backfilled with invented rows.
- **Legal/compliance exposure varies by platform and jurisdiction.** hh.ru parsing is not just a
  ToS issue but is criminally exposed under Russian law (ст. 272.1 УК РФ, in force since December
  2024), so its recipe in `references/other-platforms.md` is X-ray-search-only — no direct
  scraping recipe exists for it. LinkedIn profile _visits_ (via the optional Cowork step) risk
  account restriction under LinkedIn's User Agreement, which is why that step is opt-in with an
  explicit risk disclaimer rather than a default action.
- **GDPR Article 14** requires telling a data subject where their personal data came from at first
  contact. Because sourced outreach is the "first contact," Module 4 treats the one-line mention
  of "your LinkedIn profile" as a compliance requirement, not a stylistic nicety — this shaped a
  concrete, testable rule (mention once, never as the opening line) rather than leaving it to
  model judgment.
- **Cost of the wrong default.** Web searches and LinkedIn profile visits are the two expensive/
  risky steps in the pipeline. The three-checkpoint structure exists specifically so neither one
  runs against an unconfirmed persona or without explicit consent.
- **Region-limited search tools.** Some web search backends skew US-centric and don't strictly
  honor `site:`/`OR` operators, which would silently corrupt confidence ratings for non-US roles
  if untreated — the skill requires flagging this rather than assuming clean results.

---

## High-level behavior

---

**Trigger.** The skill activates on requests to source or find candidates (LinkedIn or other
platforms), build a talent pipeline, or write recruiter outreach — including a pasted JD/briefing
with no platform named. It does not activate for interview-prep-side hiring work or for
improving the candidate's own materials.

**End-to-end flow (default full run):**

```
Greeting + scenario menu (if input insufficient)
        │
        ▼
Checkpoint 0 — candidate pool? (which platform beyond LinkedIn)
        │
        ▼
Module 1 — Candidate Persona  ──────────────► Checkpoint 1 (confirm before spending searches)
        │
        ▼
Module 2 — Search Strings + Live Profiles
   Part A: Boolean strings (LinkedIn / Google / Sales Navigator)
   Part B: Live X-ray search, 15–20 profiles, 4–6 search budget
   Part C: optional Cowork full-profile collection (opt-in, separate consent)
   Part D: additional platform from Checkpoint 0, via other-platforms.md
        │                                     ──────────────► Checkpoint 2 (continue / retry / stop)
        ▼
Module 3 — Profile Scorecard (5 criteria max, /15, traceable to Module 1 must-haves)
        │
        ▼
Module 4 — Outreach (3 variants, single top profile by default, 80–120 words each)
        │
        ▼
Next-steps footer + list of unused platforms
```

**Five entry scenarios**, selected at the greeting instead of always running the full pipeline:
full sourcing run, search-strings-only, outreach-only, score-already-found-profiles, or another
round reusing an existing persona. This exists so a user who only wants outreach doesn't pay for
persona + search they don't need.

**Checkpoints (the core control mechanism):**

| Checkpoint | Placed          | Purpose                                                      | Escape hatch                                                                                     |
| ---------- | --------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| 0          | Before Module 1 | Pick additional platform(s) beyond LinkedIn baseline         | Skipped if JD makes candidate type unambiguous; stated as an inference instead                     |
| 1          | After Module 1  | Confirm persona before spending the search budget            | No per-checkpoint bypass of its own — covered by the shared "run it all" escape hatch below         |
| 2          | After Module 2  | Choose: retry search / continue to scorecard+outreach / stop | User can request "run it all" to skip 0–2 entirely (Checkpoint 1 included, despite gating the expensive step) |

Stage 3 (Modules 3+4) has no checkpoint between them — both are cheap and complementary, so
gating them separately would add friction without controlling any expensive action.

---

## Multi-platform architecture

---

LinkedIn (Module 2 Parts A–C) is the **fixed baseline** — it always runs regardless of Checkpoint
0's answer, because it's the strongest general-purpose pool for nearly every role. Checkpoint 0's
answer only controls Part D — the _additional_ platform(s) layered on top:

| Checkpoint 0 answer      | Additional platform(s)                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Tech / engineering       | GitHub, Stack Overflow                                                                                       |
| Design / creative        | Dribbble, Behance                                                                                            |
| Data science / ML        | Kaggle                                                                                                       |
| Algorithm-heavy          | Codeforces                                                                                                   |
| Commercial / sales / ops | none — LinkedIn only                                                                                         |
| Russia/CIS               | hh.ru (primary), geekjob.ru                                                                                  |
| Not sure / mixed         | none initially; re-evaluated against the persona once Module 1 completes (a stated commitment, not optional) |

The mapping and per-platform search recipe (approach, confidence heuristics, safety notes) live in
`references/other-platforms.md` rather than inline in SKILL.md, so adding a platform is a
references-file change, not a SKILL.md restructure. Two platforms carry recipe-level constraints
baked into that file rather than left to model judgment: hh.ru (X-ray-search-only, per the
criminal-exposure note above) and Telegram (no automatable search — hands off to the user
directly, same fallback shape as "no web search tool available").

A user naming a specific platform mid-run ("also check Reddit") is honored directly, bypassing the
Checkpoint 0 menu — the menu is a convenience default, not a restriction.

---

## Optional Cowork browser-automation step

---

Module 2 Part C is the one place the skill crosses from passive search-engine querying into
actual LinkedIn account activity, and it's designed as a distinct, separately-consented decision
rather than a natural continuation of Part B:

- **Off by default.** The Google X-ray table from Part B is treated as a complete, standalone
  deliverable. The Cowork offer is made as a separate message after the user has had a chance to
  sit with the results — never folded into the same breath as delivering the table.
- **Consent must be informed, not reflexive.** The offer states plainly that this step visits
  LinkedIn profiles from the user's logged-in account, that LinkedIn's User Agreement prohibits
  automated scraping, and that account restriction is a real possible outcome — not a offered as
  routine automation. A quick "ok" without evidence the risk registered is treated as insufficient.
- **Pacing bound.** Never more than 15–20 profile visits per Cowork instruction, to stay under
  LinkedIn's own daily view-limit ballpark (~250–1,000/day) — batches beyond that are explicitly
  spread across the day rather than issued as one instruction.
- **Confidence-gated scope.** Only High/Medium-confidence profiles are included by default; Low-
  confidence rows would spend view quota on likely mismatches, so they're left out unless the user
  asks for them specifically.
- **Untrusted-content boundary.** Text extracted from a profile page is explicitly treated as data,
  not instructions — the instruction block tells Cowork to ignore any commands or formatting
  directives embedded in scraped profile text, closing off a prompt-injection vector from
  attacker-controlled profile content.
- **Retention note.** Every generated tracker instruction includes a reminder to delete or
  anonymize tracker rows once the search closes, since indefinite storage of full candidate work
  histories creates GDPR storage-limitation exposure (and stricter exposure under some national
  laws).

---

## Error handling and UX

---

| Condition                                                           | Behavior                                                                                                                                                                     |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Input covers 2+ roles or is self-contradictory                      | Name what was seen, ask which role/interpretation to build around — never silently pick or blend                                                                             |
| Seniority AND location both missing                                 | One direct clarifying question (the sole exception to "no open-ended questions") — both feed search strings and platform choice, and guessing wrong here cascades downstream |
| Search returns 0 profiles                                           | State it plainly, don't render an empty table; offer broadening the strings, revising the persona, or handing the Boolean strings to the user for manual search              |
| No web search tool available                                        | Skip Part B entirely; hand over Part A's Boolean strings for manual use; offer to continue once results are pasted back                                                      |
| Search tool is region-limited / ignores operators                   | Flag it explicitly; treat geographic mismatch as a confidence-rating input, not an assumption that filtering worked                                                          |
| Fewer usable profiles than the 15–20 target                         | Present fewer rows and say so — never pad to reach the target                                                                                                                |
| Company name not in the input (outreach)                            | Use a `[Company]` placeholder with a note to fill in — never invent a name                                                                                                   |
| Confidential/agency search (outreach)                               | State the confidentiality candidly with concrete detail ("a ~120-person Series B AI startup") — never a fabricated company name or generic filler                            |
| LinkedIn CAPTCHA/block during Cowork run                            | Skip that profile, mark "needs manual review" in the tracker, continue with the rest                                                                                         |
| User asks for a prior scenario-5 round but no persona is in context | Say the earlier persona isn't available; ask for it to be pasted or for the original JD — never fabricate a persona from the scenario name alone                             |

---

## Future-proofing

---

- **Adding a platform** is additive: extend the Checkpoint 0 table and add a recipe block to
  `references/other-platforms.md`; SKILL.md's Part D logic ("read the reference, follow the
  recipe, use its output format") doesn't need to change per platform.
- **Adding a scenario** (a 6th entry point) follows the existing pattern: define which modules it
  routes to and where it re-enters the checkpoint sequence.
- **Search-budget and pacing constants** (4–6 searches, 15–20 profiles, 15–20 Cowork visits/batch)
  are called out as explicit numbers in SKILL.md specifically so they can be tuned later without
  restructuring the surrounding logic.
- CI enforcement (`validate-skill.mjs` + the `validate` required check, below) is the mechanism
  that keeps future SKILL.md/reference edits from silently breaking frontmatter or structure.

---

## File and reference structure

---

```
tech-sourcing/
├── SKILL.md                          # trigger description + full 4-module workflow (this doc's subject)
├── README.md                         # user-facing docs, incl. LinkedIn account-risk guidance
├── CHANGELOG.md                      # dated entries per push
├── CONTRIBUTING.md
├── LICENSE
├── validate-skill.mjs                # structural/frontmatter validation, run in CI
├── .github/workflows/ci.yml          # runs the `validate` job required by the branch ruleset
└── references/
    ├── boolean-search-guide.md       # advanced Boolean operators, LinkedIn-specific syntax
    ├── outreach-examples.md          # example messages by role type (tech, commercial, finance, ops)
    ├── other-platforms.md            # Checkpoint 0 decision table + Module 2 Part D recipes
    └── example-walkthrough.md        # worked run: verification catching stale/aspirational profiles
```

SKILL.md stays self-contained for the core 4-module loop; the `references/` files are pulled in
only at specific decision points (Checkpoint 0 and Module 2 Part D read `other-platforms.md`;
advanced-syntax or example requests read the other two) rather than loaded upfront, keeping the
always-loaded frontmatter/instruction body smaller.

---

## Versioning and release process

---

- **Branching.** `main` is guarded by a repository _ruleset_ (not classic branch protection —
  queried via `repos/.../rules/branches/main`, not the `/protection` API) requiring a status check
  named exactly `validate`, 0 required reviews. All changes land via feature branch + PR; no direct
  push to `main`.
- **CI gotcha to preserve:** if `ci.yml` is ever changed to rename or matrix-split the `validate`
  job (producing contexts like `validate (ubuntu-latest)`), the literal `validate` context never
  reports and every PR becomes permanently blocked. The fix is to keep an aggregate gate job named
  exactly `validate` (`needs: [test]`) over any matrix, rather than renaming the required check.
  `--admin`-merging past this is treated as a non-option.
- **Changelog.** `CHANGELOG.md` gets a dated entry on every push that changes skill behavior or
  content (not just releases); pure-tooling pushes (lint/format config, CI plumbing) get a short
  entry too rather than being silently dropped — a gap here (PR #40 initially shipped with no
  entry) is what this doc's own drift was caught on, so treat a missing entry as a review-time
  check, not an assumption.
- **Releases.** User-facing milestones get a matching GitHub Release via `gh release create` —
  v1.0.0 (initial), v1.1.0 (multi-platform expansion), v2.0.0 (rename from `linkedin-sourcing-skill`
  to `tech-sourcing-skill`, reflecting the platform expansion beyond LinkedIn-only), v2.0.1
  (edge-case hardening), v2.1.0 (worked-example wiring and consistency fixes), v2.2.0 (the hosted
  web-app demo under `webapp/`, its security hardening, and profile enrichment). The README's
  release badge links to a version-pinned release URL, so cutting a release means bumping that
  link in the same cycle or it points at the previous one.
- **Local/remote sync.** The local install (`~/.claude/skills/tech-sourcing/`) is a git clone of
  the GitHub repo (`origin` points there). `git pull --ff-only origin main` updates the local copy,
  but a push to GitHub does not auto-update it, and the local copy can carry uncommitted edits that
  never reached GitHub — the two have drifted in both directions before. The frontmatter `name:`
  in SKILL.md must match the local folder name, or Claude Code won't load the skill, which is why
  the v2.0.0 rename touched the repo name, the local folder, and the frontmatter together instead
  of relying on GitHub's redirect from the old URL.

---

## Acceptance criteria (as-built, verifiable against current SKILL.md)

---

- [ ] A pasted JD with no platform named triggers the skill and starts Module 1 without requiring
      the user to name LinkedIn explicitly.
- [ ] No profile URL appears in output unless it was literally returned by a search tool call.
- [ ] A run against an hh.ru-flagged role never proposes a direct-scraping recipe — only X-ray
      search.
- [ ] The Cowork offer never appears bundled in the same message as the Part B results table.
- [ ] A Cowork instruction never lists more than 20 profile URLs in one batch.
- [ ] Every outreach variant is 80–120 words and contains exactly one, non-opening mention of
      where the candidate was found.
- [ ] A confidential-search outreach message never contains an invented company name.
- [ ] Checkpoint 1 stops the run by default; it is bypassed only by the explicit escape hatch
      ("run it all, no questions" / «сделай всё сразу»), which per SKILL.md skips all three
      checkpoints together, not selectively.
- [ ] A CI run renaming or matrix-splitting the `validate` job is caught before merge (i.e., the
      aggregate job name `validate` is preserved) — verify by checking `ci.yml`'s job names against
      the ruleset's required context.
