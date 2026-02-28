import { Asset, Workspace, Conversation } from "@/schemas/models";

export interface PVExport {
  version: "1.0.0";
  workspace: Workspace;
  assets: Asset[];
  conversations: Conversation[];
}

export const exportWorkspace = (workspaceId: string, store: any): PVExport | null => {
  const workspace = store.workspaces.find((w: Workspace) => w.id === workspaceId);
  if (!workspace) return null;

  return {
    version: "1.0.0",
    workspace,
    assets: store.assets.filter((a: Asset) => a.workspaceId === workspaceId),
    conversations: store.conversations.filter((c: Conversation) => c.workspaceId === workspaceId),
  };
};

export const downloadJSON = (data: PVExport, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
