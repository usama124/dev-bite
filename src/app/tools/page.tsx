import { Metadata } from "next";
import { ToolsDirectoryClient } from "@/components/tools/ToolsDirectoryClient";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "All Developer Tools (48 Launch Utilities)",
  description:
    "Explore 48 free, fast, and privacy-friendly online developer tools. Text utilities, JSON formatters, UUID generators, Base64 converters, and more.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/tools`,
  },
};

export default function ToolsPage() {
  return <ToolsDirectoryClient />;
}
