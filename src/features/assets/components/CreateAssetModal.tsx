"use client";

import { useState } from "react";
import { useStorageActions } from "@/lib/storage-helpers";
import { useStore } from "@/store/useStore";
import { X, Plus, Workflow, TerminalSquare, Box } from "lucide-react";
import type { AssetType } from "@/schemas/models";

interface CreateAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: AssetType;
}

export function CreateAssetModal({ isOpen, onClose, defaultType = "prompt" }: CreateAssetModalProps) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<AssetType>(defaultType);
  const activeWorkspaceId = useStore((state) => state.activeWorkspaceId);
  const { addAsset } = useStorageActions();

  const handleCreate = () => {
    if (!name.trim() || !activeWorkspaceId) return;

    const newAsset = {
      id: crypto.randomUUID(),
      name: name.trim(),
      type,
      content: content.trim(),
      workspaceId: activeWorkspaceId,
      tags: [],
      pinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    addAsset(newAsset);
    onClose();
    setName("");
    setContent("");
  };

  if (!isOpen) return null;

  const typeOptions: { value: AssetType; label: string; icon: React.ReactNode }[] = [
    { value: "skill", label: "Skill", icon: <Workflow className="h-4 w-4" /> },
    { value: "prompt", label: "Prompt", icon: <TerminalSquare className="h-4 w-4" /> },
    { value: "workflow", label: "Workflow", icon: <Box className="h-4 w-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="cc-glass w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border-[var(--line-strong)]">
        <div className="flex items-center justify-between p-6 border-b border-[var(--line)]">
          <h2 id="modal-title" className="text-xl font-semibold text-white">Create New Asset</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">Type</label>
            <div className="flex gap-2">
              {typeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setType(opt.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all ${
                    type === opt.value
                      ? "bg-[var(--brand-soft)] text-[var(--brand)] border border-[var(--brand)]"
                      : "bg-[rgba(255,255,255,0.03)] text-[var(--text-muted)] border border-[var(--line)]"
                  }`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="asset-name" className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">Name</label>
            <input
              id="asset-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Code Architect"
              className="cc-input h-12 px-4 text-sm"
            />
          </div>

          <div>
            <label htmlFor="asset-content" className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">Content</label>
            <textarea
              id="asset-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your prompt or skill definition..."
              className="cc-input min-h-[150px] p-4 text-sm resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-[var(--line)] flex justify-end gap-3">
          <button onClick={onClose} className="cc-btn-secondary px-6 py-2.5 text-sm font-medium">
            Cancel
          </button>
          <button onClick={handleCreate} className="cc-btn-primary px-6 py-2.5 flex items-center gap-2 text-sm font-medium">
            <Plus className="h-4 w-4" /> Create Asset
          </button>
        </div>
      </div>
    </div>
  );
}
