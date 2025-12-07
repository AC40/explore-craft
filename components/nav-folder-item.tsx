"use client";

import {
  ChevronRight,
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

interface NavFolderItemProps {
  folder: CraftFolder;
  connection: CraftConnection;
}

export function NavFolderItem({ folder, connection }: NavFolderItemProps) {
  const { isMobile } = useSidebar();

  return (
    <Collapsible asChild defaultOpen={true} className="group/collapsible">
      <SidebarMenuItem>
        <SidebarMenuButton tooltip={folder.name} asChild>
          <a href={`/folders/${folder.id}`}>
            <Folder />
            <span>{folder.name}</span>
          </a>
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
              <DropdownMenuItem>
                <Folder className="text-muted-foreground" />
                <span>View Folder</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Forward className="text-muted-foreground" />
                <span>Share Folder</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Trash2 className="text-muted-foreground" />
                <span>Delete Folder</span>
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
            <SidebarMenuSub>
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
