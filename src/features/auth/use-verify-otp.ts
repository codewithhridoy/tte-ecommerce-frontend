"use client";

import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/envelope";
import { apiUrl } from "@/lib/api/url";
import type { SchemaVerifyOtpBody, SchemaVerifyOtpResponse } from "@/lib/api/schema.d.ts";

export function useVerifyOtp() {
  return useMutation({
    mutationFn: async (input: SchemaVerifyOtpBody) => {
      const res = await fetch(apiUrl("/auth/otp/verify"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });
      const data = (await res.json().catch(() => null)) as SchemaVerifyOtpResponse | { error?: unknown } | null;
      if (!res.ok) {
        const error = data && "error" in data ? data.error : undefined;
        const msg =
          typeof error === "string"
            ? error
            : typeof error === "object" && error && "message" in error
              ? String(error.message)
              : "Invalid or expired verification code";
        throw new ApiError(msg, res.status, data);
      }
      return data as SchemaVerifyOtpResponse;
    },
  });
}
