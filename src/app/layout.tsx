import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'SmartMenu - Digital Menu Management for Restaurants',
    template: '%s | SmartMenu',
  },
  description: 'SmartMenu is a powerful SaaS platform that helps restaurants, cafes, and pubs manage their digital menus instantly. Create QR code menus, TV displays, and manage your menu items with ease. Free and Pro plans available.',
  keywords: [
    'digital menu',
    'QR code menu',
    'restaurant menu',
    'menu management',
    'hospitality software',
    'restaurant technology',
    'digital menu board',
    'TV menu display',
    'menu management system',
    'restaurant SaaS',
  ],
  authors: [{ name: 'SmartMenu' }],
  creator: 'SmartMenu',
  publisher: 'SmartMenu',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'SmartMenu',
    title: 'SmartMenu - Digital Menu Management for Restaurants',
    description: 'Manage your restaurant menu digitally with QR codes and TV displays. Instant updates, easy management, and professional presentation.',
    images: [
      {
        url: '/og-image.png', // You can add this image later
        width: 1200,
        height: 630,
        alt: 'SmartMenu - Digital Menu Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartMenu - Digital Menu Management for Restaurants',
    description: 'Manage your restaurant menu digitally with QR codes and TV displays. Instant updates, easy management.',
    images: ['/og-image.png'], // You can add this image later
    creator: '@smartmenu', // Update with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
