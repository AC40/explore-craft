"use client";

import { ChevronRight, Folder, File } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CraftFolder, CraftDocument, CraftConnection } from "@/types/craft";
import { craftAPI } from "@/lib/api";
import { isFolder } from "@/lib/folders";

interface FolderTreeProps {
  connection: CraftConnection;
  item: CraftFolder | CraftDocument;
}

export function FolderTree({ connection, item }: FolderTreeProps) {
  if (!item) {
    return null;
  }

  if (!isFolder(item)) {
    return (
      <SidebarMenuButton asChild>
        <a href={item.url}>
          <File />
          <span>{item.title}</span>
        </a>
      </SidebarMenuButton>
    );
  }

  return <FolderTreeItem connection={connection} folder={item} />;
}

interface FolderTreeItemProps {
  connection: CraftConnection;
  folder: CraftFolder;
}

function FolderTreeItem({ connection, folder }: FolderTreeItemProps) {
  const defaultOpen = folder.name === "components" || folder.name === "ui";

  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible" defaultOpen={defaultOpen}>
        <SidebarMenuButton tooltip={folder.name} asChild>
          <a href={`/folders/${folder.id}`}>
            <span>{folder.name}</span>
          </a>
        </SidebarMenuButton>

        {folder.folders.length > 0 && (
          <>
            <CollapsibleTrigger asChild>
              <SidebarMenuAction className="data-[state=open]:rotate-90">
                <ChevronRight className="transition-transform duration-200 " />
                <span className="sr-only">Toggle</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {folder.folders.map((subFolder) => (
                  <FolderTree
                    key={subFolder.id}
                    connection={connection}
                    item={subFolder}
                  />
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </>
        )}
      </Collapsible>
    </SidebarMenuItem>
  );
}
