# Deployment

The client is deployed to GitHub Pages by the workflow `.github/workflows/deploy-pages.yml`.

## Trigger

- Every push to `main`
- Manually, from the Actions tab (`workflow_dispatch`)

## URL

The domain `matheusalves.dev` is configured on the user site repository (`mhsalves.github.io`). GitHub Pages serves every project repository of the same account under that domain, using the repository name as the path:

```
https://matheusalves.dev/<repository-name>/
```

This repository therefore needs no `CNAME` file. Adding one would conflict with the user site.

The workflow reads the path from `actions/configure-pages` and passes it to Vite as `--base`, so renaming the repository changes the URL without code changes. For example, renaming it to `travel-countdown` serves the app at `https://matheusalves.dev/travel-countdown/`.

## What is deployed

GitHub Pages hosts static files only, so only `client/dist` is published. The Express server is not part of this deployment.

`index.html` is copied to `404.html` so client-side routes load the app when opened directly.

## Repository settings

Pages source must be set to **GitHub Actions** (Settings → Pages → Build and deployment).
