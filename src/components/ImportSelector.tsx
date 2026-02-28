"use client";

import { useMemo, useState } from "react";
import { ScannedItem } from "@/types";
import { CheckCircle2, FileCode2, Layers, Loader2, RotateCcw, Workflow } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ImportSelectorProps {
  items: ScannedItem[];
  onImport: (selectedItems: ScannedItem[]) => void;
  onCancel: () => void;
}

export default function ImportSelector({ items, onImport, onCancel }: ImportSelectorProps) {
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set(items.map((item) => item.path)));
  const [activePath, setActivePath] = useState(items[0]?.path ?? "");
  const [importing, setImporting] = useState(false);

  const selectedItems = useMemo(() => items.filter((item) => selectedPaths.has(item.path)), [items, selectedPaths]);
  const activeItem = useMemo(() => items.find((item) => item.path === activePath) ?? items[0], [activePath, items]);

  const toggleItem = (path: string) => {
    setSelectedPaths((current) => {
      const next = new Set(current);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleImport = async () => {
    setImporting(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    onImport(selectedItems);
  };

  return (
    <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <div className="cc-glass rounded-3xl p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Step 2</p>
            <h3 className="mt-1 text-xl font-semibold">Select Files to Import</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Choose which discovered assets should be committed to your local vault.</p>
          </div>
          <div className="cc-pill px-3 py-1.5 text-xs text-[var(--text-muted)]">{selectedItems.length} selected</div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2 text-xs">
          <button onClick={() => setSelectedPaths(new Set(items.map((item) => item.path)))} className="cc-btn-secondary px-3 py-1.5">
            Select all
          </button>
          <button onClick={() => setSelectedPaths(new Set())} className="cc-btn-secondary px-3 py-1.5">
            Clear
          </button>
          <button onClick={onCancel} className="cc-btn-secondary flex items-center gap-1.5 px-3 py-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            Back to scan
          </button>
        </div>

        <div className="max-h-[62vh] space-y-2 overflow-y-auto pr-1">
          {items.map((item) => {
            const isSelected = selectedPaths.has(item.path);
            const isActive = activeItem?.path === item.path;

            return (
              <button
                key={item.path}
                onClick={() => {
                  setActivePath(item.path);
                  toggleItem(item.path);
                }}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  isSelected
                    ? "border-[var(--line-strong)] bg-[rgba(33,50,78,0.5)]"
                    : "border-[var(--line)] bg-[rgba(10,16,24,0.56)]"
                } ${isActive ? "ring-1 ring-[rgba(126,172,250,0.45)]" : "hover:border-[var(--line-strong)]"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      {item.type === "skill" ? (
                        <Workflow className="h-4 w-4 text-[var(--warn)]" />
                      ) : (
                        <FileCode2 className="h-4 w-4 text-[var(--brand)]" />
                      )}
                      <p className="text-sm font-medium">{item.name}</p>
                    </div>
                    <p className="mt-1 truncate font-mono text-[11px] text-[var(--text-muted)]">{item.path}</p>
                    {item.dependencies && item.dependencies.length > 0 && (
                      <p className="mt-1 text-[11px] text-[var(--text-muted)]">{item.dependencies.length} linked dependencies</p>
                    )}
                  </div>
                  {isSelected ? <CheckCircle2 className="h-4 w-4 text-[var(--ok)]" /> : <Layers className="h-4 w-4 text-[var(--text-muted)]" />}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleImport}
          disabled={selectedItems.length === 0 || importing}
          className="cc-btn-primary mt-4 flex h-11 w-full items-center justify-center gap-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
        >
          {importing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Importing assets
            </>
          ) : (
            <>Import {selectedItems.length} assets</>
          )}
        </button>
      </div>

      <aside className="cc-glass rounded-3xl p-5 md:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Preview</p>
        {activeItem ? (
          <>
            <h4 className="mt-2 truncate text-lg font-semibold">{activeItem.name}</h4>
            <p className="mt-1 truncate font-mono text-xs text-[var(--text-muted)]">{activeItem.path}</p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--line)] bg-[rgba(5,9,14,0.75)]">
              <SyntaxHighlighter
                language={activeItem.type === "skill" ? "markdown" : "text"}
                style={atomDark}
                customStyle={{
                  background: "transparent",
                  margin: 0,
                  fontSize: "0.76rem",
                  lineHeight: 1.55,
                  maxHeight: "58vh",
                }}
              >
                {activeItem.content}
              </SyntaxHighlighter>
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-[var(--text-muted)]">No file selected for preview.</p>
        )}
      </aside>
    </section>
  );
}
