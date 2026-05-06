"use client";

import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./theme-toggle";
import { useCartStore } from "@/stores/cart-store";
import { useSession } from "@/features/auth/use-session";

export function Header() {
  const { itemCount, openDrawer } = useCartStore();
  const { data: user } = useSession();

  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight">
          TTE Store
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
            Products
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative" onClick={openDrawer} aria-label="Cart">
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-4 w-4 justify-center p-0 text-[10px]">
                {itemCount > 99 ? "99+" : itemCount}
              </Badge>
            )}
          </Button>

          {user ? (
            <Button variant="ghost" size="icon" asChild aria-label="Account">
              <Link href="/account">
                <User className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
