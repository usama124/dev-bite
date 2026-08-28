export type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

function add32(a: number, b: number): number { return (a + b) & 0xffffffff; }
function rol(value: number, shift: number): number { return (value << shift) | (value >>> (32 - shift)); }

function md5(bytes: Uint8Array): string {
  const length = bytes.length;
  const paddedLength = (((length + 8) >>> 6) + 1) * 64;
  const data = new Uint8Array(paddedLength);
  data.set(bytes); data[length] = 0x80;
  const bitLength = length * 8;
  new DataView(data.buffer).setUint32(paddedLength - 8, bitLength >>> 0, true);
  new DataView(data.buffer).setUint32(paddedLength - 4, Math.floor(bitLength / 0x100000000), true);
  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  const shifts = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
  const constants = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) | 0);
  for (let offset = 0; offset < paddedLength; offset += 64) {
    const words = Array.from({ length: 16 }, (_, i) => new DataView(data.buffer).getInt32(offset + i * 4, true));
    let a = a0, b = b0, c = c0, d = d0;
    for (let i = 0; i < 64; i++) {
      let f: number, g: number;
      if (i < 16) { f = (b & c) | (~b & d); g = i; }
      else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
      else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; }
      else { f = c ^ (b | ~d); g = (7 * i) % 16; }
      const previousD = d;
      d = c; c = b;
      b = add32(b, rol(add32(add32(a, f), add32(constants[i], words[g])), shifts[i]));
      a = previousD;
    }
    a0 = add32(a0, a); b0 = add32(b0, b); c0 = add32(c0, c); d0 = add32(d0, d);
  }
  return [a0,b0,c0,d0].map((word) => Array.from({ length: 4 }, (_, i) => ((word >>> (i * 8)) & 255).toString(16).padStart(2, "0")).join("")).join("");
}

export async function hashText(input: string, algorithm: HashAlgorithm): Promise<string> {
  return hashBytes(new TextEncoder().encode(input), algorithm);
}

export async function hashBytes(bytes: Uint8Array, algorithm: HashAlgorithm): Promise<string> {
  if (algorithm === "MD5") return md5(bytes);
  const digest = await crypto.subtle.digest(algorithm, Uint8Array.from(bytes).buffer);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
