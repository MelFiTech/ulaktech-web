/**
 * API client for Ulaktech backend.
 * Base URL: NEXT_PUBLIC_API_URL (e.g. http://localhost:2900)
 * All auth responses set cookies (access_token, refresh_token); use credentials: 'include'.
 */

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL ?? "";
  }
  return process.env.NEXT_PUBLIC_API_URL ?? "";
};

export function getApiUrl(path: string): string {
  const base = getBaseUrl().replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = getApiUrl(path);
  const { method = "GET", headers: optHeaders, body, ...rest } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...optHeaders,
  };
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
      credentials: "include",
      ...rest,
    });
  } catch (e) {
    const msg =
      e instanceof TypeError && (e.message === "Failed to fetch" || e.message === "Load failed")
        ? "Connection failed. Check your network or try again. If the app and API are on different domains, the server may need to allow CORS."
        : e instanceof Error
          ? e.message
          : "Connection failed.";
    throw new Error(msg);
  }

  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = (await res.json()) as ApiError & { message?: string | string[] };
      message = Array.isArray(data.message) ? data.message[0] : (data.message ?? message);
    } catch {
      // ignore
    }
    const err = new Error(message) as Error & { statusCode?: number };
    err.statusCode = res.status;
    throw err;
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
