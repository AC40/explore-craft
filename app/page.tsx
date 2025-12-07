"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCraft } from "@/hooks/use-craft";
import { Eye, EyeOff } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const { connections, setConnections, setActiveConnection } = useCraft();
  const [url, setUrl] = useState("");
  const [connectionName, setConnectionName] = useState("");
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

      const checkConnection = await fetch(url + "/collections", { headers });

      if (!checkConnection.ok) {
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
    };

    setConnections([...connections, newConnection]);
    setActiveConnection(newConnection);
  };

  if (connections.length !== 0) {
    // redirect to /view
    redirect("/view");
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>View you Craft Space</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Connection name (optional, but helpful 😉)"
              value={connectionName}
              onChange={(e) => setConnectionName(e.target.value)}
            />
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
            <Button onClick={handleAddConnection}>View</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
