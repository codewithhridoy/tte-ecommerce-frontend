import createClient from "openapi-fetch";
import { apiBaseUrl, type ApiVersion } from "./url";
import type { paths } from "./schema.d.ts";

export function createApiClient(version?: ApiVersion) {
  return createClient<paths>({
    baseUrl: apiBaseUrl(version),
    credentials: "include",
  });
}

export const apiClient = createApiClient();
