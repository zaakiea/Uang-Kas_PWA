import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 1. Import Inter
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// 2. Konfigurasi Font Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans", // Nama variabel CSS yang akan dipanggil di globals.css
  display: "swap",
});

export const metadata: Metadata = {
  title: "Uang Kas Digital",
  description: "Aplikasi Uang Kas Angkatan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      {/* 3. Terapkan variabel font ke body */}
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
