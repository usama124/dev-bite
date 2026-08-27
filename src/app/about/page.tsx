import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Circle,
  Coffee,
  Code2,
  ExternalLink,
  Linkedin,
  Github,
  Lock,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "About DevBite & Its Developer",
  description:
    "Learn why Usama built DevBite, how its privacy-friendly developer tools work, and what is planned for the project.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
  openGraph: {
    title: "About DevBite & Its Developer",
    description:
      "The story, principles, developer, and roadmap behind the DevBite online toolbox.",
    url: `${SITE_CONFIG.url}/about`,
    type: "profile",
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: "summary",
    title: "About DevBite & Its Developer",
    description:
      "The story, principles, developer, and roadmap behind the DevBite online toolbox.",
  },
};

const principles = [
  {
    title: "Fast",
    description: "Tools should work immediately without unnecessary steps or waiting on a remote service.",
    icon: Zap,
    color: "text-amber-500",
  },
  {
    title: "Privacy First",
    description: "Where possible, processing happens directly in your browser and your input stays on your device.",
    icon: Lock,
    color: "text-emerald-500",
  },
  {
    title: "Developer Focused",
    description: "Each utility is designed around practical development, writing, and data tasks.",
    icon: Wrench,
    color: "text-primary",
  },
  {
    title: "Free to Use",
    description: "The core tools remain freely accessible, with no installation or account required.",
    icon: Sparkles,
    color: "text-cyan-500",
  },
] as const;

const roadmap = [
  {
    phase: "Phase 1",
    scope: "Text, JSON, Developer, Encoding",
    status: "complete",
  },
  {
    phase: "Phase 2",
    scope: "Security, SQL, CSV/Data",
    status: "planned",
  },
  {
    phase: "Phase 3",
    scope: "API, Image, PDF, File, Networking, Generation",
    status: "planned",
  },
  {
    phase: "Phase 4",
    scope: "Data Engineering, SEO, QR/Barcode, Advanced Tools",
    status: "planned",
  },
] as const;

function hasHref<T extends { href: string | null }>(
  link: T
): link is T & { href: string } {
  return Boolean(link.href);
}

const profileLinks = [
  { label: "GitHub", href: SITE_CONFIG.links.github, icon: Github },
  { label: "LinkedIn", href: SITE_CONFIG.links.linkedin, icon: Linkedin },
  { label: "Personal website", href: SITE_CONFIG.links.website, icon: ExternalLink },
].filter(hasHref);

export default function AboutPage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_CONFIG.developer.name,
    jobTitle: SITE_CONFIG.developer.role,
    url: `${SITE_CONFIG.url}/about`,
    sameAs: profileLinks.map((link) => link.href),
  };

  return (
    <div className="container max-w-5xl py-8 sm:py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Breadcrumbs items={[{ label: "About" }]} />

      <div className="space-y-14 md:space-y-20">
        <section className="grid items-center gap-6 py-4 md:grid-cols-[1fr_auto] md:gap-10 md:py-10">
          <div className="order-2 max-w-3xl space-y-5 text-center md:order-1 md:text-left">
            <p className="text-sm font-semibold text-primary">About DevBite</p>
            <h1 className="text-3xl font-black leading-[1.12] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Built by a Developer, for Developers.
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:mx-0">
              A collection of fast, privacy-friendly online tools built to make everyday development and data tasks simpler.
            </p>
            <Link
              href="/tools"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
            >
              Explore all 48 tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative order-1 mx-auto h-36 w-36 overflow-hidden rounded-3xl border border-primary/20 bg-primary/10 shadow-glass md:order-2 md:h-40 md:w-40">
            <Image
              src={SITE_CONFIG.developer.image}
              alt={SITE_CONFIG.developer.imageAlt}
              fill
              priority
              sizes="(min-width: 768px) 160px, 144px"
              className="object-cover object-[center_28%]"
            />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="glass-card rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold tracking-tight">About the Project</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                DevBite started from a familiar problem: small development jobs often require jumping between oversized applications, questionable websites, or one-off scripts. I wanted one dependable place for the utilities I use regularly.
              </p>
              <p>
                The goal is simple: focused tools that are free, quick to understand, and ready without an installation or account. Each workspace is built to solve one task well instead of adding unnecessary complexity.
              </p>
              <p>
                Privacy is part of that simplicity. The current tools process text, data, and files locally in the browser rather than sending them to a DevBite application server.
              </p>
            </div>
          </article>

          <article className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <Code2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Hi, I&apos;m {SITE_CONFIG.developer.name}.</h2>
                <p className="text-sm font-medium text-primary">{SITE_CONFIG.developer.role}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {SITE_CONFIG.developer.introduction}
            </p>
            <ul aria-label="Technologies" className="mt-5 flex flex-wrap gap-2">
              {SITE_CONFIG.developer.technologies.map((technology) => (
                <li key={technology} className="rounded-full border border-border/80 bg-background/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                  {technology}
                </li>
              ))}
            </ul>
            {profileLinks.length > 0 && (
              <div id="contact" className="mt-6 flex scroll-mt-24 flex-wrap gap-3">
                {profileLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-input bg-background/50 px-4 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ))}
              </div>
            )}
          </article>
        </section>

        <section aria-labelledby="principles-heading" className="space-y-6">
          <div className="max-w-2xl">
            <h2 id="principles-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">Why This Website Exists</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              A few practical principles guide every tool and product decision.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map(({ title, description, icon: Icon, color }) => (
              <article key={title} className="glass-card rounded-2xl p-5">
                <Icon className={`h-6 w-6 ${color}`} />
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="roadmap" className="scroll-mt-24 rounded-3xl border border-border/60 bg-muted/10 p-6 sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Roadmap</h2>
          <p className="mt-2 text-sm text-muted-foreground">Phase 1 is complete. Later phases will expand the same focused, privacy-conscious approach.</p>
          <ol className="mt-6 grid gap-3 md:grid-cols-2">
            {roadmap.map((item) => {
              const complete = item.status === "complete";
              const Icon = complete ? Check : Circle;
              return (
                <li key={item.phase} className="flex gap-3 rounded-xl border border-border/70 bg-card/60 p-4">
                  <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${complete ? "text-emerald-500" : "text-muted-foreground"}`} />
                  <div>
                    <p className="font-semibold">{item.phase}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{item.scope}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="glass-panel rounded-3xl p-6 text-center sm:p-10">
          <Coffee className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-4 text-2xl font-bold tracking-tight">Enjoying the tools?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            If these tools save you time or make your work a little easier, consider buying me a coffee. It helps support hosting, development, and adding new tools.
          </p>
          {SITE_CONFIG.links.buyMeACoffee ? (
            <a
              href={SITE_CONFIG.links.buyMeACoffee}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
            >
              <Coffee className="h-4 w-4" />
              Buy Me a Coffee
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <p className="mt-5 text-xs font-medium text-muted-foreground">Support link coming soon.</p>
          )}
        </section>

        <section className="grid gap-4 text-sm sm:grid-cols-2">
          <article id="privacy" className="scroll-mt-24 rounded-2xl border border-border/70 bg-card/50 p-5">
            <h2 className="font-bold">Privacy</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">Current DevBite tools process supplied content locally in your browser. No tool input is intentionally uploaded to a DevBite backend.</p>
          </article>
          <article id="terms" className="scroll-mt-24 rounded-2xl border border-border/70 bg-card/50 p-5">
            <h2 className="font-bold">Terms</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">Tools are provided for convenience without warranties. DevBite&apos;s source code is proprietary and all rights are reserved.</p>
          </article>
        </section>
      </div>
    </div>
  );
}
