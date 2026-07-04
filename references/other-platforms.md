# Sourcing beyond LinkedIn — branching logic and search recipes

This is an **opt-in extension** to Module 2, not a default step. LinkedIn X-ray search
(Part B) stays the primary and default sourcing channel. Only pull in a platform below when
the persona from Module 1 signals it's a better-than-LinkedIn pool for this specific role, or
the user explicitly asks for it ("also check Reddit", "look on Dribbble too").

## Decision table — persona signal → platform

Check the persona's **role**, **where they likely work now**, and **nice-to-have** sections
against this table. Suggest at most 1–2 platforms per run — don't run all of them "just in
case"; that dilutes signal and burns search budget for no benefit.

| Signal in the persona | Suggest | Why this pool beats/complements LinkedIn |
|---|---|---|
| Product/visual/UI designer, portfolio-driven role | Dribbble, Behance | Portfolio quality is directly visible; LinkedIn profiles rarely show actual work |
| Developer/engineer, any stack | GitHub, Stack Overflow | Actual code and technical depth are directly visible — the single strongest signal on this list, stronger than LinkedIn's self-reported titles |
| Developer/engineer, especially open-source or indie/build-in-public | Twitter/X | Public builders post work-in-progress and opinions LinkedIn doesn't surface |
| Data scientist / ML engineer | Kaggle | Competition tier and public notebooks show applied modeling skill directly, not just tool keywords on a resume |
| Backend/systems engineer where the role explicitly values strong algorithms/DSA (quant, big-tech-style interview loops) | Codeforces | Rating is a standardized, hard-to-fake measure of algorithmic ability — but see the caveat in the recipe before treating it as a general engineering signal |
| Community, DevRel, marketing-to-developers | Twitter/X, Reddit | These are the audiences such roles already engage — activity there is a direct skill signal |
| Deep technical niche (rare stack, research area) | Reddit (topic subreddits) | Niche subreddits concentrate specialists that generic LinkedIn keyword search misses |
| Russia/CIS market role | hh.ru (primary), geekjob.ru (secondary, tech-only), Telegram chats | hh.ru is the dominant RU resume database; geekjob narrows to tech; LinkedIn penetration is low there — see caveat below |
| Early-stage/indie-hacker, solo builder | Twitter/X, Threads | This audience under-indexes on LinkedIn and over-indexes on build-in-public posting |
| Nothing role-specific stands out | *(none)* | Default to LinkedIn only — don't force a platform match |

**Region caveat:** the hh.ru/geekjob/Telegram branch only fires when the persona's location or
company context is explicitly Russia/CIS. Treat it as a conditional match, not a default
inclusion for every ambiguous or unstated location — the earlier skill audit flagged
hardcoded Russia-only logic as a bug precisely because it fired outside that context.

---

## Per-platform recipes

Each recipe follows the same shape as LinkedIn Part B: an X-ray search via the public web
where possible, never a logged-in scrape. State the exact queries used, same as Module 2.

### GitHub

**Recipe:** `site:github.com "[skill/language]" "[keyword]"` for an X-ray pass, but GitHub's
own search (`github.com/search?q=...&type=users`) and topic pages
(`github.com/topics/[language-or-framework]`) are usually higher-yield than Google here since
GitHub indexes bios, READMEs, and repo languages directly. For a location-sensitive role, add
the location to the query — GitHub profiles often list it in the bio.

**Good signal:** consistent commit history (not just forks), original repos rather than only
starred/forked ones, README quality, contributions to recognizable projects in the target
stack, pinned repos that match the role's tech requirements.
**Red flag:** account is almost entirely forks with no original commits, or activity stopped
years ago — treat as stale unless other signals (e.g. a recent LinkedIn update) corroborate
they're still active in the field.
**Safety:** X-ray or native search only. Contact info in a public GitHub profile (email in
commits, bio) is fair game the same way a public LinkedIn profile is — but still route
outreach through the same tone/consent principles as Module 4, not a cold automated email.

### Stack Overflow

**Recipe:** Stack Overflow's own user search (`stackoverflow.com/users?tab=reputation&filter=[tag]`)
or tag-filtered search is more reliable than a Google X-ray, since reputation and tag
expertise aren't well exposed to external search engines. Filter by the relevant technology
tag and sort by reputation for a fast shortlist.

**Good signal:** high reputation concentrated in tags matching the role's stack (depth, not
just breadth), answer quality (accepted answers, detailed explanations) over question count.
**Red flag:** reputation built entirely on question-asking rather than answering — indicates
a learner, not necessarily a senior practitioner; useful context for calibrating seniority in
the scorecard, not automatically disqualifying.
**Safety:** profile pages are public and this is native site search — no scraping risk. Note
that Stack Overflow activity has declined industry-wide since ~2023 as usage shifted toward
LLM-assisted search, so a thin or dated profile doesn't necessarily mean low skill — corroborate
with GitHub or LinkedIn before treating it as a red flag.

