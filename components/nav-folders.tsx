"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CraftConnection } from "@/types/craft";
import { useEnrichedFolders } from "@/hooks/use-enriched-folders";
import { NavFolderItem } from "./nav-folder-item";
import { craftAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function NavFolders({ connection }: { connection: CraftConnection }) {
  const {
    data: folders,
    isLoading,
    error,
  } = useQuery({
    queryKey: [connection.id, "folders"],
    queryFn: () => craftAPI.getFolders(connection),
    enabled: !!connection.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  if (isLoading) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Folders</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton disabled>Loading...</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  if (error) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Folders</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton disabled className="text-destructive">
              Error loading folders
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Folders</SidebarGroupLabel>
      <SidebarMenu>
        {folders?.map((folder) => (
          <NavFolderItem
            key={folder.id}
            folder={folder}
            connection={connection}
          />
        ))}
        {folders && folders.length === 0 && (
          <SidebarMenuItem>
            <SidebarMenuButton disabled className="text-sidebar-foreground/70">
              No folders
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
