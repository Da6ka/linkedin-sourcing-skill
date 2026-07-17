# Changelog

## 2026-07-17 — The user picks who outreach is written for (v2.3.0)

Module 4 hardcoded its target: outreach went to "the single highest-confidence profile from Module
2", and the user could only redirect it afterwards, by naming someone once three variants for the
wrong person had already been written. The waste was not really tokens — it was that outreach for
a candidate the recruiter did not want is worth nothing.

The choice now happens at **Checkpoint 2**, before Module 4 runs. That checkpoint already stops the
run, and the user is already looking at the Module 2 profile table — numbered, with a confidence
rating and a one-line rationale per row — so they can pick with the same information a dedicated
pause would have shown them, and the invitation costs one clause rather than a turn.

Deliberately *not* a new checkpoint. SKILL.md states that Modules 3 and 4 run together without a
pause because both are cheap; adding one between them would have contradicted that for no saving.
The design doc records the deviation.

Module 4's scope text becomes a default rather than a law: absent a choice, the top-confidence
profile is still used, stated in one line, and the run continues — the default is a real answer,
not a placeholder, and the model is told not to stop and ask when the user has already had their
chance to say. Multi-candidate outreach is capped at three (three candidates is nine messages,
already more than anyone reads carefully); name more and the three highest-confidence win, with
the omission stated.

The hosted demo has no Checkpoint 2, so the harness note now resolves this choice explicitly to
its documented default instead of leaving the model to infer that it may ask a question nobody can
answer.

## 2026-07-17 — A JD is source material, not a language signal (v2.2.2)

v2.2.1 fixed the wrong half of the rule. "Output language" said to write in English by default and
to match another language if *either* the user was clearly writing in one *or* the JD/briefing was
in one. Those are two different signals joined by an `or`, and the JD half meant a piece of input
data decided what language the user got spoken to in: paste a Russian JD while writing in English,
get a Russian report. v2.2.1 made that branch work more reliably, which was the wrong direction.

The JD branch is gone. Only the user's own messages set the output language; a JD, briefing, or
profile is source material to work from, not a sample of how the user wants to be addressed. A
Russian JD pasted by someone writing in English now gets an English run. Where a JD is the only
input and there is no user message to judge — the hosted demo, where the API call carries nothing
else — the English default applies.

What survives from v2.2.1: section headings are still named explicitly in the rule, and mixing is
still forbidden («Part A — Boolean строки» was the real artifact). The Module 4 exception is
unchanged in substance, but its example is realigned — it described a Russian JD producing a
Russian persona, which is exactly what this release stops.

The demo's `isCyrillicJd` helper is removed rather than kept: with the JD no longer a language
signal, the turn-cap note is unconditionally English and there was nothing left to detect.

Also tightens the anglicism rule, which carried one example («наблюдение», not «финдинг») — too
few to generalise from, leaving the model to guess which borrowings are jargon and which are
ordinary Russian. It now carves out established IT and recruiting usage explicitly: «кандидат»,
«гипотеза», «воронка», «локация», «стек», «аутрич», «сеньорность» are ordinary and stay, so the
rule cannot over-correct into «соискатель» and «предположение». The banned list is unchanged —
«сеньорность» reads as a violation of a naive "no anglicisms" reading but is settled IT usage, and
this makes that explicit rather than leaving it to inference. Pins the spelling too: runs produced
both «сеньорность» and «сениорность».

## 2026-07-17 — Match the JD's language by its body text, not its job title (v2.2.1)

A Russian JD came back with English section headings over Russian prose. SKILL.md's "Output
language" rule already said to match the JD's language, but it never said how to decide what that
language is, and it listed "persona, tables, and the Cowork instruction block" without mentioning
headings — so headings drifted.

Two gaps closed. The rule now covers section headings explicitly and forbids mixing: a Russian run
gets Russian headings, not English ones over Russian prose. And it says to judge the JD by its body
text rather than its job title — role titles are routinely English inside an otherwise
non-English posting ("Lead Generation Manager" heading a Russian JD), as are tool and platform
names, and none of those make it an English JD.

