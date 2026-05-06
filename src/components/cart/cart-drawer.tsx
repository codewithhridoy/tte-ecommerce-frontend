"use client";

import { ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import Link from "next/link";

export function CartDrawer() {
  const { drawerOpen, closeDrawer, itemCount } = useCartStore();

  return (
    <Sheet open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Cart {itemCount > 0 && `(${itemCount})`}
          </SheetTitle>
        </SheetHeader>
        <Separator />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          {itemCount === 0 ? (
            <div className="text-muted-foreground text-center">
              <ShoppingCart className="mx-auto mb-2 h-12 w-12 opacity-30" />
              <p className="text-sm">Your cart is empty.</p>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">{itemCount} item(s) in cart</p>
          )}
        </div>
        <Separator />
        <div className="space-y-2 pt-2">
          <Button asChild className="w-full" disabled={itemCount === 0}>
            <Link href="/checkout" onClick={closeDrawer}>
              Checkout
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/cart" onClick={closeDrawer}>
              View Cart
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
