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
  ChevronRight
} from "lucide-react";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

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

      <nav className="flex-1 space-y-2 px-4 py-6">
        <NavItem icon={Layers3} label="Library" active collapsed={collapsed} />
        <NavItem icon={MessageSquare} label="Chats" collapsed={collapsed} />
        <div className="my-4 border-t border-[var(--line)]" />
        <p className={`mb-2 px-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] ${collapsed ? "text-center" : ""}`}>
          {collapsed ? "---" : "Assets"}
        </p>
        <NavItem icon={Workflow} label="Skills" collapsed={collapsed} />
        <NavItem icon={TerminalSquare} label="Prompts" collapsed={collapsed} />
      </nav>

      <div className="p-4 border-t border-[var(--line)]">
         <NavItem icon={Settings} label="Settings" collapsed={collapsed} />
      </div>

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-white z-50"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
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
