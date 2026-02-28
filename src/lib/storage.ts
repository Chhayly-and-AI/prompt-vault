import { get, set, del, keys } from 'idb-keyval';
import { PromptItem } from '@/types';

const STORE_NAME = 'prompts';

export async function savePrompt(prompt: PromptItem): Promise<void> {
  await set(prompt.id, prompt);
}

export async function getAllPrompts(): Promise<PromptItem[]> {
  const allKeys = await keys();
  const prompts = await Promise.all(allKeys.map(key => get<PromptItem>(key)));
  return prompts.filter((p): p is PromptItem => !!p);
}

export async function deletePrompt(id: string): Promise<void> {
  await del(id);
}
