"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  CopyIcon,
  Folder,
  File,
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
import { isSpecialFolder } from "@/lib/folders";
import { useQuery } from "@tanstack/react-query";
import { craftAPI } from "@/lib/api";

interface NavFolderItemProps {
  folder: CraftFolder;
  connection: CraftConnection;
}

export function NavFolderItem({ folder, connection }: NavFolderItemProps) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const { isExpanded, setExpanded } = useFolderExpansion();
  const isOpen = isExpanded(folder.id, true);
  const isActive = pathname === `/view/folder/${folder.id}` || 
                   (pathname.startsWith("/view/folder/") && pathname.includes(folder.id));

  // Fetch documents for special folders only for space-wide connections AND when expanded
  const { data: documents, isLoading: documentsLoading } = useQuery({
    queryKey: [connection.id, "folder-documents", folder.id],
    queryFn: () => {
      // Map folder names/IDs to proper location values
      const folderIdToLocation: Record<string, "unsorted" | "trash" | "templates" | "daily_notes"> = {
        "unsorted": "unsorted",
        "trash": "trash", 
        "Recently Deleted": "trash",
        "templates": "templates",
        "daily_notes": "daily_notes",
        "Daily Notes": "daily_notes"
      };

      const location = folderIdToLocation[folder.id] || folderIdToLocation[folder.name];
      
      if (location) {
        // For special folders, use location parameter
        return craftAPI.getDocuments(connection, location);
      } else {
        // For regular folders, use folderId parameter
        return craftAPI.getDocuments(connection, undefined, folder.id);
      }
    },
    enabled: !!connection.id && 
             !!folder.id && 
             connection.type === "folders" && 
             isOpen, // Only fetch when expanded
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Determine if folder can be expanded
  const folderIdToLocation: Record<string, "unsorted" | "trash" | "templates" | "daily_notes"> = {
    "unsorted": "unsorted",
    "trash": "trash", 
    "Recently Deleted": "trash",
    "templates": "templates",
    "daily_notes": "daily_notes",
    "Daily Notes": "daily_notes"
  };
  
  const isSpecialCraftFolder = !!(folderIdToLocation[folder.id] || folderIdToLocation[folder.name]);
  const hasSubFolders = folder.folders && folder.folders.length > 0;
  const hasDocuments = connection.type === "folders" && documents && documents.length > 0;
  const mightHaveDocuments = connection.type === "folders" && isSpecialCraftFolder && !isOpen; // Show chevron for unexpanded special folders
  
  const hasSubItems = hasSubFolders || hasDocuments || mightHaveDocuments;

  return (
    <Collapsible
      asChild
      open={isOpen}
      onOpenChange={(open) => setExpanded(folder.id, open)}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <SidebarMenuButton tooltip={folder.name} asChild isActive={isActive}>
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
          {hasSubItems && (
            <CollapsibleTrigger asChild>
              <SidebarMenuAction className="relative top-0 right-0 data-[state=open]:rotate-90">
                <ChevronRight className="transition-transform duration-200" />
                <span className="sr-only">Toggle</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
          )}
        </div>
        {hasSubItems && (
          <CollapsibleContent>
            <SidebarMenuSub className="pr-0 mr-0">
              {/* Show loading state for documents when fetching */}
              {connection.type === "folders" && isSpecialCraftFolder && documentsLoading && (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <File />
                    <span>Loading documents...</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {/* Render documents first (only for space-wide connections) */}
              {connection.type === "folders" && documents?.map((document) => (
                <SidebarMenuItem key={document.id}>
                  <SidebarMenuButton 
                    tooltip={document.title} 
                    asChild 
                    isActive={pathname === `/view/document/${document.id}`}
                  >
                    <Link href={`/view/document/${document.id}`}>
                      <File />
                      <span>{document.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* Then render subfolders */}
              {folder.folders?.map((subFolder) => (
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
