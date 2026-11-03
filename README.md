# Duc Nguyen Resume

[![](https://img.shields.io/badge/PDF-Download-1abc9c?style=for-the-badge)](https://github.com/vanduc1102/resume/releases/latest/download/duc_nguyen_resume.pdf)

## About

This project turns a Markdown resume into a modern, selectable-text PDF and an HTML preview. [`RESUME.md`](RESUME.md) is the single source of truth; no document editor or manually maintained PDF is needed.

The design uses a clean single-column layout, subtle teal accents, clear typography, and A4 print styles. Content stays in reading order for applicant tracking systems (ATS).

## Build locally

Use Node.js 24 or newer and **npm** (the only supported package manager):

```sh
npm ci
npx playwright install chromium
npm run build
```

On Linux, use `npx playwright install --with-deps chromium` to install browser system dependencies too.

The `out/` directory contains:

- `duc_nguyen_resume.html`: open this file in a browser to preview the design.
- `duc_nguyen_resume.pdf`: the stable download filename.
- `duc_nguyen_resume_YYYY-MM-DD.pdf`: a copy stamped with the UTC build date.

Edit [`styles/resume.css`](styles/resume.css) to customize typography, colors, spacing, and page margins. Rebuild after changing content or styles. Content before the first `#` heading (including the download badge) is omitted from the output, without modifying `RESUME.md`.

### Why not the Markdown-to-PDF action?

The build now uses [Marked](https://marked.js.org/) to render Markdown and [Playwright](https://playwright.dev/) to print it with Chromium. The same npm command runs locally and in CI, with dependency versions locked in `package-lock.json`. Custom CSS replaces the generic GitHub document theme.

`BaileyJM02/markdown-to-pdf` is no longer needed. Its v1.2.0 Docker image uses Node.js 18 and installs Chrome separately. The new build avoids that container and keeps the renderer and browser version managed through npm and Playwright. Rendering uses local system fonts and blocks network requests; no external font or badge service is needed.

## How it works

1. Edit [`RESUME.md`](RESUME.md). It is the single source of truth.
2. Build locally to review the HTML and PDF.
3. Pull requests and pushes to `main` run formatting checks, build the resume, run tests, and upload preview artifacts.
4. Push a tag to publish a GitHub release through the [release workflow](.github/workflows/release.yml):
   - `duc_nguyen_resume.pdf`, which is the file the download badge links to.
   - `duc_nguyen_resume_YYYY-MM-DD.pdf`, which is stamped with the build date.

## Development

After making changes:

```sh
npm run format:write
npm run format:check
npm test
```

`npm test` builds the resume first, then checks Markdown rendering, badge removal, UTC filenames, responsive layout, and generated PDF files. Releases use GitHub's built-in `GITHUB_TOKEN` with write access only in the publishing job; a separate `RELEASE_TOKEN` secret is no longer required.
