# Style guide

Visual definitions for Travel Countdown: colors, typography, form components and logo. Pages and components referenced here are described in the [Home page specification](home-page.md).

## 1. Colour system

The palette is inspired by travel: **Ocean** blue as the brand color, **Sunset** coral for highlights, **Sun** yellow as an accent, **Palm** green for success and warm **Sand** neutrals for surfaces. Every text pairing below meets WCAG AA (4.5:1) unless stated otherwise.

### 1.1 Brand colors

| Token       | Name   | Light     | Dark      | Use                                              |
| ----------- | ------ | --------- | --------- | ------------------------------------------------ |
| `primary`   | Ocean  | `#0B6E99` | `#5BBDE6` | Main actions, links, focus, selected states, logo badge |
| `secondary` | Sunset | `#C8502A` | `#FF9166` | Secondary highlights; use sparingly               |
| `accent`    | Sun    | `#F7C35F` | `#F7C35F` | Logo plane, small decorative details only (never text on light backgrounds) |

Text on brand colors:

| Background        | Light text | Contrast | Dark text  | Contrast |
| ----------------- | ---------- | -------- | ---------- | -------- |
| `primary` light   | `#FFFFFF`  | 5.67:1   | —          | —        |
| `secondary` light | `#FFFFFF`  | 4.53:1   | —          | —        |
| `primary` dark    | —          | —        | `#0E1620`  | 8.55:1   |
| `secondary` dark  | —          | —        | `#0E1620`  | 8.22:1   |

### 1.2 Neutrals

| Token           | Light     | Dark      | Use                                    |
| --------------- | --------- | --------- | -------------------------------------- |
| `background`    | `#F8F5EF` | `#0E1620` | Page background (Sand / Night)         |
| `surface`       | `#FFFFFF` | `#17222E` | Cards, header, form container          |
| `text`          | `#1F2A33` | `#EAF0F4` | Primary text (13.43:1 / 15.83:1)       |
| `text-muted`    | `#5A6670` | `#9DAEBD` | Secondary text, helper text, footer (5.41:1 / 7.07:1) |
| `border`        | `#DDD5C8` | `#273646` | Card and section dividers (decorative) |
| `border-strong` | `#857B6E` | `#5F7282` | Form field outlines (≥ 3:1 against background and surface) |

### 1.3 Feedback colors

| Token     | Light     | Dark      | Use                         |
| --------- | --------- | --------- | --------------------------- |
| `error`   | `#B42318` | `#FF8A80` | Validation errors           |
| `success` | `#1E7A4F` | `#5CD49A` | Confirmations (e.g. copied) |

### 1.4 Countdown background presets

Presets offered by the background option of the countdown form. **Ocean** is the default.

| Preset | Gradient (135°)           | Recommended font color | Min. contrast |
| ------ | ------------------------- | ---------------------- | ------------- |
| Ocean  | `#0B6E99` → `#0A7A94`     | `#FFFFFF`              | 4.97:1        |
| Sunset | `#F4845F` → `#F7C35F`     | `#1F2A33`              | 5.78:1        |
| Palm   | `#1E7A4F` → `#0F6B6B`     | `#FFFFFF`              | 5.31:1        |
| Night  | `#0E1620` → `#2B4A66`     | `#FFFFFF`              | 9.23:1        |

Image backgrounds receive a `rgba(0, 0, 0, 0.4)` overlay and default to white text.

Bundled image presets, plus a "Custom" option for a manual URL. All three use white text: measuring contrast at the image's whole-frame average favors dark text for the two lighter photos, but the title and counter sit centered over busy, mixed-tone illustration there, and measuring contrast in that specific region (with the overlay applied) shows white keeps a higher worst-case contrast on all three:

| Preset    | Photo                                                       | Font color |
| --------- | ------------------------------------------------------------ | ----------- |
| New Year  | `client/src/assets/backgrounds/happy-new-year.jpg`            | `#FFFFFF`    |
| Birthday  | `client/src/assets/backgrounds/happy-birthday.jpg`            | `#FFFFFF`    |
| Orlando   | `client/src/assets/backgrounds/orlando-park.jpg`              | `#FFFFFF`    |

Selecting a preset sets both the image URL and both font colors, same as a gradient preset, and the manual URL field is hidden. Selecting **Custom** clears the URL and shows the field again for a manual `http(s)` link.

### 1.5 Theme mode

The app follows the operating system preference (`prefers-color-scheme`) and uses the Light or Dark column accordingly. The countdown preview and countdown view always use the user's chosen background and font colors, regardless of theme mode.

## 2. Typography

