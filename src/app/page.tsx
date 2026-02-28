"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import GitHubScanner from "@/components/GitHubScanner";
import ImportSelector from "@/components/ImportSelector";
import LibraryView from "@/components/LibraryView";
import { ScannedItem, PromptItem } from "@/types";
import { getAllPrompts, savePrompt, deletePrompt, updatePrompt } from "@/lib/storage";
import {
  LayoutGrid,
  Plus,
  Import,
  Search,
  FolderOpen,
  Star,
  Terminal,
  ShieldCheck,
  X,
  Menu,
  Sparkles,
  FileText,
  Zap,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [scannedItems, setScannedItems] = useState<ScannedItem[] | null>(null);
  const [view, setView] = useState<"library" | "import">("library");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPrompts();
  }, []);

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setShowCreateModal(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const loadPrompts = async () => {
    const data = await getAllPrompts();
    setPrompts(data.sort((a, b) => b.createdAt - a.createdAt));
  };

  const handleItemsScanned = (items: ScannedItem[]) => {
    setScannedItems(items);
  };

  const handleImport = async (selected: ScannedItem[]) => {
    for (const item of selected) {
      await savePrompt({
        id: crypto.randomUUID(),
        name: item.name,
        content: item.content,
        type: item.type,
        createdAt: Date.now(),
        sourceUrl: item.path,
      });
    }
    setScannedItems(null);
    setView("library");
    loadPrompts();
  };

  const handleCreatePrompt = async (name: string, content: string, type: "prompt" | "skill") => {
    await savePrompt({
      id: crypto.randomUUID(),
      name,
      content,
      type,
      createdAt: Date.now(),
    });
    setShowCreateModal(false);
    loadPrompts();
  };

  const handleEditPrompt = async (prompt: PromptItem) => {
    await updatePrompt(prompt);
    loadPrompts();
  };

  const filteredPrompts = prompts.filter((p) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (p.name ?? "").toLowerCase().includes(query) ||
      (p.content ?? "").toLowerCase().includes(query);
    const matchesCategory = activeCategory === "all" || p.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const skillCount = prompts.filter((p) => p.type === "skill").length;
  const promptCount = prompts.filter((p) => p.type === "prompt").length;

  const navItems = [
    { id: "library" as const, label: "Library", icon: LayoutGrid },
    { id: "import" as const, label: "Import", icon: Import },
  ];

  const categoryItems = [
    { id: "all", label: "All Prompts", icon: FolderOpen, count: prompts.length },
    { id: "skill", label: "Skills", icon: Star, count: skillCount },
    { id: "prompt", label: "Prompts", icon: Terminal, count: promptCount },
  ];

  return (
    <main className="flex h-screen overflow-hidden font-sans">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ─── Sidebar ─────────────────────────────── */}
      <aside
        className={`fixed lg:relative z-40 w-72 h-full flex flex-col bg-surface-950 border-r border-surface-800/50 transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
          }`}
      >
        {/* Brand */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent-500/20 shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className={`${!sidebarOpen ? "lg:hidden" : ""}`}>
            <h1 className="font-bold tracking-tight text-lg leading-tight text-surface-50">
              Prompt Vault
            </h1>
            <span className="text-[10px] uppercase tracking-widest text-accent-400 font-semibold">
              Engineering Tool
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-6 overflow-y-auto">
          <div>
            <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-widest px-3 mb-2">
              Navigation
            </p>
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = view === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setView(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                      ? "bg-accent-500/10 text-accent-400 border border-accent-500/20"
                      : "text-surface-400 hover:text-surface-100 hover:bg-surface-800/40 border border-transparent"
                      }`}
                  >
                    <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-accent-400" : "text-surface-500 group-hover:text-surface-300"}`} />
                    <span className={`${!sidebarOpen ? "lg:hidden" : ""}`}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-widest px-3 mb-2">
              Collections
            </p>
            <div className="space-y-1">
              {categoryItems.map((item) => {
                const isActive = activeCategory === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveCategory(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                      ? "text-accent-400"
                      : "text-surface-400 hover:text-surface-100 hover:bg-surface-800/40"
                      }`}
                  >
                    <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-accent-400" : "text-surface-500 group-hover:text-surface-300"}`} />
                    <span className={`flex-1 text-left ${!sidebarOpen ? "lg:hidden" : ""}`}>{item.label}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive
                        ? "bg-accent-500/15 text-accent-400"
                        : "bg-surface-800 text-surface-500"
                        } ${!sidebarOpen ? "lg:hidden" : ""}`}
                    >
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-surface-800/50">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-900/60 border border-surface-800/50 hover:bg-surface-800/60 hover:border-surface-700/50 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center text-white shrink-0">
              <Plus className="h-4 w-4" />
            </div>
            <div className={`flex-1 text-left min-w-0 ${!sidebarOpen ? "lg:hidden" : ""}`}>
              <p className="text-xs font-semibold text-surface-200 group-hover:text-white transition-colors">
                Create Prompt
              </p>
              <p className="text-[10px] text-surface-500">Add manually</p>
            </div>
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─────────────────────────── */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-surface-800/50 flex items-center justify-between px-4 md:px-8 glass z-10 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-surface-400 hover:text-surface-100 hover:bg-surface-800/50 rounded-lg transition-colors lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex-1 max-w-lg relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-900/60 border border-surface-800/50 rounded-xl py-2 pl-10 pr-20 text-sm text-surface-100 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500/30 transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-800/80 border border-surface-700/50 text-[10px] text-surface-400 font-mono">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {prompts.length > 0 && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-900/60 border border-surface-800/50">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
                  <span className="text-xs text-surface-400 font-medium">
                    {prompts.length} {prompts.length === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 gradient-accent hover:opacity-90 text-white rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-accent-500/20"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Entry</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto ambient-glow dot-grid">
          <div className="relative z-10 p-4 md:p-8">
            <AnimatePresence mode="wait">
              {view === "library" ? (
                <motion.div
                  key="library"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-8"
                >
                  {/* Library Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-surface-800/30">
                    <div>
                      <div className="flex items-center gap-2 text-accent-400 text-xs font-semibold uppercase tracking-widest mb-2">
                        <Sparkles className="h-3 w-3" />
                        Your Collection
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-50">
                        Prompt Library
                      </h2>
                      <p className="text-surface-400 mt-1 max-w-lg text-sm">
                        Manage and organize your LLM prompts and agentic skill definitions.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {skillCount > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold">
                          <Zap className="h-3 w-3" />
                          {skillCount} {skillCount === 1 ? "Skill" : "Skills"}
                        </div>
                      )}
                      {promptCount > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-full text-sky-400 text-xs font-semibold">
                          <FileText className="h-3 w-3" />
                          {promptCount} {promptCount === 1 ? "Prompt" : "Prompts"}
                        </div>
                      )}
                    </div>
                  </div>

                  <LibraryView prompts={filteredPrompts} onRefresh={loadPrompts} onEdit={handleEditPrompt} />
                </motion.div>
              ) : (
                <motion.div
                  key="import"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-8 flex flex-col items-center"
                >
                  {/* Import Header */}
                  <div className="text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-500/10 border border-accent-500/20 rounded-full text-accent-400 text-[10px] font-semibold uppercase tracking-widest mb-4">
                      <Sparkles className="h-3 w-3" />
                      Repository Sync
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-50 mb-3">
                      Import from GitHub
                    </h2>
                    <p className="text-surface-400 text-base">
                      Connect to a public repository to discover and import prompt files and skill definitions.
                    </p>
                  </div>

                  <div className="w-full max-w-4xl">
                    {!scannedItems ? (
                      <GitHubScanner onItemsScanned={handleItemsScanned} />
                    ) : (
                      <ImportSelector
                        items={scannedItems}
                        onImport={handleImport}
                        onCancel={() => setScannedItems(null)}
                      />
                    )}
                  </div>

                  {/* Feature cards */}
                  <div className="glass rounded-2xl p-6 md:p-8 max-w-2xl mx-auto w-full gradient-border">
                    <h3 className="font-bold text-surface-100 flex items-center gap-2 mb-5 text-lg">
                      <Sparkles className="h-5 w-5 text-accent-400" />
                      Extraction Engine
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {[
                        {
                          title: "SKILL.md Detection",
                          desc: "Detects Claude/OpenClaw compliant skill definitions with dependency mapping.",
                        },
                        {
                          title: "File Ingestion",
                          desc: "Automatic detection of .prompt and .ai manifest files in repository trees.",
                        },
                        {
                          title: "Dependency Graph",
                          desc: "Identifies linked assets and bundles referenced files together.",
                        },
                        {
                          title: "Local Storage",
                          desc: "All data is stored locally via IndexedDB. No server-side storage.",
                        },
                      ].map((feat) => (
                        <div key={feat.title} className="space-y-1.5">
                          <p className="text-sm font-semibold text-surface-200">{feat.title}</p>
                          <p className="text-xs text-surface-500 leading-relaxed">{feat.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ─── Create Prompt Modal ──────────────────── */}
      <AnimatePresence>
        {showCreateModal && (
          <CreatePromptModal
            onSubmit={handleCreatePrompt}
            onClose={() => setShowCreateModal(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

/* ─── Create Prompt Modal Component ───────────── */

function CreatePromptModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (name: string, content: string, type: "prompt" | "skill") => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"prompt" | "skill">("prompt");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    onSubmit(name.trim(), content.trim(), type);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-xl glass rounded-2xl border border-surface-700/50 shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center text-white">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-surface-50">Create Prompt</h3>
              <p className="text-xs text-surface-500">Add a new prompt to your vault</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-surface-400 hover:text-surface-100 hover:bg-surface-800/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Code Review Assistant"
              autoFocus
              className="w-full px-4 py-3 bg-surface-900/60 border border-surface-800/50 rounded-xl text-sm text-surface-100 placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500/30 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
              Type
            </label>
            <div className="flex gap-3">
              {(["prompt", "skill"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${type === t
                    ? t === "prompt"
                      ? "bg-sky-500/10 border-sky-500/30 text-sky-400"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    : "bg-surface-900/40 border-surface-800/50 text-surface-400 hover:text-surface-200 hover:bg-surface-800/40"
                    }`}
                >
                  {t === "prompt" ? <FileText className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                  {t === "prompt" ? "Prompt" : "Skill"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your prompt content..."
              rows={8}
              className="w-full px-4 py-3 bg-surface-900/60 border border-surface-800/50 rounded-xl text-sm text-surface-100 placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500/30 transition-all resize-none font-mono leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-surface-400 hover:text-surface-200 hover:bg-surface-800/40 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !content.trim() || submitting}
              className="flex items-center gap-2 px-6 py-2.5 gradient-accent hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-accent-500/20"
            >
              {submitting ? (
                "Saving..."
              ) : (
                <>
                  Create
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
