import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ppf.org.in";

// ─── Global / Default SEO ─────────────────────────────────────────────────────
// Individual pages can override any of these by exporting their own `metadata`.
export const metadata = {
  metadataBase: new URL(BASE_URL),

  // Title template → each page's title becomes: "Page Title | PPF"
  title: {
    default: "Policy Perspectives Foundation | PPF",
    template: "%s | PPF",
  },

  description:
    "Policy Perspectives Foundation (PPF) is an independent think tank driving evidence-based policy research, public discourse, and collaborative governance across India.",

  keywords: [
    "PPF",
    "Policy Perspectives Foundation",
    "think tank India",
    "public policy",
    "policy research",
    "governance",
    "India policy",
    "Dareecha",
    "policy opinions",
    "research publications",
  ],

  // ── Open Graph (Facebook / LinkedIn previews) ────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Policy Perspectives Foundation",
    title: "Policy Perspectives Foundation | PPF",
    description:
      "Independent think tank driving evidence-based policy research and public discourse across India.",
    images: [
      {
        url: "/image.png",
        width: 512,
        height: 512,
        alt: "Policy Perspectives Foundation Logo",
      },
    ],
  },

  // ── Twitter / X card ────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Policy Perspectives Foundation | PPF",
    description:
      "Independent think tank driving evidence-based policy research and public discourse across India.",
    images: ["/image.png"],
  },

  // ── Canonical + indexing ─────────────────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}