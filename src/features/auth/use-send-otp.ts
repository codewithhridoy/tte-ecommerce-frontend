"use client";

import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/envelope";
import { API_AUTH_ENDPOINTS } from "@/lib/api/auth";
import { apiUrl } from "@/lib/api/url";
import type { SchemaSendOtpBody, SchemaSendOtpResponse } from "@/lib/api/auth";

export function useSendOtp() {
  return useMutation({
    mutationFn: async (input: SchemaSendOtpBody) => {
      const res = await fetch(apiUrl(API_AUTH_ENDPOINTS.AUTH_OTP_SEND), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });
      const data = (await res.json().catch(() => null)) as SchemaSendOtpResponse | { error?: unknown } | null;
      if (!res.ok) {
        const error = data && "error" in data ? data.error : undefined;
        const msg =
          typeof error === "string"
            ? error
            : typeof error === "object" && error && "message" in error
              ? String(error.message)
              : "Failed to send verification code";
        throw new ApiError(msg, res.status, data);
      }
      return data as SchemaSendOtpResponse;
    },
  });
}
