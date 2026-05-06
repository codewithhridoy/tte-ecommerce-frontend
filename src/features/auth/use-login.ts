"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/envelope";
import { API_AUTH_ENDPOINTS } from "@/lib/api/auth";
import { apiUrl } from "@/lib/api/url";
import type { SchemaLoginBody, SchemaSessionResponse } from "@/lib/api/auth";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SchemaLoginBody) => {
      const res = await fetch(apiUrl(API_AUTH_ENDPOINTS.AUTH_LOGIN), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = typeof data.error === "string" ? data.error : (data.error?.message ?? "Login failed");
        throw new ApiError(msg, res.status, data);
      }
      return data as SchemaSessionResponse;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });
}
