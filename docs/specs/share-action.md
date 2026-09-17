# Share action specification

How a countdown is shared from the home page: the share triggers, the share modal, the shared image and the share targets. The link format is defined in the [Countdown link specification](countdown-link.md) and visuals in the [Style guide](style-guide.md).

## 1. Requirements

- A **Share** action is available in two places: a button on the form and a button below the preview. Both run the same action.
- The action opens a modal with:
  - The generated link with a copy action.
  - A screenshot of the preview as a **landscape** or **vertical** image; the user chooses which one to share.
  - Share targets: **WhatsApp**, **Telegram** and **Other** (the device's native share, displayed only on mobile).
- A share sends the chosen image and the generated link.
- The image follows the preview format, with a small, subtle application watermark on the right baseline and the generation date and time (`dd/mm/yyyy hh:mm`) on the left baseline.

## 2. Triggers

| Trigger           | Location                          | Style                                     |
| ----------------- | --------------------------------- | ----------------------------------------- |
| Form button       | Below the form fields             | `contained`, large, full width, share icon |
| Preview button    | Below the preview                 | `outlined`, large, full width, share icon  |

Both triggers validate the form with the rules in [Countdown link specification §4.1](countdown-link.md#41-when-sharing). When validation fails, field errors are shown (and stay live while editing), the first invalid field is scrolled into view and focused, and the modal does not open. When it passes, the modal opens with a snapshot of the current form values and the current date and time as the **generation time**.

## 3. Share modal

Title: share icon + "Share your countdown". Full screen on small screens (`< sm`), otherwise a `sm` dialog. Closed with **Close**, `Esc` or clicking outside.

### 3.1 Link

| Element | Content                                                                         |
| ------- | ------------------------------------------------------------------------------- |
| Field   | Read-only "Countdown link" text field with the full link, selected on focus    |
| Copy    | **Copy** button. After copying it shows **Copied** with a check icon           |
| Failure | If the clipboard is unavailable, an error alert asks to select and copy the link manually |

### 3.2 Image

| Element     | Content                                                                          |
| ----------- | -------------------------------------------------------------------------------- |
| Orientation | Toggle: **Landscape** (default) or **Vertical**                                 |
| Preview     | Thumbnail of the image that will be shared; a progress indicator while it renders |
| Notice      | When a custom background image cannot be included (section 4.4), an info alert explains that a plain background is used |

Both orientations are rendered when the modal opens, so switching is instant and share buttons act immediately (browsers require share and pop-up actions to run directly from the click).

### 3.3 Share targets

| Target       | Visible            | Action                                                                                   |
| ------------ | ------------------ | ---------------------------------------------------------------------------------------- |
| **WhatsApp** | Always             | Downloads the chosen image and opens `https://wa.me/?text=<message>` in a new tab/app    |
| **Telegram** | Always             | Downloads the chosen image and opens `https://t.me/share/url?url=<link>&text=<text>`     |
| **Other**    | Mobile only, and only when the browser can share files | Opens the native share sheet with the chosen image file and the message |

Share targets are disabled until the chosen image is rendered.

Web pages cannot attach files to WhatsApp or Telegram through their share links, which only accept text. For those targets the image is downloaded at the same moment, and a success alert tells the user to attach the downloaded image to the message. **Other** sends the image and link together in one step.

| Native share outcome                  | Feedback                                             |
| ------------------------------------- | ---------------------------------------------------- |
| Shared                                | Success alert "Countdown shared"                     |
| Cancelled by the user (`AbortError`)  | None                                                 |
| Any other error                       | Error alert suggesting WhatsApp, Telegram or copying the link |

**Mobile** means `navigator.userAgentData.mobile` when available, otherwise a user agent matching Android, iPhone, iPad, iPod or Mobile, or an iPad reporting a desktop user agent with touch support.

### 3.4 Message

| Field                      | Value                                   |
| -------------------------- | --------------------------------------- |
| Message (WhatsApp, Other)  | `Countdown to <title>: <link>`          |
| Telegram `text`            | `Countdown to <title>` (the link goes in `url`) |
| Native share `title`       | `<title> · Travel Countdown`            |
| Native share `files`       | The chosen PNG image                    |

The link is included in the message text (not as a separate `url`) for native sharing, because several apps drop the `url` when files are shared.

## 4. Image

### 4.1 Format

| Orientation | Size (px)     | Use                              |
| ----------- | ------------- | -------------------------------- |
| Landscape   | 1600 × 900    | Chats, posts (16:9)              |
| Vertical    | 1080 × 1920   | Stories, status (9:16)           |

PNG, file name `travel-countdown-<title-slug>-<orientation>.png` (title lowercased, accents removed, non-alphanumerics replaced by `-`).

### 4.2 Content

The image reproduces the preview, filling the whole canvas (no rounded corners), with the values frozen at the generation time:

| Element | Rules                                                                                  |
| ------- | -------------------------------------------------------------------------------------- |
| Background | Same as the preview: solid color, 135° gradient, or image covering the canvas with a `rgba(0, 0, 0, 0.4)` overlay |
| Title   | Inter 700, title color, centered, wrapped to 86% of the width, up to 3 lines (ellipsis beyond) |
| Units   | Days, hours, minutes, seconds as two-digit values (Inter 700, tabular numbers) with uppercase labels (Inter 500, 85% opacity), counter color, in one row scaled down to fit 86% of the width |
| Status  | "The countdown has finished" below the units when the finish date has passed          |

Sizes scale from the preview (360 px tall) by `min(width, height) / 360`, and the content block is vertically centered.

### 4.3 Baseline details

Both are placed on the same bottom baseline, inset by 3.5% of the shorter side, in the counter color at 70% opacity, with a font size of 2.2% of the shorter side (Inter 500):

| Side  | Content                                                                 |
| ----- | ----------------------------------------------------------------------- |
| Left  | Generation date and time, `DD/MM/YYYY HH:mm` (24-hour clock, local time) |
| Right | Watermark: logo mark followed by "Travel Countdown" (Inter 600)         |

On image backgrounds both get a soft shadow (`rgba(0, 0, 0, 0.35)`, 4 px blur) for legibility.

### 4.4 Custom image backgrounds

Custom image URLs are loaded with `crossOrigin="anonymous"`. If the image cannot be loaded that way (the server does not allow cross-origin use), browsers would block exporting the canvas, so the image is rendered with the fallback background `#1F2A33` and the overlay instead, and the modal shows the notice from section 3.2. Bundled preset images are same-origin and always included.

## 5. Implementation

| Concern                                    | Location                               |
| ------------------------------------------ | -------------------------------------- |
| Triggers, validation, focus on error       | `client/src/pages/Home.tsx`            |
| Title, units and status shared by preview and image | `client/src/countdown/display.ts` |
| Image rendering (canvas)                   | `client/src/countdown/shareImage.ts`   |
| Targets, message, mobile detection, download | `client/src/countdown/share.ts`      |
| Share modal                                | `client/src/countdown/ShareDialog.tsx` |
