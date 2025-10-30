// app/page.js
import "./globals.css";
import HomeClientWrapper from "./_components/HomeClientWrapper";
import Footer from "./_components/Footer";
import { siteConfig } from "./metadata";

// SEO Metadata for homepage
export const metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default async function Page() {
  return (
    <>
      <HomeClientWrapper />
     
      <Footer />
    </>
  );
}
