# Design Doc: stage checkpoints, per-stage skip, and outreach candidate selection

Status: proposal — not implemented, not approved
Repo: [Da6ka/tech-sourcing-skill](https://github.com/Da6ka/tech-sourcing-skill)
Scope: Phase 1 = SKILL.md. Phase 2 = webapp multi-turn.
Related: [DESIGN.md](DESIGN.md) documents the system as built.

Context and motivation
----------------------

**Problem.** Checkpoints today are _binary and global_. The skill either paces the run with three
checkpoints, or — via the escape hatch at SKILL.md:158–164 ("run it all, no questions") — skips all
three. There is nothing in between. Two consequences:

- A user who wants only a persona still pays for the full run unless they know the magic words.
- A user who wants the full run gets asked three times unless they know the magic words.

Both failure modes are _discoverability_ failures as much as design ones: the escape hatch is
reactive, never offered.

**Evidence — the first problem is smaller than it looks.** A live baseline run against the hosted
demo (2026-07-17, the full 3470-character JD) ran all four modules in a single pass and never
paused: no persona checkpoint, no closing question. The 40-second persona-only stop that motivated
this design reproduced only on a shortened 1138-character JD. Checkpoints therefore do not
over-fire on realistic input, and the token saving this design chases is **unmeasured**. That does
not invalidate the goals, but it does rank them: goal 3 has demonstrable waste today, goals 1 and 2
rest on an assumption that one run has already undercut. See open questions 1 and 4.

**Second problem.** Outreach targeting is decided _after_ the money is spent. SKILL.md:480–485
writes three variants for "the single highest-confidence profile", then offers to do the same for
others. If the user wanted candidate #4, the first set was wasted.

**Goals.**

1. A checkpoint before each stage, so tokens aren't spent on stages nobody wants.
2. Per-stage skip, so users aren't nagged — including a sticky "don't ask again".
3. The user chooses which candidate(s) get outreach, before it is written.
4. Give the webapp a first-class way to declare "no checkpoints" instead of arguing with SKILL.md
   in prose (PR #73).

**Non-goals.**

- Not making consent gates skippable (see Design principles).
- Not adding checkpoints _within_ Module 2's parts (A/B/C/D stay one stage).
- Not changing scoring criteria, outreach variants, or persona structure.
- Phase 1 does not touch the webapp's request/response shape.

Implementation considerations
-----------------------------

**Constraint: this is a prompt, not code.** SKILL.md is 601 lines and the Checkpoints section is
~50 of them. Every rule added competes for the model's attention with every other rule. PR #73 is
the cautionary tale: one sentence ("skip every conversational checkpoint the skill text describes")
lost to a titled 45-line section. Complexity here is not free — it is the primary risk.

**Constraint: three kinds of pause are currently conflated.** This is the core insight of the
design, and the thing that makes "skip checkpoints" safe to specify:

| Kind        | Purpose                                   | Example                              | Skippable?                          |
| ----------- | ----------------------------------------- | ------------------------------------ | ----------------------------------- |
| **Gate**    | Protect spend / effort                    | CP1 "is the persona right?"          | Yes — by policy                     |
| **Input**   | Collect a decision the skill cannot infer | CP0 "which candidate pool?"          | Only if a documented default exists |
| **Consent** | Legal / ToS risk                          | hh.ru region gate, Cowork collection | **Never by policy**                 |

Consent gates are not pacing. `references/other-platforms.md`:27–38 gates hh.ru behind criminal
liability framing (ст. 272.1 УК РФ), not preference, and says outright: "getting this wrong in
either direction has real cost: don't guess." Cowork collection is separate consent for LinkedIn
account activity (DESIGN.md:62). A blanket "run it all" must never unlock either.

**Design principle: consent is satisfiable in advance, never by implication.** A specific statement
("this is a Russia/CIS role, use hh.ru"; "yes, collect the profiles with Cowork") _satisfies_ the
gate — it is exactly the confirmation the gate asks for, so no mid-run pause is needed. A general
statement ("run it all", "no questions") does **not**. Absent specific authorization, resolve to the
conservative default (omit the source/step), state it in one line, and continue. Never block.

High-level behavior
-------------------

A **run policy** governs the whole run. It is set at the start, sticky for the session, and
adjustable at any point.

- `ask` (default) — check in before each gate/input stage.
- `auto` — skip all gates; resolve every input to its documented default, each stated in one line.
- `stages: [...]` — run exactly these stages; skip the rest.

**Offered once, not repeated.** At the first checkpoint only, one line makes the policy
discoverable:

> I'll check in before each stage — say "run it all" to skip that, or name the stages you want.

**Stages and their pauses:**

```
Stage            Pause kind   Question                              Default when skipped
──────────────────────────────────────────────────────────────────────────────────────────
0 Pool           Input        which candidate pool?                 infer from JD; else LinkedIn only
1 Persona        Gate         does this match?                      proceed
2 Strings        Gate         (folded into stage 3's pause)         proceed
3 Profiles       Gate         spend searches now?                   proceed
  └ Cowork       Consent      collect full profiles?                omit, state inline
  └ hh.ru        Consent      RU/CIS region?                        omit unless JD explicit, state inline
4 Scorecard      Gate         continue to scoring?                  proceed
5 Outreach       Input        who should I write to?                top-confidence profile (today's behavior)
```

Stage 5's pause is new and is the answer to "let the user choose the candidate". It is an **input**
pause, not a gate: it collects a required decision that has a sensible default, so `auto` mode
resolves it to today's behavior (top match) rather than skipping outreach entirely.

Error handling and UX
---------------------

- **Ambiguous skip.** "skip the scorecard" → skip stage 4, keep going. "skip to outreach" → run
  everything needed to make outreach possible (profiles must exist), skip the rest, state what was
  inferred in one line.
- **Skipping a prerequisite.** Outreach requires profiles; scorecard requires profiles. If the user
  skips a prerequisite, say so in one line and run the minimum needed rather than failing.
- **Policy conflict.** A specific instruction beats the policy ("run it all, but ask me before
  outreach").
- **Never end on an unanswerable question** in a harness with no reply channel (see Phase 1, step 4).

Implementation outline
----------------------

**Recommended sequencing.** Split phase 1. Do **1a — outreach candidate selection** (steps 2, 3
and 5 below) first: it addresses the one goal with proven waste, it is small, and it cannot regress
the consent gates because it does not touch the checkpoint machinery. Hold **1b — the run-policy
rewrite** (steps 1 and 4) until open question 4 has an answer. Every rule added to SKILL.md competes
for the model's attention with every other rule, and a ~50-line rewrite is a large bet to place on
an unmeasured saving.

**Phase 1 — SKILL.md (the mechanism).**

1. Rewrite the Checkpoints section around the gate/input/consent taxonomy and the run policy.
   Keep it at or under its current ~50 lines — replace, don't append.
2. Add the stage-5 input pause (candidate selection) and update Module 4's scope text at
   SKILL.md:480–485, which currently hardcodes "the single highest-confidence profile".
   Cap multi-candidate outreach (suggest 3) so cost stays bounded.
3. Update DESIGN.md — the goal statement at :19–23 and the pipeline diagram at :85–104 both encode
   the three-checkpoint structure.
4. Replace the webapp harness note's prose override (PR #73) with a policy declaration:
   `policy = auto`. This is the payoff — the note stops fighting a titled section and starts using
   a supported mechanism. Keep #73's consent paragraph: `auto` must still not unlock hh.ru.
5. CHANGELOG entry. This changes published skill behavior, so it needs a version bump (v2.3.0) and
   the badge-link step from the release checklist — unlike the webapp-only work in #60–#67.

**Phase 2 — webapp multi-turn (separate design).** Sketch only:

- `POST /api/source` → `{ sessionId, stage, output, awaiting }`.
- `POST /api/source/continue` → `{ sessionId, reply }`.
- Store the `messages` array in a Durable Object keyed by `sessionId`, with a TTL.
- Rate limiting becomes per-session as well as per-IP; a session must not be a quota bypass.
- Frontend renders the stage plus a continue/skip control.
- Only worth building if the token saving is real: it saves an Opus run when users stop early,
  and costs session storage plus a stateful API surface.

Testing approach
----------------

There is no way to unit test a prompt. `validate-skill.mjs` checks Markdown structure and links
only, and CI will not catch a behavior regression here.

Proposed manual scenario matrix (run in Claude Code, then via the webapp):

| #   | Input                                   | Expect                                                              |
| --- | --------------------------------------- | ------------------------------------------------------------------- |
| 1   | JD, no policy                           | Pause before each stage; offer line appears exactly once            |
| 2   | JD + "run it all"                       | No pauses; outreach for top match; defaults stated in one line each |
| 3   | JD + "just the persona"                 | Persona only; no searches spent                                     |
| 4   | JD + "skip outreach"                    | Persona → profiles → scorecard; stops                               |
| 5   | At stage 5: "write to #4"               | Outreach for #4, not #1                                             |
| 6   | Russian-language JD, no stated location | hh.ru **omitted**, noted in one line — under both `ask` and `auto`  |
| 7   | JD + "this is a Russia role, use hh.ru" | hh.ru fires — consent satisfied specifically                        |
| 8   | JD + "run it all" (RU-ambiguous)        | hh.ru still omitted — general instruction is not consent            |

Scenarios 6–8 are the regression tests that matter most; they encode the distinction this design
rests on.

Acceptance criteria
-------------------

1. A default run pauses before each stage, and the discoverability line appears exactly once.
2. "run it all" produces a complete run with zero pauses and every default stated in one line.
3. A named stage subset runs exactly those stages; prerequisites are inferred and stated.
4. Outreach is written for the candidate(s) the user names; absent a choice, the top-confidence
   profile, matching today's behavior.
5. Multi-candidate outreach is capped and the cap is stated when it binds.
6. Under `auto`, hh.ru is omitted for an RU-ambiguous JD, and Cowork never runs without specific
   consent. Scenarios 6–8 pass.
7. The webapp harness note declares a policy rather than arguing with SKILL.md, and PR #73's
   consent paragraph survives.
8. The Checkpoints section is no longer than it is today.

Open questions
--------------

1. **Is `ask` still the right default for Claude Code?** More stages means more pauses. If most
   users say "run it all", the default is wrong and `auto` + opt-in pacing may fit better. The
   baseline narrows this: the model already runs end-to-end without pausing on realistic input, so
   the cost of `ask` today is lower than assumed — and so is the benefit of adding more gates.
2. **Multi-candidate outreach cap** — 3? Or scale with the scorecard's priority tier?
3. **Does stage 2 (strings) deserve its own pause?** Strings are cheap to produce and are the input
   to the expensive stage; folding its pause into stage 3 keeps the count down.
4. **Phase 2 gating** — is the Opus saving worth a stateful API? Worth measuring how often a demo
   user would actually stop at the persona before building it. This is now the load-bearing
   question for 1a → 1b as well: with no evidence that checkpoints over-fire, the entire case for
   the run-policy rewrite rests on this measurement.
