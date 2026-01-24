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
  // Pattern: <tr>...<td>Item Name</td><td>Quantity</td>...</tr> => "- Item Name - Quantity"
  // First, normalize table cells to be separated by " | "
  text = text.replace(/<\/td>\s*<td[^>]*>/gi, " | ");
  // Add newline before each table row
  text = text.replace(/<tr[^>]*>/gi, "\n");
  // Remove closing row tags
  text = text.replace(/<\/tr>/gi, "");
  // Remove table, tbody, thead tags
  text = text.replace(/<\/?table[^>]*>/gi, "\n");
  text = text.replace(/<\/?tbody[^>]*>/gi, "");
  text = text.replace(/<\/?thead[^>]*>/gi, "");
  // Remove td tags (opening and closing)
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
  // Convert "   * Item" to "* Item" on its own line
  text = text.replace(/(^|\n)\s*\*\s+/g, "$1* ");

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

  // 8f) IMPORTANT: Force newline before "Обращаем ваше внимание" text
  text = text.replace(/([.!?:;])\s*(Обращаем ваше внимание)/gi, "$1\n\n$2");

  // 8g) CRITICAL: Split numbered lists like "1. Item one2. Item two3. Item three" into separate lines
  // Pattern: number followed by period/dot, then text, then another number with period
  // This handles cases where numbered items are concatenated without spaces
  // IMPORTANT: Only match numbers at start of string or after whitespace/newline to avoid breaking "Ø800." etc.
  text = text.replace(/(^|\n|\s)(\d+)\.\s+(?=[A-ZА-ЯЁa-zа-яё])/g, "\n$2. ");
  
  // 8h) Also handle "Основные преимущества:" followed by numbered items - add newline after colon
  text = text.replace(/(Основные преимущества|Технические характеристики|Характеристики):\s*(?=\d+\.)/gi, "$1:\n");
  
  // 8i) CRITICAL: Remove "Спецификация комплекта:" header that appears before kit composition
  // This line should be removed as the composition is shown in "Состав комплекта" collapsible
  text = text.replace(/Спецификация комплекта:\s*/gi, "");

  // 9) Clean up whitespace.
  text = text.replace(/\u00A0/g, " ");
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/\n[ \t]+/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
};

// Helper to check if a line is a sub-item (e.g., "* Item - 1 шт.")
// vs a footnote (e.g., "* Комплект поставки..." without quantity at end)
const isSubItem = (line: string): boolean => {
  // Sub-items typically end with quantity like "- 1 шт." or "- 1 комп."
  // Pattern: ends with "- NUMBER UNIT" or just has quantity patterns
  return /[-–—]\s*\d+\s*(шт|комп|ед|упак|комплект)/i.test(line);
};

// Check if a line contains a quantity pattern indicating it's a kit component
const hasKitQuantity = (line: string): boolean => {
  // Kit items have patterns like "- 1 шт", "- 2 комп", etc.
  return /[-–—]\s*\d+\s*(шт|комп|ед|упак|комплект)/i.test(line);
};

// Check if line starts a warning/notice block
const isWarningStart = (line: string): boolean => {
  return /^Обращаем ваше внимание/i.test(line);
};

// Check if line is a section header (ends with ":")
const isSectionHeader = (line: string): boolean => {
  // Common section headers in product descriptions
  const headerPatterns = [
    /^Технические (спецификации|характеристики):/i,
    /^Применение:/i,
    /^Преимущества:/i,
    /^Основные преимущества:/i,
    /^Особенности:/i,
    /^Комплектация:/i,
    /^Характеристики:/i,
    /^Описание:/i,
  ];
  return headerPatterns.some(p => p.test(line.trim()));
};

// Extract section name from header line
const extractSectionTitle = (line: string): string => {
  return line.replace(/:$/, '').trim();
};

// Check if line is a table row (contains " | " separator with quantity)
const isTableRow = (line: string): boolean => {
  // Table rows typically have format "Item Name | Quantity"
  // Must have actual content on the left side, not just whitespace or pipe
  const parts = line.split("|").map(p => p.trim());
  // Valid table row has non-empty first part and a number in second part
  return parts.length >= 2 && parts[0].length > 0 && /^\d+$/.test(parts[1]);
};