### Kaggle

**Recipe:** Kaggle's own user search (`kaggle.com/search?q=[keyword]`) or browsing competition
leaderboards for the relevant domain (e.g. tabular, NLP, computer vision) is more useful than
a Google X-ray — profile tiers (Competitions, Notebooks, Datasets, Discussion are ranked
separately: Novice → Contributor → Expert → Master → Grandmaster) aren't well exposed to
external search.

**Good signal:** Expert+ tier specifically in **Competitions** or **Notebooks** matching the
target domain, public notebooks with clear methodology write-ups (not just a final score),
consistent participation over multiple competitions rather than one lucky result.
**Red flag:** high **Discussion**-tier only with no Competitions/Notebooks depth — indicates
forum activity, not hands-on modeling skill; don't let it substitute for the domain-specific
tier when scoring.
**Safety:** public profile and native search — no scraping risk.

### Codeforces

**Recipe:** Codeforces' user search (`codeforces.com/catalog` or direct profile search) and
contest standings pages surface rating directly. Rating bands run roughly: Newbie (<1200) →
Pupil → Specialist → Expert → Candidate Master (~1900+) → Master (~2100+) → Grandmaster+.

**Good signal:** a sustained rating in the Candidate Master+ range across many rated contests
(check contest count, not just current rating) for roles that explicitly test algorithmic
depth in interviews.
**Red flag / caveat:** competitive-programming rating measures algorithmic puzzle-solving
under time pressure — it does **not** directly measure production engineering skill
(architecture, collaboration, code maintainability). Only weight this platform for roles that
explicitly value that skill (quant trading, some big-tech interview loops); for a typical
product engineering role, treat a high rating as a nice-to-have signal, not a proxy for
overall seniority, and corroborate with GitHub.
**Safety:** public profile and native search — no scraping risk.

### Twitter / X

**Recipe:** `site:x.com "[role keyword]" "[skill/topic]"` or `site:twitter.com` as fallback.
Bio search is more reliable than tweet-content search for identifying current role.

**Good signal:** bio states current title/company, recent posts show hands-on work
(shipped features, technical opinions, conference talks).
**Red flag:** inactive >12 months, or persona-matching bio with zero substantive posts
(likely a lead-gen or aggregator account, not the person).

**Safety — public X-ray search only, never log in or automate.** X has pursued CFAA-based
litigation against scrapers (e.g. *X Corp. v. Bright Data*, 2023) and aggressively rate-limits
or blocks logged-out access with bot-walls, so treat the ToS boundary as actively enforced,
not theoretical:
- Never log in to browse — an authenticated session is what triggers ToS/CFAA exposure and
  the follower/following graph in particular is a common target of past enforcement actions.
- Never automate requests (headless browser, scraper, unofficial API) against x.com/twitter.com
  itself — only the `site:x.com` Google X-ray pattern above is safe, since it never touches
  X's servers.
- If X-ray results are sparse due to bot-wall-limited indexing, say so and fall back to a
  lower-confidence pass rather than suggesting a logged-in workaround.

### Reddit

**Recipe:** `site:reddit.com/r/[relevant-subreddit] "[skill]" "[role]"`, or search within a
subreddit directly for post/comment history. Reddit is pseudonymous by default — treat any
identity match as **Low confidence** unless the user's post or profile explicitly links a
name, LinkedIn, or portfolio.

**Good signal:** long-standing account with substantive technical answers in a relevant
subreddit; flair indicating expertise level.
**Red flag:** anonymity means you often can't reach a real identity at all — Reddit is best
used to find *language and problems this community cares about* for outreach personalization,
not always as a direct sourcing-to-contact channel.
**Safety:** never attempt to de-anonymize a Reddit user via cross-referencing without their
consent — flag this limitation to the user rather than guessing.

### Dribbble

**Recipe:** Dribbble's own search/tag filters (`dribbble.com/search/[skill or tag]`) work
better than a Google X-ray here since Dribbble's site search covers tags, colors, and shot
type. Filter by "Available for hire" if the role is urgent — but don't assume the badge
means actively job-seeking for a permanent role.

**Good signal:** consistent posting cadence, shots relevant to the target industry (e.g.
fintech UI, not just illustration), engagement (likes/saves) from other credible designers.
**Red flag:** portfolio dominated by unsolicited redesigns of famous apps with no real client
work — common practice-piece pattern, not necessarily disqualifying but worth noting in the
scorecard.

### Behance

**Recipe:** same approach as Dribbble — native search (`behance.net/search/projects?search=[keyword]`)
over Google X-ray. Behance skews toward brand/graphic/motion work vs. Dribbble's UI lean.

