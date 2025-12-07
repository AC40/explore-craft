"use client";

import Link from "next/link";
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
      <Link href={document.id}>
        <File />
        <span>{document.title}</span>
      </Link>
    </SidebarMenuButton>
  );
}
