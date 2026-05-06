import Link from "next/link";
import { Money } from "@/components/common/money";
import type { Product } from "@/features/products/use-products";

interface ProductCardProps {
  product: Product;
}

function cheapestVariant(product: Product) {
  return product.variants
    .filter((v) => v.isActive)
    .sort((a, b) => a.priceMinor - b.priceMinor)[0];
}

export function ProductCard({ product }: ProductCardProps) {
  const variant = cheapestVariant(product);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-card border-border rounded-lg border p-4 transition-shadow hover:shadow-md"
    >
      <div className="bg-muted mb-4 flex aspect-square items-center justify-center rounded-md">
        <span className="text-muted-foreground text-xs">No image</span>
      </div>
      <h3 className="group-hover:text-primary line-clamp-1 font-medium transition-colors">
        {product.title}
      </h3>
      {product.description && (
        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{product.description}</p>
      )}
      {variant && (
        <div className="mt-2 font-semibold">
          <Money amountMinor={variant.priceMinor} currency={variant.currency} />
        </div>
      )}
    </Link>
  );
}
