"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/envelope";
import { applyCoupon } from "@/lib/api/cart";

export function useApplyCoupon(cartId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      const data = await applyCoupon({ params: { path: { cartId } }, body: { code } });
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
