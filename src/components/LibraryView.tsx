"use client";

import { useMemo, useState } from "react";
import { PromptItem } from "@/types";
import { deletePrompt } from "@/lib/storage";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Check,
  Copy,
  ExternalLink,
  FileCode2,
  FolderOpenDot,
  Sparkles,
  Trash2,
  Workflow,
  X,
} from "lucide-react";

interface LibraryViewProps {
  prompts: PromptItem[];
  onRefresh: () => void;
}

export default function LibraryView({ prompts, onRefresh }: LibraryViewProps) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);

  const latestCountLabel = useMemo(() => {
    if (prompts.length === 0) {
      return "No entries loaded";
    }

    const newest = prompts[0];
    return `Latest: ${new Date(newest.createdAt).toLocaleDateString()}`;
  }, [prompts]);

  const handleCopy = async (event: React.MouseEvent, prompt: PromptItem) => {
    event.stopPropagation();
    await navigator.clipboard.writeText(prompt.content);
    setCopyStatus(prompt.id);
    setTimeout(() => setCopyStatus(null), 1500);
  };

  const handleDelete = async (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    if (confirm("Delete this prompt from local vault?")) {
      await deletePrompt(id);
      if (selectedPrompt?.id === id) {
        setSelectedPrompt(null);
      }
      onRefresh();
    }
  };

  if (prompts.length === 0) {
    return (
      <div className="cc-glass rounded-3xl p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--line)] bg-[rgba(9,14,22,0.74)]">
          <FolderOpenDot className="h-7 w-7 text-[var(--text-muted)]" />
        </div>
        <h3 className="mt-4 text-xl font-semibold">Vault is empty</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-muted)]">Run the import wizard to pull prompt assets from a GitHub repository.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[rgba(8,13,20,0.62)] px-4 py-3 text-xs text-[var(--text-muted)]">
        <span>{latestCountLabel}</span>
        <span className="cc-pill flex items-center gap-1.5 px-2.5 py-1">
          <Sparkles className="h-3.5 w-3.5 text-[var(--brand)]" />
          Click any card for detail panel
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {prompts.map((prompt) => {
          const isSkill = prompt.type === "skill";

          return (
            <article
              key={prompt.id}
              onClick={() => setSelectedPrompt(prompt)}
              className="cc-card cursor-pointer p-4"
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setSelectedPrompt(prompt);
                }
              }}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{prompt.name}</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">{new Date(prompt.createdAt).toLocaleString()}</p>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${
                    isSkill
                      ? "border-[rgba(245,199,110,0.35)] bg-[rgba(84,66,27,0.35)] text-[var(--warn)]"
                      : "border-[rgba(104,166,255,0.35)] bg-[rgba(33,61,102,0.35)] text-[var(--brand)]"
                  }`}
                >
                  {prompt.type}
                </span>
              </div>

              <p className="line-clamp-5 rounded-xl border border-[var(--line)] bg-[rgba(5,9,14,0.58)] p-3 font-mono text-[11px] leading-relaxed text-[var(--text-muted)]">
                {prompt.content}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="truncate text-[11px] text-[var(--text-muted)]">{prompt.sourceUrl ?? "local"}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(event) => void handleCopy(event, prompt)}
                    className="rounded-lg border border-[var(--line)] bg-[rgba(8,14,22,0.65)] p-1.5 text-[var(--text-muted)] transition hover:text-white"
                    aria-label="Copy prompt"
                  >
                    {copyStatus === prompt.id ? <Check className="h-3.5 w-3.5 text-[var(--ok)]" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={(event) => void handleDelete(event, prompt.id)}
                    className="rounded-lg border border-[var(--line)] bg-[rgba(8,14,22,0.65)] p-1.5 text-[var(--text-muted)] transition hover:text-[var(--danger)]"
                    aria-label="Delete prompt"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {selectedPrompt && (
        <>
          <button
            onClick={() => setSelectedPrompt(null)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-label="Close preview"
          />
          <aside className="fixed right-0 top-0 z-50 h-full w-full border-l border-[var(--line)] bg-[rgba(7,11,17,0.96)] p-4 backdrop-blur-xl sm:w-[80%] lg:w-[52%] xl:w-[46%]">
            <div className="flex h-full flex-col rounded-2xl border border-[var(--line)] bg-[rgba(8,13,20,0.76)]">
              <header className="flex items-start justify-between border-b border-[var(--line)] p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {selectedPrompt.type === "skill" ? (
                      <Workflow className="h-4 w-4 text-[var(--warn)]" />
                    ) : (
                      <FileCode2 className="h-4 w-4 text-[var(--brand)]" />
                    )}
                    <h3 className="truncate text-lg font-semibold">{selectedPrompt.name}</h3>
                  </div>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">Added {new Date(selectedPrompt.createdAt).toLocaleString()}</p>
                  {selectedPrompt.sourceUrl && (
                    <p className="mt-1 truncate text-xs text-[var(--text-muted)]">{selectedPrompt.sourceUrl}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(selectedPrompt.content);
                      setCopyStatus(selectedPrompt.id);
                      setTimeout(() => setCopyStatus(null), 1500);
                    }}
                    className="cc-btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs"
                  >
                    {copyStatus === selectedPrompt.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    Copy
                  </button>
                  <button onClick={() => setSelectedPrompt(null)} className="cc-btn-secondary p-1.5" aria-label="Close panel">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[rgba(4,8,14,0.85)]">
                  <SyntaxHighlighter
                    language={selectedPrompt.type === "skill" ? "markdown" : "text"}
                    style={atomDark}
                    customStyle={{
                      background: "transparent",
                      margin: 0,
                      fontSize: "0.8rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {selectedPrompt.content}
                  </SyntaxHighlighter>
                </div>
              </div>

              <footer className="flex items-center justify-between border-t border-[var(--line)] p-4 text-xs text-[var(--text-muted)]">
                <span>{selectedPrompt.type === "skill" ? "Skill asset" : "Prompt asset"}</span>
                {selectedPrompt.sourceUrl ? (
                  <a href={selectedPrompt.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[var(--brand)]">
                    Open source
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <span>Local entry</span>
                )}
              </footer>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
