"use client";

import { useState } from "react";
import { Plus, Check, ChevronsUpDown, Edit2, Trash2, X } from "lucide-react";
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

  const handleRename = (id: string, oldName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newName = prompt("New Name:", oldName);
    if (newName && newName !== oldName) {
      useStore.setState((state) => ({
        workspaces: state.workspaces.map(w => w.id === id ? { ...w, name: newName } : w)
      }));
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete workspace? This will hide it from your list.")) {
       useStore.setState((state) => ({
         workspaces: state.workspaces.filter(w => w.id !== id),
         activeWorkspaceId: state.activeWorkspaceId === id ? null : state.activeWorkspaceId
       }));
    }
  };

  if (collapsed) {
    return (
      <div className="flex justify-center py-2">
        <div className="h-8 w-8 rounded-lg bg-[var(--brand-soft)] flex items-center justify-center text-[var(--brand)] font-bold text-xs border border-[rgba(104,166,255,0.2)] shadow-inner">
          {activeWorkspace?.name.charAt(0).toUpperCase() || "W"}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-[var(--line)] bg-[rgba(9,14,22,0.45)] px-3 py-2 text-sm hover:border-[var(--line-strong)] transition-all group"
      >
        <span className="truncate font-medium">{activeWorkspace?.name || "Select Workspace"}</span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-[var(--text-muted)] group-hover:text-[var(--brand)] transition-colors" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 top-full z-[100] mt-2 rounded-xl border border-[var(--line-strong)] bg-[var(--bg-elevated)] p-1 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-150">
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {workspaces.map((w) => (
                <div
                  key={w.id}
                  onClick={() => {
                    setActiveWorkspaceId(w.id);
                    setOpen(false);
                  }}
                  className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-[rgba(255,255,255,0.05)] cursor-pointer"
                >
                  <span className="truncate">{w.name}</span>
                  <div className="flex items-center gap-1">
                    {w.id === activeWorkspaceId ? (
                       <Check className="h-3.5 w-3.5 text-[var(--ok)]" />
                    ) : (
                       <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={(e) => handleRename(w.id, w.name, e)} className="p-1 hover:text-[var(--brand)]"><Edit2 className="h-3 w-3" /></button>
                         <button onClick={(e) => handleDelete(w.id, e)} className="p-1 hover:text-[var(--danger)]"><Trash2 className="h-3 w-3" /></button>
                       </div>
                    )}
                  </div>
                </div>
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
                <span className="font-medium text-xs">New Workspace</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
