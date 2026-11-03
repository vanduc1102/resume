import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { outputNames, renderResume } from "./resume.mjs";

const root = new URL("../", import.meta.url);
const output = new URL("out/", root);
const [markdown, stylesheet] = await Promise.all([
  readFile(new URL("RESUME.md", root), "utf8"),
  readFile(new URL("styles/resume.css", root), "utf8"),
]);
const html = renderResume(markdown, stylesheet);
const names = outputNames(new Date());
await mkdir(output, { recursive: true });
await writeFile(new URL(names.html, output), html);

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  // PDF generation is offline: no tracking images, fonts, or remote assets.
  await page.route("**/*", (route) => route.abort());
  await page.setContent(html, { waitUntil: "load" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: fileURLToPath(new URL(names.pdf, output)),
    format: "A4",
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
    outline: true,
  });
  await copyFile(new URL(names.pdf, output), new URL(names.datedPdf, output));
} finally {
  await browser.close();
}

console.log(`Built ${names.html}, ${names.pdf}, and ${names.datedPdf} in out/`);
