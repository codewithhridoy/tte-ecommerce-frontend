import { env } from "@/lib/env";
import type { ApiEndpoint } from "./shared/endpoints";

export type ApiVersion = `v${number}`;

export const DEFAULT_API_VERSION = "v1" satisfies ApiVersion;

export function apiBaseUrl(version: ApiVersion = DEFAULT_API_VERSION): string {
  return `${env.NEXT_PUBLIC_API_URL}/api/${version}`;
}

export function apiUrl(path: ApiEndpoint, options: { version?: ApiVersion } = {}): string {
  return `${apiBaseUrl(options.version)}${path}`;
}
