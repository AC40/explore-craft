import { CraftFolder } from "@/types/craft";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function findFolder(
  folders: CraftFolder[],
  id: string
): CraftFolder | null {
  for (const folder of folders) {
    if (folder.id === id) {
      return folder;
    }
    if (folder.folders) {
      const found = findFolder(folder.folders, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}
