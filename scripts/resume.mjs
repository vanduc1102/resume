import { marked } from "marked";

export function renderResume(markdown, stylesheet) {
  const tokens = marked.lexer(markdown);
  const start = tokens.findIndex(
    (token) => token.type === "heading" && token.depth === 1,
  );
  if (start === -1) {
    throw new Error(
      "RESUME.md must contain a level-one heading with your name.",
    );
  }

  const title = tokens[start].text.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
  const content = marked.parser(tokens.slice(start));

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title} - Resume</title>
    <style>${stylesheet}</style>
  </head>
  <body>
    <main aria-label="Resume">${content}</main>
  </body>
</html>
`;
}

export function outputNames(date) {
  const stamp = date.toISOString().slice(0, 10);
  return {
    html: "duc_nguyen_resume.html",
    pdf: "duc_nguyen_resume.pdf",
    datedPdf: `duc_nguyen_resume_${stamp}.pdf`,
  };
}
