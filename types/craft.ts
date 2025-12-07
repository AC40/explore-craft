export type CraftFolder = {
  id: string;
  name: string;
  documentsCount: number;
  folders: CraftFolder[];
};

export type CraftDocument = {
  id: string;
  title: string;
};

export type CraftConnectionType = "folders" | "documents" | "daily_notes";

export type CraftConnection = {
  id: string;
  name: string;
  url: string;
  apiKey?: string;
  type: CraftConnectionType;
};
