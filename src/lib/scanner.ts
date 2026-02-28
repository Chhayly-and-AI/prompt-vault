import { ScannedItem } from "@/types";

interface GitTreeItem {
  path: string;
  type: string;
}

interface RepoMeta {
  default_branch: string;
}

export async function scanGitHubRepo(url: string): Promise<ScannedItem[]> {
  const match = url.match(/github\.com\/([^/]+)\/([^/?#]+)/i);
  if (!match) {
    throw new Error("Invalid GitHub URL");
  }

  const owner = match[1];
  const repo = match[2].replace(/\.git$/, "");

  const repoMeta = await fetchRepoMeta(owner, repo);
  const branch = repoMeta.default_branch || "main";

  const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
  const treeResponse = await fetch(treeUrl);

  if (!treeResponse.ok) {
    throw new Error("Failed to fetch repository structure");
  }

  const treeData = await treeResponse.json();
  const files: GitTreeItem[] = Array.isArray(treeData.tree)
    ? treeData.tree.filter((item: GitTreeItem) => item.type === "blob")
    : [];

  const scannedItems: ScannedItem[] = [];

  for (const file of files) {
    const path = file.path;
    if (!isPromptCandidate(path)) {
      continue;
    }

    const contentUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
    const contentResponse = await fetch(contentUrl);

    if (!contentResponse.ok) {
      continue;
    }

    const content = await contentResponse.text();
    const type = path.endsWith("SKILL.md") ? "skill" : "prompt";

    scannedItems.push({
      name: path.split("/").pop() || path,
      path,
      type,
      content,
      dependencies: extractDependencies(content),
    });
  }

  return scannedItems;
}

async function fetchRepoMeta(owner: string, repo: string): Promise<RepoMeta> {
  const metaUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const metaResponse = await fetch(metaUrl);

  if (!metaResponse.ok) {
    throw new Error("Failed to fetch repository metadata");
  }

  return metaResponse.json();
}

function isPromptCandidate(path: string): boolean {
  return path.endsWith("SKILL.md") || path.endsWith(".prompt") || path.includes("prompts/");
}

function extractDependencies(content: string): string[] {
  const dependencies: string[] = [];
  const relativePathRegex = /\[.*?\]\(\.\/([\w\-.\/]+)\)/g;

  let match: RegExpExecArray | null;
  while ((match = relativePathRegex.exec(content)) !== null) {
    dependencies.push(match[1]);
  }

  return dependencies;
}
