"use client";

import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/envelope";
import { apiUrl } from "@/lib/api/url";

interface CreateOrderInput {
  cartId: string;
  shippingAddress: Record<string, string>;
  billingAddress?: Record<string, string>;
  taxMinor?: number;
  shippingMinor?: number;
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      const idempotencyKey = crypto.randomUUID();
      const res = await fetch(apiUrl("/orders"), {
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
