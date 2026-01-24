// Utilities for turning supplier HTML-ish descriptions into readable text blocks.

export type DescriptionSection = {
  title: string;
  items: string[];
};

export type DescriptionBlocks = {
  introLines: string[];
  listItems: string[]; // Only for kit compositions
  sections: DescriptionSection[]; // For named sections like "Технические спецификации:", "Применение:", etc.
  footnotes: string[];
  warnings: string[]; // For "Обращаем ваше внимание!" blocks
  isKit: boolean; // True only if this is a real kit with quantities
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

  // 2b) CRITICAL: Convert HTML table rows to list items BEFORE stripping tags
  text = text.replace(/<\/td>\s*<td[^>]*>/gi, " | ");
  text = text.replace(/<tr[^>]*>/gi, "\n");
  text = text.replace(/<\/tr>/gi, "");
  text = text.replace(/<\/?table[^>]*>/gi, "\n");
  text = text.replace(/<\/?tbody[^>]*>/gi, "");
  text = text.replace(/<\/?thead[^>]*>/gi, "");
  text = text.replace(/<td[^>]*>/gi, "");
  text = text.replace(/<\/td>/gi, "");

  // 3) Convert common structural tags to newlines / list markers.
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<li[^>]*>/gi, "\n- ");
  text = text.replace(/<\/li>/gi, "\n");
  text = text.replace(/<\/(p|div)\s*>|<hr[^>]*>/gi, "\n");

  // 4) Remove remaining tags.
  text = text.replace(/<[^>]+>/g, "");

  // 5) Decode any entities left inside plain text.
  text = decodeHtmlEntities(text);

  // 5b) Remove escaped asterisks (\*) -> just asterisks (*)
  text = text.replace(/\\\*/g, "*");

  // 6) Supplier sometimes uses bullet symbols inline: "• Item1 • Item2" => "- Item1\n- Item2".
  text = text.replace(/\s*[•●]\s*/g, "\n- ");

  // 7) Normalize dash-bullets variants at line start.
  text = text.replace(/(^|\n)\s*[–—−]\s+/g, "$1- ");
  text = text.replace(/(^|\n)\s*-\s+/g, "$1- ");

  // 7b) Normalize asterisk-bullets at line start (with optional leading whitespace).
  text = text.replace(/(^|\n)\s*\*\s+/g, "$1* ");

  // 8) If list items were in one sentence after punctuation, force a newline before the dash or asterisk.
  text = text.replace(/([:;.!?])\s*[–—−-]\s+(?!\d+\s*(шт|комп|ед|упак))/gi, "$1\n- ");
  text = text.replace(/([:;.!?])\s*\*\s+(?!\d+\s*(шт|комп|ед|упак))/gi, "$1\n* ");
  text = text.replace(/(\d+\s*(шт|комп|ед|упак)\.?)\s+\*\s+/gi, "$1\n* ");
  text = text.replace(/(\d+\s*(шт|комп|ед|упак)\.?)\s*[–—−-]\s*(?=[A-ZА-ЯЁa-zа-яё])/gi, "$1\n- ");
  text = text.replace(/(мм|см)\s*[–—−-]\s*(\d+\s*(шт|комп|комплект|ед|упак)[а-яё]*\.?)\s*[–—−-]\s*/gi, "$1 - $2\n- ");

  // 8f) IMPORTANT: Force newline before "Обращаем ваше внимание" text
  text = text.replace(/([.!?:;])\s*(Обращаем ваше внимание)/gi, "$1\n\n$2");

  // 8g) Split numbered lists
  text = text.replace(/(^|\n|\s)(\d+)\.\s+(?=[A-ZА-ЯЁa-zа-яё])/g, "\n$2. ");
  text = text.replace(/(Основные преимущества|Технические характеристики|Характеристики):\s*(?=\d+\.)/gi, "$1:\n");
  
  // 8i) Remove "Спецификация комплекта:" header
  text = text.replace(/Спецификация комплекта:\s*/gi, "");

  // 9) Clean up whitespace.
  text = text.replace(/\u00A0/g, " ");
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/\n[ \t]+/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
};

// Helper to check if a line is a sub-item (e.g., "* Item - 1 шт.")
const isSubItem = (line: string): boolean => {
  return /[-–—]\s*\d+\s*(шт|комп|ед|упак|комплект)/i.test(line);
};

// Check if a line contains a quantity pattern indicating it's a kit component
const hasKitQuantity = (line: string): boolean => {
  return /[-–—]\s*\d+\s*(шт|комп|ед|упак|комплект)/i.test(line);
};

// Check if line starts a warning/notice block
const isWarningStart = (line: string): boolean => {
  return /^Обращаем ваше внимание/i.test(line);
};

