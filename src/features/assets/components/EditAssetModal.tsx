"use client";

import { useState, useEffect } from "react";
import { useStorageActions } from "@/lib/storage-helpers";
import { X, Save, Workflow, TerminalSquare, Box } from "lucide-react";
import type { Asset, AssetType } from "@/schemas/models";

interface EditAssetModalProps {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
}

export function EditAssetModal({ asset, isOpen, onClose }: EditAssetModalProps) {
  const [name, setName] = useState(asset.name);
  const [content, setContent] = useState(asset.content);
  const [description, setDescription] = useState(asset.description || "");
  const [tags, setTags] = useState(asset.tags.join(", "));
  const [type, setType] = useState<AssetType>(asset.type);
  const { updateAsset } = useStorageActions();

  useEffect(() => {
    if (isOpen) {
      setName(asset.name);
      setContent(asset.content);
      setDescription(asset.description || "");
      setTags(asset.tags.join(", "));
      setType(asset.type);
    }
  }, [isOpen, asset]);

  const handleSave = () => {
    if (!name.trim()) return;

    updateAsset(asset.id, {
      name: name.trim(),
      content: content.trim(),
      description: description.trim() || undefined,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      type,
    });
    
    onClose();
  };

  if (!isOpen) return null;

  const typeOptions: { value: AssetType; label: string; icon: React.ReactNode }[] = [
    { value: "skill", label: "Skill", icon: <Workflow className="h-4 w-4" /> },
    { value: "prompt", label: "Prompt", icon: <TerminalSquare className="h-4 w-4" /> },
    { value: "workflow", label: "Workflow", icon: <Box className="h-4 w-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
      <div className="cc-glass w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl border-[var(--line-strong)]">
        <div className="flex items-center justify-between p-6 border-b border-[var(--line)]">
          <h2 id="edit-modal-title" className="text-xl font-semibold text-white">Edit Asset</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
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
            <label htmlFor="edit-name" className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">Name</label>
            <input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Code Architect"
              className="cc-input h-12 px-4 text-sm"
            />
          </div>

          <div>
            <label htmlFor="edit-description" className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">Description (optional)</label>
            <input
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this asset..."
              className="cc-input h-12 px-4 text-sm"
            />
          </div>

          <div>
            <label htmlFor="edit-tags" className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">Tags (comma-separated)</label>
            <input
              id="edit-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="coding, architecture, react"
              className="cc-input h-12 px-4 text-sm"
            />
          </div>

          <div>
            <label htmlFor="edit-content" className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">Content</label>
            <textarea
              id="edit-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your prompt or skill definition..."
              className="cc-input min-h-[200px] p-4 text-sm resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-[var(--line)] flex justify-end gap-3">
          <button onClick={onClose} className="cc-btn-secondary px-6 py-2.5 text-sm font-medium">
            Cancel
          </button>
          <button onClick={handleSave} className="cc-btn-primary px-6 py-2.5 flex items-center gap-2 text-sm font-medium">
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
