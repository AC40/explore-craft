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
import { toast } from "sonner";

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

  const migrateLegacyConnection = useCallback(async (connection: any) => {
    if (connection.encryptedBlob) return connection;
    try {
      const res = await fetch("/api/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiUrl: connection.url,
          apiKey: connection.apiKey || "",
        }),
      });
      if (!res.ok) throw new Error("encryption failed");
      const data = await res.json();
      return {
        ...connection,
        encryptedBlob: data.blob,
        apiKey: undefined,
      };
    } catch (err) {
      console.warn("Failed to migrate connection to encrypted blob", err);
      toast.error("Failed to migrate a connection to encrypted storage.");
      return connection;
    }
  }, []);

  const setConnections = useCallback(
    (nextConnections: CraftConnection[]) => {
      localStorage.setItem("connections", JSON.stringify(nextConnections));
      _setConnections(nextConnections);

      if (activeConnection) {
        const found = nextConnections.find((c) => c.id === activeConnection.id);
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
    const migrate = async () => {
      const storedConnections = localStorage.getItem("connections");
      if (storedConnections) {
        const parsed = JSON.parse(storedConnections);
        // Migrate old connections: ensure type, and encrypt legacy apiKey
        const migrated = await Promise.all(
          parsed.map(async (c: any) => {
            const withType = {
              ...c,
              type: c.type || ("folders" as CraftConnectionType),
            };
            return migrateLegacyConnection(withType);
          })
        );
        // Persist migrated connections back to storage
        localStorage.setItem("connections", JSON.stringify(migrated));
        _setConnections(migrated);

        const storedActive = localStorage.getItem("activeConnection");
        let nextActive: CraftConnection | null = null;
        if (storedActive) {
          const active = JSON.parse(storedActive);
          nextActive = migrated.find((c: CraftConnection) => c.id === active.id) || null;
        } else {
          nextActive = migrated[0] || null;
        }

        if (nextActive) {
          localStorage.setItem("activeConnection", JSON.stringify(nextActive));
        } else {
          localStorage.removeItem("activeConnection");
        }
        _setActiveConnection(nextActive);
      }
    };
    migrate();
  }, [migrateLegacyConnection]);

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
