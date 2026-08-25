export interface ParsedUrlResult {
  success: boolean;
  components?: Record<string, string>;
  query?: Array<{ key: string; value: string }>;
  error?: string;
}

function safelyDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function parseUrl(input: string, decode = true): ParsedUrlResult {
  if (!input.trim()) return { success: false, error: "URL is empty." };
  try {
    const url = new URL(input.trim());
    if (!url.protocol || !url.hostname) throw new Error("URL must include a protocol and hostname.");
    const format = (value: string) => decode ? safelyDecode(value) : value;
    return {
      success: true,
      components: {
        href: format(url.href),
        protocol: url.protocol.replace(/:$/, ""),
        username: format(url.username),
        password: format(url.password),
        origin: url.origin,
        hostname: url.hostname,
        port: url.port,
        pathname: format(url.pathname),
        search: format(url.search),
        hash: format(url.hash),
      },
      query: Array.from(url.searchParams.entries()).map(([key, value]) => ({
        key: decode ? safelyDecode(key) : key,
        value: decode ? safelyDecode(value) : value,
      })),
    };
  } catch (error) {
    return { success: false, error: `Invalid URL: ${(error as Error).message}` };
  }
}
