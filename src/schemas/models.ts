import { z } from "zod";

export const AssetTypeSchema = z.enum(["skill", "prompt", "workflow"]);

export const AssetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  type: AssetTypeSchema,
  content: z.string(),
  tags: z.array(z.string()).default([]),
  workspaceId: z.string().uuid(),
  sourceUrl: z.string().url().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const WorkspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  createdAt: z.number(),
});

export const MessageRoleSchema = z.enum(["user", "assistant", "system"]);

export const MentionSchema = z.object({
  id: z.string().uuid(),
  type: AssetTypeSchema,
  name: z.string(),
  assetId: z.string().uuid(),
});

export const MessageSchema = z.object({
  id: z.string().uuid(),
  role: MessageRoleSchema,
  content: z.string(),
  mentions: z.array(MentionSchema).default([]),
  createdAt: z.number(),
});

export const ConversationSchema = z.object({
  id: z.string().uuid(),
  title: z.string().default("New Conversation"),
  workspaceId: z.string().uuid(),
  messages: z.array(MessageSchema).default([]),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Asset = z.infer<typeof AssetSchema>;
export type Workspace = z.infer<typeof WorkspaceSchema>;
export type Mention = z.infer<typeof MentionSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
export type AssetType = z.infer<typeof AssetTypeSchema>;
