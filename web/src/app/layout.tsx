import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/lib/motion";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://xactaclaim.com";
const title = "XactaClaim — When Disaster Strikes, Clarity Matters";
const description =
  "An interactive story about a homeowner, a public adjuster, and the AI-assisted claim workspace that keeps documents, photos, client updates and review work in one organized file.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: "XactaClaim",
  keywords: [
    "public adjuster software",
    "claim workspace",
    "AI-assisted claim review",
    "property insurance claim",
    "claim documentation",
    "XactaClaim",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title,
    description,
    siteName: "XactaClaim",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "A storm-damaged house at dusk with the headline When Disaster Strikes, Clarity Matters." }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#03060f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "XactaClaim",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://xactaclaim.com",
  description:
    "AI-assisted claim workspace for public adjusters — policy review, estimate comparison, client portal, and team tasks in one organized file.",
  offers: [
    { "@type": "Offer", name: "Solo", price: "0", priceCurrency: "USD" },
    { "@type": "Offer", name: "Pro", price: "19.99", priceCurrency: "USD" },
    { "@type": "Offer", name: "Pro+", price: "34.99", priceCurrency: "USD" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-motion="full" suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/media/house_storm.webp" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${serif.variable} antialiased`}>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
