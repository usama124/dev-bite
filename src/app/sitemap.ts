import { MetadataRoute } from "next";
import { getAllTools } from "@/lib/registry";
import { CATEGORY_LIST } from "@/lib/registry/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://devbite.tools";
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_LIST.map((cat) => ({
    url: `${baseUrl}/tools/category/${cat.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const toolRoutes: MetadataRoute.Sitemap = getAllTools().map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: tool.priority === "P0" ? 0.8 : 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes];
}
