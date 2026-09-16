# Countdown link specification

Rules for the link created by the **Generate link** button on the home page. Form fields are described in the [Home page specification](home-page.md) and visuals in the [Style guide](style-guide.md).

## 1. Requirements

- The link path is `/countdown`, keeping the project's base URL format.
- After the path comes a base64 token (`/countdown/<token>`) containing the form data as JSON. The token is the only source used to read the countdown configuration.
- After generating the link, a success message opens with an option to copy the generated link.

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
http://localhost:3029/countdown/eyJ2IjoxLCJ0aXRsZSI6IlRyaXAgdG8gTGlzYm9uIiwi...
https://matheusalves.dev/simple-travel-countdown/countdown/eyJ2IjoxLCJ0aXRsZSI6IlRyaXAgdG8gTGlzYm9uIiwi...
```

## 3. Token

### 3.1 Encoding

1. Build the JSON payload (section 3.2) and serialize it with `JSON.stringify`.
2. Encode the string as **UTF-8** bytes, so titles with accents or emoji are preserved.
3. Encode the bytes as **base64url** ([RFC 4648 §5](https://www.rfc-editor.org/rfc/rfc4648#section-5)): standard base64 with `+` → `-`, `/` → `_` and the `=` padding removed.

base64url is required because standard base64 may contain `/`, which would split the token into extra path segments, and `+`/`=`, which are not safe in URLs.

Decoding reverses the steps: base64url → bytes → UTF-8 string (invalid UTF-8 is rejected) → `JSON.parse` → validation (section 4.2).

### 3.2 Payload

```json
{
  "v": 1,
  "title": "Trip to Lisbon",
  "finishDate": "2027-03-10T11:30:00.000Z",
  "background": { "type": "gradient", "from": "#0B6E99", "to": "#0A7A94" },
  "titleColor": "#FFFFFF",
  "counterColor": "#FFFFFF"
}
```

| Field          | Type   | Rules                                                                 |
| -------------- | ------ | --------------------------------------------------------------------- |
| `v`            | number | Payload version. Current version: `1`                                 |
| `title`        | string | Trimmed, 1–60 characters                                              |
| `finishDate`   | string | ISO 8601 in UTC (`Date.toISOString()`), so every viewer counts down to the same instant regardless of time zone |
| `background`   | object | One of the shapes below                                               |
| `titleColor`   | string | Hex color `#RRGGBB`                                                   |
| `counterColor` | string | Hex color `#RRGGBB`                                                   |

Background shapes:

| `type`     | Fields                          | Rules                                         |
| ---------- | ------------------------------- | --------------------------------------------- |
| `solid`    | `color`                         | Hex color `#RRGGBB`                           |
| `gradient` | `from`, `to`                    | Hex colors `#RRGGBB`                          |
| `image`    | `url`                           | `http://` or `https://` URL, up to 1000 characters |

When generating, hex colors are written in uppercase and no other fields are included. When reading, hex colors are accepted in any case and unknown fields are ignored.

## 4. Validation

### 4.1 When generating

Pressing **Generate link** validates the form. If any rule fails, no link is generated and each invalid field shows its error. Errors are shown only after the first attempt and then update as the user edits.

| Field       | Rule                                   | Error message                                    |
| ----------- | -------------------------------------- | ------------------------------------------------ |
| Title       | Not empty after trimming               | Enter a title for your countdown.                |
| Finish date | Filled and valid                       | Choose the finish date.                          |
| Finish date | In the future                          | Choose a date and time in the future.            |
| Image URL   | Filled, `http(s)` URL (image background only) | Enter a URL starting with http:// or https:// |

Title length (60) and image URL length (1000) are enforced by the inputs, and colors can only be committed as valid hex values.

### 4.2 When reading a token

A token is valid only if it decodes (section 3.1) and the payload matches every rule in section 3.2, with `v` equal to `1`. A valid token whose `finishDate` is in the past is still valid: the countdown shows as finished. Invalid tokens produce no configuration, and the page reading them must show an invalid link message.

## 5. Success feedback

After a valid generation, a dialog opens:

| Element  | Content                                                                           |
| -------- | --------------------------------------------------------------------------------- |
| Title    | Success icon + "Your countdown link is ready"                                    |
| Message  | "Share this link with anyone to show the countdown for <title>."                |
| Link     | Read-only text field with the full link, selected on focus                       |
| Copy     | **Copy link** button. After copying it shows **Copied** with a check icon        |
| Failure  | If the clipboard is unavailable, an error alert asks to select and copy the link manually |
| Close    | **Close** button, `Esc` or clicking outside                                       |

Each generation creates the link from the current form values and resets the copy state.

## 6. Implementation

| Concern                    | Location                              |
| -------------------------- | ------------------------------------- |
| Encode, decode, build link | `client/src/countdown/link.ts`        |
| Form validation            | `client/src/countdown/validation.ts`  |
| Success dialog             | `client/src/countdown/LinkDialog.tsx` |

The page that reads the token and displays the countdown is not part of this specification.
