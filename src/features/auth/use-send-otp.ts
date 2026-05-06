"use client";

import { useMutation } from "@tanstack/react-query";
import { sendOtp } from "@/lib/api/auth";
import type { SchemaSendOtpBody, SchemaSendOtpResponse } from "@/lib/api/auth";

export function useSendOtp() {
  return useMutation({
    mutationFn: async (input: SchemaSendOtpBody) => {
      const data = await sendOtp({ body: input });
      return data as SchemaSendOtpResponse;
    },
  });
}
