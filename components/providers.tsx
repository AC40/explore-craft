"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { CraftProvider } from "@/hooks/use-craft";
import { Toaster } from "@/components/ui/sonner";
import { persistQueryClient } from "@/lib/persist-query-client";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 24 * 60 * 60 * 1000, // 24 hours (formerly cacheTime)
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 1,
          },
        },
      })
  );

  useEffect(() => {
    const cleanup = persistQueryClient(queryClient);
    return cleanup;
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <CraftProvider>
        <Toaster />
        {children}
      </CraftProvider>
    </QueryClientProvider>
  );
}
