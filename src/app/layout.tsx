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
    default: "JagaDana - AI-Powered Fraud Detection",
    template: "%s | JagaDana",
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
  authors: [{ name: "JagaDana Team" }],
  creator: "JagaDana",
  publisher: "JagaDana",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://JagaDana.ai"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://JagaDana.ai",
    title: "SI JagaDana - AI-Powered Fraud Detection",
    description:
      "Comprehensive AI-powered fraud detection platform for Indonesian financial institutions",
    siteName: "JagaDana",
  },
  twitter: {
    card: "summary_large_image",
    title: "JagaDana - AI-Powered Fraud Detection",
    description:
      "Comprehensive AI-powered fraud detection platform for Indonesian financial institutions",
    creator: "@JagaDana",
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
                // Default to dark mode, only go light if explicitly set to light
                if (localStorage.theme === 'light' || (localStorage.theme === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.remove('dark')
                } else {
                  document.documentElement.classList.add('dark')
                }
              } catch (_) {
                // Fallback to dark mode
                document.documentElement.classList.add('dark')
              }
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