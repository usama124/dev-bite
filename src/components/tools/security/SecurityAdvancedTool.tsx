"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TOOL_LIMITS } from "@/config/limits";
import {
  aesDecrypt, aesEncrypt, checksum, checksumBytes, fernetDecrypt, fernetEncrypt, generateAesKey,
  generateFernetKeys, generateHmac, generateJwt, generateRsaKeyPair,
  generateRsaSigningKeyPair, HmacAlgorithm, OutputEncoding, randomBytesOutput,
  rsaDecrypt, rsaEncrypt, rsaSign, rsaVerify, validateHmac, validateJwt,
} from "@/lib/engines/security";
import { ClearButton } from "../shared/ClearButton";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ErrorMessage } from "../shared/ErrorMessage";
import { PrivacyNotice } from "../shared/PrivacyNotice";
import { ToolWorkspace } from "../shared/ToolWorkspace";

export type SecurityAdvancedMode = "hmac-generate" | "hmac-validate" | "jwt-generate" | "jwt-validate" | "fernet-key" | "fernet-encrypt" | "fernet-decrypt" | "aes" | "rsa-key" | "rsa-crypt" | "rsa-sign" | "random-bytes" | "checksum";
const labels: Record<SecurityAdvancedMode, string> = { "hmac-generate": "Generate HMAC", "hmac-validate": "Validate HMAC", "jwt-generate": "Generate JWT", "jwt-validate": "Validate JWT", "fernet-key": "Generate keys", "fernet-encrypt": "Encrypt", "fernet-decrypt": "Decrypt", aes: "Process AES-GCM", "rsa-key": "Generate key pair", "rsa-crypt": "Process RSA-OAEP", "rsa-sign": "Process RSA-PSS", "random-bytes": "Generate bytes", checksum: "Generate checksum" };

