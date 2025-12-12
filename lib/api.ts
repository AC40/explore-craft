import {
  CraftConnection,
  CraftDocument,
  CraftFolder,
  CraftTask,
} from "@/types/craft";

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Request failed: ${response.status} ${text || response.statusText}`
    );
  }
  return response.json() as Promise<T>;
}

class CraftAPI {
  async getDocuments(
    connection: CraftConnection,
    location?: "unsorted" | "trash" | "templates" | "daily_notes",
    folderId?: string,
    fetchMetadata: boolean = false
  ) {
    const data = await postJson<{ items: CraftDocument[] }>(
      "/api/craft/documents",
      {
        blob: connection.encryptedBlob,
        location,
        folderId,
        fetchMetadata,
      }
    );
    return data.items;
  }

  async getFolders(connection: CraftConnection) {
    const data = await postJson<{ items: CraftFolder[] }>(
      "/api/craft/folders",
      {
        blob: connection.encryptedBlob,
      }
    );
    return data.items;
  }

  async getTasks(
    connection: CraftConnection,
    scope: "active" | "upcoming" | "inbox" | "logbook"
  ) {
    const data = await postJson<{ items: CraftTask[] }>("/api/craft/tasks", {
      blob: connection.encryptedBlob,
      scope,
    });
    return data.items;
  }

  async getBlocks(connection: CraftConnection, documentId: string) {
    return postJson("/api/craft/blocks", {
      blob: connection.encryptedBlob,
      id: documentId,
    });
  }
}

export const craftAPI = new CraftAPI();
