export const SITE_CONFIG = {
  name: "DevBite",
  url: "https://devbite.dev",
  developer: {
    name: "Usama Tahir",
    role: "Software Engineer & Backend Developer",
    image: "/images/usama-profile.jpeg",
    imageAlt: "Portrait of Usama Tahir, the developer behind DevBite",
    introduction:
      "I'm a software developer who enjoys building useful tools and solving everyday engineering problems. I created DevBite to collect the small utilities I frequently need into one fast, simple, and accessible website.",
    technologies: [
      "Python",
      "Flask",
      "FastAPI",
      "Django",
      "TypeScript",
      "Next.js",
      "Backend Systems",
      "Microservices",
      "REST APIs",
      "Kafka",
      "Airflow",
      "Docker",
      "Data Tools",
    ],
  },
  links: {
    // Optional links stay hidden until a verified destination is configured.
    github: "https://github.com/usama124",
    linkedin: "https://www.linkedin.com/in/usamatahir-py",
    website: "https://osamacodes.com/",
    buyMeACoffee: null as string | null,
  },
} as const;

export const SITE_URL = SITE_CONFIG.url;

export const FOOTER_LINKS = [
  { label: "About", href: "/about" },
  { label: "Tools", href: "/tools" },
  { label: "Categories", href: "/#categories" },
  { label: "Roadmap", href: "/about#roadmap" },
  { label: "Privacy", href: "/about#privacy" },
  { label: "Terms", href: "/about#terms" },
  { label: "Contact", href: "/about#contact" },
] as const;
