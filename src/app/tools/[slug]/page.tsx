import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTools, getToolBySlug, getRelatedTools } from "@/lib/registry";
import { ToolPageLayout } from "@/components/shared/ToolPageLayout";
import { ToolRenderer } from "@/components/tools/ToolRenderer";

interface ToolPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const tools = getAllTools();
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    return {
      title: "Tool Not Found | DevBite",
    };
  }

  const canonicalUrl = `https://devbite.tools/tools/${tool.slug}`;

  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    keywords: tool.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url: canonicalUrl,
      type: "website",
      siteName: "DevBite",
    },
    twitter: {
      card: "summary_large_image",
      title: tool.seoTitle,
      description: tool.seoDescription,
    },
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  const relatedTools = getRelatedTools(tool.id, 4);

  return (
    <ToolPageLayout tool={tool} relatedTools={relatedTools}>
      <ToolRenderer tool={tool} />
    </ToolPageLayout>
  );
}
