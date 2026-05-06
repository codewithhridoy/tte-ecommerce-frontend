"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_AUTH_ENDPOINTS } from "@/lib/api/auth";
import { apiUrl } from "@/lib/api/url";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(apiUrl(API_AUTH_ENDPOINTS.AUTH_LOGOUT), {
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
