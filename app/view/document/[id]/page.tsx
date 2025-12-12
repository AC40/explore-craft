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
import { useEffect, useState } from "react";
import { use } from "react";
import { CopyIcon, ArrowLeft, Code2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AppFooter } from "@/components/app-footer";
import { ApiInfo } from "@/components/api-info";
import Link from "next/link";
import { CraftBlock } from "@/types/craft";

export default function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { activeConnection } = useCraft();
  const router = useRouter();
  const { id } = use(params);
  const [viewMode, setViewMode] = useState<"json" | "blocks">("blocks");

  const { data: blocks, isLoading, error } = useQuery({
    queryKey: [activeConnection?.id, "blocks", id],
    queryFn: async () => {
      if (!activeConnection) return null;
      return craftAPI.getBlocks(activeConnection, id);
    },
    enabled: !!activeConnection?.id && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  useEffect(() => {
    if (!activeConnection) {
      router.push("/view");
    }
  }, [activeConnection, router]);

  if (!activeConnection) {
    return null;
  }

  const jsonString = blocks ? JSON.stringify(blocks, null, 2) : "";
  
  // Extract content array from blocks data
  const contentBlocks: CraftBlock[] = blocks?.content && Array.isArray(blocks.content)
    ? blocks.content.filter(
        (block: unknown): block is CraftBlock =>
          typeof block === "object" &&
          block !== null &&
          "id" in block &&
          "type" in block &&
          "markdown" in block
      )
    : [];

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
                  <BreadcrumbLink href="/view/documents">Documents</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {isLoading ? "Loading..." : "Document Details"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">Loading document blocks...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-destructive">
                Failed to load document blocks
              </p>
            </div>
          ) : blocks ? (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h1 className="text-2xl font-semibold">Document Blocks</h1>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        Document ID: {id}
                      </p>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          toast.success("Document ID copied");
                          navigator.clipboard.writeText(id);
                        }}
                      >
                        <CopyIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href="/view/documents">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Documents
                    </Link>
                  </Button>
                </div>
                <ApiInfo
                  connection={activeConnection}
                  endpoint="blocks"
                  description="Fetch blocks for this document"
                  queryParams={{ id }}
                />
              </div>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-2 flex items-center justify-between">
                  <div className="flex gap-1">
                    <Button
                      variant={viewMode === "blocks" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("blocks")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Blocks
                    </Button>
                    <Button
                      variant={viewMode === "json" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("json")}
                    >
                      <Code2 className="h-4 w-4 mr-2" />
                      JSON
                    </Button>
                  </div>
                  {viewMode === "json" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        toast.success("JSON copied");
                        navigator.clipboard.writeText(jsonString);
                      }}
                    >
                      <CopyIcon className="w-4 h-4 mr-2" />
                      Copy JSON
                    </Button>
                  )}
                </div>
                {viewMode === "json" ? (
                  <pre className="p-4 overflow-x-auto bg-background text-sm">
                    <code>{jsonString}</code>
                  </pre>
                ) : (
                  <div className="p-4 bg-background space-y-4">
                    {contentBlocks.length > 0 ? (
                      contentBlocks.map((block, index) => (
                        <div
                          key={block.id || index}
                          className="border rounded-lg p-4 space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-muted-foreground uppercase">
                                  {block.type}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  ID: {block.id}
                                </span>
                              </div>
                              <div className="prose prose-sm max-w-none">
                                <pre className="whitespace-pre-wrap font-sans text-sm bg-muted p-3 rounded">
                                  {block.markdown}
                                </pre>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                toast.success("Block ID copied");
                                navigator.clipboard.writeText(block.id);
                              }}
                            >
                              <CopyIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center p-8">
                        <p className="text-muted-foreground">
                          No blocks found. The response may not have a content array, or blocks may not have the expected structure.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
        <AppFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}

