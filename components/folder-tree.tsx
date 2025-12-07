"use client";

import Link from "next/link";
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
import { useFolderExpansion } from "@/hooks/use-folder-expansion";

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
        <Link href={item.url}>
          <File />
          <span>{item.title}</span>
        </Link>
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
  const { isExpanded, setExpanded } = useFolderExpansion();
  const defaultOpen = folder.name === "components" || folder.name === "ui";
  const isOpen = isExpanded(folder.id, defaultOpen);

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible"
        open={isOpen}
        onOpenChange={(open) => setExpanded(folder.id, open)}
      >
        <SidebarMenuButton tooltip={folder.name} asChild>
          <Link href={`/view/folder/${folder.id}`}>
            <span>{folder.name}</span>
          </Link>
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
              <SidebarMenuSub className="pr-0 mr-0">
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