**Good signal:** case studies with process detail (not just final shots), credited team
role on multi-person projects.
**Red flag:** projects with no case-study text — harder to verify actual ownership of the work.

### hh.ru

**Recipe:** hh.ru resume pages are Google-indexed at `hh.ru/resume/...`, so use the same
X-ray pattern as LinkedIn Part B: `site:hh.ru/resume "[role]" "[skill]" "[location]"`. This
returns real resume URLs with title/experience snippets without sending any request to hh.ru
itself. This is the **primary** RU-market platform — hh.ru is the dominant resume database by
a wide margin; geekjob.ru (below) is a smaller tech-only niche within the same market.

**Good signal:** title, stack, and location in the snippet match the persona; recency isn't
visible from the snippet, so flag it as unverified until the user opens the profile.
**Red flag:** none specific beyond the general X-ray caveats — treat exactly like a LinkedIn
snippet match.

**Safety — do NOT scrape or automate hh.ru directly.** hh.ru's User Agreement
(`hh.ru/article/28949`, prohibited-actions list, item 12) explicitly bans
*"использование функций парсинга/программ парсинга"* (use of parsing functions/programs),
grouped with proxy evasion and remote-desktop circumvention as a security violation. The
exposure here is materially higher than LinkedIn's civil-ToS-only risk:
- **Criminal liability** — since 11.12.2024, unauthorized collection of personal data falls
  under ст. 272.1 УК РФ, with penalties up to 5 years.
- **152-ФЗ fines** — turnover-based penalties up to ~18M ₽ for personal-data violations,
  which scraping resumes would likely trigger.

The X-ray search above is safe because it never touches hh.ru's servers with an automated
request — it only queries Google. Never suggest a logged-in scraper, headless browser, or
unofficial API wrapper against hh.ru itself. Full contact details still require either the
candidate's consent or hh.ru's own paid employer access — that purchased-access path is the
only sanctioned way to get beyond what's in the public snippet, not a workaround to build.

### geekjob.ru

**Recipe:** geekjob's resume search is the closest analog to LinkedIn Recruiter search for
the RU tech market — search by role/stack keyword directly on the platform. There is no
reliable Google X-ray equivalent (resumes aren't consistently indexed). Use this as a
secondary pass alongside hh.ru above, mainly for its tech-specific filtering.

**Good signal:** recently updated resume (geekjob shows last-active date), stack match.

**Safety — treat with the same caution as hh.ru until its terms are separately confirmed.**
geekjob.ru is a resume database in the same RU jurisdiction as hh.ru, collecting the same kind
of personal data (name, contact intent, work history). The criminal and administrative exposure
described above for hh.ru — ст. 272.1 УК РФ (unauthorized personal-data collection, up to 5
years) and 152-ФЗ turnover-based fines — turns on Russian law and the nature of the data, not
on hh.ru's specific User Agreement wording, so there is no reason to assume geekjob.ru carries
materially lower risk. This is a resume database of people actively job-seeking — softer opener
than a cold LinkedIn message is appropriate; they've already signaled openness. But since
geekjob has no indexed X-ray path, any search here happens on-platform — stay within normal
manual browsing behavior only (no automation, no scraper, no headless browser) exactly as with
hh.ru, not because geekjob's own terms have been reviewed and found more permissive.

### Telegram chats/channels

**Recipe:** no public search index exists for most Telegram group content. This one can't
be run as an automated X-ray — it requires the user (who has access to the relevant
professional chats) to search manually, or paste candidate names/handles back for scoring
once found.

**Output when this branch fires:** don't fabricate a search step. Tell the user which
Telegram communities are typically relevant for this role type (if known from context) and
hand off the manual search, same as the "no web search tool available" fallback in Module 2
Part B.
**Safety:** never suggest joining a chat under false pretenses or scraping member lists —
both violate Telegram ToS and most communities' own norms.

### Threads

**Recipe:** `site:threads.net "[role keyword]"`. Threads' search indexing is thinner than
Twitter/X's — treat this as a low-yield supplementary pass, not a primary channel, and say
so if results come back sparse.

**Good signal / red flag:** same heuristics as Twitter/X — this is functionally the same
audience type on a newer platform.

---

## Output format when a platform branch fires

Keep it inside Module 2, as an additional labeled block after the LinkedIn table — don't
create a separate module number for this (avoids renumbering Modules 3–4 downstream):

```
## [Platform name] profiles found

| # | Name/handle | Signal | Link | Confidence | Why included |
|---|---|---|---|---|---|
| 1 | ... | ... | ... | High/Medium/Low | ... |

> Queries used: [exact queries, or "manual search — no indexed search available" for Telegram]
```

Confidence ratings use the same High/Medium/Low definitions as Module 2 Part B, adapted per
platform's identity-verification strength (e.g. a Reddit match is capped at Medium unless the
account explicitly links an external identity).
