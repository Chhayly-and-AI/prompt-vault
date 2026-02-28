"use client";

import { useState } from "react";
import { Compass, Plus, FolderGit2, Sparkles } from "lucide-react";
import { useStorageActions } from "@/lib/storage-helpers";
import { useStore } from "@/store/useStore";

export function WelcomeScreen() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { addWorkspace, addAssetsBatch } = useStorageActions();
  const setActiveWorkspaceId = useStore((state) => state.setActiveWorkspaceId);

  const handleCreateWorkspace = () => {
    if (!workspaceName.trim()) return;
    
    const newWorkspace = {
      id: crypto.randomUUID(),
      name: workspaceName.trim(),
      createdAt: Date.now(),
    };
    
    addWorkspace(newWorkspace);
    setActiveWorkspaceId(newWorkspace.id);
    setIsCreating(false);
  };

  const handleCreateWithSamples = () => {
    const name = workspaceName.trim() || "My Prompt Vault";
    
    const newWorkspace = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
    };
    
    // Sample assets to get started
    const sampleAssets = [
      {
        id: crypto.randomUUID(),
        name: "Code Architect",
        type: "skill" as const,
        content: `You are an expert software architect. Your role is to:\n\n1. Analyze codebases for architectural patterns\n2. Suggest improvements and refactoring opportunities\n3. Help design scalable system architectures\n4. Review code for best practices\n\nBe thorough but concise. Use examples when helpful.`,
        workspaceId: newWorkspace.id,
        tags: ["coding", "architecture", "review"],
        pinned: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: crypto.randomUUID(),
        name: "PR Review Checklist",
        type: "prompt" as const,
        content: `Review this pull request for:\n\n- [ ] Code correctness and logic\n- [ ] Test coverage\n- [ ] Documentation updates\n- [ ] Breaking changes\n- [ ] Performance implications\n- [ ] Security considerations\n\nProvide actionable feedback.`,
        workspaceId: newWorkspace.id,
        tags: ["review", "pr", "checklist"],
        pinned: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: crypto.randomUUID(),
        name: "Debug Assistant",
        type: "skill" as const,
        content: `You are a debugging expert. Help users:\n\n1. Identify root causes of issues\n2. Suggest debugging strategies\n3. Explain error messages\n4. Propose fixes with code examples\n\nAlways ask clarifying questions if the problem isn't clear.`,
        workspaceId: newWorkspace.id,
        tags: ["debugging", "troubleshooting"],
        pinned: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];
    
    addWorkspace(newWorkspace);
    addAssetsBatch(sampleAssets);
    setActiveWorkspaceId(newWorkspace.id);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <div className="cc-glass max-w-lg w-full rounded-3xl p-8 text-center space-y-6">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-[var(--brand-soft)] flex items-center justify-center text-[var(--brand)]">
          <Compass className="h-8 w-8" />
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to Prompt Vault</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Your local-first command center for managing AI prompts, skills, and workflows.
          </p>
        </div>

        {!isCreating ? (
          <div className="space-y-3">
            <button
              onClick={handleCreateWithSamples}
              className="cc-btn-primary w-full py-3 flex items-center justify-center gap-2 font-medium"
            >
              <Sparkles className="h-4 w-4" />
              Quick Start with Examples
            </button>
            
            <button
              onClick={() => setIsCreating(true)}
              className="cc-btn-secondary w-full py-3 flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="h-4 w-4" />
              Create Empty Workspace
            </button>
            
            <div className="pt-4 border-t border-[var(--line)]">
              <p className="text-xs text-[var(--text-muted)] mb-2">Or import from GitHub</p>
              <button
                onClick={() => {/* TODO: trigger import view */}}
                className="cc-btn-secondary w-full py-2.5 flex items-center justify-center gap-2 text-sm"
              >
                <FolderGit2 className="h-4 w-4" />
                Import from GitHub
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <input
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Workspace name..."
                className="cc-input h-12 px-4 text-sm w-full"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleCreateWorkspace()}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setIsCreating(false)}
                className="cc-btn-secondary flex-1 py-2.5 text-sm"
              >
                Back
              </button>
              <button
                onClick={handleCreateWorkspace}
                disabled={!workspaceName.trim()}
                className="cc-btn-primary flex-1 py-2.5 text-sm font-medium disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        )}
        
        <div className="pt-4 border-t border-[var(--line)]">
          <p className="text-[10px] text-[var(--text-muted)]">
            ✨ All data stored locally in your browser via IndexedDB
          </p>
        </div>
      </div>
    </div>
  );
}
