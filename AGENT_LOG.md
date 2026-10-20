# Agent log

One entry per agent session, newest at the bottom. Be honest: what went wrong is the useful part.

<!-- Copy this block for each session:

## YYYY-MM-DD · <short title>
- Goal:
- Delegated:
- Checkpoints:
- Went wrong:
- Changed by hand:

-->

## 2026-10-20 · Connect the MCP server to Gemini CLI
- Goal: connect my MCP server to Gemini CLI and check that the model picks one of my tools without being told which.
- Delegated: asked Gemini (gemini-3-flash-preview) "Which lecture talks about security?" without naming a tool. It called `find_lecture(number: 8)` on my server and answered from the tool result.
- Checkpoints: `node mcp-server/check.mjs -- node mcp-server/server.js` at 12/12 before connecting; `/mcp` showing `my-project` as Ready with 2 tools; I approved each tool call before it ran.
- Went wrong: `/mcp` first showed `my-project` as Disconnected, because Gemini does not start project MCP servers in an untrusted folder; fixed with `/permissions trust`. "Auto" model selection hung for about 2 minutes (7 requests to gemini-3.8-flash with 0 tokens), so I switched to gemini-3-flash-preview.
- Changed by hand: nothing in the code.

## 2026-10-20 · Description experiment
- Goal: see whether the tool description changes which tool the model chooses.
- Delegated: asked Gemini the same question in a new session, with the same model, after changing the `find_lecture` description to "Lecture helper.".
- Checkpoints: same model as the first session; checked which tool was called; `check.mjs` back at 12/12 after restoring the description.
- Went wrong: nothing. The model ignored `find_lecture` and called `search_lectures(keyword: security)` once.
- Changed by hand: the `find_lecture` description, then restored the original.