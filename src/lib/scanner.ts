import { ScannedItem } from "@/types";

/**
 * Parse YAML frontmatter from a markdown file.
 * Expects the file to start with "---" and have a closing "---".
 * Returns an object with key-value pairs from the frontmatter.
 */
function parseFrontmatter(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return result;

  const lines = match[1].split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();
    if (key && value) {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Derive a human-readable skill name from the file path.
 * For a path like "skills/frontend-design/SKILL.md", returns "Frontend Design".
 * Falls back to the filename if no parent folder context exists.
 */
function deriveNameFromPath(filePath: string): string {
  const parts = filePath.split('/');
  // If the file is SKILL.md, use the parent folder name
  const filename = parts[parts.length - 1];
  if (filename === 'SKILL.md' && parts.length >= 2) {
    const folderName = parts[parts.length - 2];
    // Convert kebab-case to Title Case
    return folderName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  // For .prompt files, strip extension and title-case
  if (filename.endsWith('.prompt')) {
    const base = filename.replace('.prompt', '');
    return base
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return filename;
}

export async function scanGitHubRepo(url: string): Promise<ScannedItem[]> {
  // Extract owner/repo from URL
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error("Invalid GitHub URL");

  const [_, owner, repo] = match;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;

  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error("Failed to fetch repository structure");

  const data = await response.json();
  const files = data.tree.filter((item: any) => item.type === 'blob');

  const scannedItems: ScannedItem[] = [];

  for (const file of files) {
    const path = file.path;
    // Look for SKILL.md, .prompt files, or other common patterns
    if (path.endsWith('SKILL.md') || path.endsWith('.prompt') || path.includes('prompts/')) {
      const contentUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;
      const contentResponse = await fetch(contentUrl);
      if (contentResponse.ok) {
        const content = await contentResponse.text();
        const type = path.endsWith('SKILL.md') ? 'skill' : 'prompt';

        // Extract name and description from frontmatter if available
        let name = deriveNameFromPath(path);
        let description: string | undefined;

        if (type === 'skill') {
          const frontmatter = parseFrontmatter(content);
          if (frontmatter.name) {
            // Title-case the frontmatter name (kebab-case -> Title Case)
            name = frontmatter.name
              .split('-')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');
          }
          if (frontmatter.description) {
            description = frontmatter.description;
          }
        }

        scannedItems.push({
          name,
          description,
          path,
          type,
          content,
          dependencies: extractDependencies(content, path)
        });
      }
    }
  }

  return scannedItems;
}

function extractDependencies(content: string, filePath: string): string[] {
  const dependencies: string[] = [];
  // Simple regex for relative path dependencies often found in SKILL.md or prompt templates
  const relativePathRegex = /\[.*?\]\(\.\/([\\w\-\.\/]+)\)/g;
  let match;
  while ((match = relativePathRegex.exec(content)) !== null) {
    dependencies.push(match[1]);
  }
  return dependencies;
}
