export type ToolCategory = "text" | "json" | "developer" | "encoding";

export type ToolPriority = "P0" | "P1" | "P2";

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolExample {
  title: string;
  input?: string;
  output?: string;
  description?: string;
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  category: ToolCategory;
  priority: ToolPriority;
  shortDescription: string;
  description: string;
  keywords: string[];
  seoTitle: string;
  seoDescription: string;
  inputLabel: string;
  outputLabel: string;
  supportsCopy: boolean;
  supportsDownload: boolean;
  supportsClear: boolean;
  supportsSample: boolean;
  downloadFilename?: string;
  clientSide: boolean;
  relatedToolIds: string[];
  faqs: ToolFaq[];
  examples: ToolExample[];
  features?: string[];
  howToUse?: string[];
  status?: "active" | "coming_soon";
}

export interface CategoryMeta {
  id: ToolCategory;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  totalTools: number;
}
