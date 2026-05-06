import { cookies } from "next/headers";
import createClient from "openapi-fetch";
import { env } from "../env";
import type { paths } from "./schema.d.ts";

export async function createServerClient() {
  const cookieStore = await cookies();

  return createClient<paths>({
    baseUrl: `${env.NEXT_PUBLIC_API_URL}/api/v1`,
    headers: { cookie: cookieStore.toString() },
    credentials: "include",
  });
}
