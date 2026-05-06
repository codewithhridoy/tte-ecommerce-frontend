"use client";

import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "@/lib/api/url";
import type { Product } from "./use-products";

async function fetchProduct(idOrSlug: string): Promise<Product> {
  const res = await fetch(apiUrl(`/products/${idOrSlug}`), {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Product not found");
  const json = await res.json();
  return json.data as Product;
}

export function useProduct(idOrSlug: string) {
  return useQuery({
    queryKey: ["product", idOrSlug],
    queryFn: () => fetchProduct(idOrSlug),
    enabled: !!idOrSlug,
  });
}
