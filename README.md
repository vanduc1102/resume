# Duc Nguyen Resume

[![](https://img.shields.io/badge/PDF-Download-1abc9c?style=for-the-badge)](https://github.com/vanduc1102/resume/releases/latest/download/duc_nguyen_resume.pdf)

## About

This repository builds my resume as a PDF. The content is written in Markdown in [`RESUME.md`](RESUME.md), and a GitHub Actions workflow converts it to PDF.

## How it works

1. Edit [`RESUME.md`](RESUME.md). It is the single source of truth.
2. Push a tag to GitHub.
3. The [release workflow](.github/workflows/release.yml) converts `RESUME.md` to PDF and attaches it to a GitHub release:
   - `duc_nguyen_resume.pdf`, which is the file the download badge links to.
   - `duc_nguyen_resume_YYYY-MM-DD.pdf`, which is stamped with the build date.

## Development

Formatting uses Prettier through npm:

```sh
npm install
npm run format:check
npm run format:write
```
