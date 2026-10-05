import type { ReactNode } from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { CookieConsent } from "@/components/CookieConsent";

export const metadata: Metadata = {
  metadataBase: new URL("https://birminghamairportcars.co.uk"),
  title: {
    default: "Birmingham Airport Cars | Premium Airport Transfers",
    template: "%s | Birmingham Airport Cars",
  },
  description: "Fixed-price airport transfers across Birmingham and the West Midlands.",
  verification: {
    other: {
      "ahrefs-site-verification": "<meta name="ahrefs-site-verification" content="b1fcba24fbbf3a2a0f49e1dfd06a74899488eab90e75b5b51895bc71544bcec9">
",
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <GoogleAnalytics measurementId={measurementId} />
        </Suspense>
        <Header />
        <main>{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
