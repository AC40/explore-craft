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
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppFooter } from "@/components/app-footer";

export default function Page() {
  const { connections, activeConnection } = useCraft();
  const router = useRouter();

  if (connections.length === 0) {
    redirect("/");
  }

  useEffect(() => {
    if (activeConnection) {
      if (activeConnection.type === "documents") {
        router.push("/view/documents");
      } else if (activeConnection.type === "daily_notes") {
        router.push("/view/tasks/active");
      }
    }
  }, [activeConnection, router]);
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
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 pt-0 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome to the Craft API Explorer
          </h1>
          <p className="text-lg text-muted-foreground">
            Select an item in the sidebar to get started
          </p>
        </div>
        <AppFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
