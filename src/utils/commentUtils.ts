export function stripComments(text: string): string {
  return text.replace(/\[\[comment:.*?\]\]/g, '');
}

export function hasComments(text: string): boolean {
  return /\[\[comment:.*?\]\]/.test(text);
}

export function extractComments(text: string): string[] {
  const matches = text.match(/\[\[comment:(.*?)\]\]/g);
  if (!matches) return [];

  return matches.map(match => {
    const content = match.replace(/^\[\[comment:\s*/, '').replace(/\]\]$/, '');
    return content.trim();
  });
}

export function insertCommentTemplate(): string {
  return '[[comment: Your note here]]';
}
