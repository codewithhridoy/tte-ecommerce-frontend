"use client";

import { Loader2 } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { useProducts } from "@/features/products/use-products";

export default function AdminProductsPage() {
  const { data, isLoading } = useProducts({ limit: 50 });
  const products = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Products</h1>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
