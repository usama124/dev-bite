import { Metadata } from "next";
import { ToolsDirectoryClient } from "@/components/tools/ToolsDirectoryClient";

export const metadata: Metadata = {
  title: "All Developer Tools (48 Launch Utilities)",
  description:
    "Explore 48 free, fast, and privacy-friendly online developer tools. Text utilities, JSON formatters, UUID generators, Base64 converters, and more.",
  alternates: {
    canonical: "https://devbite.tools/tools",
  },
};

export default function ToolsPage() {
  return <ToolsDirectoryClient />;
}
