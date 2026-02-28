"use client";

import { useState } from "react";
import { 
  Compass, 
  Layers3, 
  Workflow, 
  TerminalSquare, 
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <main className="cc-shell cc-grid-bg flex h-screen overflow-hidden text-[var(--text)]">
      {/* Sidebar Shell */}
      <aside 
        className={`relative flex flex-col border-r border-[var(--line)] bg-[rgba(7,11,17,0.78)] transition-all duration-300 backdrop-blur-xl ${
          sidebarCollapsed ? "w-20" : "w-[280px]"
        }`}
      >
        <div className="p-4">
          <div className="cc-glass flex items-center gap-3 rounded-2xl p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
              <Compass className="h-5 w-5" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 overflow-hidden">
                <p className="truncate text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">Vault</p>
                <h1 className="truncate text-sm font-semibold">Command Center</h1>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          <NavItem icon={Layers3} label="Library" active collapsed={sidebarCollapsed} />
          <NavItem icon={MessageSquare} label="Chats" collapsed={sidebarCollapsed} />
          <div className="my-4 border-t border-[var(--line)]" />
          <p className={`mb-2 px-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] ${sidebarCollapsed ? "text-center" : ""}`}>
            {sidebarCollapsed ? "---" : "Assets"}
          </p>
          <NavItem icon={Workflow} label="Skills" collapsed={sidebarCollapsed} />
          <NavItem icon={TerminalSquare} label="Prompts" collapsed={sidebarCollapsed} />
        </nav>

        <div className="p-4 border-t border-[var(--line)]">
           <NavItem icon={Settings} label="Settings" collapsed={sidebarCollapsed} />
        </div>

        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-white"
        >
          {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Workspace Header */}
        <header className="flex h-16 items-center justify-between border-b border-[var(--line)] bg-[rgba(7,11,17,0.72)] px-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
             <h2 className="text-sm font-medium">Default Workspace</h2>
             <div className="cc-pill px-2 py-0.5 text-[10px] text-[var(--text-muted)]">v1.0.0</div>
          </div>
          <div className="flex items-center gap-3">
             <button className="cc-btn-secondary px-3 py-1.5 text-xs">Share</button>
             <button className="cc-btn-primary flex items-center gap-2 px-3 py-1.5 text-xs font-medium">
               <Plus className="h-3.5 w-3.5" /> New Asset
             </button>
          </div>
        </header>

        {/* Dynamic View Area */}
        <div className="flex-1 overflow-hidden p-6">
           <div className="cc-glass flex h-full flex-col items-center justify-center rounded-3xl border-dashed opacity-50">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-soft)]">
                <Layers3 className="h-8 w-8 text-[var(--brand)]" />
              </div>
              <p className="text-sm text-[var(--text-muted)] font-mono">_init_milestone_0_shell_</p>
           </div>
        </div>
      </div>
    </main>
  );
}

function NavItem({ icon: Icon, label, active, collapsed }: any) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-sm transition ${
        active
          ? "border-[var(--line-strong)] bg-[rgba(24,35,53,0.62)] text-white"
          : "border-transparent bg-transparent text-[var(--text-muted)] hover:border-[var(--line)] hover:bg-[rgba(8,13,20,0.46)]"
      } ${collapsed ? "justify-center px-0" : ""}`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${active ? "text-[var(--brand)]" : ""}`} />
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}
