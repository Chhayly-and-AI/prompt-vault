"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { FileText, Copy, CheckCircle2, X, AlertTriangle } from "lucide-react";
import { Asset, Mention } from "@/schemas/models";

export function PromptCompiler({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const activeConversationId = useStore((state) => state.activeConversationId);
  const activeConversation = useStore((state) => state.conversations).find(c => c.id === activeConversationId);
  const assets = useStore((state) => state.assets);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !activeConversation) return null;

  // Resolve Mentions recursively with a depth guard
  const resolveAssets = (mentions: Mention[], depth = 0, visited = new Set<string>()): Asset[] => {
    if (depth > 3) return []; // Recursion depth guard
    
    let resolved: Asset[] = [];
    mentions.forEach(m => {
      if (visited.has(m.assetId)) return;
      visited.add(m.assetId);
      
      const asset = assets.find(a => a.id === m.assetId);
      if (asset) {
        resolved.push(asset);
        // Naive extraction of mentions from asset content for recursion
        const subMentionNames = Array.from(asset.content.matchAll(/[\\@\\#\\~]([\\w-]+)/g)).map(match => match[1]);
        const subMentions: Mention[] = assets
          .filter(a => subMentionNames.includes(a.name) && a.workspaceId === asset.workspaceId)
          .map(a => ({ id: crypto.randomUUID(), type: a.type, name: a.name, assetId: a.id }));
        
        resolved = [...resolved, ...resolveAssets(subMentions, depth + 1, visited)];
      }
    });
    return resolved;
  };

  const allMentions = activeConversation.messages.flatMap(m => m.mentions);
  const relevantAssets = [...new Set(resolveAssets(allMentions))];

  const compiledOutput = `# COMPILED PROMPT\n\n${relevantAssets.map(a => `## ${a.type.toUpperCase()}: ${a.name}\n${a.content}`).join("\n\n")}\n\n## USER MESSAGE\n${activeConversation.messages.filter(m => m.role === 'user').pop()?.content || ""}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="cc-glass w-full max-w-3xl max-h-[80vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl border-[var(--line-strong)]">
        <div className="flex items-center justify-between p-6 border-b border-[var(--line)]">
           <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[var(--brand)]" />
              <h2 className="text-xl font-semibold text-white">Compiled System Prompt</h2>
           </div>
           <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[rgba(0,0,0,0.2)]">
           <pre className="text-xs font-mono leading-relaxed text-[var(--text-muted)] whitespace-pre-wrap">
             {compiledOutput}
           </pre>
        </div>

        <div className="p-6 border-t border-[var(--line)] flex justify-between items-center">
           <div className="flex items-center gap-2">
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
                {relevantAssets.length} Assets in context
              </p>
              {relevantAssets.length > 10 && <AlertTriangle className="h-3 w-3 text-[var(--warn)]" title="Large context detected" />}
           </div>
           <button 
             onClick={handleCopy}
             className="cc-btn-primary px-6 py-2.5 flex items-center gap-2 text-sm font-medium"
           >
             {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
             {copied ? "Copied to Clipboard" : "Copy Compiled Prompt"}
           </button>
        </div>
      </div>
    </div>
  );
}
