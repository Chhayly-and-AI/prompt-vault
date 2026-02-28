"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Plus, MessageSquare, Layers3, Download, FolderGit2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { AssetList } from "@/features/assets/components/AssetList";
import { CreateAssetModal } from "@/features/assets/components/CreateAssetModal";
import { ChatInterface } from "@/features/chat/components/ChatInterface";
import { GitHubWizard } from "@/features/import/components/GitHubWizard";
import { useStorageActions } from "@/lib/storage-helpers";
import { exportWorkspace, downloadJSON } from "@/lib/portability/json-handler";

export default function Home() {
  const [view, setView] = useState<"library" | "chat" | "import">("library");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const activeWorkspaceId = useStore((state) => state.activeWorkspaceId);
  const workspaces = useStore((state) => state.workspaces);
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);
  
  const { addConversation } = useStorageActions();
  const setActiveConversationId = useStore((state) => state.setActiveConversationId);

  const handleNewConversation = () => {
    if (!activeWorkspaceId) return;
    const newConv = {
      id: crypto.randomUUID(),
      title: "New Conversation",
      workspaceId: activeWorkspaceId,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    addConversation(newConv);
    setActiveConversationId(newConv.id);
    setView("chat");
  };

  const handleExport = () => {
    if (!activeWorkspaceId) return;
    const data = exportWorkspace(activeWorkspaceId, useStore.getState());
    if (data) {
       downloadJSON(data, `pv-export-${activeWorkspace?.name.toLowerCase().replace(/\s+/g, '-')}.json`);
    }
  };

  return (
    <main className="cc-shell cc-grid-bg flex h-screen overflow-hidden text-[var(--text)]">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Workspace Header */}
        <header className="flex h-16 items-center justify-between border-b border-[var(--line)] bg-[rgba(7,11,17,0.72)] px-6 backdrop-blur-xl">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-4">
                <h2 className="text-sm font-medium">{activeWorkspace?.name || "No Workspace Selected"}</h2>
                <div className="cc-pill px-2 py-0.5 text-[10px] text-[var(--text-muted)]">v1.0.0</div>
             </div>
             <div className="flex gap-1 h-8 bg-[rgba(255,255,255,0.03)] p-1 rounded-xl border border-[var(--line)]">
                <button 
                  onClick={() => setView("library")}
                  className={`flex items-center gap-2 px-3 rounded-lg text-xs font-medium transition ${view === "library" ? "bg-[var(--brand-soft)] text-[var(--brand)]" : "text-[var(--text-muted)] hover:text-white"}`}
                >
                  <Layers3 className="h-3.5 w-3.5" /> Library
                </button>
                <button 
                  onClick={() => setView("chat") }
                  className={`flex items-center gap-2 px-3 rounded-lg text-xs font-medium transition ${view === "chat" ? "bg-[var(--brand-soft)] text-[var(--brand)]" : "text-[var(--text-muted)] hover:text-white"}`}
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Chat
                </button>
                <button 
                  onClick={() => setView("import") }
                  className={`flex items-center gap-2 px-3 rounded-lg text-xs font-medium transition ${view === "import" ? "bg-[var(--brand-soft)] text-[var(--brand)]" : "text-[var(--text-muted)] hover:text-white"}`}
                >
                  <FolderGit2 className="h-3.5 w-3.5" /> Import
                </button>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={handleExport}
               className="cc-btn-secondary flex items-center gap-2 px-3 py-1.5 text-xs font-medium"
               title="Export Workspace JSON"
             >
               <Download className="h-3.5 w-3.5" />
             </button>
             <button onClick={handleNewConversation} className="cc-btn-secondary flex items-center gap-2 px-3 py-1.5 text-xs font-medium">
               <Plus className="h-3.5 w-3.5" /> New Chat
             </button>
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
           {!activeWorkspaceId ? (
             <div className="cc-glass flex h-full flex-col items-center justify-center rounded-3xl border-dashed opacity-50">
                <p className="text-sm text-[var(--text-muted)]">Please select a workspace to continue.</p>
             </div>
           ) : view === "library" ? (
             <AssetList />
           ) : view === "chat" ? (
             <ChatInterface />
           ) : (
             <GitHubWizard />
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
