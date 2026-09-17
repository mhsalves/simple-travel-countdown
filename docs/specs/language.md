# Language specification

The interface language of the app. Page layouts are described in the [Home page](home-page.md) and [Countdown page](countdown-page.md) specifications.

## 1. Requirements

- The interface is written in **Portuguese only**.
- There is no language selector and no language switching: the app does not offer or detect other languages.

## 2. Rules

| Item                    | Value                                                          |
| ----------------------- | --------------------------------------------------------------- |
| Interface language      | Portuguese (Brazil)                                             |
| `<html lang>`           | `pt-BR`, set in `client/index.html`                             |
| Date and time picker    | Material UI `ptBR` locale with the Day.js `pt-br` locale        |
| Date and time in the shared image | `DD/MM/YYYY HH:mm`                                    |

## 3. Scope

In Portuguese:

- Header, footer and page titles.
- The countdown form: field labels, placeholders, background options and validation messages.
- The countdown display: unit labels (Dias, Horas, Minutos, Segundos), the title placeholder and the status messages.
- The share modal: sections, orientation names, buttons, step instructions and feedback messages.
- The countdown page, including the invalid link message.
- The shared image, which draws the unit labels and status in Portuguese.

Kept as is:

- The application name "Travel Countdown", used as the brand and in the image watermark.
- The user's own countdown title.
- Preset names (Ocean, Sunset, Palm, Night, New Year, Birthday, Orlando) and app names (WhatsApp, Telegram).

## 4. Implementation

There is no translation layer: no dictionary, no `t()` helper and no language state. Portuguese text is written directly where it is displayed, and values that depend on data (an app name, a file name) use template literals.

| Concern            | Location                                     |
| ------------------ | -------------------------------------------- |
| Interface text     | The component that displays it                |
| Validation messages | `client/src/countdown/validation.ts`         |
| Countdown labels and status | `client/src/countdown/display.ts`     |
| Date picker locale | `client/src/main.tsx` (MUI `ptBR` + Day.js `pt-br`) |

Adding another language later would mean reintroducing that layer; until then, inline text keeps the components simpler to read.
