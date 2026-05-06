"use client";

import { useQuery } from "@tanstack/react-query";
import { refresh } from "@/lib/api/auth";
import { decodeJwt, isTokenExpired } from "@/lib/api/tokens";

export interface SessionUser {
  id: string;
  email: string;
  role: "customer" | "staff" | "admin";
  fullName: string | null;
}

async function fetchSession(): Promise<SessionUser | null> {
  const data = await refresh().catch(() => null);
  if (!data) return null;

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
