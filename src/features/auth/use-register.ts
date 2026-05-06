"use client";

import { useMutation } from "@tanstack/react-query";
import { register } from "@/lib/api/auth";
import type { SchemaRegisterBody, SchemaRegisterResponse } from "@/lib/api/auth";

export function useRegister() {
  return useMutation({
    mutationFn: async (input: SchemaRegisterBody) => {
      const data = await register({ body: input });
      return data as SchemaRegisterResponse;
    },
  });
}
