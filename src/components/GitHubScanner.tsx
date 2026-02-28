"use client";

import { useState } from "react";
import { scanGitHubRepo } from "@/lib/scanner";
import { ScannedItem } from "@/types";
import { AlertCircle, ArrowRight, Github, Loader2, Radar, SearchCode, ShieldCheck } from "lucide-react";

interface ScannerProps {
  onItemsScanned: (items: ScannedItem[]) => void;
}

type ScanState = "idle" | "fetching" | "analyzing";

export default function GitHubScanner({ onItemsScanned }: ScannerProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<ScanState>("idle");

  const handleScan = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!url.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setState("fetching");

    try {
      await new Promise((resolve) => setTimeout(resolve, 450));
      setState("analyzing");
      const items = await scanGitHubRepo(url.trim());
      await new Promise((resolve) => setTimeout(resolve, 250));
      onItemsScanned(items);
    } catch (scanError: unknown) {
      const message = scanError instanceof Error ? scanError.message : "Scan failed for this repository.";
      setError(message);
      setState("idle");
    } finally {
      setLoading(false);
    }
  };

  const statusLabel =
    state === "fetching"
      ? "Reading repository tree"
      : state === "analyzing"
        ? "Resolving prompt files and dependencies"
        : "Awaiting repository URL";

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      <div className="cc-glass rounded-3xl p-6 md:p-7">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Step 1</p>
            <h3 className="mt-1 text-2xl font-semibold">Scan GitHub Repository</h3>
            <p className="mt-2 text-sm text-[var(--text-muted)]">Paste a public repo URL. The scanner looks for `SKILL.md`, `.prompt`, and prompt folders.</p>
          </div>
          <div className="cc-pill flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--text-muted)]">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--ok)]" />
            Read-only ingest
          </div>
        </div>

        <form onSubmit={handleScan} className="space-y-4">
          <label className="block text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Repository URL</label>
          <div className="relative">
            <Github className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="url"
              className="cc-input h-12 pl-10 pr-4 text-sm"
              placeholder="https://github.com/owner/repository"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              disabled={loading}
              aria-label="GitHub repository URL"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="cc-btn-primary flex h-11 w-full items-center justify-center gap-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {state === "fetching" ? "Fetching tree" : "Analyzing files"}
              </>
            ) : (
              <>
                Start Scan
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="cc-card flex items-center gap-3 p-4">
            <Radar className="h-4 w-4 text-[var(--brand)]" />
            <div>
              <p className="text-xs text-[var(--text-muted)]">Scanner status</p>
              <p className="text-sm">{statusLabel}</p>
            </div>
          </div>
          <div className="cc-card flex items-center gap-3 p-4">
            <SearchCode className="h-4 w-4 text-[var(--brand)]" />
            <div>
              <p className="text-xs text-[var(--text-muted)]">Patterns</p>
              <p className="text-sm">`SKILL.md`, `.prompt`, `prompts/`</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-[rgba(255,127,159,0.45)] bg-[rgba(86,22,39,0.38)] px-4 py-3 text-sm text-[var(--danger)]">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
