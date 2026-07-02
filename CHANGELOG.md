# Changelog

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
