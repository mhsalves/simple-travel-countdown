# Share action specification

How a countdown is shared: the share triggers, the share modal, the shared image and the share targets. The interface texts quoted here are shown in Portuguese ([Language specification](language.md)); this document keeps their English meaning for reference. The link format is defined in the [Countdown link specification](countdown-link.md) and visuals in the [Style guide](style-guide.md).

## 1. Requirements

- A **Share** action is available in two places: a button on the form and a button below the preview. Both run the same action.
- The action opens a modal with:
  - The generated link with a copy action.
  - A screenshot of the preview as a **landscape** or **vertical** image; the user chooses which one to share.
  - Share targets: on web, **WhatsApp**, **Telegram** and **Other** (native share); on mobile, native share only.
- A share sends the chosen image and the generated link.
- The image follows the preview format, with a small, subtle application watermark on the right baseline and the generation date and time (`dd/mm/yyyy hh:mm`) on the left baseline.

## 2. Triggers

| Trigger                | Page           | Location              | Style                                      |
| ---------------------- | -------------- | --------------------- | ------------------------------------------ |
| Form button            | Home           | Below the form fields | `contained`, large, full width, share icon |
| Preview button         | Home           | Below the preview     | `outlined`, large, full width, share icon  |
| Header **Share** button | Countdown page | Header, after the edit action | `contained`, share icon; icon-only below `sm` ([Countdown page](countdown-page.md)) |

The two home page triggers validate the form with the rules in [Countdown link specification §4.1](countdown-link.md#41-when-sharing). When validation fails, field errors are shown (and stay live while editing), the first invalid field is scrolled into view and focused, and the modal does not open. When it passes, the modal opens with a snapshot of the current form values and the current date and time as the **generation time**.

On the countdown page there is nothing to validate: the header **Share** button opens the same modal for the countdown being viewed, using the page's own URL as the link, the configuration decoded from the token, and the moment the button was pressed as the generation time.

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

Share targets appear once the chosen image is rendered and depend on the device (**mobile** detection below).

#### Web (desktop)

A toggle offers **WhatsApp**, **Telegram** and **Other**. Nothing happens until a target is chosen; choosing one shows numbered steps explaining exactly what will happen, followed by a button that performs those steps. The steps follow the chosen orientation.

WhatsApp and Telegram web share links (`web.whatsapp.com/send`, `t.me/share/url`) only accept text, and web pages have no API to attach a file to a specific app, so the image is handed over through the clipboard or a download:

| Target / case | Steps shown | Button | Action |
| ------------- | ----------- | ------ | ------ |
| WhatsApp or Telegram, clipboard image copy allowed | 1. The `<orientation>` image is copied to your clipboard. 2. `<App>` opens in a new tab with a message containing the countdown link. 3. Choose a chat and paste the image (⌘V / Ctrl+V) to attach it. | **Copy image and open `<App>`** | Copies the PNG to the clipboard, opens the app share URL |
| WhatsApp or Telegram, clipboard image copy not allowed | 1. Your browser can't copy images, so the `<orientation>` image is downloaded to your computer as `<file name>`. 2. `<App>` opens in a new tab with a message containing the countdown link. 3. Choose a chat and attach the downloaded image. | **Download image and open `<App>`** | Downloads the PNG, opens the app share URL |
| Other | See [Native sharing](#native-sharing) | | |

Clipboard image copy is **allowed** when the browser supports `ClipboardItem` and `navigator.clipboard.write`, `ClipboardItem.supports('image/png')` is not false, and the `clipboard-write` permission is not `denied` (browsers without that permission query decide on write). If copying still fails when the button is pressed, the image is downloaded instead and the feedback says so.

App share URLs:

| App      | URL                                                             |
| -------- | --------------------------------------------------------------- |
| WhatsApp | `https://web.whatsapp.com/send?text=<message>`                  |
| Telegram | `https://t.me/share/url?url=<link>&text=Countdown to <title>`   |

#### Mobile

No WhatsApp or Telegram buttons: only [Native sharing](#native-sharing) is offered, with its steps shown directly (no toggle). WhatsApp, Telegram and any other app are chosen from the phone's share options.

#### Native sharing

Uses the [Web Share API](https://developer.mozilla.org/docs/Web/API/Navigator/share) on both web and mobile. It always tries to share the image **and** the message with the link:

| Browser support | Steps shown | Button | `navigator.share` data |
| --------------- | ----------- | ------ | ---------------------- |
| Files (`navigator.canShare({ files })`) | 1. Your phone's / system's share options open with the `<orientation>` image and a message containing the countdown link. 2. Choose WhatsApp, Telegram or any other app to send them. Note: some apps keep only the image and drop the message; if the link is missing, copy it above and paste it in the chat. | **Share image and link** | `title`, `text` (message with link), `files` (PNG) |
| Text only | 1. Your browser can share the link but not images. 2. Your phone's / system's share options open with a message containing the countdown link, without the image. | **Share link** | `title`, `text` |
| None | Mobile: "Your browser doesn't support sharing. Copy the link above and paste it in any app." Web: "Your browser doesn't support system sharing. Use WhatsApp, Telegram or copy the link above." | None | — |

What the receiving app does with the shared data is up to the app: the page passes the image and the message together, but some apps may keep only one of them.

#### Feedback

| Outcome                               | Feedback                                                                         |
| ------------------------------------- | -------------------------------------------------------------------------------- |
| Native share completed                | Success alert "Countdown shared"                                                 |
| Native share cancelled (`AbortError`) | None                                                                             |
| Native share failed                   | Error alert "Couldn't open the share options. Copy the link above instead."     |
| Image copied, app opened              | Success alert "Image copied. Choose a chat in `<App>` and paste it (⌘V / Ctrl+V) to attach it." |
| Image downloaded, app opened          | Success alert "Image downloaded. Attach `<file name>` to the `<App>` chat."      |
| Copy failed, downloaded instead       | Success alert "Couldn't copy the image, so it was downloaded instead. Attach `<file name>` to the `<App>` chat." |
| Pop-up blocked                        | Same alert, with an **Open `<App>`** button linking to the share URL            |

Automatic delivery with no user step would require the WhatsApp Business Platform or a Telegram bot, which need a backend, a business or bot account and the recipient's number or chat, so they are out of scope.

**Mobile** means `navigator.userAgentData.mobile` when available, otherwise a user agent matching Android, iPhone, iPad, iPod or Mobile, or an iPad reporting a desktop user agent with touch support.

### 3.4 Message

| Field                      | Value                                   |
| -------------------------- | --------------------------------------- |
| Message (WhatsApp, native share) | `Countdown to <title>: <link>`    |
| Telegram `text`            | `Countdown to <title>` (the link goes in `url`) |
| Native share `title`       | `<title> · Travel Countdown`            |
| Native share `files`       | The chosen PNG image (omitted when the browser can only share text) |

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
| Units   | Dias, Horas, Minutos, Segundos as two-digit values (Inter 700, tabular numbers) with uppercase labels (Inter 500, 85% opacity), counter color, in one row scaled down to fit 86% of the width |
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
| Targets, message, mobile detection, clipboard, download | `client/src/countdown/share.ts` |
| Share targets section (steps and actions)  | `client/src/countdown/ShareTargets.tsx` |
| Share modal                                | `client/src/countdown/ShareDialog.tsx` |
