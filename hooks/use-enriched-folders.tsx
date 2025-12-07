"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CraftConnection } from "@/types/craft";
import { craftAPI } from "@/lib/api";
import { EnrichedFolder, isSpecialFolder } from "@/lib/folders";

export function useEnrichedFolders(connection: CraftConnection) {
  const {
    data: folders,
    isLoading,
    error,
  } = useQuery({
    queryKey: [connection.id, "folders"],
    queryFn: () => craftAPI.getFolders(connection),
    enabled: !!connection.id,
  });

  const [enrichedFolders, setEnrichedFolders] = useState<
    EnrichedFolder[] | undefined
  >(undefined);

  useEffect(() => {
    if (!folders) {
      setEnrichedFolders(undefined);
      return;
    }

    let isMounted = true;

    (async () => {
      const enriched = await Promise.all(
        folders.map(async (folder) => {
          if (isSpecialFolder(folder.id)) {
            const documents = await craftAPI.getDocuments(
              connection,
              folder.id
            );
            return { ...folder, documents };
          }

          const documents = await craftAPI.getDocuments(
            connection,
            undefined,
            folder.id
          );
          return { ...folder, documents };
        })
      );
      if (isMounted) setEnrichedFolders(enriched);
    })();

    return () => {
      isMounted = false;
    };
  }, [folders, connection]);

  return { enrichedFolders, isLoading, error };
}
