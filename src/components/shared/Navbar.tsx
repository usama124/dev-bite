"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Wrench,
  Type,
  Braces,
  Code2,
  Binary,
  Menu,
  X,
  Command,
  UserRound,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { CommandSearch } from "./CommandSearch";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { label: "All Tools", href: "/tools", icon: Wrench },
    { label: "Text", href: "/tools/category/text", icon: Type },
    { label: "JSON", href: "/tools/category/json", icon: Braces },
    { label: "Developer", href: "/tools/category/developer", icon: Code2 },
    { label: "Encoding", href: "/tools/category/encoding", icon: Binary },
    { label: "About", href: "/about", icon: UserRound },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl transition-colors">
        <div className="container flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 group transition-transform hover:scale-102"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
                D
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  Dev<span className="text-primary">Bite</span>
                </span>
                <span className="text-[10px] text-muted-foreground -mt-0.5 tracking-wide font-medium">
                  Developer Toolbox
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-2">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 h-9 rounded-xl border border-input/80 bg-background/50 text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-accent/40 backdrop-blur-sm transition-all shadow-xs"
              aria-label="Search tools"
            >
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="hidden sm:inline">Search tools...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 font-mono text-[10px] bg-muted/80 px-1.5 py-0.5 rounded border border-border/80 text-muted-foreground">
                <Command className="h-2.5 w-2.5" /> K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-border/60 bg-background/95 backdrop-blur-2xl px-4 py-3 space-y-1 animate-fade-in">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Global Command Search Modal */}
      <CommandSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