export function SecurityAdvancedTool({ mode }: { mode: SecurityAdvancedMode }) {
  const [input, setInput] = React.useState(mode.startsWith("jwt") ? '{"sub":"123","name":"DevBite User","iat":1700000000}' : "DevBite local security input");
  const [secondary, setSecondary] = React.useState(""); const [secret, setSecret] = React.useState(""); const [output, setOutput] = React.useState(""); const [error, setError] = React.useState(""); const [algorithm, setAlgorithm] = React.useState(mode.startsWith("jwt") ? "HS256" : "SHA-256"); const [encoding, setEncoding] = React.useState<OutputEncoding>("hex"); const [operation, setOperation] = React.useState<"encrypt" | "decrypt" | "sign" | "verify">(mode === "rsa-sign" ? "sign" : "encrypt"); const [count, setCount] = React.useState(1); const [size, setSize] = React.useState(32); const [busy, setBusy] = React.useState(false); const [fileBytes, setFileBytes] = React.useState<Uint8Array | null>(null); const [fileName, setFileName] = React.useState("");
  const hmacMode = mode.startsWith("hmac"); const jwtMode = mode.startsWith("jwt"); const rsaMode = mode.startsWith("rsa");

  const run = async () => { setBusy(true); setError(""); try {
    let value: string;
    if (mode === "hmac-generate") value = await generateHmac(input, secret, algorithm as HmacAlgorithm, encoding);
    else if (mode === "hmac-validate") { const result = await validateHmac(input, secret, secondary, algorithm as HmacAlgorithm, encoding); value = `${result.valid ? "VALID" : "INVALID"}\n${result.generated}`; }
    else if (mode === "jwt-generate") value = await generateJwt('{"typ":"JWT"}', input, secret, algorithm as "HS256" | "HS384" | "HS512");
    else if (mode === "jwt-validate") { const result = await validateJwt(input, secret, algorithm as "HS256" | "HS384" | "HS512"); value = `${result.valid ? "VALID SIGNATURE" : "INVALID SIGNATURE"}\n${JSON.stringify(result.decoded.payload, null, 2)}`; }
    else if (mode === "fernet-key") value = generateFernetKeys(count).join("\n");
    else if (mode === "fernet-encrypt") value = await fernetEncrypt(input, secret);
    else if (mode === "fernet-decrypt") value = await fernetDecrypt(input, secret);
    else if (mode === "aes") { if (operation === "encrypt") { const key = secret || generateAesKey(); if (!secret) setSecret(key); value = JSON.stringify(await aesEncrypt(input, key, secondary), null, 2); } else value = await aesDecrypt(input, secret); }
    else if (mode === "rsa-key") { const keys = operation === "sign" ? await generateRsaSigningKeyPair(size as 2048 | 3072 | 4096) : await generateRsaKeyPair(size as 2048 | 3072 | 4096); value = `${keys.publicKey}\n\n${keys.privateKey}`; }
    else if (mode === "rsa-crypt") value = operation === "encrypt" ? await rsaEncrypt(input, secret) : await rsaDecrypt(input, secret);
    else if (mode === "rsa-sign") value = operation === "sign" ? await rsaSign(input, secret) : (await rsaVerify(input, secondary, secret) ? "VALID SIGNATURE" : "INVALID SIGNATURE");
    else if (mode === "random-bytes") value = randomBytesOutput(size, encoding);
    else value = fileBytes ? await checksumBytes(fileBytes, algorithm as "CRC32" | "MD5" | HmacAlgorithm | "SHA-1") : await checksum(input, algorithm as "CRC32" | "MD5" | HmacAlgorithm | "SHA-1");
    setOutput(value);
  } catch (reason) { setOutput(""); setError(reason instanceof Error ? reason.message : "The cryptographic operation failed."); } finally { setBusy(false); } };

  const secretLabel = rsaMode ? (operation === "encrypt" || operation === "verify" ? "Public key (PEM)" : "Private key (PEM)") : mode === "aes" ? "AES key (Base64URL; leave blank to generate for encryption)" : mode.includes("fernet") ? "Fernet key" : "Secret";
  return <ToolWorkspace className="space-y-5"><PrivacyNotice cryptographic />
    {(jwtMode || mode === "aes" || rsaMode) && <div role="note" className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3 text-xs leading-relaxed text-amber-700 dark:text-amber-300">{jwtMode ? "JWT generation/validation supports only HS256, HS384 and HS512. Never treat decoding alone as verification." : mode === "aes" ? "AES-GCM authenticates ciphertext. Store the key and nonce package securely; this browser utility is intended for development workflows." : "RSA operations use RSA-OAEP/SHA-256 or RSA-PSS/SHA-256 only. Large payloads must use hybrid encryption rather than direct RSA."}</div>}
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {hmacMode && <label className="text-xs font-medium">Algorithm<Select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} className="mt-1"><option>SHA-256</option><option>SHA-384</option><option>SHA-512</option></Select></label>}
      {jwtMode && <label className="text-xs font-medium">Algorithm<Select value={algorithm.startsWith("HS") ? algorithm : "HS256"} onChange={(e) => setAlgorithm(e.target.value)} className="mt-1"><option>HS256</option><option>HS384</option><option>HS512</option></Select></label>}
      {(hmacMode || mode === "random-bytes") && <label className="text-xs font-medium">Encoding<Select value={encoding} onChange={(e) => setEncoding(e.target.value as OutputEncoding)} className="mt-1"><option value="hex">Hex</option><option value="base64">Base64</option><option value="base64url">Base64URL</option></Select></label>}
      {mode === "checksum" && <label className="text-xs font-medium">Algorithm<Select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} className="mt-1"><option>CRC32</option><option>MD5</option><option>SHA-1</option><option>SHA-256</option><option>SHA-384</option><option>SHA-512</option></Select></label>}
      {mode === "fernet-key" && <label className="text-xs font-medium">Key count<Input type="number" min={1} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))} className="mt-1" /></label>}
      {(mode === "random-bytes" || mode === "rsa-key") && <label className="text-xs font-medium">{mode === "rsa-key" ? "RSA key size" : "Byte count"}{mode === "rsa-key" ? <Select value={String(size < 2048 ? 2048 : size)} onChange={(e) => setSize(Number(e.target.value))} className="mt-1"><option>2048</option><option>3072</option><option>4096</option></Select> : <Input type="number" min={1} max={65536} value={size} onChange={(e) => setSize(Number(e.target.value))} className="mt-1" />}</label>}
      {mode === "aes" && <label className="text-xs font-medium">Operation<Select value={operation} onChange={(e) => setOperation(e.target.value as "encrypt" | "decrypt")} className="mt-1"><option value="encrypt">Encrypt</option><option value="decrypt">Decrypt</option></Select></label>}
      {mode === "rsa-crypt" && <label className="text-xs font-medium">Operation<Select value={operation} onChange={(e) => setOperation(e.target.value as "encrypt" | "decrypt")} className="mt-1"><option value="encrypt">Encrypt</option><option value="decrypt">Decrypt</option></Select></label>}
      {(mode === "rsa-sign" || mode === "rsa-key") && <label className="text-xs font-medium">Purpose<Select value={operation === "verify" ? "verify" : operation === "sign" ? "sign" : "encrypt"} onChange={(e) => setOperation(e.target.value as "encrypt" | "sign" | "verify")} className="mt-1"><option value="sign">Sign / verify keys</option>{mode === "rsa-sign" && <option value="verify">Verify</option>}{mode === "rsa-key" && <option value="encrypt">Encrypt / decrypt keys</option>}</Select></label>}
    </div>
    {!(["fernet-key", "rsa-key", "random-bytes"] as SecurityAdvancedMode[]).includes(mode) && <section className="space-y-2"><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-semibold uppercase text-muted-foreground">{mode.includes("decrypt") || operation === "decrypt" ? "Ciphertext / token" : jwtMode && mode === "jwt-validate" ? "JWT" : "Message / input"}</span>{mode === "checksum" && <label className="inline-flex h-8 cursor-pointer items-center rounded-md border border-input bg-background/50 px-3 text-xs font-medium hover:bg-accent">{fileName || "Hash local file"}<input type="file" className="sr-only" onChange={async (event) => { const file = event.target.files?.[0]; if (file) { if (file.size > TOOL_LIMITS.dataFileMaxBytes) { setFileBytes(null); setFileName(""); setError(`File exceeds the ${(TOOL_LIMITS.dataFileMaxBytes / 1_000_000).toFixed(0)} MB local checksum limit.`); } else { setFileBytes(new Uint8Array(await file.arrayBuffer())); setFileName(`${file.name} (${file.size.toLocaleString()} bytes)`); setError(""); } } event.target.value = ""; }} /></label>}</div><Textarea value={input} onChange={(e) => { setInput(e.target.value); if (mode === "checksum") { setFileBytes(null); setFileName(""); } }} className="min-h-40 font-mono text-xs" spellCheck={false} />{mode === "checksum" && fileBytes && <p className="text-xs text-muted-foreground">File mode is active. Editing the text area switches back to text mode.</p>}</section>}
    {(hmacMode || jwtMode || mode.includes("fernet") || mode === "aes" || rsaMode) && mode !== "fernet-key" && mode !== "rsa-key" && <label className="block text-xs font-medium">{secretLabel}<Textarea value={secret} onChange={(e) => setSecret(e.target.value)} className="mt-1 min-h-20 font-mono text-xs" spellCheck={false} /></label>}
    {(mode === "hmac-validate" || (mode === "rsa-sign" && operation === "verify") || mode === "aes") && <label className="block text-xs font-medium">{mode === "hmac-validate" ? "Expected signature" : mode === "aes" ? "Associated data (optional; encryption only)" : "Signature (Base64URL)"}<Textarea value={secondary} onChange={(e) => setSecondary(e.target.value)} className="mt-1 min-h-20 font-mono text-xs" /></label>}
    <div className="flex flex-wrap items-center gap-2"><Button onClick={run} disabled={busy}>{busy ? "Processing…" : labels[mode]}</Button><ClearButton onClear={() => { setInput(""); setSecondary(""); setSecret(""); setOutput(""); setError(""); setFileBytes(null); setFileName(""); }} disabled={!input && !output && !secret && !fileBytes} /><div className="ml-auto flex gap-1"><CopyButton textToCopy={output} /><DownloadButton content={output} filename={`${mode}-output.txt`} /></div></div>
    {error ? <ErrorMessage title="Operation failed" message={error} /> : <pre className="max-h-[520px] min-h-28 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-border/70 bg-muted/10 p-4 font-mono text-xs">{output || "Output will appear here after you run the operation."}</pre>}
  </ToolWorkspace>;
}
