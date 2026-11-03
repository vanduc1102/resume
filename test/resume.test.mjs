import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { chromium } from "playwright";
import { outputNames, renderResume } from "../scripts/resume.mjs";

test("renders Markdown content, links, and metadata without the download badge", async () => {
  const markdown = `[![Download](https://example.com/badge.svg)](https://example.com/resume.pdf)

# Test & Example

[Email](mailto:test@example.com)

## Experience

### Engineer, _2020 - present_

- Built **useful** software.
`;
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(renderResume(markdown, "h1 { color: teal; }"));
    assert.equal(await page.title(), "Test & Example - Resume");
    assert.equal(await page.locator("main h1").textContent(), "Test & Example");
    assert.equal(await page.locator("img").count(), 0);
    assert.equal(
      await page.locator("a").getAttribute("href"),
      "mailto:test@example.com",
    );
    assert.equal(await page.locator("li strong").textContent(), "useful");
    assert.equal(await page.locator("h3 em").textContent(), "2020 - present");
  } finally {
    await browser.close();
  }
});

test("rejects a resume without a name heading", () => {
  assert.throws(
    () => renderResume("## Summary\nContent", ""),
    /level-one heading/,
  );
});

test("names the dated PDF using UTC, including across a year boundary", () => {
  assert.deepEqual(outputNames(new Date("2026-12-31T23:30:00-02:00")), {
    html: "duc_nguyen_resume.html",
    pdf: "duc_nguyen_resume.pdf",
    datedPdf: "duc_nguyen_resume_2027-01-01.pdf",
  });
});

test("builds matching stable and dated PDFs with the current resume content", async () => {
  const root = new URL("../", import.meta.url);
  const names = outputNames(new Date());
  const [pdf, datedPdf, html] = await Promise.all([
    readFile(new URL(`out/${names.pdf}`, root)),
    readFile(new URL(`out/${names.datedPdf}`, root)),
    readFile(new URL(`out/${names.html}`, root), "utf8"),
  ]);
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  assert.deepEqual(datedPdf, pdf);

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(html);
    const markdown = await readFile(new URL("RESUME.md", root), "utf8");
    const name = markdown.match(/^# (.+)$/m)[1];
    assert.equal(await page.locator("h1").textContent(), name);
    assert.deepEqual(
      await page.locator("h2").allTextContents(),
      [...markdown.matchAll(/^## (.+)$/gm)].map((match) => match[1]),
    );
    assert.equal(await page.locator("img").count(), 0);
    await page.setViewportSize({ width: 375, height: 812 });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      "mobile preview should not overflow horizontally",
    );
  } finally {
    await browser.close();
  }
});
