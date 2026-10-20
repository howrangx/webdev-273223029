# Usage

One row per agent session. In Gemini CLI, type `/stats` before you quit and copy the input and output tokens. Copilot shows credits instead of tokens: write those in the credits column. The free tier charges nothing, so record what the session **would cost at the provider's published list price**, and note once below the table which price list you used. Leave the cost empty for rows that only show credits.

| Date | Tool | Input tokens | Output tokens | Credits (if no tokens) | List-price cost |
|---|---|---|---|---|---|
| 2026-10-20 | Gemini CLI (gemini-3-flash-preview) | 39 563 | 117 | | $0.020 |
| 2026-10-20 | Gemini CLI (gemini-3-flash-preview) | 25 116 | 46 | | $0.013 |

Prices: Google Gemini API standard list price for Gemini 3 Flash Preview, $0.50 per million input tokens and $3.00 per million output tokens (https://ai.google.dev/gemini-api/docs/pricing, checked 2026-10-20). Token counts are the totals from `/stats`, including the small gemini-3.5-flash-lite utility calls, all priced at the Gemini 3 Flash rate, and cached input is counted at the full input price, so the costs are a slight upper estimate.