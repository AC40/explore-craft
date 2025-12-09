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
import { isSpecialFolder } from "@/lib/folders";

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
        <SidebarGroupLabel>User folders</SidebarGroupLabel>
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
      <>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Craft folders</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton disabled className="text-destructive">
                Error loading folders
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>User folders</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton disabled className="text-destructive">
                Error loading folders
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </>
    );
  }

  const specialFolders = folders?.filter((folder) => isSpecialFolder(folder.id)) || [];
  const regularFolders = folders?.filter((folder) => !isSpecialFolder(folder.id)) || [];

  return (
    <>
      {specialFolders.length > 0 && (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Craft folders</SidebarGroupLabel>
          <SidebarMenu>
            {specialFolders.map((folder) => (
              <NavFolderItem
                key={folder.id}
                folder={folder}
                connection={connection}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      )}
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>User folders</SidebarGroupLabel>
        <SidebarMenu>
          {regularFolders.map((folder) => (
            <NavFolderItem
              key={folder.id}
              folder={folder}
              connection={connection}
            />
          ))}
          {regularFolders.length === 0 && (
            <SidebarMenuItem>
              <SidebarMenuButton disabled className="text-sidebar-foreground/70">
                No folders
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
