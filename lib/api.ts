import { CraftConnection, CraftDocument, CraftFolder } from "@/types/craft";

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
