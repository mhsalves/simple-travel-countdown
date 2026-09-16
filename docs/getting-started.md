# Getting started

## Requirements

- Node.js 20 or newer (see `.nvmrc`)
- npm 10 or newer

## Install

```bash
npm install
```

Dependencies for both workspaces (`client` and `server`) are installed from the root.

## Scripts

Run from the project root:

| Script              | Description                                                        |
| ------------------- | ------------------------------------------------------------------ |
| `npm run dev`       | Starts the client dev server (port 3029) and the server (port 3030) |
| `npm run build`     | Builds the client to `client/dist` and the server to `server/dist`  |
| `npm start`         | Runs the compiled server                                            |
| `npm run typecheck` | Type-checks both workspaces                                         |

## Development

```bash
npm run dev
```

Open http://localhost:3029. Requests to `/api/*` are proxied to the server on port 3030.

## Production

```bash
npm run build
NODE_ENV=production npm start
```

Open http://localhost:3029. In production the server also serves the built client.

## Environment variables

| Variable   | Default | Description                                     |
| ---------- | ------- | ----------------------------------------------- |
| `PORT`     | `3029`  | Server port (`npm run dev` sets it to `3030`)   |
| `NODE_ENV` | —       | Set to `production` to serve the built client   |
