# Architecture

The project is an npm workspaces monorepo with two packages.

```
.
├── client/              React 17 + TypeScript app (Vite)
│   ├── index.html
│   ├── src/
│   │   ├── main.tsx     App entry point
│   │   ├── App.tsx      Root component
│   │   ├── index.css    Global styles and theme tokens
│   │   ├── pages/       Page components
│   │   └── countdown/   Countdown link helpers
│   └── vite.config.ts
├── server/              Node.js + Express + TypeScript API
│   └── src/
│       └── index.ts     Server entry point
├── docs/                Project documentation
├── package.json         Workspaces and root scripts
└── tsconfig.base.json   Shared TypeScript options
```

## Client

- React 17 rendered with `ReactDOM.render`.
- Bundled by Vite. In development it proxies `/api` to the server.

## Server

- Express app written in TypeScript, run with `tsx` in development and compiled with `tsc` for production.
- Exposes routes under `/api` (currently `GET /api/health`).
- With `NODE_ENV=production`, serves `client/dist` and falls back to `index.html` for client-side routes.

## Pages

| Page            | Status  | Description                                                 |
| --------------- | ------- | ----------------------------------------------------------- |
| Home            | Done    | Form to create a countdown link (see [Countdown links](countdown-links.md)) |
| Countdown view  | Planned | Displays the counter according to the link's configuration  |
