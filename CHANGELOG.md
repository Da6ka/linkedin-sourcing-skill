# Changelog

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
