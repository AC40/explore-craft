"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { CraftConnectionType } from "@/types/craft";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface ConnectionFormProps {
  connectionName: string;
  setConnectionName: (value: string) => void;
  connectionType: CraftConnectionType;
  setConnectionType: (value: CraftConnectionType) => void;
  url: string;
  setUrl: (value: string) => void;
  apiKey: string;
  setApiKey: (value: string) => void;
  showApiKey: boolean;
  setShowApiKey: (value: boolean) => void;
  onSubmit: () => void;
  submitLabel: string;
}

export function ConnectionForm({
  connectionName,
  setConnectionName,
  connectionType,
  setConnectionType,
  url,
  setUrl,
  apiKey,
  setApiKey,
  showApiKey,
  setShowApiKey,
  onSubmit,
  submitLabel,
}: ConnectionFormProps) {
  return (
    <div className="flex flex-col gap-2">
      <Input
        type="text"
        placeholder="Connection name (optional, but helpful 😉)"
        required
        value={connectionName}
        onChange={(e) => setConnectionName(e.target.value)}
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Connection Type</label>
        <select
          value={connectionType}
          onChange={(e) =>
            setConnectionType(e.target.value as CraftConnectionType)
          }
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="folders">All Documents (Space)</option>
          <option value="documents">Selected Documents</option>
          <option value="daily_notes">Daily Notes & Tasks</option>
        </select>
      </div>
      <Input
        type="url"
        placeholder="https://connect.craft.do/links/..."
        required
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <div className="relative">
        <Input
          type={showApiKey ? "text" : "password"}
          placeholder="API Key (optional)"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="pr-10"
        />
        <Button
          variant="ghost"
          className="absolute right-0 top-0 bottom-0 h-full"
          size="icon"
          onClick={() => setShowApiKey(!showApiKey)}
        >
          {showApiKey ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </Button>
      </div>
      <Button onClick={onSubmit}>{submitLabel}</Button>
    </div>
  );
}
