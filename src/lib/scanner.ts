import { ScannedItem } from "@/types";

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
        
        scannedItems.push({
          name: path.split('/').pop() || path,
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
  const relativePathRegex = /\[.*?\]\(\.\/([\w\-\.\/]+)\)/g;
  let match;
  while ((match = relativePathRegex.exec(content)) !== null) {
    dependencies.push(match[1]);
  }
  return dependencies;
}
