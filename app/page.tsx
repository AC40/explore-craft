"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCraft } from "@/hooks/use-craft";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CraftConnectionType } from "@/types/craft";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const { connections, setConnections, setActiveConnection, activeConnection } =
    useCraft();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [connectionName, setConnectionName] = useState("");
  const [connectionType, setConnectionType] =
    useState<CraftConnectionType>("folders");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  // Redirect to dashboard if connections exist
  useEffect(() => {
    if (connections.length > 0) {
      if (activeConnection) {
        // Redirect based on connection type
        if (activeConnection.type === "documents") {
          router.push("/view/documents");
        } else if (activeConnection.type === "daily_notes") {
          router.push("/view/tasks/active");
        } else {
          router.push("/view");
        }
      } else {
        router.push("/view");
      }
    }
  }, [connections, activeConnection, router]);

  const handleAddConnection = async () => {
    if (!url) {
      toast.error("URL is required");
      return;
    }

    const checkConnection = async () => {
      const res = await fetch("/api/craft/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiUrl: url,
          apiKey,
          type: connectionType,
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        let errorMessage = "Failed to connect to Craft.";
        if (data.status === 401) {
          errorMessage += " Please check if the API key is correct.";
        }
        if (data.status === 404) {
          errorMessage += " Please check if the URL is correct.";
        }
        if (data.status === 500) {
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

    const encryptRes = await fetch("/api/encrypt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiUrl: url, apiKey }),
    });

    if (!encryptRes.ok) {
      toast.error("Failed to secure your API key. Please try again.");
      return;
    }

    const { blob } = await encryptRes.json();

    let finalConnectionName = connectionName;
    if (!finalConnectionName) {
      const match = url.match(/\/links\/([^\/]+)/);
      finalConnectionName = match?.[1] || new URL(url).hostname;
    }

    const newConnection = {
      id: crypto.randomUUID(),
      name: finalConnectionName,
      url,
      encryptedBlob: blob,
      type: connectionType,
    };

    setConnections([...connections, newConnection]);
    setActiveConnection(newConnection);
    toast.success("Connection added securely");

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
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left side - Hero content */}
            <div className="flex flex-col gap-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Explore Craft
              </h1>
              <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground">
                Get document IDs quickly. A local-first browser application to
                explore your Craft workspace through the Craft API.
              </p>
            </div>

            {/* Right side - Connection form */}
            <div className="w-full">
              <Card className="backdrop-blur-md bg-white/70 border-white/60 shadow-xl">
                <CardHeader>
                  <CardTitle>View your Craft Space</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <Input
                    type="text"
                    placeholder="Connection name (optional, but helpful 😉)"
                    value={connectionName}
                    onChange={(e) => setConnectionName(e.target.value)}
                    className="bg-white/60 backdrop-blur-sm border-white/80"
                  />
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">
                      Connection Type
                    </label>
                    <select
                      value={connectionType}
                      onChange={(e) =>
                        setConnectionType(e.target.value as CraftConnectionType)
                      }
                      className="flex h-10 w-full rounded-md border border-white/80 bg-white/60 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="bg-white/60 backdrop-blur-sm border-white/80"
                  />
                  <div className="relative">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      placeholder="API Key (optional)"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="pr-10 bg-white/60 backdrop-blur-sm border-white/80"
                    />
                    <Button
                      variant="ghost"
                      className="absolute right-0 top-0 bottom-0 h-full hover:bg-white/50"
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
        </div>
      </div>

      <div className="border-t border-white/60 py-4 backdrop-blur-md bg-white/60">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Learn more about this app
          </Link>
        </div>
      </div>
    </div>
  );
}
