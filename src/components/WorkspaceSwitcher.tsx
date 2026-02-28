"use client";

import { useState } from "react";
import { Plus, Check, ChevronsUpDown } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useStorageActions } from "@/lib/storage-helpers";

export function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = useState(false);
  const workspaces = useStore((state) => state.workspaces);
  const activeWorkspaceId = useStore((state) => state.activeWorkspaceId);
  const setActiveWorkspaceId = useStore((state) => state.setActiveWorkspaceId);
  const { addWorkspace } = useStorageActions();

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  const handleCreateWorkspace = () => {
    const name = prompt("Workspace Name:");
    if (name) {
      const newWorkspace = {
        id: crypto.randomUUID(),
        name,
        createdAt: Date.now(),
      };
      addWorkspace(newWorkspace);
      setActiveWorkspaceId(newWorkspace.id);
    }
  };

  if (collapsed) {
    return (
      <div className="flex justify-center py-2">
        <div className="h-8 w-8 rounded-lg bg-[var(--brand-soft)] flex items-center justify-center text-[var(--brand)] font-bold text-xs">
          {activeWorkspace?.name.charAt(0) || "W"}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-[var(--line)] bg-[rgba(9,14,22,0.45)] px-3 py-2 text-sm hover:border-[var(--line-strong)]"
      >
        <span className="truncate font-medium">{activeWorkspace?.name || "Select Workspace"}</span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-[100] mt-2 rounded-xl border border-[var(--line-strong)] bg-[var(--bg-elevated)] p-1 shadow-2xl backdrop-blur-xl">
          <div className="max-h-60 overflow-y-auto">
            {workspaces.map((w) => (
              <button
                key={w.id}
                onClick={() => {
                  setActiveWorkspaceId(w.id);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-[rgba(255,255,255,0.05)]"
              >
                <span className="truncate">{w.name}</span>
                {w.id === activeWorkspaceId && <Check className="h-4 w-4 text-[var(--ok)]" />}
              </button>
            ))}
          </div>
          <div className="mt-1 border-t border-[var(--line)] p-1">
            <button
              onClick={() => {
                handleCreateWorkspace();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--brand)] hover:bg-[rgba(255,255,255,0.05)]"
            >
              <Plus className="h-4 w-4" />
              <span>Create Workspace</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
