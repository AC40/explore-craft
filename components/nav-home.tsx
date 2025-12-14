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
import { Home, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function NavHome({ connection }: { connection: CraftConnection }) {
  const pathname = usePathname();
  const isActive = pathname === "/view";

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(connection.url);
    toast.success("API URL copied to clipboard");
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Home</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={isActive}>
            <Link href="/view">
              <Home />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <div className="flex items-center justify-between w-full px-2 py-1.5">
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-medium text-sidebar-foreground/70">
                Connection: {connection.name}
              </span>
              <span className="text-xs text-sidebar-foreground/50 truncate">
                {connection.type}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyUrl}
              className="h-6 w-6 p-0 shrink-0"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

