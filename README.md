# Duc Nguyen Resume

[![Download PDF](https://img.shields.io/badge/PDF-Download-1abc9c?style=for-the-badge)](https://github.com/vanduc1102/resume/releases/latest/download/duc_nguyen_resume.pdf)

Build a modern resume PDF from Markdown. [`RESUME.md`](RESUME.md) is the single source of truth; the npm build renders it into an HTML preview and a selectable-text A4 PDF.

The design uses a clean single-column layout, subtle teal accents, and clear typography. Content remains in reading order, without columns or image-based text.

## Build locally

Use **Node.js 26** (see [`.nvmrc`](.nvmrc)) and **npm**, the only supported package manager.

```sh
npm ci
npx playwright install chromium
npm run build
```

On Linux, use `npx playwright install --with-deps chromium` to install the browser's system dependencies too.

Generated files are written to the ignored `out/` directory:

| File                               | Purpose                                                |
| ---------------------------------- | ------------------------------------------------------ |
| `duc_nguyen_resume.html`           | Open in a browser to preview the design.               |
| `duc_nguyen_resume.pdf`            | Stable filename used by the download badge.            |
| `duc_nguyen_resume_YYYY-MM-DD.pdf` | Identical PDF with the UTC build date in its filename. |

## Edit the resume

1. Update the content in [`RESUME.md`](RESUME.md).
2. Customize typography, colors, spacing, and page margins in [`styles/resume.css`](styles/resume.css).
3. Run `npm run build` and review the generated HTML and PDF.

The build omits content before the first level-one heading, including the download badge, without modifying the Markdown source.

## Rendering

[Marked](https://marked.js.org/) converts Markdown to HTML, and [Playwright](https://playwright.dev/) prints it using Chromium and the project's CSS. The same build runs locally and in GitHub Actions, with npm dependencies locked in `package-lock.json`.

PDF rendering uses local system fonts and blocks network requests. No external font service, Docker image, or third-party Markdown-to-PDF action is needed.

## Checks

```sh
npm run format:write
npm run format:check
npm test
```

`npm test` builds the resume, then checks Markdown rendering, badge removal, UTC filenames, responsive layout, and matching stable and dated PDF files.

## GitHub Actions and releases

The [workflow](.github/workflows/release.yml) runs on pull requests, pushes to `main`, tags, and manual dispatches. It installs dependencies with `npm ci`, installs Chromium, checks formatting, builds and tests the resume, and uploads the generated files as a `resume` artifact.

Tag pushes also publish both PDFs to a GitHub release. For example:

```sh
git tag v1.0.1
git push origin v1.0.1
```

The publishing job uses GitHub's built-in `GITHUB_TOKEN` with `contents: write`; the build job has read-only repository permissions. No separate `RELEASE_TOKEN` secret is required.
