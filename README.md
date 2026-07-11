# Ergogen documentation

This repository contains the documentation for [Ergogen](https://github.com/ergogen/ergogen), the
ergonomic keyboard layout generator.

This fork is deployed via GitHub Pages at **https://kumekay.github.io/ergogen-docs/** and tracks the
[`kumekay/ergogen`](https://github.com/kumekay/ergogen) engine (v4.2.1).

## Contributing

To submit improvements and fixes to the documentation: fork this repository and edit the Markdown
under [`/docs`](./docs). Opening a PR builds a deploy preview so you can check your changes.

The example configs and visualizations are generated from the real engine — see
[`helpers/render.js`](./helpers/render.js), which runs a config through a local ergogen checkout and
emits themed SVGs into `docs/assets/`:

```sh
node helpers/render.js path/to/config.yaml docs/assets my_example
```

3D case examples work the same way through [`helpers/render3d.js`](./helpers/render3d.js), which
evaluates the generated JSCAD scripts and emits binary STL files into `static/models/` for the
interactive viewer ([`src/components/StlViewer.js`](./src/components/StlViewer.js)):

```sh
node helpers/render3d.js path/to/config.yaml static/models my_example
```

Set `ERGOGEN_PATH` if your ergogen checkout isn't at `/home/ku/p/kumekay/ergogen`.

## Local development

Requires **Node.js 18+**.

```sh
npm install
npm start
```

This starts a local dev server with hot reload. To produce a production build:

```sh
npm run build
npm run serve   # preview the build locally
```

## Deployment

Pushing to `main` builds the site and publishes it to the `gh-pages` branch via
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml). Enable Pages for the repository
with **Settings → Pages → Build and deployment → Source: Deploy from a branch → `gh-pages` /
(root)**.

Pull requests get a deploy preview at `pr-preview/pr-<number>/` on the same branch via
[`.github/workflows/pr-preview.yml`](./.github/workflows/pr-preview.yml), linked from a comment on
the PR (previews are skipped for PRs from forks, which can't push to `gh-pages`).

The public URL is controlled by `url`/`baseUrl` in [`docusaurus.config.js`](./docusaurus.config.js)
(overridable via the `SITE_URL` / `BASE_URL` environment variables).

This website is built with [Docusaurus 3](https://docusaurus.io/), a modern static site generator.
