"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products";
import type { ProductsGetQuery, ProductsGetResponse, SchemaProduct } from "@/lib/api/products";

type ProductsParams = ProductsGetQuery;
type ProductsPage = ProductsGetResponse;

export type Product = SchemaProduct;

async function fetchProducts(params: ProductsParams, cursor?: string): Promise<ProductsPage> {
  const data = await getProducts({
    params: { query: { ...params, ...(cursor ? { cursor } : {}) } },
  });
  return data as ProductsPage;
}

export function useProducts(params: ProductsParams = {}) {
  return useInfiniteQuery({
    queryKey: ["products", params],
    queryFn: ({ pageParam }) => fetchProducts(params, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.meta.nextCursor,
  });
}
