import { del, get, keys, set } from "idb-keyval";
import { PromptItem } from "@/types";

export async function savePrompt(prompt: PromptItem): Promise<void> {
  await set(prompt.id, prompt);
}

export async function getAllPrompts(): Promise<PromptItem[]> {
  const allKeys = await keys();
  const prompts = await Promise.all(allKeys.map((key) => get<PromptItem>(key)));
  return prompts.filter((prompt): prompt is PromptItem => Boolean(prompt));
}

export async function deletePrompt(id: string): Promise<void> {
  await del(id);
}
