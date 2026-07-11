"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function AdminProviders({ children }: { children: React.ReactNode }) {
  // Create the client once per browser session (inside useState so SSR/CSR
  // don't share a client across requests).
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Mock data lives in-memory; avoid surprise refetches wiping
            // optimistic schedule changes on window focus.
            staleTime: Infinity,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
