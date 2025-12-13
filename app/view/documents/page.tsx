"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
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
import { CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { AppFooter } from "@/components/app-footer";
import { ApiInfo } from "@/components/api-info";
import { CollectionSchemaPanel } from "@/components/collection-schema-panel";

export default function DocumentsPage() {
  const { activeConnection } = useCraft();
  const router = useRouter();

  const { data: documents, isLoading } = useQuery({
    queryKey: [activeConnection?.id, "documents", "all"],
    queryFn: () => {
      if (!activeConnection) return [];
      return craftAPI.getDocuments(activeConnection);
    },
    enabled: !!activeConnection?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  useEffect(() => {
    if (!activeConnection) {
      router.push("/view");
    } else if (activeConnection.type !== "documents") {
      router.push("/view");
    }
  }, [activeConnection, router]);

  if (!activeConnection || activeConnection.type !== "documents") {
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
                <BreadcrumbItem>
                  <BreadcrumbPage>Documents</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">Loading documents...</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h1 className="text-2xl font-semibold">Documents</h1>
                  {documents && documents.length > 0 && (
                    <div className="bg-primary/10 rounded-lg p-4">
                      <p className="">
                        {documents.length} document
                        {documents.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  )}
                </div>
                <div className="grid gap-4">
                  <ApiInfo
                    connection={activeConnection}
                    endpoint="documents"
                    description="Fetch all selected documents"
                  />
                  <CollectionSchemaPanel connection={activeConnection} />
                </div>
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
                  <p className="text-muted-foreground">No documents found</p>
                </div>
              )}
            </>
          )}
        </div>
        <AppFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
