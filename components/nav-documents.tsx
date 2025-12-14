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
import { File } from "lucide-react";

export function NavDocuments({ connection }: { connection: CraftConnection }) {
  const pathname = usePathname();
  const isActive = pathname === "/view/documents" || pathname.startsWith("/view/document/");

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Documents</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={isActive}>
            <Link href="/view/documents">
              <File />
              <span>Documents</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

