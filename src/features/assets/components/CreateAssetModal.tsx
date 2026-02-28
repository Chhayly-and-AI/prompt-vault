"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { useStorageActions } from "@/lib/storage-helpers";
import { AssetType } from "@/schemas/models";
import { X } from "lucide-react";

export function CreateAssetModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const activeWorkspaceId = useStore((state) => state.activeWorkspaceId);
  const { addAsset } = useStorageActions();
  
  const [name, setName] = useState("");
  const [type, setType] = useState<AssetType>("prompt");
  const [content, setContent] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspaceId) return;

    const newAsset = {
      id: crypto.randomUUID(),
      name,
      type,
      content,
      workspaceId: activeWorkspaceId,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(), pinned: false,
    };

    addAsset(newAsset);
    onClose();
    setName("");
    setContent("");
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="cc-glass w-full max-w-lg rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">New Asset</h3>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-1.5">Name</label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="cc-input h-11 px-4 text-sm" 
              placeholder="e.g. Code Review Assistant"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-1.5">Type</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as AssetType)}
              className="cc-input h-11 px-4 text-sm appearance-none"
            >
              <option value="skill">Skill</option>
              <option value="prompt">Prompt</option>
              <option value="workflow">Workflow</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-1.5">Content</label>
            <textarea 
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="cc-input min-h-[160px] p-4 text-sm resize-none" 
              placeholder="Paste your system prompt or asset content here..."
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="cc-btn-secondary flex-1 py-2.5 text-sm font-medium">Cancel</button>
            <button type="submit" className="cc-btn-primary flex-1 py-2.5 text-sm font-medium">Create Asset</button>
          </div>
        </form>
      </div>
    </div>
  );
}
