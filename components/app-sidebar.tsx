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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

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
            <div className="p-4 text-sm text-muted-foreground">
              Daily Notes coming soon...
            </div>
          ) : null)}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
