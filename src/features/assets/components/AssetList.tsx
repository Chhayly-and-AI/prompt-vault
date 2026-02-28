"use client";

import { useStore } from "@/store/useStore";
import { Asset } from "@/schemas/models";
import { Workflow, TerminalSquare, Box, MoreVertical, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { AssetDrawer } from "./AssetDrawer";

export function AssetList() {
  const assets = useStore((state) => state.assets);
  const activeWorkspaceId = useStore((state) => state.activeWorkspaceId);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "skill" | "prompt" | "workflow">("all");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesWorkspace = asset.workspaceId === activeWorkspaceId;
      const matchesTab = activeTab === "all" || asset.type === activeTab;
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           asset.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesWorkspace && matchesTab && matchesSearch;
    });
  }, [assets, activeWorkspaceId, activeTab, searchQuery]);

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {["all", "skill", "prompt", "workflow"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`cc-pill px-3 py-1.5 text-xs capitalize ${
                activeTab === tab ? "text-white bg-[var(--brand-soft)] border-[var(--brand)]" : "text-[var(--text-muted)]"
              }`}
            >
              {tab}s
            </button>
          ))}
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets..."
            className="cc-input h-9 pl-10 pr-3 text-xs"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {filteredAssets.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--line)] opacity-50">
            <Box className="h-8 w-8 text-[var(--text-muted)] mb-2" />
            <p className="text-xs text-[var(--text-muted)]">No assets found</p>
          </div>
        ) : (
          filteredAssets.map((asset) => (
            <div key={asset.id} onClick={() => setSelectedAsset(asset)}>
               <AssetItem asset={asset} />
            </div>
          ))
        )}
      </div>

      <AssetDrawer 
        asset={selectedAsset} 
        onClose={() => setSelectedAsset(null)} 
      />
    </div>
  );
}

function AssetItem({ asset }: { asset: Asset }) {
  const Icon = asset.type === "skill" ? Workflow : asset.type === "prompt" ? TerminalSquare : Box;
  
  return (
    <div className="cc-card group flex items-center justify-between p-3 cursor-pointer">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.03)] text-[var(--brand)]">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0">
          <h4 className="truncate text-sm font-medium">{asset.name}</h4>
          <p className="truncate text-[10px] text-[var(--text-muted)]">
            {asset.tags.join(", ") || "No tags"} • Updated {new Date(asset.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <button className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text-muted)] hover:text-white transition-opacity">
        <MoreVertical className="h-4 w-4" />
      </button>
    </div>
  );
}
