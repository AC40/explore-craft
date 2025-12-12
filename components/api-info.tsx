"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyIcon, Code2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { CraftConnection } from "@/types/craft";
import { useState } from "react";

interface ApiInfoProps {
  connection: CraftConnection;
  endpoint: string;
  method?: string;
  description?: string;
  queryParams?: Record<string, string>;
}

export function ApiInfo({
  connection,
  endpoint,
  method = "GET",
  description,
  queryParams,
}: ApiInfoProps) {
  const [activeTab, setActiveTab] = useState<"url" | "fetch" | "curl">("url");

  const queryString = queryParams
    ? new URLSearchParams(queryParams).toString()
    : "";
  const fullUrl = `${connection.url}/${endpoint}${
    queryString ? `?${queryString}` : ""
  }`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const fetchCode = `fetch("/api/craft/${endpoint}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    blob: "${connection.encryptedBlob}",
    ${queryString ? `// query: ${queryString}` : ""}
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));`;

  const curlCode = `curl -X POST "/api/craft/${endpoint}" \\
  -H "Content-Type: application/json" \\
  -d '{ "blob": "${connection.encryptedBlob}"${
    queryString ? `, "query": "${queryString}"` : ""
  } }'`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">API Endpoint</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant={activeTab === "url" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("url")}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              URL
            </Button>
            <Button
              variant={activeTab === "fetch" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("fetch")}
            >
              <Code2 className="h-4 w-4 mr-1" />
              Fetch
            </Button>
            <Button
              variant={activeTab === "curl" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("curl")}
            >
              <Code2 className="h-4 w-4 mr-1" />
              cURL
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeTab === "url" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm bg-muted px-3 py-2 rounded break-all">
                {fullUrl}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(fullUrl, "URL")}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              <strong>Auth:</strong>
              <div className="mt-1 bg-muted px-2 py-1 rounded">
                Authorization handled server-side. API key never leaves the server.
              </div>
            </div>
          </div>
        )}

        {activeTab === "fetch" && (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <pre className="flex-1 text-xs bg-muted px-3 py-2 rounded overflow-x-auto">
                <code>{fetchCode}</code>
              </pre>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(fetchCode, "Fetch code")}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === "curl" && (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <pre className="flex-1 text-xs bg-muted px-3 py-2 rounded overflow-x-auto">
                <code>{curlCode}</code>
              </pre>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(curlCode, "cURL command")}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
