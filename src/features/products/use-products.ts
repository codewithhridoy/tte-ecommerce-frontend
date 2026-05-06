"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { API_PRODUCTS_ENDPOINTS } from "@/lib/api/products";
import { apiUrl } from "@/lib/api/url";
import type { ProductsGetQuery, ProductsGetResponse, SchemaProduct } from "@/lib/api/products";

type ProductsParams = ProductsGetQuery;
type ProductsPage = ProductsGetResponse;

export type Product = SchemaProduct;

async function fetchProducts(params: ProductsParams, cursor?: string): Promise<ProductsPage> {
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  if (params.limit) search.set("limit", String(params.limit));
  if (cursor) search.set("cursor", cursor);

  const query = search.toString();
  const res = await fetch(`${apiUrl(API_PRODUCTS_ENDPOINTS.PRODUCTS)}${query ? `?${query}` : ""}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export function useProducts(params: ProductsParams = {}) {
  return useInfiniteQuery({
    queryKey: ["products", params],
    queryFn: ({ pageParam }) => fetchProducts(params, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.meta.nextCursor,
  });
}
