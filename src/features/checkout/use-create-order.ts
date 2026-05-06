"use client";

import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/envelope";
import { API_ORDERS_ENDPOINTS } from "@/lib/api/orders";
import { apiUrl } from "@/lib/api/url";
import type { SchemaCreateOrderBody, SchemaOrder } from "@/lib/api/orders";

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (input: SchemaCreateOrderBody): Promise<SchemaOrder> => {
      const idempotencyKey = crypto.randomUUID();
      const res = await fetch(apiUrl(API_ORDERS_ENDPOINTS.ORDERS), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        credentials: "include",
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = typeof data.error === "string" ? data.error : (data.error?.message ?? "Failed to place order");
        throw new ApiError(msg, res.status, data);
      }
      return data.data;
    },
  });
}
