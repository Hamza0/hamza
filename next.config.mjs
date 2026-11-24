import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  async redirects() {
    const consolidatedNotes = {
      "the-difference-between-a-website-and-a-digital-platform": "when-a-website-becomes-a-system",
      "forms-are-part-of-the-workflow": "a-fast-website-still-needs-a-clear-next-step",
      "why-production-support-changes-how-you-build": "how-i-approach-production-problems",
      "data-quality-comes-before-the-dashboard": "why-a-dashboard-total-can-be-wrong",
      "why-an-api-timeout-does-not-always-mean-failure": "apis-are-where-systems-start-talking",
    };
    return Object.entries(consolidatedNotes).map(([source, destination]) => ({
      source: `/blog/${source}`,
      destination: `/blog/${destination}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
