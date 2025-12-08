"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, ServerIcon, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Button } from "./ui/button";
import { useCraft } from "@/hooks/use-craft";
import { toast } from "sonner";
import { validateConnection, extractConnectionName } from "@/lib/utils";
import { ConnectionForm } from "./connection-form";

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
  const resetForm = () => {
    setUrl("");
    setConnectionName("");
    setConnectionType("folders");
    setApiKey("");
  };

  const handleAddConnection = async () => {
    if (!url) {
      toast.error("URL is required");
      return;
    }

    const validation = await validateConnection(url, apiKey, connectionType);
    if (!validation.success) {
      toast.error(validation.error);
      return;
    }

    const newConnection: CraftConnection = {
      id: crypto.randomUUID(),
      name: extractConnectionName(url, connectionName),
      url,
      apiKey,
      type: connectionType,
    };

    setConnections([...connections, newConnection]);
    setActiveConnection(newConnection);
    setIsAddConnectionDialogOpen(false);
    resetForm();
    toast.success("Connection added");
  };

  const handleEditConnection = (connection: CraftConnection) => {
    setEditingConnection(connection);
    setConnectionName(connection.name);
    setConnectionType(connection.type);
    setUrl(connection.url);
    setApiKey(connection.apiKey || "");
    setIsEditConnectionDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditConnectionDialogOpen(false);
    setEditingConnection(null);
    resetForm();
  };

  const handleUpdateConnection = async () => {
    if (!editingConnection || !url) {
      toast.error("URL is required");
      return;
    }

    const validation = await validateConnection(url, apiKey, connectionType);
    if (!validation.success) {
      toast.error(validation.error);
      return;
    }

    const updatedConnection: CraftConnection = {
      ...editingConnection,
      name: extractConnectionName(url, connectionName),
      url,
      apiKey,
      type: connectionType,
    };

    const updatedConnections = connections.map((c) =>
      c.id === editingConnection.id ? updatedConnection : c
    );

    setConnections(updatedConnections);

    if (activeConnection?.id === editingConnection.id) {
      setActiveConnection(updatedConnection);
    }

    setIsEditConnectionDialogOpen(false);
    setEditingConnection(null);
    resetForm();
    toast.success("Connection updated");
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
              tooltip={
                isMobile
                  ? undefined
                  : activeConnection.name ?? activeConnection.url
              }
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground group-data-[collapsible=icon]:size-6">
                <ServerIcon className="size-4 group-data-[collapsible=icon]:size-3" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">
                  {activeConnection.name ?? activeConnection.url}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
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
        onOpenChange={(open) => {
          setIsAddConnectionDialogOpen(open);
          if (!open) {
            resetForm();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add connection</DialogTitle>
          </DialogHeader>
          <ConnectionForm
            connectionName={connectionName}
            setConnectionName={setConnectionName}
            connectionType={connectionType}
            setConnectionType={setConnectionType}
            url={url}
            setUrl={setUrl}
            apiKey={apiKey}
            setApiKey={setApiKey}
            showApiKey={showApiKey}
            setShowApiKey={setShowApiKey}
            onSubmit={handleAddConnection}
            submitLabel="Add"
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditConnectionDialogOpen}
        onOpenChange={handleCloseEditDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit connection</DialogTitle>
          </DialogHeader>
          <ConnectionForm
            connectionName={connectionName}
            setConnectionName={setConnectionName}
            connectionType={connectionType}
            setConnectionType={setConnectionType}
            url={url}
            setUrl={setUrl}
            apiKey={apiKey}
            setApiKey={setApiKey}
            showApiKey={showApiKey}
            setShowApiKey={setShowApiKey}
            onSubmit={handleUpdateConnection}
            submitLabel="Update"
          />
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
