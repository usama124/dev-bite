import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllCategories,
  getCategoryBySlug,
  getToolsByCategory,
  ToolCategory,
} from "@/lib/registry";
import { ToolCard } from "@/components/shared/ToolCard";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Type, Braces, Code2, Binary, ArrowRight, ShieldCheck, Database, Table2 } from "lucide-react";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({
    category: cat.id,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const cat = getCategoryBySlug(params.category);
  if (!cat) {
    return {
      title: "Category Not Found",
    };
  }

  const canonicalUrl = `https://devbite.tools/tools/category/${cat.slug}`;

  return {
    title: `${cat.name} — Free Online Developer Tools`,
    description: `Discover free online ${cat.name.toLowerCase()}. ${cat.description} Fast, secure, and 100% client-side.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${cat.name} — Free Online Developer Tools | DevBite`,
      description: cat.description,
      url: canonicalUrl,
      type: "website",
    },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryMeta = getCategoryBySlug(params.category);

  if (!categoryMeta) {
    notFound();
  }

  const tools = getToolsByCategory(categoryMeta.id as ToolCategory);
  const allCategories = getAllCategories();
  const otherCategories = allCategories.filter((c) => c.id !== categoryMeta.id);

  const categoryIcons = {
    text: Type,
    json: Braces,
    developer: Code2,
    encoding: Binary,
    security: ShieldCheck,
    sql: Database,
    data: Table2,
  };

  const Icon = categoryIcons[categoryMeta.id];

  return (
    <div className="container py-8 max-w-5xl space-y-10">
      <Breadcrumbs
        items={[
          { label: "Tools", href: "/tools" },
          { label: categoryMeta.name },
        ]}
      />

      {/* Category Hero */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${categoryMeta.badgeBg} ${categoryMeta.badgeBorder} ${categoryMeta.badgeText}`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Category Hub
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {tools.length} Tools
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {categoryMeta.name}
            </h1>
          </div>
        </div>

        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          {categoryMeta.description}
        </p>
      </div>

      {/* Category Tools Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">
          Available {categoryMeta.name} ({tools.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>

      {/* Other Categories Section */}
      <div className="pt-8 border-t border-border/60 space-y-4">
        <h2 className="text-lg font-bold text-foreground">
          Explore Other Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherCategories.map((other) => {
            const OtherIcon = categoryIcons[other.id];
            return (
              <Link
                key={other.id}
                href={`/tools/category/${other.id}`}
                className="group p-4 rounded-xl glass-card transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-lg flex items-center justify-center border ${other.badgeBg} ${other.badgeBorder} ${other.badgeText}`}
                  >
                    <OtherIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {other.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">{other.totalTools} Tools</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
