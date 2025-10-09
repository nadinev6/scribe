export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export const extractHeadingsFromHtml = (html: string): TocItem[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headings = doc.querySelectorAll('h1, h2, h3');

  const tocItems: TocItem[] = [];

  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.substring(1));
    const text = heading.textContent || '';
    const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    heading.id = id;

    tocItems.push({
      id,
      text,
      level
    });
  });

  return tocItems;
};

export const generateTocHtml = (tocItems: TocItem[]): string => {
  if (tocItems.length === 0) {
    return '<div class="toc-placeholder"><p><em>Table of Contents will appear here</em></p></div>';
  }

  let html = '<nav class="table-of-contents"><div class="toc-title"><strong>Table of Contents</strong></div><ul class="toc-list">';
  let currentLevel = 1;

  tocItems.forEach((item, index) => {
    while (currentLevel < item.level) {
      html += '<ul class="toc-list">';
      currentLevel++;
    }

    while (currentLevel > item.level) {
      html += '</ul>';
      currentLevel--;
    }

    html += `<li class="toc-item toc-level-${item.level}"><a href="#${item.id}" class="toc-link">${item.text}</a></li>`;
  });

  while (currentLevel > 1) {
    html += '</ul>';
    currentLevel--;
  }

  html += '</ul></nav>';

  return html;
};

export const processTocInHtml = (html: string): string => {
  const tocPlaceholder = '{{TOC}}';

  if (!html.includes(tocPlaceholder)) {
    return html;
  }

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  const headings = tempDiv.querySelectorAll('h1, h2, h3');
  const tocItems: TocItem[] = [];

  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.substring(1));
    const text = heading.textContent || '';
    const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    heading.id = id;

    tocItems.push({
      id,
      text,
      level
    });
  });

  const tocHtml = generateTocHtml(tocItems);

  const processedHtml = tempDiv.innerHTML.replace(tocPlaceholder, tocHtml);

  return processedHtml;
};

const createGitHubAnchor = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const createDevToAnchor = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const extractHeadingsFromMarkdown = (markdown: string): TocItem[] => {
  const lines = markdown.split('\n');
  const tocItems: TocItem[] = [];
  const headingRegex = /^(#{1,3})\s+(.+)$/;

  lines.forEach((line) => {
    const match = line.match(headingRegex);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = createGitHubAnchor(text);

      tocItems.push({
        id,
        text,
        level
      });
    }
  });

  return tocItems;
};

export const generateGitHubTocMarkdown = (tocItems: TocItem[]): string => {
  if (tocItems.length === 0) {
    return '';
  }

  let markdown = '## Table of Contents\n\n';

  tocItems.forEach((item) => {
    const indent = '  '.repeat(item.level - 1);
    markdown += `${indent}- [${item.text}](#${item.id})\n`;
  });

  return markdown;
};

export const generateDevToTocMarkdown = (tocItems: TocItem[]): string => {
  if (tocItems.length === 0) {
    return '';
  }

  let markdown = '## Table of Contents\n\n';

  tocItems.forEach((item) => {
    const indent = '  '.repeat(item.level - 1);
    markdown += `${indent}- [${item.text}](#${item.id})\n`;
  });

  return markdown;
};

export const exportMarkdownWithToc = (
  markdown: string,
  format: 'github' | 'devto'
): string => {
  const tocPlaceholder = '{{TOC}}';

  if (!markdown.includes(tocPlaceholder)) {
    return markdown;
  }

  const tocItems = extractHeadingsFromMarkdown(markdown);
  const tocMarkdown =
    format === 'github'
      ? generateGitHubTocMarkdown(tocItems)
      : generateDevToTocMarkdown(tocItems);

  return markdown.replace(tocPlaceholder, tocMarkdown);
};
