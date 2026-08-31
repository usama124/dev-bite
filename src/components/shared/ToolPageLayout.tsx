import React from "react";
import { Tool } from "@/lib/registry/types";
import { Breadcrumbs } from "./Breadcrumbs";
import { PrivacyBadge } from "./PrivacyBadge";
import { AdSlot } from "./AdSlot";
import { HowToUseSection } from "./HowToUseSection";
import { FAQSection } from "./FAQSection";
import { RelatedTools } from "./RelatedTools";
import { SITE_CONFIG } from "@/config/site";

interface ToolPageLayoutProps {
  tool: Tool;
  relatedTools: Tool[];
  children: React.ReactNode;
}

export function ToolPageLayout({ tool, relatedTools, children }: ToolPageLayoutProps) {
  // Schema.org WebApplication Structured Data
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: `${SITE_CONFIG.url}/tools/${tool.slug}`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    browserRequirements: "Requires JavaScript. Requires HTML5.",
  };

  const breadcrumbs = [
    { label: "Tools", href: "/tools" },
    { label: tool.category.toUpperCase(), href: `/tools/category/${tool.category}` },
    { label: tool.name },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <div className="container py-8 max-w-5xl">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Tool Header & Description */}
        <div className="mb-6 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {tool.name}
            </h1>
            <PrivacyBadge subtle />
          </div>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
            {tool.description}
          </p>
        </div>

        {/* Primary Tool Interactive Workspace */}
        <div className="my-6">
          {children}
        </div>

        {/* Non-intrusive Ad Slot (Positioned safely after tool) */}
        <AdSlot format="horizontal" />

        {/* How to use & Examples (SEO content below tool) */}
        <HowToUseSection
          toolName={tool.name}
          steps={tool.howToUse}
          examples={tool.examples}
          features={tool.features}
        />

        {/* FAQ Section */}
        <FAQSection faqs={tool.faqs} toolName={tool.name} />

        {/* Related Tools */}
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}
