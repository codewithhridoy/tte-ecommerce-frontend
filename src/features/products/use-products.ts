"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { apiUrl } from "@/lib/api/url";

interface ProductsParams {
  status?: "draft" | "active" | "archived";
  limit?: number;
}

interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  priceMinor: number;
  currency: string;
  options: Record<string, string>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  title: string;
  description: string | null;
  status: "draft" | "active" | "archived";
  attributes: Record<string, string | number | boolean>;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

interface ProductsPage {
  data: Product[];
  meta: { hasMore: boolean; limit: number; nextCursor?: string };
}

async function fetchProducts(params: ProductsParams, cursor?: string): Promise<ProductsPage> {
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  if (params.limit) search.set("limit", String(params.limit));
  if (cursor) search.set("cursor", cursor);

  const res = await fetch(apiUrl(`/products?${search.toString()}`), {
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
