# Boolean search guide for LinkedIn sourcing

## Core operators

| Operator | Use | Example |
|----------|-----|---------|
| `"quotes"` | Exact phrase match | `"Head of Growth"` |
| `OR` | Either term (must be uppercase) | `"VP Sales" OR "Sales Director"` |
| `AND` | Both terms (default behaviour — useful for clarity) | `"SaaS" AND "Series B"` |
| `NOT` | Exclude a term | `"Marketing Manager" NOT "Digital"` |
| `()` | Group terms | `("VP" OR "Director") AND "Marketing"` |

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
site:linkedin.com/in "Head of International Marketing" OR "International Marketing Director" "FMCG" "London"

site:linkedin.com/in "VP Marketing" "B2B SaaS" "Series B" OR "Series C"

site:linkedin.com/in "Marketing Manager" "Unilever" OR "P&G" OR "Nestlé"
```

**Tips:**
- Drop location to get a wider result set
- Use company names as keywords to find people who worked at specific firms
- Combine title with a skill or tool: `"Demand Generation" "HubSpot" "SaaS"`
- Use past-tense company names for career-changers: `"ex-McKinsey" OR "formerly McKinsey"`

## LinkedIn Sales Navigator search

Sales Navigator has the most powerful search. Key filters to use:
- **Current title** — exact match or keyword
- **Past title** — for career changers
- **Company headcount** — proxy for company stage
- **Years in current role** — find people who might be ready to move (2–4 years is sweet spot)
- **Geography** — city or region level
- **Industry** — use sparingly, many people self-classify incorrectly

## Common mistakes to avoid

1. **Over-filtering** — too many keywords = zero results. Start broad, then narrow.
2. **Title inflation** — a "Manager" at a startup may be equivalent to a "Director" at a corporate. Use OR to capture variants.
3. **Missing title variants** — "Head of" vs "VP" vs "Director" vs "Lead" all mean similar seniority at different companies. Always include 3+ title variants.
4. **Ignoring adjacent roles** — the best candidate may have a non-obvious title. A "Country Manager" may be perfect for a "GM EMEA" role.
5. **Unparenthesized OR groups** — `AND` binds tighter than `OR`, so `"Title A" OR "Title B" AND "Skill"` actually parses as `"Title A" OR ("Title B" AND "Skill")` — anyone matching "Title A" alone passes, regardless of the skill clause. Always wrap every `OR` group in its own parentheses when it's combined with an `AND`: `("Title A" OR "Title B") AND "Skill"`.
