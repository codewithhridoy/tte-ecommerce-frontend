export const COOKIE_ACCESS = "access_token";
export const COOKIE_REFRESH = "refresh_token";
export const COOKIE_CART_ID = "tte_cart_id";

export interface JwtPayload {
  sub: string;
  email: string;
  role: "customer" | "staff" | "admin";
  fullName?: string | null;
  iat?: number;
  exp?: number;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const [, payloadB64] = token.split(".");
    if (!payloadB64) return null;
    const json = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(payload: JwtPayload): boolean {
  if (!payload.exp) return false;
  return Date.now() / 1000 >= payload.exp - 10;
}