The Module 4 exception is unchanged: outreach still follows the candidate's likely language, with a
one-line note when it differs from the rest of the run.

The demo's turn-cap note (#75) had the same problem in code rather than in prose — it is appended
by the Worker after the agent is out of turns, so no model call can write it. It now follows the
JD's script, judged on the body's letters rather than the title. This distinguishes Russian from
English only, where the rule the model follows covers every language; a Russian JD consisting
almost entirely of English tool names would still get an English note, which prose-bearing JDs do
not trigger in practice.

## 2026-07-17 — Return the partial transcript when the agent hits its turn cap ([PR #75](https://github.com/Da6ka/tech-sourcing-skill/pull/75))

The demo agent's loop ended with an unconditional `throw`, so hitting `MAX_AGENT_TURNS` returned a
500 and nothing else. That was cheap when only the final turn's text was ever returned — there was
nothing worth salvaging — but #72 made the loop collect text from every turn, which turned the same
throw into a discard of the whole write-up: persona, Boolean strings, profiles, all of it, after
the caller had already waited about two minutes and paid for a full Opus run. #72 did not introduce
the throw, it made the failure expensive.

The loop now returns whatever sections the agent produced, followed by a note that the run stops
short and that a more specific job description usually completes within the limit. It still throws
when there is genuinely no text, since there is nothing to hand back.

Verified by exercising the path rather than reasoning about it: with `MAX_AGENT_TURNS` temporarily
set to 2, the full 3470-character JD run against a local `wrangler dev` returned HTTP 200 with 5106
characters — a complete persona and the Boolean strings — plus the note, where the old code
returned a 500. The cap was restored to 12 before the change was committed.

Known wrinkle: the note is English while the write-up follows the JD's language, so a
Russian-language run ends on an English sentence.

## 2026-07-16 — Override SKILL.md's checkpoints explicitly in the demo harness note ([PR #73](https://github.com/Da6ka/tech-sourcing-skill/pull/73))

The hosted demo is a single request/response call: any question the model asks ends the run and
leaves the caller with nothing usable. The harness note tried to prevent that with one sentence
telling the model to skip the skill's conversational checkpoints, and that sentence lost to
SKILL.md's titled, 45-line "Checkpoints — don't deliver everything at once" section. On a shortened
JD the run really did stop after the persona to ask for confirmation nobody could give.

The note now names that section, overrides Checkpoints 0, 1 and 2 in full, and defuses Checkpoint
1's stated rationale rather than just contradicting it: the checkpoint exists so that searches are
not spent on an unconfirmed persona, but submitting the JD to this endpoint *is* that confirmation
and there is nobody to confirm with afterwards. It also says what to do instead of asking — decide
from the JD, state the assumption in one line, keep going — and forbids ending on a question.

Scope note: on the full 3470-character JD the checkpoint never fired, either before or after this
change. The 40-second persona-only pause that prompted the work reproduced only on a shortened
1138-character JD. This is therefore defensive hardening for short or ambiguous input, not a fix
for an observed production failure.

The consent gate is deliberately preserved. The hh.ru/geekjob/Telegram region caveat in
`references/other-platforms.md` gates a source for legal reasons rather than for pacing, so
"never pause, always proceed" must not unlock it: the note resolves the caveat without asking,
fires the branch only on an explicitly named Russia/CIS location or a company legally based there,
and otherwise omits it with a one-line note. Verified on a live run — the model declines the branch
inline, citing that a Russian-language JD alone is not a Russia/CIS signal, and continues.

## 2026-07-16 — Return the whole agent transcript, not just the last turn ([PR #72](https://github.com/Da6ka/tech-sourcing-skill/pull/72))

