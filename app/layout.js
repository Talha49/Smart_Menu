import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { GlobalLoader } from "@/components/ui/GlobalLoader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: 'swap',
});

export const metadata = {
  title: "SmartMenu - Digital QR Menu SaaS",
  description: "Create beautiful digital menus for your restaurant in seconds.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased bg-background text-foreground font-sans`}>
        <AuthProvider>
          <GlobalLoader />
          {children}
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
