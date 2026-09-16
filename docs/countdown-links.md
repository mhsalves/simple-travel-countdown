# Countdown links

A countdown link carries its whole configuration in the URL, so no server or database is needed to store it.

## Creating a link

On the home page, fill in:

| Field         | Rules                                                     |
| ------------- | --------------------------------------------------------- |
| Title         | Required, up to 60 characters. Leading/trailing spaces are removed |
| Date and time | Required, must be in the future. Entered in the creator's local time zone |

Submitting the form shows the generated link with a **Copy** button. Changing any field hides the previous link until the form is submitted again.

## Link format

```
<origin><base path>countdown?title=<title>&date=<ISO 8601 UTC date>
```

Example (development):

```
http://localhost:3029/countdown?title=Trip+to+Lisbon&date=2027-03-10T11%3A30%3A00.000Z
```

| Parameter | Description                                                                 |
| --------- | --------------------------------------------------------------------------- |
| `title`   | Countdown title, URL-encoded                                                |
| `date`    | Target moment in UTC (`Date.toISOString()`), so every viewer counts down to the same instant regardless of their time zone |

The base path comes from Vite's `BASE_URL` (`/` locally, the repository path on GitHub Pages; see [Deployment](deployment.md)).

The link is built by `buildCountdownLink` in `client/src/countdown/link.ts`.
