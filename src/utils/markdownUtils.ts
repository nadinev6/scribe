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
    case 'badge-react':
      insert = `![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)`;
      cursorOffset = insert.length;
      break;
    case 'badge-typescript':
      insert = `![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)`;
      cursorOffset = insert.length;
      break;
    case 'badge-javascript':
      insert = `![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)`;
      cursorOffset = insert.length;
      break;
    case 'badge-vite':
      insert = `![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)`;
      cursorOffset = insert.length;
      break;
    case 'badge-tailwind':
      insert = `![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)`;
      cursorOffset = insert.length;
      break;
    case 'badge-nodejs':
      insert = `![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)`;
      cursorOffset = insert.length;
      break;
    case 'badge-vue':
      insert = `![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=flat&logo=vue.js&logoColor=white)`;
      cursorOffset = insert.length;
      break;
    case 'badge-angular':
      insert = `![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white)`;
      cursorOffset = insert.length;
      break;
    case 'badge-svelte':
      insert = `![Svelte](https://img.shields.io/badge/Svelte-FF3E00?style=flat&logo=svelte&logoColor=white)`;
      cursorOffset = insert.length;
      break;
    case 'badge-nextjs':
      insert = `![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)`;
      cursorOffset = insert.length;
      break;
    case 'badge-webpack':
      insert = `![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=flat&logo=webpack&logoColor=black)`;
      cursorOffset = insert.length;
      break;
    case 'badge-npm':
      insert = `![npm](https://img.shields.io/badge/npm-CB3837?style=flat&logo=npm&logoColor=white)`;
      cursorOffset = insert.length;
      break;
    case 'badge-yarn':
      insert = `![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=flat&logo=yarn&logoColor=white)`;
      cursorOffset = insert.length;
      break;
    case 'badge-pnpm':
      insert = `![pnpm](https://img.shields.io/badge/pnpm-F69220?style=flat&logo=pnpm&logoColor=white)`;
      cursorOffset = insert.length;
      break;
    case 'badge-supabase':
      insert = `![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)`;
      cursorOffset = insert.length;
      break;
    case 'badge-postgresql':
      insert = `![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)`;
      cursorOffset = insert.length;
      break;
    case 'badge-mongodb':
      insert = `![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)`;
      cursorOffset = insert.length;
      break;
    case 'badge-express':
      insert = `![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)`;
      cursorOffset = insert.length;
      break;
    case 'badge-bootstrap':
      insert = `![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white)`;
      cursorOffset = insert.length;
      break;
    case 'badge-sass':
      insert = `![Sass](https://img.shields.io/badge/Sass-CC6699?style=flat&logo=sass&logoColor=white)`;
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
      if (format.startsWith('social-')) {
        const parts = format.split('::');
        if (parts.length === 2) {
          const platformId = parts[0].replace('social-', '');
          const profileUrl = parts[1];
          insert = `[![${platformId}](social-icon://${platformId})](${profileUrl})`;
          cursorOffset = insert.length;
        } else {
          insert = selected;
          cursorOffset = insert.length;
        }
      } else {
        insert = selected;
        cursorOffset = insert.length;
      }
  }

  const newText = before + insert + after;
  const newCursorPos = selectionStart + cursorOffset;

  return { newText, newCursorPos };
};

export const plainTextToMarkdown = (plainText: string): string => {
  return plainText;
};
