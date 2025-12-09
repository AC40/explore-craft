"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCraft } from "@/hooks/use-craft";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CraftConnectionType } from "@/types/craft";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const { connections, setConnections, setActiveConnection } = useCraft();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [connectionName, setConnectionName] = useState("");
  const [connectionType, setConnectionType] =
    useState<CraftConnectionType>("folders");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  const handleAddConnection = async () => {
    if (!url) {
      toast.error("URL is required");
      return;
    }

    const checkConnection = async () => {
      const headers = new Headers();
      if (apiKey) {
        headers.set("Authorization", `Bearer ${apiKey}`);
      }

      // Check different endpoints based on connection type
      let endpoint = "/collections";
      if (connectionType === "documents") {
        endpoint = "/documents";
      } else if (connectionType === "daily_notes") {
        endpoint = "/documents?location=daily_notes";
      }

      const checkConnection = await fetch(url + endpoint, { headers });

      // 304 (Not Modified) is a success status
      if (!checkConnection.ok && checkConnection.status !== 304) {
        let errorMessage = "Failed to connect to Craft.";

        if (checkConnection.status === 401) {
          errorMessage += " Please check if the API key is correct.";
        }
        if (checkConnection.status === 404) {
          errorMessage += " Please check if the URL is correct.";
        }
        if (checkConnection.status === 500) {
          errorMessage += " Internal server error.";
        }

        if (!apiKey) {
          errorMessage += " Did you maybe forget to add the API key?";
        }

        toast.error(errorMessage);
        return false;
      }

      return true;
    };

    const success = await checkConnection();
    if (!success) {
      return;
    }

    let finalConnectionName = connectionName;
    if (!finalConnectionName) {
      const match = url.match(/\/links\/([^\/]+)/);
      finalConnectionName = match?.[1] || new URL(url).hostname;
    }

    const newConnection = {
      id: crypto.randomUUID(),
      name: finalConnectionName,
      url,
      apiKey,
      type: connectionType,
    };

    setConnections([...connections, newConnection]);
    setActiveConnection(newConnection);
    toast.success("Connection added successfully");

    // Navigate to the appropriate view based on connection type
    if (connectionType === "documents") {
      router.push("/view/documents");
    } else if (connectionType === "daily_notes") {
      router.push("/view/tasks/active");
    } else {
      router.push("/view");
    }
  };

  // Don't redirect if connections exist - allow access to landing page

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>View your Craft Space</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Input
                type="text"
                placeholder="Connection name (optional, but helpful 😉)"
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
              <Button onClick={handleAddConnection} className="w-full">
                View
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="border-t py-4">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Learn more about this app
          </Link>
        </div>
      </div>
    </div>
  );
}

