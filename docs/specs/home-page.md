# Home page specification

Visual definitions (colors, typography, form components, logo) are in the [Style guide](style-guide.md).

## Requirements

- **Header**: simple header with the logo and the feature name "Travel Countdown".
- **Content**: split into two areas:
  - **Form** to create a countdown, with the options:
    - Title
    - Finish date
    - Background
    - Custom font colors
  - **Preview** that displays the countdown in real time, applying every option set in the form.
  - A **Generate link** button. Its action is not implemented yet and will be specified later.
- **Footer**: logo and name, "Developed by Matheus Alves" and the current year.

## Details

### Form options

| Option       | Input                        | Default                         | Notes                                    |
| ------------ | ---------------------------- | ------------------------------- | ---------------------------------------- |
| Title        | Text, up to 60 characters    | Empty                           | Preview shows "Your trip title" when empty |
| Finish date  | Date and time (local time)   | 30 days from now at 09:00       |                                          |
| Background   | Solid color, gradient or image | Ocean preset ([Style guide](style-guide.md#14-countdown-background-presets)) | Gradient uses two colors; image uses an `http(s)` URL |
| Title color  | Color picker                 | Preset font color (`#FFFFFF`)   | Reset to the preset/background default when the background changes |
| Counter color | Color picker                | Preset font color (`#FFFFFF`)   | Applies to the numbers and their labels; reset like the title color |

### Preview

- Shows the title and the time left in days, hours, minutes and seconds, updated every second.
- When the finish date is empty, the counter shows zeros and asks for a date.
- When the finish date has passed, the counter shows zeros and "The countdown has finished".
- Image backgrounds get a dark overlay so the text stays readable.

### Layout

- Desktop (≥ 900px): form on the left, preview on the right.
- Mobile: single column, preview first so changes stay visible near the top.

### Generate link

- The button is displayed below the form fields and has no action yet.