// Check if line is an empty or invalid table row that should be skipped
const isEmptyTableRow = (line: string): boolean => {
  // Empty rows are just "|" or " | " or multiple pipes with only whitespace
  const cleaned = line.replace(/\|/g, "").trim();
  if (cleaned.length === 0 || line.trim() === "|") return true;
  
  // Also skip lines that end with "|" but don't have a valid quantity after it
  // These are table rows with empty second cell (e.g., "сухая очистка... |")
  if (/\|\s*$/.test(line.trim())) return true;
  
  return false;
};

// Convert table row "Item Name | Qty" to list item "- Item Name - Qty шт"
const tableRowToListItem = (line: string): string => {
  const parts = line.split("|").map(p => p.trim());
  if (parts.length >= 2 && parts[0] && parts[1]) {
    // Add "шт" after the quantity number
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
  let hasKitItems = false; // Track if we have real kit items with quantities

  for (const line of lines) {
    // Check for warning block start
    if (isWarningStart(line)) {
      // Save current section if any
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
      // Warning block ends when we hit a new list item or asterisk line
      if (/^[-–—−*]/.test(line)) {
        inWarning = false;
        // Process this line normally below
      } else {
        warnings.push(line);
        continue;
      }
    }

    // Skip empty table rows (just "|" or whitespace)
    if (isEmptyTableRow(line)) {
      continue;
    }

    // Check for section headers (e.g., "Технические спецификации:")
    if (isSectionHeader(line)) {
      // Save previous section if any
      if (currentSection && currentSection.items.length > 0) {
        sections.push(currentSection);
      }
      currentSection = {
        title: extractSectionTitle(line),
        items: []
      };
      continue;
    }

    // CRITICAL: Check if line is a table row (from HTML table parsing)
    // Format: "Item Name | Quantity"
    if (isTableRow(line)) {
      const converted = tableRowToListItem(line);
      listItems.push(converted);
      hasKitItems = true;
      continue;
    }

    // Check if line starts with asterisk
    if (/^\*/.test(line)) {
      // If it's a sub-item (ends with quantity), treat as list item, not footnote
      if (isSubItem(line)) {
        // Convert * to - for consistency in list display
        const converted = line.replace(/^\*\s*/, "- ");
        listItems.push(converted);
        hasKitItems = true;
        continue;
      }
      // Otherwise it's a real footnote
      // Save current section first
      if (currentSection && currentSection.items.length > 0) {
        sections.push(currentSection);
        currentSection = null;
      }
      inFootnote = true;
      footnotes.push(line);
      continue;
    }

    if (inFootnote) {
      // Check if this line could be a sub-item that follows a footnote start
      // but is actually a continuation of list
      if (/^[-–—−]/.test(line) || isSubItem(line)) {
        if (hasKitQuantity(line)) {
          listItems.push(line);
          hasKitItems = true;
        } else if (currentSection) {
          currentSection.items.push(line);
        } else {
          // Check if any previous section can take this
          if (sections.length > 0) {
            sections[sections.length - 1].items.push(line);
          } else {
            introLines.push(line);
          }
        }
        continue;
      }
      // Everything after the first "*" is treated as part of footnote block.
      footnotes.push(line);
      continue;
    }

    // Handle list items (lines starting with dash)
    if (/^[-–—−]/.test(line)) {
      // Check if it's a kit item (has quantity) or just a spec/feature item
      if (hasKitQuantity(line)) {
        listItems.push(line);
        hasKitItems = true;
      } else if (currentSection) {
        // Add to current section
        currentSection.items.push(line);
      } else {
        // No section yet - this is a standalone list item, add to intro or create unnamed section
        introLines.push(line);
      }
      continue;
    }

    // Regular text line
    if (currentSection) {
      // If we're in a section and this is a spec line (like "― Мощность: 285 Вт")
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
