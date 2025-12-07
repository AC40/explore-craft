"use client";

import { File } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { CraftDocument } from "@/types/craft";

interface NavDocumentItemProps {
  document: CraftDocument;
  isActive?: boolean;
}

export function NavDocumentItem({ document, isActive }: NavDocumentItemProps) {
  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      className="data-[active=true]:bg-transparent"
    >
      <a href={document.url}>
        <File />
        <span>{document.title}</span>
      </a>
    </SidebarMenuButton>
  );
}
