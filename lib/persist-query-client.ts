import { QueryClient } from "@tanstack/react-query";

const CACHE_KEY = "react-query-cache";
const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

export function persistQueryClient(queryClient: QueryClient) {
  if (typeof window === "undefined") return;

  const cache = queryClient.getQueryCache();
  let saveTimeout: NodeJS.Timeout | null = null;

  const saveCache = () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    saveTimeout = setTimeout(() => {
      const queries = cache.getAll();
      const cacheData = queries
        .filter((query) => query.state.data !== undefined)
        .map((query) => ({
          queryKey: query.queryKey,
          data: query.state.data,
          dataUpdatedAt: query.state.dataUpdatedAt,
        }));

      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      } catch (error) {
        console.warn("Failed to persist query cache:", error);
        try {
          localStorage.removeItem(CACHE_KEY);
        } catch {
          // Ignore cleanup errors
        }
      }
    }, 500);
  };

  const loadCache = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return;

      const cacheData = JSON.parse(cached);
      const now = Date.now();

      cacheData.forEach(
        (item: {
          queryKey: unknown[];
          data: unknown;
          dataUpdatedAt: number;
        }) => {
          const age = now - item.dataUpdatedAt;
          if (age < MAX_AGE && item.data !== undefined) {
            queryClient.setQueryData(item.queryKey, item.data, {
              updatedAt: item.dataUpdatedAt,
            });
          }
        }
      );
    } catch (error) {
      console.warn("Failed to load query cache:", error);
      try {
        localStorage.removeItem(CACHE_KEY);
      } catch {
        // Ignore cleanup errors
      }
    }
  };

  loadCache();

  const unsubscribe = cache.subscribe((event) => {
    if (event?.type === "updated" || event?.type === "added") {
      saveCache();
    }
  });

  window.addEventListener("beforeunload", () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    saveCache();
  });

  return () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    unsubscribe();
    window.removeEventListener("beforeunload", saveCache);
  };
}
