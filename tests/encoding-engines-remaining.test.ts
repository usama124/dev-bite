import { describe, expect, it } from "vitest";
import { decodeBase64, decodeBase64ToBytes, encodeBase64 } from "../src/lib/engines/encoding/base64";
import { decodeUrl, encodeUrl } from "../src/lib/engines/encoding/url-codec";
import { decodeHtmlEntities, encodeHtmlEntities } from "../src/lib/engines/encoding/html-entities";
import { decodeHex, encodeHex } from "../src/lib/engines/encoding/hex";

describe("Remaining Encoding processing engines", () => {
  it("decodes standard and unpadded Base64URL data into bytes", () => {
    const encoded = encodeBase64("DevBite 🚀", { urlSafe: true, padding: false });
    expect(encoded.output).not.toMatch(/[+/=]/);
    expect(decodeBase64(encoded.output).output).toBe("DevBite 🚀");
    expect(Array.from(decodeBase64ToBytes("AAEC_w").bytes)).toEqual([0, 1, 2, 255]);
  });

  it("rejects malformed Base64 lengths and padding", () => {
    expect(decodeBase64("a").success).toBe(false);
    expect(decodeBase64("YW=Jj").success).toBe(false);
  });

  it("percent-encodes URL components and preserves full URL structure", () => {
    expect(encodeUrl("hello world&x=1", "component").output).toBe("hello%20world%26x%3D1");
    expect(encodeUrl("https://example.com/a b?q=one two", "full-url").output).toBe("https://example.com/a%20b?q=one%20two");
  });

  it("decodes percent values with optional form-style plus handling", () => {
    expect(decodeUrl("hello%20world%21").output).toBe("hello world!");
    expect(decodeUrl("hello+world", "component", true).output).toBe("hello world");
    expect(decodeUrl("%E0%A4%A").success).toBe(false);
  });

  it("encodes HTML-sensitive characters using named and numeric entities", () => {
    expect(encodeHtmlEntities('<p title="x">Tom & Jerry\'s</p>')).toBe("&lt;p title=&quot;x&quot;&gt;Tom &amp; Jerry&apos;s&lt;/p&gt;");
    expect(encodeHtmlEntities("©", "hexadecimal", true)).toBe("&#xA9;");
  });

  it("decodes named, decimal, and hexadecimal HTML entities", () => {
    expect(decodeHtmlEntities("&lt;b&gt;&#169; &#x1F680;&lt;/b&gt;").output).toBe("<b>© 🚀</b>");
    expect(decodeHtmlEntities("&unknown;", true).success).toBe(false);
  });

  it("encodes UTF-8 text as configurable hexadecimal bytes", () => {
    expect(encodeHex("Hi 🚀", { uppercase: true, separator: ":" })).toBe("48:69:20:F0:9F:9A:80");
  });

  it("decodes grouped hexadecimal and rejects invalid input", () => {
    expect(decodeHex("48 65:6c-6c\n6f").output).toBe("Hello");
    expect(decodeHex("abc").success).toBe(false);
    expect(decodeHex("zz").success).toBe(false);
    expect(decodeHex("ff", true).success).toBe(false);
  });
});
