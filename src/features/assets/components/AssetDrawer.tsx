"use client";

import { Asset } from "@/schemas/models";
import { X, Copy, Trash2, Edit3, CheckCircle2, Pin, PinOff } from "lucide-react";
import { useState } from "react";
import { useStorageActions } from "@/lib/storage-helpers";

interface AssetDrawerProps {
  asset: Asset | null;
  onClose: () => void;
}

export function AssetDrawer({ asset, onClose }: AssetDrawerProps) {
  const { deleteAsset, togglePin } = useStorageActions();
  const [copied, setCopied] = useState(false);

  if (!asset) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(asset.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this asset?")) {
      deleteAsset(asset.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-[150] w-full max-w-md border-l border-[var(--line)] bg-[rgba(7,11,17,0.85)] backdrop-blur-2xl shadow-2xl transition-transform duration-300">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] p-5">
          <div className="flex items-center gap-3">
             <div className="cc-pill px-2 py-1 text-[10px] uppercase tracking-wider text-[var(--brand)] font-bold">
               {asset.type}
             </div>
             <button 
               onClick={() => togglePin(asset.id)}
               className={`p-1.5 rounded-lg transition-colors ${asset.pinned ? 'bg-[var(--brand-soft)] text-[var(--brand)]' : 'text-[var(--text-muted)] hover:text-white'}`}
             >
               {asset.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
             </button>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-1">{asset.name}</h3>
            <p className="text-xs text-[var(--text-muted)]">Created {new Date(asset.createdAt).toLocaleString()}</p>
          </section>

          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Prompt Content</label>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-[10px] text-[var(--brand)] hover:underline"
              >
                {copied ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy Content"}
              </button>
            </div>
            <div className="cc-glass rounded-xl p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap border-[rgba(255,255,255,0.03)]">
              {asset.content}
            </div>
          </section>

          {asset.tags.length > 0 && (
            <section>
              <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] block mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {asset.tags.map(tag => (
                  <span key={tag} className="cc-pill px-2 py-1 text-[10px]">{tag}</span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[var(--line)] p-5 flex gap-3">
          <button className="cc-btn-secondary flex-1 flex items-center justify-center gap-2 py-2 text-xs">
            <Edit3 className="h-3.5 w-3.5" /> Edit Asset
          </button>
          <button 
            onClick={handleDelete}
            className="border border-[rgba(255,127,159,0.3)] bg-[rgba(255,127,159,0.05)] text-[var(--danger)] hover:bg-[rgba(255,127,159,0.1)] flex-1 flex items-center justify-center gap-2 py-2 text-xs rounded-lg transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
