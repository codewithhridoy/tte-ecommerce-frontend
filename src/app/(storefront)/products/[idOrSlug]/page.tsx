"use client";

import { use, useState } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Money } from "@/components/common/money";
import { EmptyState } from "@/components/common/empty-state";
import { useProduct } from "@/features/products/use-product";
import { useAddToCart } from "@/features/cart/use-add-to-cart";

interface PageProps {
  params: Promise<{ idOrSlug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { idOrSlug } = use(params);
  const { data: product, isLoading, isError } = useProduct(idOrSlug);
  const addToCart = useAddToCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="container mx-auto flex justify-center px-4 py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState title="Product not found" description="This product may have been removed." />
      </div>
    );
  }

  const activeVariants = product.variants.filter((v) => v.isActive);
  const selectedVariant = activeVariants.find((v) => v.id === selectedVariantId) ?? activeVariants[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        <div className="bg-muted flex aspect-square items-center justify-center rounded-lg">
          <span className="text-muted-foreground text-sm">No image</span>
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant={product.status === "active" ? "default" : "secondary"}>
                {product.status}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
            {product.description && (
              <p className="text-muted-foreground mt-2">{product.description}</p>
            )}
          </div>

          {selectedVariant && (
            <div className="text-2xl font-semibold">
              <Money amountMinor={selectedVariant.priceMinor} currency={selectedVariant.currency} />
            </div>
          )}

          {activeVariants.length > 1 && (
            <div>
              <p className="mb-2 text-sm font-medium">Variant</p>
              <div className="flex flex-wrap gap-2">
                {activeVariants.map((v) => (
                  <Button
                    key={v.id}
                    variant={selectedVariant?.id === v.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedVariantId(v.id)}
                  >
                    {v.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Button
            size="lg"
            className="w-full"
            disabled={!selectedVariant || addToCart.isPending}
            onClick={() => {
              if (selectedVariant) {
                addToCart.mutate({ variantId: selectedVariant.id, quantity: 1 });
              }
            }}
          >
            {addToCart.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="mr-2 h-4 w-4" />
            )}
            Add to Cart
          </Button>

          <div className="text-muted-foreground text-xs">SKU: {product.sku}</div>
        </div>
      </div>
    </div>
  );
}
