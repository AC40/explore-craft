"use client";

import Link from "next/link";
import {
  ChevronRight,
  CopyIcon,
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CraftFolder, CraftDocument, CraftConnection } from "@/types/craft";
import { FolderTree } from "./folder-tree";
import { toast } from "sonner";
import { useFolderExpansion } from "@/hooks/use-folder-expansion";

interface NavFolderItemProps {
  folder: CraftFolder;
  connection: CraftConnection;
}

export function NavFolderItem({ folder, connection }: NavFolderItemProps) {
  const { isMobile } = useSidebar();
  const { isExpanded, setExpanded } = useFolderExpansion();
  const isOpen = isExpanded(folder.id, true);

  return (
    <Collapsible
      asChild
      open={isOpen}
      onOpenChange={(open) => setExpanded(folder.id, open)}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <SidebarMenuButton tooltip={folder.name} asChild>
          <Link href={`/view/folder/${folder.id}`}>
            <Folder />
            <span>{folder.name}</span>
          </Link>
        </SidebarMenuButton>
        <div className="absolute top-1.5 right-1 flex items-center gap-0.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction className="relative top-0 right-0" showOnHover>
                <MoreHorizontal />
                <span className="sr-only">More</span>
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-48 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align={isMobile ? "end" : "start"}
            >
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(folder.id);
                  toast.success("Folder ID copied to clipboard");
                }}
              >
                <CopyIcon className="text-muted-foreground" />
                <span>Copy Folder ID</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {folder.folders && folder.folders.length > 0 && (
            <CollapsibleTrigger asChild>
              <SidebarMenuAction className="relative top-0 right-0 data-[state=open]:rotate-90">
                <ChevronRight className="transition-transform duration-200" />
                <span className="sr-only">Toggle</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
          )}
        </div>
        {folder.folders && folder.folders.length > 0 && (
          <CollapsibleContent>
            <SidebarMenuSub className="pr-0 mr-0">
              {folder.folders.map((subFolder) => (
                <FolderTree
                  connection={connection}
                  item={subFolder}
                  key={subFolder.id}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
}
