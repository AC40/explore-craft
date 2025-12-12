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

export type CraftTask = {
  id: string;
  markdown: string;
  state: string;
  scheduleDate?: string;
  deadlineDate?: string;
};

export type CraftConnectionType = "folders" | "documents" | "daily_notes";

export type CraftConnection = {
  id: string;
  name: string;
  url: string;
  type: CraftConnectionType;
  encryptedBlob: string;
};

export type CraftBlock = {
  id: string;
  type: string;
  markdown: string;
  [key: string]: unknown;
};

export type CraftBlocksResponse = {
  content?: CraftBlock[];
  [key: string]: unknown;
};
