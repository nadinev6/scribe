import * as jszip from 'jszip';
import { exportMarkdownWithToc } from "./tocUtils";
import { collectImagesFromMarkdown, replaceImageUrlsInMarkdown } from "./imageExportUtils";
import { stripComments } from "./commentUtils";

export const downloadMarkdownFile = (markdown: string, filename: string = "document.md") => {
  const cleanMarkdown = stripComments(markdown);
  const blob = new Blob([cleanMarkdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadHtmlFile = (html: string, filename: string = "document.html") => {
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Document</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.8;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: #333;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
    }
    h1 { font-size: 2em; border-bottom: 2px solid #eee; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    h3 { font-size: 1.25em; }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    code {
      background: #f6f8fa;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }
    pre {
      background: #f6f8fa;
      padding: 1em;
      border-radius: 6px;
      overflow-x: auto;
    }
    pre code {
      background: none;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid #dfe2e5;
      padding-left: 1em;
      color: #6a737d;
      margin: 1em 0;
    }
    img { max-width: 100%; height: auto; }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid #dfe2e5;
      padding: 0.6em 1em;
      text-align: left;
    }
    th {
      background: #f6f8fa;
      font-weight: 600;
    }
    .table-of-contents {
      background: #f6f8fa;
      padding: 1.5em;
      border-radius: 6px;
      margin: 2em 0;
    }
    .toc-title {
      font-size: 1.2em;
      font-weight: 600;
      margin-bottom: 0.5em;
    }
    .toc-list {
      list-style: none;
      padding-left: 0;
    }
    .toc-list .toc-list {
      padding-left: 1.5em;
      margin-top: 0.3em;
    }
    .toc-link {
      color: #0366d6;
      text-decoration: none;
      display: block;
      padding: 0.2em 0;
    }
    .toc-link:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
${html}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const copyMarkdownForPlatform = (
  markdown: string,
  platform: "github" | "devto"
): string => {
  const cleanMarkdown = stripComments(markdown);
  return exportMarkdownWithToc(cleanMarkdown, platform);
};

export const downloadGitHubExport = async (
  markdown: string,
  featuredImage: string
): Promise<void> => {
  const zip = new JSZip();

  const cleanMarkdown = stripComments(markdown);
  const images = await collectImagesFromMarkdown(cleanMarkdown, featuredImage);

  let processedMarkdown = exportMarkdownWithToc(cleanMarkdown, 'github');
  processedMarkdown = replaceImageUrlsInMarkdown(processedMarkdown, images, 'images');

  const badges = `[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](/LICENSE) [![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#) [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](#)\n\n`;

  const finalMarkdown = processedMarkdown.replace(/^(# .+)\n/, `$1\n\n${badges}`);

  zip.file('README.md', finalMarkdown);

  const imagesFolder = zip.folder('images');
  if (imagesFolder) {
    images.forEach(image => {
      if (image.blob) {
        imagesFolder.file(image.filename, image.blob);
      }
    });
  }

  const timestamp = new Date().toISOString().split('T')[0];
  const blob = await zip.generateAsync({ type: 'blob' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `github-export-${timestamp}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadDevToExport = async (
  markdown: string,
  featuredImage: string
): Promise<void> => {
  const zip = new JSZip();

  const cleanMarkdown = stripComments(markdown);
  const images = await collectImagesFromMarkdown(cleanMarkdown, featuredImage);

  let processedMarkdown = exportMarkdownWithToc(cleanMarkdown, 'devto');
  processedMarkdown = replaceImageUrlsInMarkdown(processedMarkdown, images, 'images');

  const firstHeading = processedMarkdown.match(/^# (.+)$/m);
  const title = firstHeading ? firstHeading[1] : 'My Article';

  const frontmatter = `---
title: ${title}
published: false
description:
tags:
cover_image: ./images/${images[0]?.filename || 'cover.png'}
---

`;

  const finalMarkdown = frontmatter + processedMarkdown;

  zip.file('article.md', finalMarkdown);

  const imagesFolder = zip.folder('images');
  if (imagesFolder) {
    images.forEach(image => {
      if (image.blob) {
        imagesFolder.file(image.filename, image.blob);
      }
    });
  }

  const timestamp = new Date().toISOString().split('T')[0];
  const blob = await zip.generateAsync({ type: 'blob' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `devto-export-${timestamp}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