// Check if line is a main section header (ends with ":")
const isSectionHeader = (line: string): boolean => {
  const trimmed = line.trim();
  const headerPatterns = [
    /^Технические\s+(спецификации|характеристики):?$/i,
    /^Применение:?$/i,
    /^Преимущества:?$/i,
    /^Основные\s+преимущества:?$/i,
    /^Особенности:?$/i,
    /^Комплектация:?$/i,
    /^Характеристики:?$/i,
  ];
  return headerPatterns.some(p => p.test(trimmed));
};

// Check if line is a product sub-header that should be bold but stays in description
// Examples: "G-3 Фильтр грубой очистки", "F-7 Фильтр тонкой очистки", "G3 - F7 STANDART / EU7 (207.002.012)"
const isSubHeader = (line: string): boolean => {
  const subHeaderPatterns = [
    /^[GFgf]-?\d+\s+(Фильтр|фильтр)/i,                    // G-3 Фильтр грубой очистки
    /^[GFgf]\d+\s*-\s*[GFgf]\d+\s+(STANDART|STANDARD)/i,  // G3 - F7 STANDART / EU7
    /^HAC-\d+\s+HEPA/i,                                    // HAC-10 HEPA Air Cleaner
  ];
  return subHeaderPatterns.some(p => p.test(line.trim()));
};

// If a line starts with a known sub-header but continues as a long paragraph,
// split it into: 1) bold subheader line, 2) remaining text line.
// This prevents accidentally making the whole description bold for single-line descriptions (e.g., HAC-10).
const splitLeadingSubHeader = (line: string): { header: string; rest: string } | null => {
  const trimmed = line.trim();

  const candidates: RegExp[] = [
    /^(HAC-\d+\s+HEPA\s+Air\s+Cleaner)\b/i,
    /^([GFgf]-?\d+\s+Фильтр[^—–-]{0,40})\b/i,
    /^([GFgf]\d+\s*-\s*[GFgf]\d+\s+(STANDART|STANDARD)[^—–-]{0,40})\b/i,
  ];

  const match = candidates.map((r) => trimmed.match(r)).find(Boolean);
  if (!match || !match[1]) return null;

  const header = match[1].trim();
  let rest = trimmed.slice(match[0].length).trim();

  // If the remainder begins with a dash, drop it (we render as separate paragraph).
  rest = rest.replace(/^[—–-]\s*/u, "");

  // Only split if this is clearly more than a title line.
  if (!rest || trimmed.length <= 90) return null;

  return { header, rest };
};

// Check if line looks like a technical spec (starts with "― " or "- " followed by parameter name and colon/value)
const isTechSpecLine = (line: string): boolean => {
  // Pattern: "― Мощность мотора: 285 Ватт" or "- Напряжение: 230В" or "- Размеры 592 x 592"
  const trimmed = line.trim();
  if (!/^[―–—-]\s*/.test(trimmed)) return false;

  // Primary signal: explicit "Параметр: значение"
  if (/^[―–—-]\s*[^:]{1,80}:\s*\S/.test(trimmed)) return true;

  // Secondary signal: contains numbers + common units (to avoid misclassifying "Применение" bullets)
  const hasNumbersAndUnits = /\b\d+[\d\s.,]*\s*(в|ватт|квт|кг|г|мм|см|м|м3\/час|м³\/ч|%|об\/мин|rpm|pa|кпа|ø|диаметр)\b/i.test(trimmed);
  if (hasNumbersAndUnits) return true;

  // Dimensions like "410 x 540 x 410" (even without explicit unit token)
  if (/\b\d+\s*[x×]\s*\d+(\s*[x×]\s*\d+)?\b/i.test(trimmed)) return true;

  return false;
};

// Extract section name from header line
const extractSectionTitle = (line: string): string => {
  return line.replace(/:$/, '').trim();
};

// Check if line is a table row (contains " | " separator with quantity)
const isTableRow = (line: string): boolean => {
  const parts = line.split("|").map(p => p.trim());
  return parts.length >= 2 && parts[0].length > 0 && /^\d+$/.test(parts[1]);
};

// Check if line is an empty or invalid table row that should be skipped
const isEmptyTableRow = (line: string): boolean => {
  const cleaned = line.replace(/\|/g, "").trim();
  if (cleaned.length === 0 || line.trim() === "|") return true;
  if (/\|\s*$/.test(line.trim())) return true;
  return false;
};

// Convert table row "Item Name | Qty" to list item "- Item Name - Qty шт"
const tableRowToListItem = (line: string): string => {
  const parts = line.split("|").map(p => p.trim());
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `- ${parts[0]} - ${parts[1]} шт`;
  }
  return line;
};

