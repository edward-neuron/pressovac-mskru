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
    // Normalize NBSP which часто приходит из &nbsp; и ломает trim()/сравнения.
    return textarea.value.replace(/\u00A0/g, " ");
  }

  return input
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
    .replace(/\u00A0/g, " ");
};

export const stripHtmlToText = (html: string): string => {
  // 1) Decode entities first so tags like &lt;br&gt; become real tags.
  let text = decodeHtmlEntities(html);

  // 2) Normalize newlines.
  text = text.replace(/\r\n?/g, "\n");

  // 3) Convert common structural tags to newlines / list markers.
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<li[^>]*>/gi, "\n- ");
  text = text.replace(/<\/li>/gi, "\n");
  text = text.replace(/<\/(p|div)\s*>|<hr[^>]*>/gi, "\n");

  // 4) Remove remaining tags.
  text = text.replace(/<[^>]+>/g, "");

  // 5) Decode any entities left inside plain text.
  text = decodeHtmlEntities(text);

  // 6) Supplier sometimes uses bullet symbols inline: "• Item1 • Item2" => "- Item1\n- Item2".
  text = text.replace(/\s*[•●]\s*/g, "\n- ");

  // 7) Normalize dash-bullets variants at line start.
  text = text.replace(/(^|\n)\s*[–—−]\s+/g, "$1- ");
  text = text.replace(/(^|\n)\s*-\s+/g, "$1- ");

  // 8) If list items were in one sentence after punctuation, force a newline before the dash or asterisk.
  // Example: "...: - Item1; - Item2" => each on its own line.
  // Example: "...: * Item1 * Item2" => each on its own line.
  // BUT: Do NOT break when the dash is followed only by a quantity like "- 1 шт." or "- 2 комп."
  // Those should stay on the same line as the preceding item.
  text = text.replace(/([:;.!?])\s*[–—−-]\s+(?!\d+\s*(шт|комп|ед|упак))/gi, "$1\n- ");
  
  // 8b) Handle asterisk (*) as a list marker within text (not at line start - those are footnotes)
  // Pattern: after punctuation or space, if we see "* Text" - break before it
  text = text.replace(/([:;.!?])\s*\*\s+(?!\d+\s*(шт|комп|ед|упак))/gi, "$1\n* ");
  
  // 8c) Handle asterisk after a list item ending (e.g., "1 комп. * Шланг" => newline before *)
  text = text.replace(/(\d+\s*(шт|комп|ед|упак)\.?)\s+\*\s+/gi, "$1\n* ");
  
  // 8d) CRITICAL: Handle dash after a list item ending (e.g., "1 комп.- S-Набор" or "1 комп. - S-Набор")
  // This catches cases where a new list item starts right after a quantity ending
  text = text.replace(/(\d+\s*(шт|комп|ед|упак)\.?)\s*[–—−-]\s*(?=[A-ZА-ЯЁa-zа-яё])/gi, "$1\n- ");
  
  // 8e) Handle cases like "мм - 1 комплект- L" where dash is between quantity and new item
  text = text.replace(/(мм|см)\s*[–—−-]\s*(\d+\s*(шт|комп|комплект|ед|упак)[а-яё]*\.?)\s*[–—−-]\s*/gi, "$1 - $2\n- ");

  // 9) Clean up whitespace.
  text = text.replace(/\u00A0/g, " ");
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/\n[ \t]+/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
};

export const parseDescriptionBlocks = (text: string): DescriptionBlocks => {
  const lines = text
    .split("\n")
    .map((l) => l.replace(/\u00A0/g, " ").trim())
    .filter(Boolean);

  const introLines: string[] = [];
  const listItems: string[] = [];
  const footnotes: string[] = [];

  let inFootnote = false;

  for (const line of lines) {
    if (/^\*/.test(line)) {
      inFootnote = true;
      footnotes.push(line);
      continue;
    }

    if (inFootnote) {
      // Everything after the first "*" is treated as part of footnote block.
      footnotes.push(line);
      continue;
    }

    if (/^[-–—−]/.test(line)) {
      listItems.push(line);
      continue;
    }

    introLines.push(line);
  }

  return {
    introLines,
    listItems,
    footnotes,
  };
};

