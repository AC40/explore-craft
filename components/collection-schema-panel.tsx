"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { craftAPI } from "@/lib/api";
import { CraftConnection, CraftCollectionSchema } from "@/types/craft";
import { toast } from "sonner";
import { XIcon } from "lucide-react";

interface CollectionSchemaPanelProps {
  connection: CraftConnection;
  defaultCollectionId?: string;
  showInput?: boolean;
  panelTitle?: string;
  onClose?: () => void;
  onSchemaFetched?: (
    collectionId: string,
    schema: CraftCollectionSchema
  ) => void;
}

export function CollectionSchemaPanel({
  connection,
  defaultCollectionId,
  onClose,
  showInput = true,
  panelTitle = "Collection Schema",
  onSchemaFetched,
}: CollectionSchemaPanelProps) {
  const [collectionId, setCollectionId] = useState(defaultCollectionId ?? "");
  const [schema, setSchema] = useState<CraftCollectionSchema | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allowManualTrigger = showInput;

  const fetchSchema = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      setSchema(null);
      try {
        const result = await craftAPI.getCollectionSchema(connection, id);
        setSchema(result);
        onSchemaFetched?.(id, result);
      } catch (fetchError) {
        const message =
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load schema";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [connection, onSchemaFetched]
  );

  const handleManualFetch = useCallback(() => {
    const trimmedId = collectionId.trim();
    if (!trimmedId) {
      toast.error("Enter a collection ID");
      return;
    }
    fetchSchema(trimmedId);
  }, [collectionId, fetchSchema]);

  useEffect(() => {
    if (defaultCollectionId) {
      setCollectionId(defaultCollectionId);
      fetchSchema(defaultCollectionId);
    } else {
      setSchema(null);
      setError(null);
    }
  }, [defaultCollectionId, fetchSchema]);

  const renderedSchema = useMemo(() => {
    if (!schema) return null;
    return JSON.stringify(schema, null, 2);
  }, [schema]);

  return (
    <div className="border rounded-xl p-4 bg-white/70 backdrop-blur-md shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-semibold flex items-center gap-2 w-full justify-between">
          {panelTitle}
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XIcon className="w-4 h-4" />
            Close schema
          </Button>
        </h3>
        {isLoading && (
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Loading…
          </span>
        )}
      </div>

      {allowManualTrigger ? (
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Input
            placeholder="Collection ID (e.g. col-123)"
            value={collectionId}
            onChange={(event) => setCollectionId(event.target.value)}
            className="flex-1 bg-white/60 backdrop-blur-sm"
          />
          <Button
            onClick={handleManualFetch}
            disabled={isLoading}
            className="mt-2 md:mt-0"
          >
            {isLoading ? "Loading..." : "View Schema"}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Showing schema for <strong>{collectionId}</strong>
        </p>
      )}

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {renderedSchema && (
        <div className="overflow-auto max-h-80 bg-muted/50 rounded-lg border border-white/40">
          <pre className="text-xs leading-relaxed p-3 whitespace-pre-wrap wrap-break-word min-w-0">
            {renderedSchema}
          </pre>
        </div>
      )}
      {!renderedSchema && !error && !isLoading && (
        <p className="text-sm text-muted-foreground">No schema loaded yet.</p>
      )}
    </div>
  );
}
