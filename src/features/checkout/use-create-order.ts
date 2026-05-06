"use client";

import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/lib/api/orders";
import type { SchemaCreateOrderBody, SchemaOrder } from "@/lib/api/orders";

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (input: SchemaCreateOrderBody): Promise<SchemaOrder> => {
      const idempotencyKey = crypto.randomUUID();
      const data = await createOrder({
        body: input,
        params: { header: { "idempotency-key": idempotencyKey } },
      });
      if (!data) throw new Error("Failed to place order");
      return data.data;
    },
  });
}
