"use client";

import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";

export function AppFooter() {
  const handleFeatureRequest = () => {
    window.location.href =
      "mailto:contact@aaronrichter.tech?subject=Feature Request";
  };

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFeatureRequest}
          className="gap-2"
        >
          <MessageSquarePlus className="h-4 w-4" />
          <span>Feature Request</span>
        </Button>
      </div>
    </footer>
  );
}
