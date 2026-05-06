"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/lib/api/auth";
import type { SchemaLoginBody, SchemaSessionResponse } from "@/lib/api/auth";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SchemaLoginBody) => {
      const data = await login({ body: input });
      return data as SchemaSessionResponse;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });
}
