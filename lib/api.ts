import {
  CraftConnection,
  CraftDocument,
  CraftFolder,
  CraftTask,
} from "@/types/craft";

class CraftAPI {
  async getDocuments(
    connection: CraftConnection,
    location?: "unsorted" | "trash" | "templates" | "daily_notes",
    folderId?: string,
    fetchMetadata: boolean = false
  ) {
    const queryParams = new URLSearchParams();
    if (location) {
      queryParams.set("location", location);
    }
    if (folderId) {
      queryParams.set("folderId", folderId);
    }
    if (fetchMetadata) {
      queryParams.set("fetchMetadata", "true");
    }
    const response = await fetch(
      this.constructUrl(connection, "documents", queryParams),
      {
        headers: this.constructHeaders(connection),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch documents: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data.items as CraftDocument[];
  }

  async getFolders(connection: CraftConnection) {
    const response = await fetch(this.constructUrl(connection, "folders"), {
      headers: this.constructHeaders(connection),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch folders: ${response.statusText}`);
    }
    const data = await response.json();
    return data.items as CraftFolder[];
  }

  async getTasks(
    connection: CraftConnection,
    scope: "active" | "upcoming" | "inbox" | "logbook"
  ) {
    const queryParams = new URLSearchParams();
    queryParams.set("scope", scope);
    const response = await fetch(
      this.constructUrl(connection, "tasks", queryParams),
      {
        headers: this.constructHeaders(connection),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }
    const data = await response.json();
    return data.items as CraftTask[];
  }

  async getBlocks(connection: CraftConnection, documentId: string) {
    const queryParams = new URLSearchParams();
    queryParams.set("id", documentId);
    const response = await fetch(
      this.constructUrl(connection, "blocks", queryParams),
      {
        headers: this.constructHeaders(connection),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch blocks: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  }

  constructUrl(
    connection: CraftConnection,
    path: string,
    queryParams?: URLSearchParams
  ) {
    return `${connection.url}/${path}?${queryParams?.toString()}`;
  }

  constructHeaders(connection: CraftConnection) {
    return {
      Authorization: `Bearer ${connection.apiKey}`,
    };
  }
}

export const craftAPI = new CraftAPI();
