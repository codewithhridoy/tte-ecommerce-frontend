"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyOtp } from "@/lib/api/auth";
import type { SchemaVerifyOtpBody, SchemaVerifyOtpResponse } from "@/lib/api/auth";

export function useVerifyOtp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SchemaVerifyOtpBody) => {
      const data = await verifyOtp({ body: input });
      return data as SchemaVerifyOtpResponse;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });
}
