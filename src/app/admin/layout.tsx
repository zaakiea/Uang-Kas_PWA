// src/app/admin/layout.tsx
import Sidebar from "@/components/layout/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Admin - role="ADMIN" akan memuat menu admin */}
      <Sidebar role="ADMIN" />

      {/* Konten Utama */}
      <div className="flex-1 w-full lg:ml-0">
        {/* Padding atas (mt-14) di mobile agar tidak tertutup toggle button */}
        <main className="p-4 lg:p-8 mt-14 lg:mt-0">{children}</main>
      </div>
    </div>
  );
}