export const parseDescriptionBlocks = (text: string): DescriptionBlocks => {
  const lines = text
    .split("\n")
    .map((l) => l.replace(/\u00A0/g, " ").trim())
    .filter(Boolean);

  const introLines: string[] = [];
  const listItems: string[] = []; // Only for kit compositions
  const sections: DescriptionSection[] = [];
  const footnotes: string[] = [];
  const warnings: string[] = [];

  let inFootnote = false;
  let inWarning = false;
  let currentSection: DescriptionSection | null = null;
  let hasKitItems = false;

  // First pass: identify where tech specs start by looking for patterns
  // This helps handle HEPA-10 where "Технические спецификации:" header exists in text
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Prevent whole-paragraph bolding when supplier provides a single long line starting with a subheader
    const split = splitLeadingSubHeader(line);
    if (split) {
      if (currentSection) {
        currentSection.items.push(`**${split.header}**`);
        currentSection.items.push(split.rest);
      } else {
        introLines.push(`**${split.header}**`);
        introLines.push(split.rest);
      }
      continue;
    }

    // Check for warning block start
    if (isWarningStart(line)) {
      if (currentSection && currentSection.items.length > 0) {
        sections.push(currentSection);
        currentSection = null;
      }
      inWarning = true;
      warnings.push(line);
      continue;
    }

    // If we're in a warning block, continue collecting warning lines
    if (inWarning) {
      if (/^[-–—−*]/.test(line)) {
        inWarning = false;
      } else {
        warnings.push(line);
        continue;
      }
    }

    // Skip empty table rows
    if (isEmptyTableRow(line)) {
      continue;
    }

    // Skip duplicate "Описание" headers
    if (/^Описание:?$/i.test(line.trim())) {
      continue;
    }

    // Check for main section headers (e.g., "Технические спецификации:", "Применение:", "Преимущества:")
    if (isSectionHeader(line)) {
      if (currentSection && currentSection.items.length > 0) {
        sections.push(currentSection);
      }
      currentSection = {
        title: extractSectionTitle(line),
        items: []
      };
      continue;
    }

    // Check if this line is a sub-header (bold text within description)
    // Mark it specially so UI can render it bold
    if (isSubHeader(line)) {
      if (currentSection) {
        currentSection.items.push(`**${line}**`);
      } else {
        introLines.push(`**${line}**`);
      }
      continue;
    }

    // Check for table row (from HTML table parsing)
    if (isTableRow(line)) {
      const converted = tableRowToListItem(line);
      listItems.push(converted);
      hasKitItems = true;
      continue;
    }

    // Check if line starts with asterisk
    if (/^\*/.test(line)) {
      if (isSubItem(line)) {
        const converted = line.replace(/^\*\s*/, "- ");
        listItems.push(converted);
        hasKitItems = true;
        continue;
      }
      if (currentSection && currentSection.items.length > 0) {
        sections.push(currentSection);
        currentSection = null;
      }
      inFootnote = true;
      footnotes.push(line);
      continue;
    }

    if (inFootnote) {
      if (/^[-–—−]/.test(line) || isSubItem(line)) {
        if (hasKitQuantity(line)) {
          listItems.push(line);
          hasKitItems = true;
        } else if (currentSection) {
          currentSection.items.push(line);
        } else if (sections.length > 0) {
          sections[sections.length - 1].items.push(line);
        } else {
          introLines.push(line);
        }
        continue;
      }
      footnotes.push(line);
      continue;
    }

    // Handle list items (lines starting with dash)
    if (/^[-–—−]/.test(line)) {
      if (hasKitQuantity(line)) {
        listItems.push(line);
        hasKitItems = true;
      } else if (
        isTechSpecLine(line) &&
        // Do not hijack named non-technical sections like "Применение" / "Преимущества"
        !(currentSection && /примен|преим|особенн|комплект/i.test(currentSection.title))
      ) {
        // This is a technical specification line
        if (!currentSection || !currentSection.title.toLowerCase().includes('техническ')) {
          if (currentSection && currentSection.items.length > 0) {
            sections.push(currentSection);
          }
          currentSection = {
            title: 'Технические спецификации',
            items: []
          };
        }
        currentSection.items.push(line);
      } else if (currentSection) {
        currentSection.items.push(line);
      } else {
        introLines.push(line);
      }
      continue;
    }

    // Regular text line
    if (currentSection) {
      currentSection.items.push(line);
    } else {
      introLines.push(line);
    }
  }

  // Save last section if any
  if (currentSection && currentSection.items.length > 0) {
    sections.push(currentSection);
  }

  return {
    introLines,
    listItems,
    sections,
    footnotes,
    warnings,
    isKit: hasKitItems && listItems.length > 0,
  };
};