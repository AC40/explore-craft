"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useCraft } from "@/hooks/use-craft";
import { useQuery } from "@tanstack/react-query";
import { craftAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { use } from "react";
import { CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { findFolder } from "@/lib/utils";
import { AppFooter } from "@/components/app-footer";
import { ApiInfo } from "@/components/api-info";
import Link from "next/link";

export default function FolderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { activeConnection } = useCraft();
  const router = useRouter();
  const { id } = use(params);

  const { data: folder, isLoading } = useQuery({
    queryKey: [activeConnection?.id, "folders", id],
    queryFn: async () => {
      if (!activeConnection) return null;
      const folders = await craftAPI.getFolders(activeConnection);
      return findFolder(folders, id);
    },
    enabled: !!activeConnection?.id && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  console.log(folder);

  const { data: documents } = useQuery({
    queryKey: [activeConnection?.id, "documents", id],
    queryFn: () => {
      if (!activeConnection) return [];
      return craftAPI.getDocuments(activeConnection, undefined, id);
    },
    enabled: !!activeConnection?.id && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
  console.log(documents);

  useEffect(() => {
    if (!activeConnection) {
      router.push("/view");
    }
  }, [activeConnection, router]);

  if (!activeConnection) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/view">Folders</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {isLoading ? "Loading..." : folder?.name || "Folder"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">Loading folder...</p>
            </div>
          ) : folder ? (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h1 className="text-2xl font-semibold">{folder.name}</h1>
                  <div className="bg-primary/10 rounded-lg p-4">
                    <p className="flex items-center gap-2">
                      ID: {folder.id}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toast.success("Folder ID copied");
                        navigator.clipboard.writeText(folder.id);
                      }}
                    >
                      <CopyIcon className="w-4 h-4" />
                    </Button>
                    </p>
                    {documents && documents.length > 0 && (
                      <p className="">
                        {documents.length} document
                        {documents.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
                <ApiInfo
                  connection={activeConnection}
                  endpoint="documents"
                  description="Fetch documents in this folder"
                  queryParams={{ folderId: folder.id }}
                />
              </div>
              <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                {documents?.map((document) => (
                  <div key={document.id} className="border rounded-lg p-4">
                    <div className="pb-0">
                      <div className="flex justify-between">
                        <strong>
                          <Link
                            href={`/view/document/${document.id}`}
                            className="hover:underline"
                          >
                            {document.title}
                          </Link>
                        </strong>
                      </div>
                    </div>
                    <div>
                      <p className="flex items-center gap-2">
                        {document.id}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            toast.success("Document ID copied");
                            navigator.clipboard.writeText(document.id);
                          }}
                        >
                          <CopyIcon className="w-4 h-4" />
                        </Button>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {documents && documents.length === 0 && (
                <div className="flex items-center justify-center p-8">
                  <p className="text-muted-foreground">
                    No documents in this folder
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">Folder not found</p>
            </div>
          )}
        </div>
        <AppFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
