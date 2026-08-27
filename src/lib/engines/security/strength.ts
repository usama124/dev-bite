export interface PasswordStrengthResult {
  score: number;
  label: "Very weak" | "Weak" | "Fair" | "Strong" | "Very strong";
  entropy: number;
  composition: Record<"uppercase" | "lowercase" | "numbers" | "symbols", number>;
  findings: string[];
  suggestions: string[];
}

export function analyzePassword(password: string): PasswordStrengthResult {
  const composition = {
    uppercase: (password.match(/[A-Z]/g) ?? []).length,
    lowercase: (password.match(/[a-z]/g) ?? []).length,
    numbers: (password.match(/\d/g) ?? []).length,
    symbols: (password.match(/[^A-Za-z0-9\s]/g) ?? []).length,
  };
  let pool = 0;
  if (composition.uppercase) pool += 26;
  if (composition.lowercase) pool += 26;
  if (composition.numbers) pool += 10;
  if (composition.symbols) pool += 33;
  if (/\s/.test(password)) pool += 1;
  const entropy = password ? Math.round(password.length * Math.log2(Math.max(pool, 1)) * 10) / 10 : 0;
  const findings: string[] = [];
  const suggestions: string[] = [];
  if (password.length < 12) { findings.push("The password is shorter than 12 characters."); suggestions.push("Use at least 12–16 characters."); }
  if (/(.)\1{2,}/i.test(password)) { findings.push("Repeated characters reduce unpredictability."); suggestions.push("Avoid long repeated-character sequences."); }
  if (/1234|abcd|qwerty|password|letmein|admin/i.test(password)) { findings.push("A common word or sequence was detected."); suggestions.push("Replace predictable words and keyboard sequences."); }
  if (/^[A-Za-z]+$/.test(password)) suggestions.push("Mix in numbers or symbols, or use a longer passphrase.");
  if (!password) suggestions.push("Enter a password to analyze locally.");
  let score = entropy >= 80 ? 4 : entropy >= 60 ? 3 : entropy >= 40 ? 2 : entropy >= 24 ? 1 : 0;
  if (findings.some((finding) => finding.includes("common"))) score = Math.min(score, 1);
  const labels = ["Very weak", "Weak", "Fair", "Strong", "Very strong"] as const;
  return { score, label: labels[score], entropy, composition, findings, suggestions };
}
