import { absoluteUrl } from "@huddle/utils/absolute-url";
import type { MetadataRoute } from "next";
import { getAlternateLanguages } from "@/lib/alternates";

const seoPages = [
  "/best-doodle-alternative",
  "/scheduling-for/assistants",
  "/scheduling-for/committees",
  "/scheduling-for/sports-clubs",
  "/scheduling-for/thesis-defense",
  "/scheduling-for/legal",
  "/free-scheduling-poll",
  "/when2meet-alternative",
];

export default async function Sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: absoluteUrl(),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: getAlternateLanguages("/"),
      },
    },
    {
      url: absoluteUrl("/pricing"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: getAlternateLanguages("/pricing"),
      },
    },
    ...seoPages.map((path) => ({
      url: absoluteUrl(path),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: getAlternateLanguages(path),
      },
    })),
  ];
}
