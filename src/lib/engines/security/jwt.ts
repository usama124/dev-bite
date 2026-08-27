export interface JwtDecodeResult {
  header?: unknown;
  payload?: unknown;
  signature?: string;
  expiresAt?: string;
  issuedAt?: string;
  error?: string;
}

function decodeSegment(segment: string): string {
  if (!/^[A-Za-z0-9_-]+$/.test(segment)) throw new Error("JWT segments must use Base64URL characters only.");
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(segment.length / 4) * 4, "=");
  const binary = atob(normalized);
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

export function decodeJwt(token: string): JwtDecodeResult {
  const parts = token.trim().split(".");
  if (parts.length !== 3 || parts.some((part) => !part)) return { error: "Invalid JWT format. Expected three non-empty Base64URL segments." };
  try {
    const header = JSON.parse(decodeSegment(parts[0]));
    const payload = JSON.parse(decodeSegment(parts[1]));
    const claims = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
    const dateClaim = (value: unknown) => typeof value === "number" && Number.isFinite(value) ? new Date(value * 1000).toISOString() : undefined;
    return { header, payload, signature: parts[2], expiresAt: dateClaim(claims.exp), issuedAt: dateClaim(claims.iat) };
  } catch (error) {
    return { error: error instanceof Error ? `Unable to decode JWT: ${error.message}` : "Unable to decode JWT." };
  }
}
