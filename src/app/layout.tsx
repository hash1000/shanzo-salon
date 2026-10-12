import type { Metadata } from "next";
import { Parisienne, Quicksand } from "next/font/google";
import "./globals.css";
import "./home.css";
import { SITE_NAME } from "@/lib/site";

const parisienne = Parisienne({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-parisienne",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: `${SITE_NAME} | Nail & Beauty Salon in Chicago`,
  description: `Experience luxurious nail and beauty treatments at ${SITE_NAME} in Chicago. Book your appointment today.`,
  openGraph: { title: `${SITE_NAME} | Chicago Nail & Beauty Salon`, description: "Experience luxurious beauty treatments at our salon in Chicago’s Gold Coast.", type: "website", locale: "en_US", images: [{ url: "/media/hero.jpeg", alt: "Gold Coast Beauty Spa salon interior" }] },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${parisienne.variable} ${quicksand.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}