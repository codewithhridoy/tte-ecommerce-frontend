"use client";

import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/lib/api/products";
import type { Product } from "./use-products";

async function fetchProduct(idOrSlug: string): Promise<Product> {
  const json = await getProduct({ params: { path: { idOrSlug } } });
  if (!json) throw new Error("Product not found");
  return json.data as Product;
}

export function useProduct(idOrSlug: string) {
  return useQuery({
    queryKey: ["product", idOrSlug],
    queryFn: () => fetchProduct(idOrSlug),
    enabled: !!idOrSlug,
  });
}
