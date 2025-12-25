"use client";
import { ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  queryOptions,
  // useMutation,
} from "@tanstack/react-query";
const queryClient = new QueryClient();

type QueryProviderProps = {
  children: ReactNode;
};



function getClientSession() {
  return queryOptions({
    queryKey: ["sessionData"],
    queryFn: async () => {
      try {
        const route = `/session`
        const res = await fetch(route, {
          // cache: "no-store"
        })
        if (!res.ok) {
          return null
        }
        return await res.json();
      }
      catch (err) {
        console.log(err)
        throw err
      }
    },
    retry: false,
    // staleTime: Infinity,
  });
}



function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export {
  queryClient,
  QueryProvider,
  getClientSession,

};