The demo agent writes each stage of the workflow — persona, Boolean strings, notes on what a search
turned up — as text in the same turn it calls its tools. The loop returned only the final turn's
text, so every stage but the last was discarded and the caller got a write-up that opened
mid-thought, referring to work it never saw. This was the demo's most visible bug and a code review
missed it; it surfaced only on running the thing end to end.

The loop now collects the text from every turn and returns the joined transcript. A live run on a
real 3470-character JD comes back at 15343 characters across five sections — persona, Boolean
strings, profiles, scorecard, outreach — where the old code would have delivered the closing
section alone. Multiple text blocks within a single response are kept. The "no text at all" case
still throws, now keyed on the whole transcript being empty rather than on one response.

## 2026-07-16 — Verify the demo smoke test from the response body, not `wrangler tail` ([PR #69](https://github.com/Da6ka/tech-sourcing-skill/pull/69))

`SMOKE.md` told you to watch `wrangler tail` for the Apollo call, but live runs showed tail
connects and then captures no invocations when piped to a file or run non-interactively, even
when attached before the request — so the documented check silently proved nothing. The tail step
is now marked optional and interactive-TTY-only, and the reliable pass criterion is Apollo-only
data in the response body itself: dated employer history and the `(NDA)` placeholder, neither of
which a search-snippet fallback can produce. Docs only, no behavior change.

## 2026-07-16 — Add a `fetch_profile` enrichment tool to the demo agent ([PR #68](https://github.com/Da6ka/tech-sourcing-skill/pull/68))

The hosted agent had one tool, `search_web`, and scored candidates from search snippets alone —
no dated employment history, which is what the skill's scorecard actually wants. Adds a second
tool, `fetch_profile(url)`: LinkedIn URLs route to Apollo's people/match for dated history and
fall back to a snippet when Apollo has no match, and everything else (GitHub, hh.ru, personal
sites) goes to Firecrawl scrape, since Firecrawl blocklists LinkedIn. Profile data only — no
email or phone reveal. Apollo's `seniority` field is deliberately dropped: on a live run it
labelled both a 20-year data architect and a mid-career senior DE "entry", so the agent relies on
the dated history instead. A `HARNESS_NOTE` caps enrichment at roughly five High-confidence
LinkedIn profiles per run to bound Apollo credit spend and agent turns. Adds the `APOLLO_API_KEY`
secret. URL routing is unit-tested (9/9, including country subdomains and a spoofed
`evil-linkedin.com.attacker.io` host); typecheck clean.

## 2026-07-16 — Document why the cf-connecting-ip fallback is safe ([PR #66](https://github.com/Da6ka/tech-sourcing-skill/pull/66))

Comment only, no behavior change. A review flagged the demo rate limiter's `?? "unknown"` IP
fallback as failing open; it doesn't. Cloudflare sets `cf-connecting-ip` on every request that
reaches the Worker and rejects any client that supplies its own with a 403 at the edge, so the
fallback is unreachable and the header can't be spoofed to mint a fresh rate-limit bucket. Were
it reached, sharing one bucket is the restrictive direction, not a bypass. Recorded on the line
so the finding isn't re-opened.

## 2026-07-16 — Preserve line breaks and render fenced blocks in the demo ([PR #65](https://github.com/Da6ka/tech-sourcing-skill/pull/65))

