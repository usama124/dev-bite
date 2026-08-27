"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { analyzePassword } from "@/lib/engines/security";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { PrivacyNotice } from "../shared/PrivacyNotice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PasswordStrengthCheckerTool() {
  const [password, setPassword] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const result = React.useMemo(() => analyzePassword(password), [password]);
  return <ToolWorkspace className="space-y-5">
    <PrivacyNotice />
    <div className="space-y-2"><label htmlFor="strength-password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password to analyze</label><div className="flex gap-2"><Input id="strength-password" type={visible ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="off" placeholder="Your password never leaves this browser" /><Button variant="outline" size="icon" onClick={() => setVisible((value) => !value)} aria-label={visible ? "Hide password" : "Show password"}>{visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button></div></div>
    <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-xl border border-border/70 bg-muted/10 p-5"><div className="flex items-end justify-between"><div><p className="text-xs text-muted-foreground">Strength</p><p className="text-2xl font-bold">{result.label}</p></div><p className="text-sm font-semibold text-primary">{result.entropy} bits</p></div><div className="mt-4 grid grid-cols-5 gap-1" aria-label={`${result.score + 1} of 5 strength segments`}>{[0,1,2,3,4].map((score) => <span key={score} className={`h-2 rounded-full ${score <= result.score && password ? "bg-primary" : "bg-muted"}`} />)}</div><dl className="mt-5 grid grid-cols-2 gap-3 text-xs">{Object.entries(result.composition).map(([label, count]) => <div key={label}><dt className="capitalize text-muted-foreground">{label}</dt><dd className="font-semibold">{count}</dd></div>)}</dl></div><div className="rounded-xl border border-border/70 bg-muted/10 p-5"><h3 className="font-semibold">Findings & suggestions</h3><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{[...result.findings, ...result.suggestions].length ? [...result.findings, ...result.suggestions].map((item, index) => <li key={`${item}-${index}`} className="flex gap-2"><span className="text-primary">•</span>{item}</li>) : <li>No obvious weaknesses detected by these local rules. Always use a unique password.</li>}</ul></div></div>
  </ToolWorkspace>;
}
