"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CraftConnection } from "@/types/craft";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare2 } from "lucide-react";

const taskScopes = [
  { value: "active", label: "Active" },
  { value: "upcoming", label: "Upcoming" },
  { value: "inbox", label: "Inbox" },
  { value: "logbook", label: "Logbook" },
] as const;

export function NavTasks({ connection }: { connection: CraftConnection }) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Tasks</SidebarGroupLabel>
      <SidebarMenu>
        {taskScopes.map((scope) => {
          const isActive = pathname === `/view/tasks/${scope.value}`;
          return (
            <SidebarMenuItem key={scope.value}>
              <SidebarMenuButton asChild isActive={isActive}>
                <Link href={`/view/tasks/${scope.value}`}>
                  <CheckSquare2 />
                  <span>{scope.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
