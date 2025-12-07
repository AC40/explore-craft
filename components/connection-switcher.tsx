"use client";

import * as React from "react";
import {
  ChevronsUpDown,
  Eye,
  EyeOff,
  Plus,
  ServerIcon,
  Pencil,
  Trash2,
} from "lucide-react";

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
import { CraftConnection, CraftConnectionType } from "@/types/craft";
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
  const [connectionType, setConnectionType] =
    React.useState<CraftConnectionType>("folders");
  const [apiKey, setApiKey] = React.useState("");
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [isAddConnectionDialogOpen, setIsAddConnectionDialogOpen] =
    React.useState(false);
  const [editingConnection, setEditingConnection] =
    React.useState<CraftConnection | null>(null);
  const [isEditConnectionDialogOpen, setIsEditConnectionDialogOpen] =
    React.useState(false);
  const [deletingConnection, setDeletingConnection] =
    React.useState<CraftConnection | null>(null);
  const [isDeleteConnectionDialogOpen, setIsDeleteConnectionDialogOpen] =
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

      // Check different endpoints based on connection type
      let endpoint = "/collections";
      if (connectionType === "documents") {
        endpoint = "/documents";
      } else if (connectionType === "daily_notes") {
        endpoint = "/documents?location=daily_notes";
      }

      const checkConnection = await fetch(url + endpoint, { headers });

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
      {
        id: crypto.randomUUID(),
        name: finalConnectionName,
        url,
        apiKey,
        type: connectionType,
      },
    ]);
    setIsAddConnectionDialogOpen(false);
    setUrl("");
    setConnectionName("");
    setConnectionType("folders");
    setApiKey("");
  };

  const handleEditConnection = (connection: CraftConnection) => {
    setEditingConnection(connection);
    setConnectionName(connection.name);
    setConnectionType(connection.type);
    setUrl(connection.url);
    setApiKey(connection.apiKey || "");
    setIsEditConnectionDialogOpen(true);
  };

  const handleUpdateConnection = async () => {
    if (!editingConnection || !url) {
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

    const updatedConnection: CraftConnection = {
      ...editingConnection,
      name: finalConnectionName,
      url,
      apiKey,
      type: connectionType,
    };

    const updatedConnections = connections.map((c) =>
      c.id === editingConnection.id ? updatedConnection : c
    );

    setConnections(updatedConnections);

    // Update active connection if it's the one being edited
    if (activeConnection?.id === editingConnection.id) {
      setActiveConnection(updatedConnection);
    }

    setIsEditConnectionDialogOpen(false);
    setEditingConnection(null);
    setUrl("");
    setConnectionName("");
    setConnectionType("folders");
    setApiKey("");
  };

  const handleDeleteConnection = (connection: CraftConnection) => {
    setDeletingConnection(connection);
    setIsDeleteConnectionDialogOpen(true);
  };

  const confirmDeleteConnection = () => {
    if (!deletingConnection) return;

    const updatedConnections = connections.filter(
      (c) => c.id !== deletingConnection.id
    );

    setConnections(updatedConnections);

    // If deleting the active connection, set a new active connection
    if (activeConnection?.id === deletingConnection.id) {
      const newActiveConnection =
        updatedConnections.length > 0 ? updatedConnections[0] : null;
      setActiveConnection(newActiveConnection);
    }

    toast.success("Connection deleted");
    setIsDeleteConnectionDialogOpen(false);
    setDeletingConnection(null);
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
                className="gap-2 p-2 group"
                onSelect={(e) => {
                  e.preventDefault();
                  setActiveConnection(connection);
                }}
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <ServerIcon className="size-4 shrink-0" />
                </div>
                <div className="flex-1">
                  {connection.name ?? connection.url}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    className="h-6 w-6 flex items-center justify-center rounded hover:bg-accent"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleEditConnection(connection);
                    }}
                    title="Edit connection"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    className="h-6 w-6 flex items-center justify-center rounded hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleDeleteConnection(connection);
                    }}
                    title="Delete connection"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
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
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Connection Type</label>
              <select
                value={connectionType}
                onChange={(e) =>
                  setConnectionType(e.target.value as CraftConnectionType)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="folders">Folders</option>
                <option value="documents">Documents Only</option>
                <option value="daily_notes">Daily Notes</option>
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
            <Button onClick={handleAddConnection}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditConnectionDialogOpen}
        onOpenChange={(open) => {
          setIsEditConnectionDialogOpen(open);
          if (!open) {
            setEditingConnection(null);
            setUrl("");
            setConnectionName("");
            setConnectionType("folders");
            setApiKey("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit connection</DialogTitle>
          </DialogHeader>
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
                <option value="folders">Folders</option>
                <option value="documents">Documents Only</option>
                <option value="daily_notes">Daily Notes</option>
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
            <Button onClick={handleUpdateConnection}>Update</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteConnectionDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteConnectionDialogOpen(open);
          if (!open) {
            setDeletingConnection(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete connection</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete "
              {deletingConnection?.name ?? deletingConnection?.url}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteConnectionDialogOpen(false);
                  setDeletingConnection(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteConnection}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarMenu>
  );
}
