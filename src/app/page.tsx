"use client";

import { useEffect, useMemo, useState } from "react";
import GitHubScanner from "@/components/GitHubScanner";
import ImportSelector from "@/components/ImportSelector";
import LibraryView from "@/components/LibraryView";
import { getAllPrompts, savePrompt } from "@/lib/storage";
import { PromptItem, ScannedItem } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  CheckCircle2,
  Compass,
  Database,
  FolderGit2,
  Github,
  Layers3,
  Search,
  Sparkles,
  TerminalSquare,
  Workflow,
} from "lucide-react";

type View = "library" | "import";
type WizardStep = "scan" | "select" | "success";

const categoryOptions = [
  { id: "all", label: "All Assets", icon: Layers3 },
  { id: "skill", label: "Skills", icon: Workflow },
  { id: "prompt", label: "Prompts", icon: TerminalSquare },
] as const;

export default function Home() {
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [scannedItems, setScannedItems] = useState<ScannedItem[] | null>(null);
  const [view, setView] = useState<View>("library");
  const [wizardStep, setWizardStep] = useState<WizardStep>("scan");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastImportCount, setLastImportCount] = useState(0);

  const loadPrompts = async () => {
    const data = await getAllPrompts();
    setPrompts(data.sort((a, b) => b.createdAt - a.createdAt));
  };

  useEffect(() => {
    void loadPrompts();
  }, []);

  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const matchesSearch =
        searchQuery.trim().length === 0 ||
        prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "all" || prompt.type === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [prompts, searchQuery, activeCategory]);

  const skillCount = prompts.filter((item) => item.type === "skill").length;
  const promptCount = prompts.filter((item) => item.type === "prompt").length;

  const handleItemsScanned = (items: ScannedItem[]) => {
    setScannedItems(items);
    setWizardStep("select");
  };

  const handleImport = async (selectedItems: ScannedItem[]) => {
    for (const item of selectedItems) {
      await savePrompt({
        id: crypto.randomUUID(),
        name: item.name,
        content: item.content,
        type: item.type,
        sourceUrl: item.path,
        createdAt: Date.now(),
      });
    }

    setLastImportCount(selectedItems.length);
    setWizardStep("success");
    await loadPrompts();
  };

  const resetImportFlow = () => {
    setScannedItems(null);
    setWizardStep("scan");
  };

  const jumpToImport = () => {
    setView("import");
    resetImportFlow();
  };

  return (
    <main className="cc-shell cc-grid-bg text-[var(--text)]">
      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-[274px] shrink-0 border-r border-[var(--line)] bg-[rgba(7,11,17,0.78)] p-5 backdrop-blur-xl md:flex md:flex-col">
          <div className="cc-glass rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Command Center</p>
                <h1 className="text-lg font-semibold">Prompt Vault</h1>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <button
              onClick={() => setView("library")}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                view === "library"
                  ? "border-[var(--line-strong)] bg-[rgba(25,39,60,0.55)]"
                  : "border-[var(--line)] bg-[rgba(9,14,22,0.45)] hover:border-[var(--line-strong)]"
              }`}
            >
              <span className="flex items-center gap-2 font-medium">
                <Archive className="h-4 w-4" /> Library
              </span>
            </button>
            <button
              onClick={jumpToImport}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                view === "import"
                  ? "border-[var(--line-strong)] bg-[rgba(25,39,60,0.55)]"
                  : "border-[var(--line)] bg-[rgba(9,14,22,0.45)] hover:border-[var(--line-strong)]"
              }`}
            >
              <span className="flex items-center gap-2 font-medium">
                <FolderGit2 className="h-4 w-4" /> GitHub Import
              </span>
            </button>
          </div>

          <div className="mt-7">
            <p className="mb-2 px-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Filter</p>
            <div className="space-y-2">
              {categoryOptions.map((category) => {
                const Icon = category.icon;
                const active = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-sm transition ${
                      active
                        ? "border-[var(--line-strong)] bg-[rgba(24,35,53,0.62)]"
                        : "border-[var(--line)] bg-[rgba(8,13,20,0.46)] hover:border-[var(--line-strong)]"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-[var(--brand)]" />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-auto grid gap-3">
            <div className="cc-glass rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Assets</p>
              <p className="mt-1 text-2xl font-semibold">{prompts.length}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{skillCount} skills, {promptCount} prompts</p>
            </div>
            <div className="cc-glass rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Storage</p>
              <p className="mt-2 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <Database className="h-4 w-4 text-[var(--ok)]" /> IndexedDB local-first
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[rgba(7,11,17,0.72)] px-4 py-3 backdrop-blur-xl md:px-7">
            <div className="flex items-center gap-3">
              <div className="relative w-full max-w-2xl">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="cc-input h-10 pl-10 pr-3 text-sm"
                  placeholder="Search prompts and skills"
                />
              </div>
              <button onClick={jumpToImport} className="cc-btn-primary px-4 py-2 text-sm font-medium">
                Import
              </button>
            </div>
            <div className="mt-3 flex gap-2 md:hidden">
              <button
                onClick={() => setView("library")}
                className={`cc-pill px-3 py-1.5 text-xs ${view === "library" ? "text-white" : "text-[var(--text-muted)]"}`}
              >
                Library
              </button>
              <button
                onClick={jumpToImport}
                className={`cc-pill px-3 py-1.5 text-xs ${view === "import" ? "text-white" : "text-[var(--text-muted)]"}`}
              >
                Import Wizard
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-5 md:px-7 md:py-7">
            <AnimatePresence mode="wait">
              {view === "library" ? (
                <motion.section
                  key="library"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="cc-glass rounded-3xl p-5 md:p-6">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Prompt Operations</p>
                        <h2 className="mt-1 text-2xl font-semibold md:text-3xl">Engineering Library</h2>
                        <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
                          Local-first storage, dependency-aware imports, and fast preview workflows for team prompt systems.
                        </p>
                      </div>
                      <div className="cc-pill px-3 py-1.5 text-xs text-[var(--text-muted)]">
                        {filteredPrompts.length} visible / {prompts.length} total
                      </div>
                    </div>
                  </div>

                  <LibraryView prompts={filteredPrompts} onRefresh={loadPrompts} />
                </motion.section>
              ) : (
                <motion.section
                  key="import"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="cc-glass rounded-3xl p-5 md:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">GitHub Import Wizard</p>
                        <h2 className="mt-1 text-2xl font-semibold md:text-3xl">Repository Intake</h2>
                      </div>
                      <ol className="flex items-center gap-2 text-xs md:text-sm">
                        {[
                          { key: "scan", label: "Scan" },
                          { key: "select", label: "Select" },
                          { key: "success", label: "Success" },
                        ].map((entry, index) => {
                          const isActive = wizardStep === entry.key;
                          const done =
                            (entry.key === "scan" && wizardStep !== "scan") ||
                            (entry.key === "select" && wizardStep === "success");

                          return (
                            <li key={entry.key} className="flex items-center gap-2">
                              <span
                                className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] ${
                                  done
                                    ? "border-[rgba(83,193,149,0.6)] bg-[rgba(32,107,77,0.35)] text-[var(--ok)]"
                                    : isActive
                                      ? "border-[var(--line-strong)] bg-[rgba(38,61,97,0.58)] text-white"
                                      : "border-[var(--line)] text-[var(--text-muted)]"
                                }`}
                              >
                                {done ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                              </span>
                              <span className={isActive ? "text-white" : "text-[var(--text-muted)]"}>{entry.label}</span>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  </div>

                  {wizardStep === "scan" && <GitHubScanner onItemsScanned={handleItemsScanned} />}
                  {wizardStep === "select" && scannedItems && (
                    <ImportSelector items={scannedItems} onImport={handleImport} onCancel={resetImportFlow} />
                  )}
                  {wizardStep === "success" && (
                    <div className="cc-glass mx-auto max-w-3xl rounded-3xl p-8 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(83,193,149,0.45)] bg-[rgba(31,103,75,0.34)] text-[var(--ok)]">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Import Complete</p>
                      <h3 className="mt-2 text-2xl font-semibold">{lastImportCount} assets added to your vault</h3>
                      <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--text-muted)]">
                        Prompt content and metadata were stored in IndexedDB. You can return to library view or start another scan.
                      </p>
                      <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <button
                          onClick={() => setView("library")}
                          className="cc-btn-primary px-5 py-2.5 text-sm font-medium"
                        >
                          Open Library
                        </button>
                        <button
                          onClick={resetImportFlow}
                          className="cc-btn-secondary px-5 py-2.5 text-sm font-medium"
                        >
                          Scan Another Repo
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="cc-card p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Scanning</p>
                      <p className="mt-2 text-sm text-[var(--text-muted)]">Recursive Git tree fetch with SKILL.md and prompt discovery.</p>
                    </div>
                    <div className="cc-card p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Dependencies</p>
                      <p className="mt-2 text-sm text-[var(--text-muted)]">Inline dependency extraction is retained for import context mapping.</p>
                    </div>
                    <div className="cc-card p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Persistence</p>
                      <p className="mt-2 text-sm text-[var(--text-muted)]">All records are stored locally with IndexedDB via `idb-keyval`.</p>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-4 right-4 z-40 hidden items-center gap-2 rounded-full border border-[var(--line)] bg-[rgba(10,17,27,0.72)] px-4 py-2 text-xs text-[var(--text-muted)] backdrop-blur-xl md:flex">
        <Sparkles className="h-3.5 w-3.5 text-[var(--brand)]" />
        IndexedDB active
        <Github className="ml-1 h-3.5 w-3.5" />
      </div>
    </main>
  );
}
