"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiUrl } from "@/lib/api/url";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(apiUrl("/auth/logout"), {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
