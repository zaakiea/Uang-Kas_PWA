import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// 1. Konfigurasi Viewport (Warna tema browser di HP)
export const viewport: Viewport = {
  themeColor: "#2563eb", // Warna biru DigiKas
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Agar terasa seperti app native (tidak bisa zoom cubit)
};

// 2. Konfigurasi Metadata & Manifest
export const metadata: Metadata = {
  title: "DigiKas",
  description: "Aplikasi Uang Kas Angkatan",
  manifest: "/manifest.json", // Link ke file manifest
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DigiKas",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
