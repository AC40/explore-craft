import { CraftFolder, CraftConnectionType } from "@/types/craft";
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

export function getConnectionEndpoint(type: CraftConnectionType): string {
  switch (type) {
    case "documents":
      return "/documents";
    case "daily_notes":
      return "/tasks?scope=active";
    case "folders":
    default:
      return "/folders";
  }
}

export function extractConnectionName(
  url: string,
  providedName?: string
): string {
  if (providedName) return providedName;
  const match = url.match(/\/links\/([^\/]+)/);
  return match?.[1] || new URL(url).hostname;
}

export async function validateConnection(
  url: string,
  apiKey: string | undefined,
  type: CraftConnectionType
): Promise<{ success: boolean; error?: string }> {
  const headers = new Headers();
  if (apiKey) {
    headers.set("Authorization", `Bearer ${apiKey}`);
  }

  const endpoint = getConnectionEndpoint(type);
  const response = await fetch(url + endpoint, { headers });

  if (!response.ok) {
    let errorMessage = "Failed to connect to Craft.";

    if (response.status === 401) {
      errorMessage += " Please check if the API key is correct.";
    } else if (response.status === 404) {
      errorMessage += " Please check if the URL is correct.";
    } else if (response.status === 500) {
      errorMessage += " Internal server error.";
    }

    if (!apiKey) {
      errorMessage += " Did you maybe forget to add the API key?";
    }

    return { success: false, error: errorMessage };
  }

  return { success: true };
}
