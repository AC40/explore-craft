export type CraftFolder = {
  id: string;
  name: string;
  documentsCount: number;
  folders: CraftFolder[];
};

export type CraftDocument = {
  id: string;
  title: string;
  url: string;
};

export type CraftConnection = {
  id: string;
  url: string;
  apiKey?: string;
};
