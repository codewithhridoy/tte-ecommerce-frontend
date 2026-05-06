"use client";

import { useQuery } from "@tanstack/react-query";
import { API_AUTH_ENDPOINTS } from "@/lib/api/auth";
import { apiUrl } from "@/lib/api/url";
import { decodeJwt, isTokenExpired } from "@/lib/api/tokens";
import type { SchemaSessionResponse } from "@/lib/api/auth";

export interface SessionUser {
  id: string;
  email: string;
  role: "customer" | "staff" | "admin";
  fullName: string | null;
}

async function fetchSession(): Promise<SessionUser | null> {
  const res = await fetch(apiUrl(API_AUTH_ENDPOINTS.AUTH_REFRESH), {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) return null;

  const data = (await res.json()) as SchemaSessionResponse;
  const token = data.data?.accessToken;
  const payload = token ? decodeJwt(token) : null;
  if (!payload || isTokenExpired(payload)) return null;

  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
    fullName: payload.fullName ?? null,
  };
}

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000,
  });
}
