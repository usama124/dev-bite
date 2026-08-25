export type UrlCodecMode = "component" | "full-url";

export interface UrlCodecResult {
  success: boolean;
  output: string;
  error?: string;
}

export function encodeUrl(input: string, mode: UrlCodecMode = "component"): UrlCodecResult {
  try {
    return { success: true, output: mode === "full-url" ? encodeURI(input) : encodeURIComponent(input) };
  } catch (error) {
    return { success: false, output: "", error: `Unable to encode input: ${(error as Error).message}` };
  }
}

export function decodeUrl(input: string, mode: UrlCodecMode = "component", plusAsSpace = false): UrlCodecResult {
  try {
    const source = plusAsSpace ? input.replace(/\+/g, " ") : input;
    return { success: true, output: mode === "full-url" ? decodeURI(source) : decodeURIComponent(source) };
  } catch (error) {
    return { success: false, output: "", error: `Malformed percent-encoded input: ${(error as Error).message}` };
  }
}
