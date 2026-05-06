"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";
import { ApiError } from "@/lib/api/envelope";
import { addCartItem } from "@/lib/api/cart";
import type { SchemaAddToCartBody, SchemaCartResponse } from "@/lib/api/cart";

type AddToCartInput = Pick<SchemaAddToCartBody, "variantId" | "quantity">;

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { cartId, setCartId, setItemCount, openDrawer } = useCartStore();

  return useMutation({
    mutationFn: async (input: AddToCartInput) => {
      const body: SchemaAddToCartBody = { ...input };
      if (!cartId) {
        const guestToken = crypto.randomUUID();
        body.guestToken = guestToken;
        document.cookie = `tte_guest_token=${guestToken}; path=/; max-age=86400`;
      }

      const data = await addCartItem({ body });
      return data as SchemaCartResponse;
    },
    onSuccess: (data) => {
      setCartId(data.data.id);
      setItemCount(data.data.items.reduce((acc, i) => acc + i.quantity, 0));
      openDrawer();
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart");
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to add to cart");
    },
  });
}
