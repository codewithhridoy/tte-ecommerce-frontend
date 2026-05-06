"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeLogin } from "@/lib/api/auth";
import type { SchemaCompleteLoginBody, SchemaSessionResponse } from "@/lib/api/auth";

export function useCompleteLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SchemaCompleteLoginBody) => {
      const data = await completeLogin({ body: input });
      return data as SchemaSessionResponse;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });
}
