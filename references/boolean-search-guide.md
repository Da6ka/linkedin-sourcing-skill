# Boolean search guide for LinkedIn sourcing

## Core operators

| Operator   | Use                                                 | Example                                |
| ---------- | --------------------------------------------------- | -------------------------------------- |
| `"quotes"` | Exact phrase match                                  | `"Head of Growth"`                     |
| `OR`       | Either term (must be uppercase)                     | `"VP Sales" OR "Sales Director"`       |
| `AND`      | Both terms (default behaviour — useful for clarity) | `"SaaS" AND "Series B"`                |
| `NOT`      | Exclude a term                                      | `"Marketing Manager" NOT "Digital"`    |
| `()`       | Group terms                                         | `("VP" OR "Director") AND "Marketing"` |

## LinkedIn search bar tips

- LinkedIn's search bar supports basic Boolean but is inconsistent with complex strings
- Keep strings to 2–3 operators for reliability
- Use filters (location, industry, company size) to narrow — don't put everything in the string
- LinkedIn Recruiter supports full Boolean including `()` grouping

## Google site:linkedin.com search

This is often more powerful than LinkedIn's own search for finding profiles.

**Template:**

```
site:linkedin.com/in "[Title]" OR "[Title variant]" "[Keyword]" "[Location]"
```

**Examples:**

```
site:linkedin.com/in "Backend Engineer" OR "Software Engineer" "Go" "Postgres" "Series A"

site:linkedin.com/in "Staff Engineer" OR "Senior Software Engineer" "Kubernetes" "remote"

site:linkedin.com/in "Head of International Marketing" OR "International Marketing Director" "FMCG" "London"

site:linkedin.com/in "VP Marketing" "B2B SaaS" "Series B" OR "Series C"

site:linkedin.com/in "Marketing Manager" "Unilever" OR "P&G" OR "Nestlé"
```

**Tips:**

- Drop location to get a wider result set
- Use company names as keywords to find people who worked at specific firms
- Combine title with a skill or tool: `"Backend Engineer" "Go" "Kubernetes"` for a tech search,
  or `"Demand Generation" "HubSpot" "SaaS"` for a marketing one — the Boolean structure is the
  same regardless of domain
- Use past-tense company names for career-changers: `"ex-Google" OR "formerly Google"` (or
  `"ex-McKinsey" OR "formerly McKinsey"` outside tech)
- **`-exclusion` is a blunt instrument** — a bare `-recruiter` drops any indexed page containing
  that word _anywhere_, including sidebar "People also viewed" text or unrelated boilerplate, so
  it can suppress good candidate profiles along with the ones you meant to exclude. Prefer a more
  specific phrase exclusion (`-"recruiter at"`, `-"talent acquisition"`) over a single bare word.

## LinkedIn Sales Navigator search

Sales Navigator has the most powerful search. Key filters to use:

- **Current title** — exact match or keyword
- **Past title** — for career changers
- **Company headcount** — proxy for company stage
- **Years in current role** — find people who might be ready to move (2–4 years is sweet spot)
- **Geography** — city or region level
- **Industry** — use sparingly, many people self-classify incorrectly

## Non-Latin names, locations, and special characters

- **Transliteration is ambiguous, not solved by picking one spelling.** A Cyrillic name like
  Юрий has multiple standard Latin renderings (Yuri, Yuriy, Iurii); the same applies to CJK and
  other non-Latin scripts. A single wrong transliteration can silently return zero results with
  no error — the search just looks unusually thin. When sourcing in a non-Latin-script market,
  generate at least one string using the native script (`site:linkedin.com/in "Юрий" "Москва"`)
  alongside a transliterated variant, rather than committing to one spelling of the name/location
  and treating a thin result as "no matches."
- **Special characters in titles need escaping awareness, not literal copy-paste.** `&`
  (`R&D`), `/` (`Sales/Marketing`), and `+` (`C++`) behave differently across engines: Google
  generally ignores `&` and `+` as noise tokens (so `"R&D"` may effectively search as `"R D"`),
  while LinkedIn's own search bar treats `/` as a literal separator that can split one title into
  two unmatched terms. Prefer the spelled-out form (`"Research and Development"`, `"C plus
plus"` as a fallback variant) alongside the symbol form rather than assuming the symbol works
  everywhere it's typed.
- **Cap total string length.** Stacking 3+ title variants, several skill keywords, and a location
  in one string (per the "always include 3+ title variants" rule below) can produce a string long
  enough that Google truncates or silently drops trailing terms, and LinkedIn's own search bar
  degrades noticeably past a handful of operators (see "Keep strings to 2–3 operators" above).
  As a rough ceiling, keep any single generated string under ~12 quoted terms/operators total; if
  a persona needs more coverage than that, split it into two Boolean strings (as Module 2 Part A
  already does with "one string per talent pool archetype") rather than one long one.

## Common mistakes to avoid

1. **Over-filtering** — too many keywords = zero results. Start broad, then narrow.
2. **Title inflation** — a "Manager" at a startup may be equivalent to a "Director" at a corporate. Use OR to capture variants.
3. **Missing title variants** — "Head of" vs "VP" vs "Director" vs "Lead" all mean similar seniority at different companies. Always include 3+ title variants.
4. **Ignoring adjacent roles** — the best candidate may have a non-obvious title. A "Country Manager" may be perfect for a "GM EMEA" role.
5. **Unparenthesized OR groups** — `AND` binds tighter than `OR`, so `"Title A" OR "Title B" AND "Skill"` actually parses as `"Title A" OR ("Title B" AND "Skill")` — anyone matching "Title A" alone passes, regardless of the skill clause. Always wrap every `OR` group in its own parentheses when it's combined with an `AND`: `("Title A" OR "Title B") AND "Skill"`.
