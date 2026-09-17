# Countdown link specification

Rules for the link created and shared by the **Share** button on the home page. Form fields are described in the [Home page specification](home-page.md) and visuals in the [Style guide](style-guide.md).

## 1. Requirements

- The link path is `/countdown`, keeping the project's base URL format.
- After the path comes a base64 token (`/countdown/<token>`) containing the form data as a compact binary payload. The token is the only source used to read the countdown configuration.
- The home page action is **Share**: it creates the link and shares it through the device's native share sheet when available, falling back to a dialog with an option to copy the link (section 5).

## 2. URL format

```
<origin><base path>countdown/<token>
```

| Part        | Value                                                                 |
| ----------- | --------------------------------------------------------------------- |
| `origin`    | Origin of the page where the link was generated (`window.location.origin`) |
| `base path` | Vite `BASE_URL`: `/` locally, `/<repository-name>/` on GitHub Pages ([Deployment](../deployment.md)) |
| `token`     | Encoded configuration (section 3)                                     |

Examples:

```
http://localhost:3029/countdown/AQ5UcmlwIHRvIExpc2JvbmuRNDgBC26ZCnqU________
https://matheusalves.dev/simple-travel-countdown/countdown/AQ5UcmlwIHRvIExpc2JvbmuRNDgBC26ZCnqU________
```

## 3. Token

### 3.1 Encoding

The payload (section 3.2) is packed as **fixed-width binary fields**, not JSON, so the token stays as short as possible: colors are raw RGB bytes instead of `"#RRGGBB"` strings, and the finish date is a 4-byte integer instead of an ISO string.

1. Build the binary payload (section 3.2), producing a byte array.
2. Encode the bytes as **base64url** ([RFC 4648 §5](https://www.rfc-editor.org/rfc/rfc4648#section-5)): standard base64 with `+` → `-`, `/` → `_` and the `=` padding removed.

base64url is required because standard base64 may contain `/`, which would split the token into extra path segments, and `+`/`=`, which are not safe in URLs.

Decoding reverses the steps: base64url → bytes → binary payload → validation (section 4.2). A structurally malformed byte array (wrong length, unknown enum value, trailing bytes) is an invalid token.

Implemented in `client/src/countdown/binary.ts` (see section 6).

### 3.2 Payload

Byte layout, in order:

| Field           | Size                          | Rules                                                                 |
| --------------- | ------------------------------ | ---------------------------------------------------------------------- |
| Format version  | 1 byte                          | Current version: `1`                                                   |
| Title length    | 1 byte (`N`, 0–255)             | Length **in UTF-8 bytes** of the title that follows                    |
| Title           | `N` bytes                       | UTF-8 text. Trimmed, 1–60 **characters** (not bytes)                   |
| Finish date     | 4 bytes, unsigned big-endian    | Unix time in **seconds**, UTC. Sub-second precision is not preserved (the countdown display only shows whole seconds, so nothing is lost) |
| Background type | 1 byte                          | `0` = solid, `1` = gradient, `2` = image                                |
| Background data | variable, depends on type       | See background shapes below                                            |
| Title color     | 3 bytes (R, G, B)               | Raw color bytes, no `#` or hex text                                     |
| Counter color   | 3 bytes (R, G, B)               | Raw color bytes, no `#` or hex text                                     |

Background shapes (immediately after the background type byte):

| `type`     | Bytes                                                          | Rules                                              |
| ---------- | ---------------------------------------------------------------- | --------------------------------------------------- |
| `solid`    | 3 bytes (R, G, B)                                                 | Raw color bytes                                     |
| `gradient` | 3 bytes (R, G, B) `from` + 3 bytes (R, G, B) `to`                 | Raw color bytes                                     |
| `image`    | 2 bytes unsigned big-endian length (`M`) + `M` bytes UTF-8 URL    | `http://` or `https://` URL, up to 1000 characters  |

When generating, colors are read from `#RRGGBB` input and written as raw bytes. When reading, raw bytes are converted back to an uppercase `#RRGGBB` string — there is no casing concern on the wire since no hex text is stored.

## 4. Validation

### 4.1 When sharing

Pressing **Share** validates the form. If any rule fails, no link is created or shared and each invalid field shows its error. Errors are shown only after the first attempt and then update as the user edits.

| Field       | Rule                                   | Error message                                    |
| ----------- | -------------------------------------- | ------------------------------------------------ |
| Title       | Not empty after trimming               | Enter a title for your countdown.                |
| Finish date | Filled and valid                       | Choose the finish date.                          |
| Finish date | In the future                          | Choose a date and time in the future.            |
| Image URL   | Filled, `http(s)` URL (image background only) | Enter a URL starting with http:// or https:// |

Title length (60) and image URL length (1000) are enforced by the inputs, and colors can only be committed as valid hex values.

### 4.2 When reading a token

A token is valid only if it decodes (section 3.1) and the payload matches every rule in section 3.2, with the format version equal to `1`. A valid token whose finish date is in the past is still valid: the countdown shows as finished. Invalid tokens produce no configuration, and the page reading them must show an invalid link message.

## 5. Share action

After a valid **Share** press, the link is built from the current form values and shared:

1. **Native share sheet** — when the browser supports the [Web Share API](https://developer.mozilla.org/docs/Web/API/Navigator/share) (`navigator.share`, and `navigator.canShare` accepts the data), the system share sheet opens with:

   | Field   | Value                                |
   | ------- | ------------------------------------ |
   | `title` | `<title> · Travel Countdown`         |
   | `text`  | `Countdown to <title>`               |
   | `url`   | The countdown link                   |

   | Outcome                             | Feedback                                                      |
   | ----------------------------------- | ------------------------------------------------------------- |
   | Shared                              | Success snackbar "Countdown shared" (auto-hides after 4 seconds) |
   | Cancelled by the user (`AbortError`) | None                                                         |
   | Any other error                     | Share dialog (step 2)                                         |

2. **Share dialog** — when the Web Share API is unavailable (most desktop browsers) or fails, a dialog opens:

   | Element  | Content                                                                           |
   | -------- | --------------------------------------------------------------------------------- |
   | Title    | Share icon + "Share your countdown"                                              |
   | Message  | "Copy this link and send it to anyone to show the countdown for <title>."       |
   | Link     | Read-only text field with the full link, selected on focus                       |
   | Copy     | **Copy link** button. After copying it shows **Copied** with a check icon        |
   | Failure  | If the clipboard is unavailable, an error alert asks to select and copy the link manually |
   | Close    | **Close** button, `Esc` or clicking outside                                       |

Each press creates the link from the current form values; the dialog opens with the copy state reset.

The share sheet must be opened directly from the button press (browsers require a user gesture), so validation and link creation run synchronously before calling `navigator.share`.

## 6. Implementation

| Concern                     | Location                              |
| --------------------------- | -------------------------------------- |
| Binary payload encode/decode | `client/src/countdown/binary.ts`      |
| base64url, build link       | `client/src/countdown/link.ts`        |
| Form validation             | `client/src/countdown/validation.ts`  |
| Native share                | `client/src/countdown/share.ts`       |
| Share dialog                | `client/src/countdown/ShareDialog.tsx` |

The page that reads the token and displays the countdown is described in the [Countdown page specification](countdown-page.md).
