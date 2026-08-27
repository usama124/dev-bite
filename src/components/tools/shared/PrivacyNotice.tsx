import { ShieldCheck } from "lucide-react";

export function PrivacyNotice({ cryptographic = false }: { cryptographic?: boolean }) {
  return (
    <div role="note" className="flex gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs leading-relaxed text-emerald-700 dark:text-emerald-300">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
      <p><strong>Processed locally:</strong> Your input is not uploaded to DevBite servers.{cryptographic ? " Browser tools are convenient for development, but do not replace production key-management infrastructure." : ""}</p>
    </div>
  );
}
