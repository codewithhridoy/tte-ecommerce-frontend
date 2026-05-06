"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/envelope";
import { API_CART_ENDPOINTS } from "@/lib/api/cart";
import { apiUrl } from "@/lib/api/url";
import type { SchemaApplyCouponBody } from "@/lib/api/cart";

export function useApplyCoupon(cartId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      const body: SchemaApplyCouponBody = { code };
      const res = await fetch(apiUrl(API_CART_ENDPOINTS.CART_CART_ID_COUPON({ cartId })), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = typeof data.error === "string" ? data.error : (data.error?.message ?? "Invalid coupon");
        throw new ApiError(msg, res.status, data);
      }
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Coupon applied");
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Invalid coupon");
    },
  });
}
