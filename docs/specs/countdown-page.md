# Countdown page specification

Visual definitions (colors, typography, logo) are in the [Style guide](style-guide.md). Token encoding and validation are in the [Countdown link specification](countdown-link.md).

## Requirements

- **Route**: `/countdown/<token>`, matching the [Countdown link specification](countdown-link.md#2-url-format). No other route exists for this page.
- **Header**: same as the home page — logo and the feature name "Travel Countdown".
- **Valid token**: displays the countdown from the token's configuration (title, finish date, background, font colors), same as the home page's preview, but filling the page's viewport instead of a small box.
- **Invalid token**: the token fails to decode or fails validation ([Countdown link specification §4.2](countdown-link.md#42-when-reading-a-token)). Shows an "Invalid countdown link" message instead of a countdown.
- **Call to action**: in both states, a **Create my countdown** button that opens the home page.

## Details

### Valid token

- Reuses the same countdown display as the home page's preview (title, time left, background, font colors), scaled up to fill the viewport instead of a bounded preview box.
- A valid token whose finish date is in the past still displays: the counter shows zeros and "The countdown has finished", same as the preview.
- The **Create my countdown** button sits below the countdown, in its own bar with the app's neutral surface color — not the countdown's user-defined background — so it stays legible regardless of the countdown's colors.

### Invalid token

- Centered message: "Invalid countdown link" with a short explanation, on the app's normal (neutral) background.
- The **Create my countdown** button is shown below the message.

### Create my countdown

- A link to the app's base URL (the home page), not a form reset or client-side navigation — this page has no shared state with the home page.

## Implementation

| Concern                              | Location                            |
| ------------------------------------- | ------------------------------------ |
| Route matching (`/countdown/<token>`) | `client/src/App.tsx`                 |
| Page (valid/invalid states, CTA)      | `client/src/pages/CountdownPage.tsx` |
| Countdown display (`variant="page"`)  | `client/src/countdown/Countdown.tsx` |
| Token decoding                        | `client/src/countdown/link.ts`       |
