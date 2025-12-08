"use client";

import * as React from "react";

import { NavUser } from "@/components/nav-user";
import { ConnectionSwitcher } from "@/components/connection-switcher";
import { NavDocuments } from "@/components/nav-documents";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useCraft } from "@/hooks/use-craft";
import { NavFolders } from "./nav-folders";
import { NavTasks } from "./nav-tasks";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { connections, activeConnection } = useCraft();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ConnectionSwitcher connections={connections} />
      </SidebarHeader>
      <SidebarContent>
        {activeConnection &&
          (activeConnection.type === "folders" ? (
            <NavFolders connection={activeConnection} />
          ) : activeConnection.type === "documents" ? (
            <NavDocuments connection={activeConnection} />
          ) : activeConnection.type === "daily_notes" ? (
            <NavTasks connection={activeConnection} />
          ) : null)}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
