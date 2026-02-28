"use client";

import { useState } from "react";
import { PromptItem } from "@/types";
import {
  Copy,
  Trash2,
  Folder,
  FileText,
  Zap,
  ExternalLink,
  Check,
  Clock,
  Code,
  X,
  Maximize2,
  Edit3,
  Save,
} from "lucide-react";
import { deletePrompt } from "@/lib/storage";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

interface LibraryViewProps {
  prompts: PromptItem[];
  onRefresh: () => void;
  onEdit?: (prompt: PromptItem) => void;
}

export default function LibraryView({ prompts, onRefresh, onEdit }: LibraryViewProps) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState("");

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Delete this prompt from your vault?")) {
      await deletePrompt(id);
      if (selectedPrompt?.id === id) setSelectedPrompt(null);
      onRefresh();
    }
  };

  const startEditName = (e: React.MouseEvent, prompt: PromptItem) => {
    e.stopPropagation();
    setEditingName(prompt.id);
    setEditNameValue(prompt.name);
  };

  const saveEditName = (e: React.MouseEvent, prompt: PromptItem) => {
    e.stopPropagation();
    if (editNameValue.trim() && onEdit) {
      onEdit({ ...prompt, name: editNameValue.trim() });
    }
    setEditingName(null);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {prompts.map((prompt, index) => (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3, ease: "easeOut" }}
            onClick={() => setSelectedPrompt(prompt)}
            className="group glass-card p-5 rounded-2xl cursor-pointer relative overflow-hidden"
          >
            {/* Accent bar */}
            <div
              className={cn(
                "absolute top-0 left-0 right-0 h-0.5 transition-all duration-300",
                prompt.type === "skill"
                  ? "bg-gradient-to-r from-amber-500 to-amber-400"
                  : "bg-gradient-to-r from-accent-500 to-sky-400"
              )}
            />

            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={cn(
                    "p-2.5 rounded-xl shrink-0",
                    prompt.type === "skill"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-accent-500/10 text-accent-400"
                  )}
                >
                  {prompt.type === "skill" ? (
                    <Zap className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  {editingName === prompt.id ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        value={editNameValue}
                        onChange={(e) => setEditNameValue(e.target.value)}
                        className="flex-1 bg-surface-900 border border-surface-700 rounded-lg px-2 py-1 text-sm font-semibold text-surface-100 focus:outline-none focus:ring-1 focus:ring-accent-500/50"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEditName(e as any, prompt);
                          if (e.key === "Escape") setEditingName(null);
                        }}
                      />
                      <button
                        onClick={(e) => saveEditName(e, prompt)}
                        className="p-1 text-accent-400 hover:text-accent-300"
                      >
                        <Save className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <h3 className="font-semibold text-surface-100 text-sm truncate leading-tight">
                      {prompt.name}
                    </h3>
                  )}
                  <div className="flex items-center gap-1.5 text-[10px] text-surface-500 mt-0.5">
                    <Clock className="h-3 w-3" />
                    {new Date(prompt.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                <button
                  onClick={(e) => startEditName(e, prompt)}
                  className="p-1.5 bg-surface-800/80 hover:bg-surface-700 rounded-lg text-surface-400 hover:text-surface-100 transition-colors"
                  title="Edit Name"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(prompt.content, prompt.id);
                  }}
                  className="p-1.5 bg-surface-800/80 hover:bg-surface-700 rounded-lg text-surface-400 hover:text-surface-100 transition-colors"
                  title="Copy Content"
                >
                  {copyStatus === prompt.id ? (
                    <Check className="h-3.5 w-3.5 text-accent-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={(e) => handleDelete(e, prompt.id)}
                  className="p-1.5 bg-surface-800/80 hover:bg-rose-500/20 rounded-lg text-surface-400 hover:text-rose-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Content Preview */}
            <div className="relative group/code">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-950/90 z-[1] rounded-xl pointer-events-none" />
              <p className="text-xs text-surface-400 font-mono line-clamp-5 bg-surface-950/60 p-3.5 rounded-xl border border-surface-800/40 leading-relaxed">
                {prompt.content}
              </p>
              <div className="absolute bottom-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity z-[2]">
                <Maximize2 className="h-3.5 w-3.5 text-surface-500" />
              </div>
            </div>

            {/* Footer Tags */}
            <div className="mt-3 flex items-center gap-2">
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider",
                  prompt.type === "skill"
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-sky-500/10 text-sky-400"
                )}
              >
                {prompt.type}
              </span>
              {prompt.sourceUrl && (
                <span className="px-2 py-0.5 bg-surface-800/60 rounded-md text-[10px] text-surface-500 font-medium flex items-center gap-1">
                  <ExternalLink className="h-2.5 w-2.5" />
                  GitHub
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {prompts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center py-24 border-2 border-dashed border-surface-800/50 rounded-2xl"
        >
          <div className="w-16 h-16 bg-surface-900/80 border border-surface-800/50 rounded-2xl flex items-center justify-center text-surface-600 mx-auto mb-5 shadow-inner">
            <Folder className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-surface-300">No prompts yet</h3>
          <p className="text-surface-500 mt-1 text-sm max-w-xs mx-auto">
            Create a new prompt or import from a GitHub repository to get started.
          </p>
        </motion.div>
      )}

      {/* ─── Detail Modal ───────────────────────── */}
      <AnimatePresence>
        {selectedPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/75 backdrop-blur-sm"
            onClick={() => setSelectedPrompt(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-full max-w-5xl max-h-[90vh] glass rounded-2xl border border-surface-700/50 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-surface-800/50 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "p-2.5 rounded-xl shrink-0",
                      selectedPrompt.type === "skill"
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-accent-500/15 text-accent-400"
                    )}
                  >
                    {selectedPrompt.type === "skill" ? (
                      <Zap className="h-5 w-5" />
                    ) : (
                      <FileText className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-surface-50 truncate">
                      {selectedPrompt.name}
                    </h2>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] text-surface-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(selectedPrompt.createdAt).toLocaleString()}
                      </span>
                      {selectedPrompt.sourceUrl && (
                        <a
                          href={selectedPrompt.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-accent-400 hover:text-accent-300 flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Source
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopy(selectedPrompt.content, selectedPrompt.id)}
                    className="flex items-center gap-2 px-4 py-2 gradient-accent hover:opacity-90 text-white rounded-xl text-sm font-semibold transition-all active:scale-95"
                  >
                    {copyStatus === selectedPrompt.id ? (
                      <>
                        <Check className="h-4 w-4" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedPrompt(null)}
                    className="p-2 text-surface-400 hover:text-surface-100 hover:bg-surface-800/50 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-surface-400 uppercase tracking-widest">
                      <Code className="h-3.5 w-3.5 text-accent-400" />
                      Content
                    </div>
                    <div className="rounded-xl overflow-hidden border border-surface-800/50 bg-surface-950/60">
                      <SyntaxHighlighter
                        language={selectedPrompt.type === "skill" ? "markdown" : "text"}
                        style={atomDark}
                        customStyle={{
                          background: "transparent",
                          padding: "1.25rem",
                          fontSize: "0.8125rem",
                          lineHeight: "1.7",
                          margin: 0,
                        }}
                      >
                        {selectedPrompt.content}
                      </SyntaxHighlighter>
                    </div>
                  </div>

                  {selectedPrompt.type === "skill" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="glass p-5 rounded-xl border border-surface-800/40">
                        <h4 className="font-semibold text-surface-200 mb-2 flex items-center gap-2 text-sm">
                          <Zap className="h-4 w-4 text-amber-400" />
                          Skill Manifest
                        </h4>
                        <p className="text-xs text-surface-500 leading-relaxed">
                          This asset is an agentic skill definition following the standard for
                          tool/skill specification, including system prompt segments and dependency links.
                        </p>
                      </div>
                      <div className="glass p-5 rounded-xl border border-surface-800/40">
                        <h4 className="font-semibold text-surface-200 mb-2 flex items-center gap-2 text-sm">
                          <ExternalLink className="h-4 w-4 text-accent-400" />
                          Source
                        </h4>
                        <p className="text-xs text-surface-500 leading-relaxed">
                          Origin: {selectedPrompt.sourceUrl || "Local manual entry"}.
                          Stored locally in your IndexedDB vault.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-3 border-t border-surface-800/30 flex justify-center shrink-0">
                <p className="text-[10px] text-surface-600 font-medium tracking-widest uppercase">
                  Prompt Vault
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
