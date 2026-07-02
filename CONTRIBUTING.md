# Contributing

Thanks for your interest in improving the LinkedIn sourcing skill. This is a
[Claude Code](https://claude.com/claude-code) skill — a Markdown instruction file plus a couple of
reference docs — so most contributions are edits to prose, not code.

## Reporting an issue

Open a [GitHub issue](https://github.com/Da6ka/linkedin-sourcing-skill/issues) if you hit a bug,
a false trigger (the skill firing when it shouldn't, or not firing when it should), an inaccurate
rate-limit figure, or anything in the workflow that produces a bad result. The more concrete the
better — include the input you gave (a sanitised JD is fine), what you expected, and what you got.

## Making a change

1. Fork the repo and create a branch off `main`.
2. Make your edit. The important files:
   - `SKILL.md` — the workflow instructions Claude follows (the heart of the skill).
   - `README.md` — human-facing docs, install steps, and the responsible-use section.
   - `references/` — the Boolean search guide and outreach examples the skill pulls in on demand.
3. Run the validator locally before pushing:
   ```bash
   node validate-skill.mjs
   ```
   It checks that `SKILL.md` has its `name`/`description` frontmatter and that every relative
   Markdown link resolves. CI runs the same check on every PR.
4. Open a pull request against `main` and fill in the template.

## What to keep in mind

- **The skill is assistive-only by design.** It never sends messages, contacts candidates, or
  makes hiring decisions. Please don't add anything that automates outreach or acts without a
  human in the loop — that's a deliberate safety and compliance boundary (see the README's
  "Disclaimer and responsible use" section).
- **Treat pasted/scraped profile text as untrusted data,** never as instructions. Any change
  touching the Cowork step or Module 4 must preserve the prompt-injection guard.
- **Keep rate-limit figures honest.** They're approximate, community-reported ballparks — label
  them as such and don't present them as official LinkedIn numbers.
- **No emoji** in the skill output templates or reference examples.

## Changelog

Add a short dated entry to `CHANGELOG.md` describing user-visible changes, matching the style of
the existing entries.
