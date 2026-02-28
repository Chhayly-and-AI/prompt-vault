"use client";

import { useState } from "react";
import { Github, Search, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";

export function GitHubWizard() {
  const [step, setStep] = useState<"url" | "scan" | "select" | "success">("url");
  const [url, setUrl] = useState("");

  const handleStartScan = () => {
    setStep("scan");
    setTimeout(() => setStep("select"), 2000);
  };

  return (
    <div className="cc-glass mx-auto max-w-2xl rounded-3xl p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 rounded-2xl bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-white">
          <Github className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">GitHub Import Wizard</h2>
          <p className="text-sm text-[var(--text-muted)]">Import assets directly from your repositories.</p>
        </div>
      </div>

      {step === "url" && (
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">Repository URL</label>
            <input 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              className="cc-input h-12 px-4 text-sm"
            />
          </div>
          <button 
            onClick={handleStartScan}
            className="cc-btn-primary w-full py-3 flex items-center justify-center gap-2 font-medium"
          >
            Start Discovery <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {step === "scan" && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-10 w-10 text-[var(--brand)] animate-spin" />
          <p className="text-sm text-[var(--text-muted)] animate-pulse">Scanning repository for prompts and skills...</p>
        </div>
      )}

      {step === "select" && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-muted)]">Select assets to import to your workspace:</p>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {[1, 2, 3].map(i => (
               <div key={i} className="cc-card p-4 flex items-center justify-between border-transparent bg-[rgba(255,255,255,0.02)]">
                  <div className="flex items-center gap-3">
                     <input type="checkbox" defaultChecked className="rounded border-[var(--line)] bg-transparent text-[var(--brand)]" />
                     <div>
                        <p className="text-sm font-medium">Mock Asset ${i}.md</p>
                        <p className="text-[10px] text-[var(--text-muted)]">detected as: prompt</p>
                     </div>
                  </div>
               </div>
            ))}
          </div>
          <button 
            onClick={() => setStep("success")}
            className="cc-btn-primary w-full py-3 font-medium"
          >
            Import Selected
          </button>
        </div>
      )}

      {step === "success" && (
        <div className="text-center py-8 space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-[rgba(54,211,153,0.1)] flex items-center justify-center text-[var(--ok)]">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h3 className="text-lg font-semibold">Import Successful</h3>
          <p className="text-sm text-[var(--text-muted)] max-w-xs mx-auto">
            3 assets have been added to your current workspace library.
          </p>
          <button className="cc-btn-secondary px-6 py-2 text-sm font-medium" onClick={() => setStep("url")}>
            Done
          </button>
        </div>
      )}
    </div>
  );
}
