export interface PromptItem {
  id: string;
  name: string;
  content: string;
  type: 'prompt' | 'skill';
  sourceUrl?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: number;
}

export interface ScannedItem {
  name: string;
  path: string;
  type: 'prompt' | 'skill';
  content: string;
  dependencies?: string[];
}
