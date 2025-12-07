"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "folder-expansion-state";

export function useFolderExpansion() {
  const [folderStates, setFolderStates] = useState<Record<string, boolean>>(
    {}
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFolderStates(parsed);
      }
    } catch (error) {
      console.warn("Failed to load folder expansion state:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const toggleFolder = useCallback((folderId: string) => {
    setFolderStates((prev) => {
      const next = { ...prev };
      next[folderId] = !prev[folderId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        console.warn("Failed to save folder expansion state:", error);
      }
      return next;
    });
  }, []);

  const isExpanded = useCallback(
    (folderId: string, defaultValue = false) => {
      if (!isLoaded) return defaultValue;
      return folderStates[folderId] ?? defaultValue;
    },
    [folderStates, isLoaded]
  );

  const setExpanded = useCallback((folderId: string, expanded: boolean) => {
    setFolderStates((prev) => {
      const next = { ...prev, [folderId]: expanded };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        console.warn("Failed to save folder expansion state:", error);
      }
      return next;
    });
  }, []);

  return { isExpanded, toggleFolder, setExpanded };
}