One typeface keeps the interface simple: **[Inter](https://rsms.me/inter/)**, self-hosted through `@fontsource-variable/inter` so it works offline and on GitHub Pages. Font stack: `"Inter Variable", Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.

### 2.1 Type scale

| Role               | MUI variant | Size                        | Weight | Line height | Use                               |
| ------------------ | ----------- | --------------------------- | ------ | ----------- | --------------------------------- |
| Countdown value    | custom `countdownValue` | `clamp(2.5rem, 8vw, 4rem)` | 700 | 1.1 | Numbers in preview and countdown view (`font-variant-numeric: tabular-nums`) |
| Countdown title    | `h2`        | `clamp(1.5rem, 4vw, 2.25rem)` | 700  | 1.2         | Title in preview and countdown view |
| Page title         | `h1`        | `1.5rem`                    | 700    | 1.3         | "Create your countdown"           |
| Section title      | `h2`        | `1.25rem`                   | 600    | 1.4         | "Preview"                         |
| Brand name         | `subtitle1` | `1.125rem` (header), `0.875rem` (footer) | 700 | 1.4 | Next to the logo            |
| Body               | `body1`     | `1rem`                      | 400    | 1.5         | Default text, form inputs         |
| Small              | `body2`     | `0.875rem`                  | 400    | 1.5         | Helper text, footer text          |
| Countdown label    | `overline`  | `0.75rem`                   | 500    | 1.5         | "DAYS", "HOURS"… (uppercase, `letter-spacing: 0.08em`) |
| Button             | `button`    | `0.9375rem`                 | 600    | 1.5         | Buttons, sentence case (no uppercase) |

### 2.2 Rules

- Use only weights 400, 500, 600 and 700.
- Sentence case everywhere except countdown labels.
- Maximum line length for body text: 70 characters.

## 3. Form library

Forms use **[Material UI](https://mui.com/material-ui/)** (`@mui/material` v9, compatible with React 17), themed with the tokens above.

### 3.1 Packages

| Package                                   | Purpose                        |
| ----------------------------------------- | ------------------------------ |
| `@mui/material`                           | Components and theming         |
| `@emotion/react`, `@emotion/styled`       | Styling engine required by MUI |
| `@mui/x-date-pickers`, `dayjs`            | Date and time picker           |
| `@fontsource-variable/inter`              | Inter typeface                 |

### 3.2 Theme

A single theme created with `createTheme` and applied with `ThemeProvider` + `CssBaseline` at the app root:

- `colorSchemes.light.palette` / `colorSchemes.dark.palette`: tokens from section 1 (`primary`, `secondary`, `error`, `success`, `background.default` = `background`, `background.paper` = `surface`, `text.primary`, `text.secondary` = `text-muted`, `divider` = `border`).
- `cssVariables: true`. With both color schemes defined, `ThemeProvider` follows the system preference (`defaultMode="system"`).
- `typography`: Inter and the scale from section 2.
- `shape.borderRadius`: `10`.
- Component defaults:
  - `MuiTextField`: `variant="outlined"`, `fullWidth`.
  - `MuiButton`: `disableElevation`, `textTransform: none`.
  - `MuiOutlinedInput`: outline color `border-strong`.

### 3.3 Component mapping

| Home page element     | MUI component                                     | Notes                                                    |
| --------------------- | ------------------------------------------------- | -------------------------------------------------------- |
| Form container        | `Card` (`variant="outlined"`) + `CardContent`     | Padding 24px                                              |
| Title                 | `TextField`                                       | `slotProps.htmlInput.maxLength = 60`, helper text shows `n/60` |
| Finish date           | `DateTimePicker` (`@mui/x-date-pickers`, `AdapterDayjs`) | `disablePast`, `ampm` follows locale              |
| Background type       | `ToggleButtonGroup` (`exclusive`, `fullWidth`)    | Options: Solid color, Gradient, Image                    |
| Gradient presets      | `ToggleButton` grid (2 columns on mobile, 4 from `sm`) | Presets from 1.4 with a gradient swatch; selecting one also sets both font colors to its recommended color |
| Background / font colors | `TextField` with a native color swatch in `InputAdornment` | Editable hex value (invalid values are flagged and reverted on blur); labels: Background color, Start color, End color, Title color, Counter color |
| Image presets         | `ToggleButton` grid (2 columns; names are too long for 4) | Presets from 1.4 with a photo thumbnail, plus a "Custom" option (`AddPhotoAlternateRounded` icon); selecting a preset sets the Image URL (resolved from the bundled asset) and both font colors, and hides the Image URL field; selecting Custom clears the URL and shows the field again |
| Image URL             | `TextField` (`type="url"`)                        | Shown only when Custom is selected; `error` + `helperText` when the URL is not `http(s)` |
| Share (form)          | `Button` (`type="submit"`, `variant="contained"`, `size="large"`, `fullWidth`) | Primary color, `ShareRounded` start icon |
| Share (preview)       | `Button` (`variant="outlined"`, `size="large"`, `fullWidth`) | Below the preview, 16px top margin, `ShareRounded` start icon |
| Field errors          | `error` + `helperText` on the field               | Shown after the first share attempt; the title counter is replaced by its error |
| Share modal           | `Dialog` (`maxWidth="sm"`, `fullWidth`, `fullScreen` below `sm`) | `DialogTitle` with `ShareRounded` in `primary` color; sections Link, Image, Share to separated by `Divider`, each titled with `FormLabel` |
| Share link            | Small read-only `TextField` + `outlined` **Copy** `Button` | After copying: `success` color, `CheckRounded` icon and "Copied" |
| Image orientation     | `ToggleButtonGroup` (`exclusive`, `fullWidth`)    | `CropLandscapeRounded` Landscape, `CropPortraitRounded` Vertical |
| Image preview         | `img` in a 280px `background.default` box with `divider` border | `CircularProgress` while rendering; 6px radius and `boxShadow: 2` on the image |
| Share targets (web)   | `ToggleButtonGroup` (`exclusive`, `fullWidth`)    | `WhatsApp`, `Telegram` and `ShareRounded` (Other) icons; hidden on mobile |
| Share steps           | Numbered list (`ol`, `body2`) in a `background.default` box with `divider` border | Optional `text.secondary` note; `contained` full-width action button with the target icon |
| Share feedback        | `Alert` (`success` / `error`), dismissible        | Below the share targets |
| Copy link             | `Button` (`variant="contained"`)                  | `ContentCopyRounded` icon; after copying: `success` color, `CheckRounded` icon and "Copied" |
| Copy failure          | `Alert` (`severity="error"`)                      | Inside the dialog, below the link                        |
| Field groups          | `Stack` (`spacing={2.5}`) and `FormLabel`         |                                                          |

### 3.4 Spacing and shape

- Base unit: **8px** (MUI `theme.spacing`). Use multiples: 8, 16, 24, 32, 48.
- Radius: 10px for cards, inputs and buttons; 12px for the countdown preview.
- Page container: max width 1120px, 16px side padding.

## 4. Logo

### 4.1 Design

<img src="../../client/public/favicon.svg" alt="Travel Countdown logo" width="96" height="96" />

Source: [`client/public/favicon.svg`](../../client/public/favicon.svg), mirrored by the `Logo` component (`client/src/components/Logo.tsx`).

The mark combines the two themes of the product, **travelling** and **countdown**:

- **Countdown ring**: a faint full circle (white, 30% opacity) with a solid white arc covering three quarters, read as a progress ring running out.
- **Clock hands** (white): time.
- **Plane** (Sun yellow) flying clockwise through the remaining quarter towards 12 o'clock: the trip getting closer as the countdown ends.
- **Badge**: rounded square in Ocean blue, corner radius 25% of the size.

Geometry on a 48 × 48 grid: ring centered at (24, 24), radius 14, stroke 3.5; hands stroke 3.5 with round caps.

The **lockup** is the mark followed by the name "Travel Countdown" in Inter 700, vertically centered, with a gap of 1/3 of the mark size.

### 4.2 Variants

| Variant      | Badge          | Clock     | Plane     | Use                                        |
| ------------ | -------------- | --------- | --------- | ------------------------------------------ |
| Full color   | Ocean `#0B6E99` | `#FFFFFF` | `#F7C35F` | Default, on light and dark theme backgrounds |
| Monochrome   | None           | `currentColor` | `currentColor` | On user-defined backgrounds (countdown view) |

### 4.3 Rules

- Minimum size: 16px (favicon), 24px when used in the lockup.
- Clear space around the mark: 25% of its size.
- Do not recolor the full color variant, rotate it, add effects or separate the plane from the clock.

### 4.4 Applicability

| Place                         | Version                  | Mark size | Name style                          |
| ----------------------------- | ------------------------ | --------- | ----------------------------------- |
| Header                        | Full color lockup        | 32px      | `subtitle1` 1.125rem, `text` color  |
| Footer                        | Full color lockup        | 24px      | 0.875rem, `text-muted` color, followed by "Developed by Matheus Alves · year" ("Matheus Alves" is a `primary` link to https://matheusalves.dev/) |
| Home — form                   | Not used                 | —         | —                                   |
| Home — preview                | Not used (user content)  | —         | —                                   |
| Countdown view                | Not used                 | —         | Replaced by a "Create my countdown" button below the countdown ([spec](countdown-page.md)) |
| Favicon / browser tab         | Full color mark (`favicon.svg`, fallback `favicon-32.png`) | 16px, 32px | —   |
| Apple touch icon              | Full color mark with square badge (`apple-touch-icon.png`, the OS applies the corner mask) | 180px | — |

Favicon files live in `client/public/` and are linked from `client/index.html`.
