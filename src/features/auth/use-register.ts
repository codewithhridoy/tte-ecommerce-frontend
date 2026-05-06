"use client";

import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/envelope";
import { apiUrl } from "@/lib/api/url";
import type { SchemaRegisterResponse } from "@/lib/api/schema.d.ts";

interface RegisterInput {
  email: string;
  password: string;
  fullName?: string;
}

function getErrorMessage(data: unknown): string {
  if (!data || typeof data !== "object" || !("error" in data)) return "Registration failed";

  const error = data.error;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) return String(error.message);

  return "Registration failed";
}

export function useRegister() {
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const res = await fetch(apiUrl("/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });
      const data = (await res.json()) as SchemaRegisterResponse | { error?: unknown };
      if (!res.ok) {
        throw new ApiError(getErrorMessage(data), res.status, data);
      }
      return data as SchemaRegisterResponse;
    },
  });
}
