"use client";

import { useState, type ComponentType } from "react";
import { 
  Compass, 
  Layers3, 
  Workflow, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Hash,
  Pin
} from "lucide-react";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { useStore } from "@/store/useStore";
import type { AppView } from "@/types/navigation";

interface SidebarProps {
  view: AppView;
  setView: (view: AppView) => void;
}

export function Sidebar({ view, setView }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const activeWorkspaceId = useStore((state) => state.activeWorkspaceId);
  const conversations = useStore((state) => state.conversations).filter(c => c.workspaceId === activeWorkspaceId);
  const pinnedAssets = useStore((state) => state.assets).filter(a => a.workspaceId === activeWorkspaceId && a.pinned);
  const activeConversationId = useStore((state) => state.activeConversationId);
  const setActiveConversationId = useStore((state) => state.setActiveConversationId);

  return (
    <aside 
      className={`relative flex flex-col border-r border-[var(--line)] bg-[rgba(7,11,17,0.78)] transition-all duration-300 backdrop-blur-xl ${
        collapsed ? "w-20" : "w-[280px]"
      }`}
    >
      <div className="p-4 space-y-4">
        <div className="cc-glass flex items-center gap-3 rounded-2xl p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
            <Compass className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0 overflow-hidden">
              <p className="truncate text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">Vault</p>
              <h1 className="truncate text-sm font-semibold">Command Center</h1>
            </div>
          )}
        </div>

        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      <nav className="flex-1 overflow-y-auto space-y-1 px-4 py-6 scrollbar-hide">
        <NavItem
          icon={Layers3}
          label="Library"
          collapsed={collapsed}
          isActive={view === "library"}
          onClick={() => setView("library")}
        />
        <NavItem
          icon={MessageSquare}
          label="Chat"
          collapsed={collapsed}
          isActive={view === "chat"}
          onClick={() => setView("chat")}
        />
        <NavItem
          icon={Workflow}
          label="Import"
          collapsed={collapsed}
          isActive={view === "import"}
          onClick={() => setView("import")}
        />
        
        {pinnedAssets.length > 0 && !collapsed && (
          <>
            <div className="mt-8 mb-2 px-2 flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Pinned Assets</p>
              <Pin className="h-3 w-3 text-[var(--brand)] opacity-50" />
            </div>
            {pinnedAssets.map(asset => (
              <button
                key={asset.id}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-xs text-[var(--text-muted)] hover:bg-[rgba(255,255,255,0.03)] transition"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] shadow-[0_0_8px_var(--brand)]" />
                <span className="truncate">{asset.name}</span>
              </button>
            ))}
          </>
        )}

        <div className="mt-8 mb-2 px-2 flex items-center justify-between">
          <p className={`text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] ${collapsed ? "hidden" : ""}`}>Recent Chats</p>
          {!collapsed && <MessageSquare className="h-3 w-3 text-[var(--text-muted)] opacity-50" />}
        </div>
        
        {conversations.slice(0, 5).map(conv => (
          <button
            key={conv.id}
            onClick={() => {
              setActiveConversationId(conv.id);
              setView("chat");
            }}
            className={`flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-xs transition ${
              activeConversationId === conv.id 
                ? "bg-[rgba(104,166,255,0.1)] text-white" 
                : "text-[var(--text-muted)] hover:bg-[rgba(255,255,255,0.03)]"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <Hash className="h-3.5 w-3.5 shrink-0 opacity-50" />
            {!collapsed && <span className="truncate">{conv.title}</span>}
          </button>
        ))}

      </nav>

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-white z-50"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}

interface NavItemProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
  collapsed: boolean;
  onClick?: () => void;
}

function NavItem({ icon: Icon, label, isActive = false, collapsed, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-sm transition ${
        isActive
          ? "border-[var(--line-strong)] bg-[rgba(24,35,53,0.62)] text-white"
          : "border-transparent bg-transparent text-[var(--text-muted)] hover:border-[var(--line)] hover:bg-[rgba(8,13,20,0.46)]"
      } ${collapsed ? "justify-center px-0" : ""}`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[var(--brand)]" : ""}`} />
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}
