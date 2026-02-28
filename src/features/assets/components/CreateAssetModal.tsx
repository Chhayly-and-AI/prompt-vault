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
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [type, setType] = useState<AssetType>(defaultType);
  const activeWorkspaceId = useStore((state) => state.activeWorkspaceId);
  const { addAsset } = useStorageActions();

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleCreate = () => {
    if (!name.trim() || !activeWorkspaceId) return;

    const newAsset = {
      id: crypto.randomUUID(),
      name: name.trim(),
      type,
      content: content.trim(),
      description: description.trim() || undefined,
      workspaceId: activeWorkspaceId,
      tags,
      pinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    addAsset(newAsset);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setName("");
    setContent("");
    setDescription("");
    setTagInput("");
    setTags([]);
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
          <button onClick={handleClose} className="text-[var(--text-muted)] hover:text-white" aria-label="Close modal">
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
            <label htmlFor="asset-description" className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">Description (optional)</label>
            <input
              id="asset-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this asset..."
              className="cc-input h-12 px-4 text-sm"
            />
          </div>

          <div>
            <label htmlFor="asset-tags" className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">Tags</label>
            <div className="flex gap-2">
              <input
                id="asset-tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type and press Enter..."
                className="cc-input h-10 flex-1 px-4 text-sm"
              />
              <button 
                onClick={handleAddTag}
                className="cc-btn-secondary px-4"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <span 
                    key={tag} 
                    className="cc-pill px-2 py-1 text-xs flex items-center gap-1"
                  >
                    {tag}
                    <button 
                      onClick={() => handleRemoveTag(tag)}
                      className="text-[var(--text-muted)] hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
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
          <button onClick={handleClose} className="cc-btn-secondary px-6 py-2.5 text-sm font-medium">
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
