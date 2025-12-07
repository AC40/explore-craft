"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCraft } from "@/hooks/use-craft";
import { Eye, EyeOff } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const { connections, setConnections } = useCraft();
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const handleAddConnection = () => {
    setConnections([...connections, { id: crypto.randomUUID(), url, apiKey }]);
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
              type="url"
              placeholder="https://your-craft-space.com"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <div className="relative">
              <Input
                type={showApiKey ? "text" : "password"}
                placeholder="API Key"
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
