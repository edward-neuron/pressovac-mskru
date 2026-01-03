// Utilities for turning supplier HTML-ish descriptions into readable text blocks.

export type DescriptionBlocks = {
  introLines: string[];
  listItems: string[];
  footnotes: string[];
};

const decodeHtmlEntities = (input: string): string => {
  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = input;
    return textarea.value;
  }

  return input
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)));
};

export const stripHtmlToText = (html: string): string => {
  // 1) Decode entities first so tags like &lt;br&gt; become real tags.
  let text = decodeHtmlEntities(html);

  // 2) Convert common structural tags to newlines / list markers.
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<li[^>]*>/gi, "\n- ");
  text = text.replace(/<\/li>/gi, "\n");
  text = text.replace(/<\/(p|div)\s*>|<hr[^>]*>/gi, "\n");

  // 3) Remove remaining tags.
  text = text.replace(/<[^>]+>/g, "");

  // 4) Decode any entities left inside plain text.
  text = decodeHtmlEntities(text);

  // 5) If supplier uses bullet symbols, force them onto new lines.
  // Example: "• Item1 • Item2" => "- Item1\n- Item2"
  text = text.replace(/\s*[•●]\s*/g, "\n- ");

  // 6) Clean up whitespace.
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/\n[ \t]+/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
};

export const parseDescriptionBlocks = (text: string): DescriptionBlocks => {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const introLines: string[] = [];
  const listItems: string[] = [];
  const footnotes: string[] = [];

  let inFootnote = false;

  for (const line of lines) {
    if (line.startsWith("*")) {
      inFootnote = true;
      footnotes.push(line);
      continue;
    }

    if (inFootnote) {
      // Everything after the first "*" is treated as part of footnote block.
      footnotes.push(line);
      continue;
    }

    if (line.startsWith("-")) {
      listItems.push(line);
      continue;
    }

    introLines.push(line);
  }

  return { introLines, listItems, footnotes };
};
