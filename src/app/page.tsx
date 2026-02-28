"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Plus } from "lucide-react";
import { useStore } from "@/store/useStore";
import { AssetList } from "@/features/assets/components/AssetList";
import { CreateAssetModal } from "@/features/assets/components/CreateAssetModal";

export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const activeWorkspaceId = useStore((state) => state.activeWorkspaceId);
  const workspaces = useStore((state) => state.workspaces);
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);

  return (
    <main className="cc-shell cc-grid-bg flex h-screen overflow-hidden text-[var(--text)]">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Workspace Header */}
        <header className="flex h-16 items-center justify-between border-b border-[var(--line)] bg-[rgba(7,11,17,0.72)] px-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
             <h2 className="text-sm font-medium">{activeWorkspace?.name || "No Workspace Selected"}</h2>
             <div className="cc-pill px-2 py-0.5 text-[10px] text-[var(--text-muted)]">v1.0.0</div>
          </div>
          <div className="flex items-center gap-3">
             <button className="cc-btn-secondary px-3 py-1.5 text-xs">Share</button>
             <button 
               onClick={() => setIsCreateModalOpen(true)}
               className="cc-btn-primary flex items-center gap-2 px-3 py-1.5 text-xs font-medium"
             >
               <Plus className="h-3.5 w-3.5" /> New Asset
             </button>
          </div>
        </header>

        {/* Dynamic View Area */}
        <div className="flex-1 overflow-hidden p-6">
           {activeWorkspaceId ? (
             <AssetList />
           ) : (
             <div className="cc-glass flex h-full flex-col items-center justify-center rounded-3xl border-dashed opacity-50">
                <p className="text-sm text-[var(--text-muted)]">Please select a workspace to view assets.</p>
             </div>
           )}
        </div>
      </div>

      <CreateAssetModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </main>
  );
}
