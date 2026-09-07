import { Metadata } from "next";
import { ToolsDirectoryClient } from "@/components/tools/ToolsDirectoryClient";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "All Developer Tools",
  description:
    "Explore DevBite's free, fast, and privacy-friendly online developer tools for text, JSON, encoding, security, SQL, data and local files.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/tools`,
  },
};

export default function ToolsPage() {
  return <ToolsDirectoryClient />;
}
