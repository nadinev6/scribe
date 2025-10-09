export const markdownToPlainText = (markdown: string): string => {
  return markdown
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    // Remove strikethrough
    .replace(/~~(.+?)~~/g, '$1')
    // Remove links
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    // Remove images
    .replace(/!\[.*?\]\(.+?\)/g, '')
    // Remove inline code
    .replace(/`(.+?)`/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove list markers
    .replace(/^[\*\-\+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .trim();
};

export const insertMarkdownFormat = (
  text: string,
  selectionStart: number,
  selectionEnd: number,
  format: string
): { newText: string; newCursorPos: number } => {
  const before = text.substring(0, selectionStart);
  const selected = text.substring(selectionStart, selectionEnd);
  const after = text.substring(selectionEnd);
  
  let insert = '';
  let cursorOffset = 0;
  
  switch (format) {
    case 'h1':
      insert = `# ${selected || 'Heading 1'}`;
      cursorOffset = selected ? insert.length : 2;
      break;
    case 'h2':
      insert = `## ${selected || 'Heading 2'}`;
      cursorOffset = selected ? insert.length : 3;
      break;
    case 'h3':
      insert = `### ${selected || 'Heading 3'}`;
      cursorOffset = selected ? insert.length : 4;
      break;
    case 'bold':
      insert = `**${selected || 'bold text'}**`;
      cursorOffset = selected ? insert.length : 2;
      break;
    case 'italic':
      insert = `*${selected || 'italic text'}*`;
      cursorOffset = selected ? insert.length : 1;
      break;
    case 'strikethrough':
      insert = `~~${selected || 'strikethrough'}~~`;
      cursorOffset = selected ? insert.length : 2;
      break;
    case 'code':
      insert = `\`${selected || 'code'}\``;
      cursorOffset = selected ? insert.length : 1;
      break;
    case 'quote':
      insert = `> ${selected || 'quote'}`;
      cursorOffset = selected ? insert.length : 2;
      break;
    case 'ul':
      insert = `- ${selected || 'list item'}`;
      cursorOffset = selected ? insert.length : 2;
      break;
    case 'ol':
      insert = `1. ${selected || 'list item'}`;
      cursorOffset = selected ? insert.length : 3;
      break;
    case 'link':
      insert = `[${selected || 'link text'}](url)`;
      cursorOffset = selected ? insert.length - 4 : 1;
      break;
    case 'image':
      insert = `![${selected || 'alt text'}](url)`;
      cursorOffset = selected ? insert.length - 4 : 2;
      break;
    case 'table':
      insert = `\n\n| Column 1 | Column 2 |\n| :--- | :--- |\n| Row 1, Cell 1 | Row 1, Cell 2 |\n| Row 2, Cell 1 | Row 2, Cell 2 |\n\n`;
      cursorOffset = insert.length;
      break;
    case 'llm-gemini':
      insert = `![Gemini](llm-icon://gemini)`;
      cursorOffset = insert.length;
      break;
    case 'llm-chatgpt':
      insert = `![ChatGPT](llm-icon://chatgpt)`;
      cursorOffset = insert.length;
      break;
    case 'llm-claude':
      insert = `![Claude](llm-icon://claude)`;
      cursorOffset = insert.length;
      break;
    case 'llm-perplexity':
      insert = `![Perplexity](llm-icon://perplexity)`;
      cursorOffset = insert.length;
      break;
    case 'llm-mistral':
      insert = `![Mistral](llm-icon://mistral)`;
      cursorOffset = insert.length;
      break;
    case 'llm-groq':
      insert = `![Groq](llm-icon://groq)`;
      cursorOffset = insert.length;
      break;
    case 'llm-deepseek':
      insert = `![DeepSeek](llm-icon://deepseek)`;
      cursorOffset = insert.length;
      break;
    case 'llm-ollama':
      insert = `![Ollama](llm-icon://ollama)`;
      cursorOffset = insert.length;
      break;
    case 'llm-anthropic':
      insert = `![Anthropic](llm-icon://anthropic)`;
      cursorOffset = insert.length;
      break;
    case 'toc':
      insert = `{{TOC}}`;
      cursorOffset = insert.length;
      break;
    case 'badge-mit':
      insert = `[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](/LICENSE)`;
      cursorOffset = insert.length;
      break;
    case 'badge-apache':
      insert = `[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](/LICENSE)`;
      cursorOffset = insert.length;
      break;
    case 'badge-gpl':
      insert = `[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](/LICENSE)`;
      cursorOffset = insert.length;
      break;
    case 'badge-coc':
      insert = `[![Code of Conduct](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](/CODE_OF_CONDUCT.md)`;
      cursorOffset = insert.length;
      break;
    case 'badge-contributing':
      insert = `[![Contributing](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)](/CONTRIBUTING.md)`;
      cursorOffset = insert.length;
      break;
    case 'badge-build':
      insert = `[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)`;
      cursorOffset = insert.length;
      break;
    case 'badge-coverage':
      insert = `[![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen.svg)](#)`;
      cursorOffset = insert.length;
      break;
    case 'badge-version':
      insert = `[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](#)`;
      cursorOffset = insert.length;
      break;
    case 'center':
      if (selected) {
        insert = `<div align="center">\n${selected}\n</div>`;
        cursorOffset = insert.length;
      } else {
        insert = `<div align="center">\n\n</div>`;
        cursorOffset = 21;
      }
      break;
    case 'comment':
      insert = `[[comment: Your note here]]`;
      cursorOffset = 11;
      break;
    default:
      insert = selected;
      cursorOffset = insert.length;
  }

  const newText = before + insert + after;
  const newCursorPos = selectionStart + cursorOffset;

  return { newText, newCursorPos };
};

export const plainTextToMarkdown = (plainText: string): string => {
  return plainText;
};
