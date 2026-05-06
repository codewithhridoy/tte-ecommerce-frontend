"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";

export default function CartPage() {
  const { itemCount, cartId } = useCartStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Your Cart</h1>
      {itemCount === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <ShoppingCart className="text-muted-foreground h-16 w-16 opacity-30" />
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="text-muted-foreground">Add some products to get started.</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl space-y-6">
          <p className="text-muted-foreground">{itemCount} item(s) in cart (ID: {cartId})</p>
          <Button asChild className="w-full">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
