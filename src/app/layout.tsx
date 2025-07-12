// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GuardChain - AI-Powered Fraud Detection",
    template: "%s | GuardChain",
  },
  description:
    "Comprehensive AI-powered fraud detection platform for Indonesian financial institutions",
  keywords: [
    "fraud detection",
    "AI",
    "financial security",
    "banking",
    "Indonesia",
  ],
  authors: [{ name: "GuardChain Team" }],
  creator: "GuardChain",
  publisher: "GuardChain",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://guardchain.ai"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://guardchain.ai",
    title: "GuardChain - AI-Powered Fraud Detection",
    description:
      "Comprehensive AI-powered fraud detection platform for Indonesian financial institutions",
    siteName: "GuardChain",
  },
  twitter: {
    card: "summary_large_image",
    title: "GuardChain - AI-Powered Fraud Detection",
    description:
      "Comprehensive AI-powered fraud detection platform for Indonesian financial institutions",
    creator: "@guardchain",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
