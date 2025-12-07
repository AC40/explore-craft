"use client";

import * as React from "react";
import { ChevronsUpDown, Eye, EyeOff, Plus, ServerIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { CraftConnection } from "@/types/craft";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useCraft } from "@/hooks/use-craft";
import { toast } from "sonner";

export function ConnectionSwitcher({
  connections,
}: {
  connections: CraftConnection[];
}) {
  const { setConnections, activeConnection, setActiveConnection } = useCraft();
  const { isMobile } = useSidebar();
  const [url, setUrl] = React.useState("");
  const [connectionName, setConnectionName] = React.useState("");
  const [apiKey, setApiKey] = React.useState("");
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [isAddConnectionDialogOpen, setIsAddConnectionDialogOpen] =
    React.useState(false);
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
          errorMessage += "Please check if the API key is correct.";
        }
        if (checkConnection.status === 404) {
          errorMessage += "Please check if the URL is correct.";
        }
        if (checkConnection.status === 500) {
          errorMessage += "Internal server error.";
        }

        if (!apiKey) {
          errorMessage += "Did you maybe forget to add the API key?";
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
    setConnections([
      ...connections,
      { id: crypto.randomUUID(), name: finalConnectionName, url, apiKey },
    ]);
    setIsAddConnectionDialogOpen(false);
    setUrl("");
    setConnectionName("");
    setApiKey("");
  };

  if (!activeConnection) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <ServerIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeConnection.name ?? activeConnection.url}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Connections
            </DropdownMenuLabel>
            {connections.map((connection, index) => (
              <DropdownMenuItem
                key={connection.id}
                onClick={() => setActiveConnection(connection)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <ServerIcon className="size-4 shrink-0" />
                </div>
                {connection.name ?? connection.url}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => {
                setIsAddConnectionDialogOpen(true);
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add connection
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <Dialog
        open={isAddConnectionDialogOpen}
        onOpenChange={setIsAddConnectionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add connection</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Connection name (optional, but helpful 😉)"
              required
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
            <Button onClick={handleAddConnection}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarMenu>
  );
}
