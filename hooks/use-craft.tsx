"use client";

import { CraftConnection, CraftConnectionType } from "@/types/craft";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  useEffect,
} from "react";

interface CraftContextValue {
  connections: CraftConnection[];
  activeConnection: CraftConnection | null;
  setConnections: (connections: CraftConnection[]) => void;
  setActiveConnection: (connection: CraftConnection | null) => void;
}

const CraftContext = createContext<CraftContextValue | undefined>(undefined);

export function CraftProvider({ children }: { children: ReactNode }) {
  const [connections, _setConnections] = useState<CraftConnection[]>([]);
  const [activeConnection, _setActiveConnection] =
    useState<CraftConnection | null>(null);

  const setConnections = useCallback(
    (connections: CraftConnection[]) => {
      localStorage.setItem("connections", JSON.stringify(connections));
      _setConnections(connections);

      if (activeConnection) {
        const found = connections.find((c) => c.id === activeConnection.id);
        if (found) {
          _setActiveConnection(found);
        } else {
          _setActiveConnection(null);
          localStorage.removeItem("activeConnection");
        }
      }
    },
    [activeConnection]
  );

  const setActiveConnection = useCallback(
    (connection: CraftConnection | null) => {
      localStorage.setItem(
        "activeConnection",
        connection ? JSON.stringify(connection) : ""
      );
      _setActiveConnection(connection);
    },
    []
  );

  useEffect(() => {
    const storedConnections = localStorage.getItem("connections");
    if (storedConnections) {
      const parsed = JSON.parse(storedConnections);
      // Migrate old connections without type to "folders" type
      const migrated = parsed.map((c: CraftConnection) => ({
        ...c,
        type: c.type || ("folders" as CraftConnectionType),
      }));
      _setConnections(migrated);

      const storedActive = localStorage.getItem("activeConnection");
      if (storedActive) {
        const active = JSON.parse(storedActive);
        const found = migrated.find((c: CraftConnection) => c.id === active.id);
        if (found) {
          _setActiveConnection(found);
        }
      } else {
        _setActiveConnection(migrated[0] || null);
      }
    }
  }, []);

  return (
    <CraftContext.Provider
      value={{
        connections,
        activeConnection,
        setConnections,
        setActiveConnection,
      }}
    >
      {children}
    </CraftContext.Provider>
  );
}

export function useCraft() {
  const context = useContext(CraftContext);
  if (context === undefined) {
    throw new Error("useCraft must be used within a CraftProvider");
  }
  return context;
}
