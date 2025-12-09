"use client";

import { ChevronsUpDown, Shield, ExternalLink, Info } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavUser() {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={""} alt={"Craft Logo"} />
                <AvatarFallback className="rounded-lg">AC</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  Explore Craft API
                </span>
                <span className="truncate text-xs">100% local</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-lg p-4"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-lg">
                  <AvatarImage src={""} alt={"Craft Logo"} />
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                    AC
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-sm">Explore Craft API</div>
                  <div className="text-xs text-muted-foreground">
                    Explore your Craft workspace
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
                <Shield className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div className="flex-1 text-xs">
                  <div className="font-medium mb-1">100% Local</div>
                  <div className="text-muted-foreground">
                    No data is ever stored on a server.<br></br>Everything runs
                    locally in your browser.
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator />

              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">
                  Created by
                </div>
                <Link
                  href="https://aaronrichter.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:text-foreground transition-colors group"
                >
                  <span className="font-medium">Aaron Richter</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  About this app
                </Link>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
