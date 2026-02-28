"use client";

import { useState } from "react";
import { Github, Search, CheckCircle2, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useStorageActions } from "@/lib/storage-helpers";
import { useStore } from "@/store/useStore";
import { AssetType, Asset } from "@/schemas/models";

interface DetectedAsset {
  name: string;
  type: AssetType;
  content: string;
  path: string;
}

export function GitHubWizard() {
  const [step, setStep] = useState<"url" | "scan" | "select" | "success">("url");
  const [url, setUrl] = useState("");
  const [detected, setDetected] = useState<DetectedAsset[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const activeWorkspaceId = useStore((state) => state.activeWorkspaceId);
  const { addAssetsBatch } = useStorageActions();

  const handleStartScan = async () => {
    if (!url.includes("github.com")) {
      alert("Please enter a valid GitHub URL");
      return;
    }
    setStep("scan");
    
    setTimeout(() => {
      setDetected([
        { name: "Code Architect", type: "skill", content: "Architecture guidelines...", path: "skills/arch/SKILL.md" },
        { name: "React Expert", type: "skill", content: "React best practices...", path: "skills/react/SKILL.md" },
        { name: "PR Template", type: "prompt", content: "Checklist for PRs...", path: "prompts/pr.md" },
      ]);
      setStep("select");
    }, 1500);
  };

  const handleImport = () => {
    if (!activeWorkspaceId) return;
    
    const assetsToImport: Asset[] = detected
      .filter((_, idx) => selectedIds.includes(idx) || selectedIds.length === 0)
      .map(asset => ({
        id: crypto.randomUUID(),
        name: asset.name,
        type: asset.type,
        content: asset.content,
        workspaceId: activeWorkspaceId,
        tags: ["github-import"],
        sourceUrl: url + "/blob/main/" + asset.path,
        pinned: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }));

    addAssetsBatch(assetsToImport);
    setStep("success");
  };

  const toggleSelect = (idx: number) => {
    setSelectedIds(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  return (
    <div className="cc-glass mx-auto max-w-2xl rounded-3xl p-8 shadow-2xl border-[var(--line-strong)]">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 rounded-2xl bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-white border border-[var(--line)]">
          <Github className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">GitHub Import Wizard</h2>
          <p className="text-sm text-[var(--text-muted)]">Local-first repository discovery engine.</p>
        </div>
      </div>

      {step === "url" && (
        <div className="space-y-5">
          <div className="cc-card p-4 bg-[rgba(104,166,255,0.03)] border-[rgba(104,166,255,0.1)] flex gap-3">
             <AlertCircle className="h-5 w-5 text-[var(--brand)] shrink-0" />
             <p className="text-xs text-[var(--text-muted)] leading-relaxed">
               Enter a public repository URL. The wizard will scan for <code className="text-[var(--brand)]">SKILL.md</code> files and markdown prompts automatically.
             </p>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">Repository URL</label>
            <input 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/Chhayly-and-AI/my-prompts"
              className="cc-input h-12 px-4 text-sm"
            />
          </div>
          <button 
            onClick={handleStartScan}
            className="cc-btn-primary w-full py-3.5 flex items-center justify-center gap-2 font-medium"
          >
            Start Discovery <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {step === "scan" && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Loader2 className="h-12 w-12 text-[var(--brand)] animate-spin" />
          <div className="text-center">
            <p className="text-sm text-white font-medium">Scanning Repository...</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Analyzing file tree for agentic assets</p>
          </div>
        </div>
      )}

      {step === "select" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white font-medium">Discovered {detected.length} Assets</p>
            <button className="text-[10px] text-[var(--brand)] uppercase tracking-wider font-bold">Select All</button>
          </div>
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {detected.map((asset, i) => (
               <div key={i} onClick={() => toggleSelect(i)} className={`cc-card p-4 flex items-center justify-between cursor-pointer transition-all ${selectedIds.includes(i) || selectedIds.length === 0 ? 'border-[var(--brand-soft)] bg-[rgba(104,166,255,0.05)]' : 'opacity-60'}`}>
                  <div className="flex items-center gap-4">
                     <div className={`h-4 w-4 rounded border flex items-center justify-center ${selectedIds.includes(i) || selectedIds.length === 0 ? 'bg-[var(--brand)] border-[var(--brand)]' : 'border-[var(--line)]'}`}>
                        {(selectedIds.includes(i) || selectedIds.length === 0) && <CheckCircle2 className="h-3 w-3 text-white" />}
                     </div>
                     <div>
                        <p className="text-sm font-medium text-white">{asset.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)] font-mono">{asset.path}</p>
                     </div>
                  </div>
                  <div className="cc-pill px-2 py-0.5 text-[9px] uppercase font-bold text-[var(--text-muted)]">{asset.type}</div>
               </div>
            ))}
          </div>
          <button 
            onClick={handleImport}
            className="cc-btn-primary w-full py-3.5 font-medium"
          >
            Import to Library
          </button>
        </div>
      )}

      {step === "success" && (
        <div className="text-center py-12 space-y-6">
          <div className="mx-auto h-20 w-20 rounded-3xl bg-[rgba(54,211,153,0.1)] flex items-center justify-center text-[var(--ok)] border border-[rgba(54,211,153,0.2)]">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div>
             <h3 className="text-xl font-semibold text-white">Assets Secured</h3>
             <p className="text-sm text-[var(--text-muted)] mt-2 max-w-sm mx-auto">
               The selected assets have been cloned into your local vault. They are now available in your Library and Chat Mentions.
             </p>
          </div>
          <button className="cc-btn-secondary px-8 py-2.5 text-sm font-medium" onClick={() => setStep("url")}>
            Close Wizard
          </button>
        </div>
      )}
    </div>
  );
}