The web app's Markdown renderer joined consecutive paragraph lines with a space, so the Boolean
search strings — the app's main copy-pasteable deliverable, which SKILL.md formats as consecutive
bare lines — rendered as one run-on paragraph. Paragraph lines now join with `<br>`; real model
output soft-wraps prose as single long lines, so ordinary text doesn't turn ragged. Also added
fenced code block support, which was missing entirely: the inline-code regex chewed ``` fences
into garbage, and real responses do return them. Frontend only, deployed to Pages separately.

## 2026-07-16 — Use a sliding window for the demo's rate limiter ([PR #64](https://github.com/Da6ka/tech-sourcing-skill/pull/64))

The limiter bucketed on wall-clock hour, so a caller could spend a full quota just before the
hour rolled and another immediately after — 10 requests in a couple of minutes against a 5/hour
cap. It's now a sliding-window log: each allowed request's timestamp is kept and ages out on its
own schedule, so there's no boundary to exploit. 429s also carry an accurate `Retry-After`, which
the fixed window couldn't know. Verified by running the same burst against both algorithms with
the window shrunk to 10s — the old one let a 6th request through, the new one rejects it.

## 2026-07-16 — Restrict the demo API's CORS to known origins ([PR #63](https://github.com/Da6ka/tech-sourcing-skill/pull/63))

`Access-Control-Allow-Origin` was `*`, so any site could call `/api/source` from its visitors'
browsers — spending the demo's Anthropic and Firecrawl budget and burning the per-IP rate limit
across that site's whole audience. Now an allowlist: the Pages frontend and its per-deploy
preview subdomains, plus localhost for development. CORS is browser-enforced, so this closes
cross-site embedding only; the rate limiter remains the control for direct scripted callers.

## 2026-07-16 — Stop relaying upstream error text to demo callers ([PR #62](https://github.com/Da6ka/tech-sourcing-skill/pull/62))

`/api/source` returned `err.message` verbatim on a 500, and upstream failures arrive with their
raw bodies attached — the Firecrawl search error interpolated the response text — so a public
endpoint echoed upstream account and quota detail to anyone who could trigger a failure. It now
returns a generic message and logs the detail, with `[observability]` enabled so that log is
retained rather than visible only during a live `wrangler tail`. Fixed at the source too: the
search error is surfaced to the model as a tool result whose text is returned to the caller, so
a raw body could reach a client through a 200, not only a 500.

## 2026-07-16 — Typecheck the Worker in CI ([PR #61](https://github.com/Da6ka/tech-sourcing-skill/pull/61))

CI ran only `validate-skill.mjs`, which checks the skill's Markdown structure and link targets.
The Worker under `webapp/worker` is TypeScript that ships to production and nothing verified it —
a `typecheck` script existed in its package.json but no job ever called it, so a type error could
reach a deploy with a green check on the PR. Adds a job running `npm ci && npm run typecheck`,
folded into the existing `validate` aggregate so the single required status check on main covers
it. It caught a real bug within the day: a self-recursive helper introduced during PR #63.

## 2026-07-16 — Cap jobDescription size on the demo API ([PR #60](https://github.com/Da6ka/tech-sourcing-skill/pull/60))

`/api/source` validated only that `jobDescription` was non-empty, so a caller could post an
arbitrarily large body and have it billed as Opus input tokens. The rate limiter caps request
count (5/hour/IP), not spend per request, and the agent loop resends the whole conversation on
each of up to 12 turns — so an oversized body grew cost quadratically in turns. Bodies over 20k
characters now get a 413 before reaching the agent, well clear of any realistic job description.
The textarea gains a matching maxlength as a UX hint; the Worker check is the enforcement.

## 2026-07-16 — Add web-app wrapper as webapp/, switch rate limiting to a Durable Object ([PR #58](https://github.com/Da6ka/tech-sourcing-skill/pull/58))

The Cloudflare Worker + Pages code behind the live demo (linked from the README in #56) is now
part of this repo, under `webapp/worker` and `webapp/frontend` — previously it only existed as an
untracked local project. The Worker reads `SKILL.md` and `references/*.md` directly from the repo
root at build time, so there's no embedded copy to drift out of sync. Also swapped the demo's
rate limiter from Workers KV to a Durable Object: KV is only eventually consistent and could
under-count a fast burst from one IP for up to ~60s before writes propagate, whereas a Durable
Object is single-threaded per instance and race-free. Verified locally (clean 5-allowed-then-429
sequence) and in production.

## 2026-07-15 — Add live web-app demo to README as a showcase ([PR #56](https://github.com/Da6ka/tech-sourcing-skill/pull/56))

README gains a "Live demo" section linking to `tech-sourcing-webapp.pages.dev`, a Cloudflare
Worker + Pages wrapper around this skill (Claude API + Firecrawl search), so readers can try the
full pipeline without installing Claude Code. Summarizes a verified live run (Go/fintech JD → 17
LinkedIn + 3 GitHub profiles, scorecard, outreach drafts, ~2 min end to end) without reproducing
real candidates' names. The web-app wrapper's code isn't part of this repo — this skill still
works standalone in Claude Code; the web app is just one possible harness around it.

## v2.1.0 — Worked-example wiring and consistency fixes

Note: the entries for PR #40 and PRs #42/#44 below were previously filed under v2.0.1, but
they merged after the v2.0.1 tag was cut — they ship in v2.1.0.

## 2026-07-13 — Match Variant 2's heading name to SKILL.md exactly ([PR #53](https://github.com/Da6ka/tech-sourcing-skill/pull/53))

`references/outreach-examples.md`'s Variant 2 heading now uses the exact name SKILL.md refers
to, so the cross-reference resolves unambiguously. No content changes to the variant itself.

## 2026-07-13 — Add tech-role examples to the Boolean search guide ([PR #52](https://github.com/Da6ka/tech-sourcing-skill/pull/52))

`references/boolean-search-guide.md` gains worked Boolean examples for common tech roles, so
the guide demonstrates the syntax on the searches this skill actually generates rather than
only abstract patterns.

## 2026-07-13 — Tooling: bump CI actions to latest majors ([PR #51](https://github.com/Da6ka/tech-sourcing-skill/pull/51))

`actions/checkout` and `actions/setup-node` bumped to their latest major versions in
`.github/workflows/ci.yml`. No content or behavior changes.

## 2026-07-13 — Add missing reference files to CONTRIBUTING.md and the PR template ([PR #50](https://github.com/Da6ka/tech-sourcing-skill/pull/50))

CONTRIBUTING.md's file map and the PR template described `references/` as only the Boolean
search guide and outreach examples; both now also mention the other-platforms decision
table/recipes and the worked walkthrough. Documentation only.

## 2026-07-13 — Fix DESIGN.md's false claim that Checkpoint 1 has no escape hatch ([PR #49](https://github.com/Da6ka/tech-sourcing-skill/pull/49))

DESIGN.md claimed Checkpoint 1 had no escape hatch; SKILL.md's escape hatch covers it.
Documentation only.

## 2026-07-13 — Make example-walkthrough.md's scoring tiers match SKILL.md's 3-tier scorecard ([PR #48](https://github.com/Da6ka/tech-sourcing-skill/pull/48))

The worked example's scoring language now uses the same 3-tier scorecard SKILL.md defines,
so the walkthrough no longer models a scoring scheme the skill doesn't use. Matters at runtime
since SKILL.md points to the walkthrough for ambiguous scoring judgment calls.

## 2026-07-13 — Add missing Threads mention to two README platform lists ([PR #47](https://github.com/Da6ka/tech-sourcing-skill/pull/47))

Two README platform lists omitted Threads even though `references/other-platforms.md` covers
it. Documentation only.

## 2026-07-13 — Backfill missing CHANGELOG entries ([PR #45](https://github.com/Da6ka/tech-sourcing-skill/pull/45), [PR #46](https://github.com/Da6ka/tech-sourcing-skill/pull/46))

Backfilled changelog entries for previously undocumented PRs (#9, #10, #16, #18, #21, #25, and
others) and softened DESIGN.md's claim that the changelog was complete. Documentation only.

## 2026-07-13 — Add as-built design doc ([PR #43](https://github.com/Da6ka/tech-sourcing-skill/pull/43))

New DESIGN.md documents the skill's architecture as built: context and motivation, high-level
behavior, the multi-platform architecture, the optional Cowork step, error handling and UX,
and the file/reference structure. Documentation only.

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

## v2.0.1 — Edge-case hardening

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
