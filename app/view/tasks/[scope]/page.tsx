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
import { AppFooter } from "@/components/app-footer";
import { ApiInfo } from "@/components/api-info";

const scopeLabels: Record<string, string> = {
  active: "Active",
  upcoming: "Upcoming",
  inbox: "Inbox",
  logbook: "Logbook",
};

export default function TasksPage({
  params,
}: {
  params: Promise<{ scope: string }>;
}) {
  const { activeConnection } = useCraft();
  const router = useRouter();
  const { scope } = use(params);

  const { data: tasks, isLoading } = useQuery({
    queryKey: [activeConnection?.id, "tasks", scope],
    queryFn: async () => {
      if (!activeConnection) return [];
      if (
        scope !== "active" &&
        scope !== "upcoming" &&
        scope !== "inbox" &&
        scope !== "logbook"
      ) {
        return [];
      }
      return craftAPI.getTasks(activeConnection, scope);
    },
    enabled:
      !!activeConnection?.id &&
      !!scope &&
      (scope === "active" ||
        scope === "upcoming" ||
        scope === "inbox" ||
        scope === "logbook"),
    staleTime: 5 * 60 * 1000, // 5 minutes
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

  const scopeLabel = scopeLabels[scope] || scope;

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
                  <BreadcrumbLink href="/view">Tasks</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{scopeLabel}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">Loading tasks...</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h1 className="text-2xl font-semibold">{scopeLabel} Tasks</h1>
                  {tasks && tasks.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {tasks.length} task{tasks.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
                <ApiInfo
                  connection={activeConnection}
                  endpoint="tasks"
                  description={`Fetch ${scopeLabel.toLowerCase()} tasks`}
                  queryParams={{ scope }}
                />
              </div>
              <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                {tasks?.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4">
                    <div className="pb-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <p className="font-medium">{task.markdown}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="capitalize">{task.state}</span>
                            {task.scheduleDate && (
                              <span>Scheduled: {task.scheduleDate}</span>
                            )}
                            {task.deadlineDate && (
                              <span>Deadline: {task.deadlineDate}</span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            toast.success("Task ID copied");
                            navigator.clipboard.writeText(task.id);
                          }}
                        >
                          <CopyIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        {task.id}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {tasks && tasks.length === 0 && (
                <div className="flex items-center justify-center p-8">
                  <p className="text-muted-foreground">
                    No tasks in {scopeLabel.toLowerCase()}
                  </p>
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
