# Agent instructions

All coding agents (Claude Code, Codex, Cursor, …) follow [CLAUDE.md](CLAUDE.md) — it is the single source of
project rules, commands and the definition of done.

Reusable roles live in [.claude/agents/](.claude/agents/) and procedures in [.claude/skills/](.claude/skills/).
Tools without native sub-agent support can load those markdown files as prompts.
