import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, Terminal, Sparkles } from "lucide-react";
import { CATEGORY_LIST } from "@/lib/registry/categories";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-muted/20 backdrop-blur-md">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Privacy */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-base shadow-sm">
                D
              </div>
              <span className="font-bold text-lg tracking-tight">
                Dev<span className="text-primary">Bite</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Free, fast, privacy-first developer utility tools designed to make everyday workflows effortless. 100% processed locally in your browser.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>Zero server tracking &bull; 100% Client-side execution</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-foreground">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {CATEGORY_LIST.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/tools/category/${cat.id}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tools */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-foreground">Popular Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/tools/word-counter" className="hover:text-foreground transition-colors">
                  Word Counter
                </Link>
              </li>
              <li>
                <Link href="/tools/json-formatter" className="hover:text-foreground transition-colors">
                  JSON Formatter
                </Link>
              </li>
              <li>
                <Link href="/tools/uuid-generator" className="hover:text-foreground transition-colors">
                  UUID Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/base64-encoder" className="hover:text-foreground transition-colors">
                  Base64 Encoder
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Info */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-foreground">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/tools" className="hover:text-foreground transition-colors">
                  All 48 Tools
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-foreground transition-colors">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DevBite. Built for developers worldwide.</p>
          <div className="flex items-center gap-1">
            <span>Fast &bull; Private &bull; Open Web Utilities</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
