import type { Metadata } from "next";
import SiteMotion from "@/components/site/SiteMotion";
import localFont from "next/font/local";
import "./globals.css";
import "./about/about.css";
import "./site.css";
import "./decor.css";
import { SITE_NAME } from "@/lib/site";

const serif = localFont({
  src: "./fonts/cormorant-garamond.ttf",
  weight: "500 700",
  variable: "--about-serif",
  display: "swap",
});
const script = localFont({
  src: "./fonts/sacramento.ttf",
  weight: "400",
  variable: "--about-script",
  display: "swap",
});
const sans = localFont({
  src: "./fonts/quicksand.ttf",
  weight: "300 700",
  variable: "--about-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shanzosalon.com"),
  title: `${SITE_NAME} | Hair, Nails & Waxing in Chicago`,
  description: `Personal hair, nail, and waxing services for men, women, and kids at ${SITE_NAME} in Chicago. Book your appointment today.`,
  openGraph: {
    title: `${SITE_NAME} | Chicago Hair, Nails & Waxing`,
    description: "Hair, nails, and waxing for men, women, and kids in Chicago.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/pedicure-lounge.webp",
        alt: "The pedicure lounge at Shanzo Salon",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${script.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">{children}<SiteMotion /></body>
    </html>
  );
}
