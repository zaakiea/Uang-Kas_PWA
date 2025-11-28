// src/app/dashboard/layout.tsx
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Mahasiswa */}
      <Sidebar role="MAHASISWA" />

      {/* Wrapper Konten */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        {/* PERBAIKAN UTAMA DI SINI: */}
        {/* pt-16: Memberi jarak atas 64px di HP agar tidak tertutup header */}
        {/* lg:pt-0: Menghapus jarak tersebut di laptop karena sidebar ada di samping */}
        <main className="flex-1 pt-16 lg:pt-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
