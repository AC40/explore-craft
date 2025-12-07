import { CraftFolder, CraftDocument } from "@/types/craft";

export const SPECIAL_FOLDER_IDS = [
  "unsorted",
  "trash",
  "templates",
  "daily_notes",
] as const;

export type SpecialFolderId = (typeof SPECIAL_FOLDER_IDS)[number];

export function isSpecialFolder(folderId: string): folderId is SpecialFolderId {
  return SPECIAL_FOLDER_IDS.includes(folderId as SpecialFolderId);
}

export function isFolder(
  item: CraftFolder | CraftDocument
): item is CraftFolder {
  return "folders" in item;
}

export type EnrichedFolder = CraftFolder & { documents: CraftDocument[] };
