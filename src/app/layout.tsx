import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://devbite.tools"),
  title: {
    default: "DevBite — Free, Fast & Private Online Developer Tools",
    template: "%s | DevBite",
  },
  description:
    "Free, instant, privacy-first developer utility tools. Format JSON, count words, generate UUIDs, encode Base64, and more. 100% client-side in your browser.",
  alternates: {
    canonical: "https://devbite.tools",
  },
  keywords: [
    "developer tools",
    "online utilities",
    "json formatter",
    "word counter",
    "uuid generator",
    "base64 encoder",
    "regex tester",
    "free developer tools",
  ],
  authors: [{ name: "DevBite" }],
  creator: "DevBite",
  publisher: "DevBite",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devbite.tools",
    title: "DevBite — Free, Fast & Private Online Developer Tools",
    description:
      "Free, instant, privacy-first developer utility tools. 100% processed locally in your browser.",
    siteName: "DevBite",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevBite — Free, Fast & Private Online Developer Tools",
    description:
      "Free, instant, privacy-first developer utility tools. 100% processed locally in your browser.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Ambient background glows */}
          <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-500/10 via-cyan-500/10 to-transparent blur-[120px] rounded-full" />
          </div>

          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
