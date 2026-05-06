"use client";

import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/api/auth";
import type { SchemaLoginBody, SchemaLoginPendingResponse } from "@/lib/api/auth";

export function useLogin() {
  return useMutation({
    mutationFn: async (input: SchemaLoginBody) => {
      const data = await login({ body: input });
      return data as SchemaLoginPendingResponse;
    },
  });
}
