"use client";

import { useQuery } from "@tanstack/react-query";
import { API_PRODUCTS_ENDPOINTS } from "@/lib/api/products";
import { apiUrl } from "@/lib/api/url";
import type { Product } from "./use-products";

async function fetchProduct(idOrSlug: string): Promise<Product> {
  const res = await fetch(apiUrl(API_PRODUCTS_ENDPOINTS.PRODUCTS_ID_OR_SLUG({ idOrSlug })), {
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
