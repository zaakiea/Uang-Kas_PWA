import Sidebar from "@/components/layout/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="ADMIN" />

      {/* Main Content Wrapper */}
      {/* lg:pl-64 menggeser konten ke kanan saat di desktop agar tidak tertutup sidebar */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        {/* mt-14 memberi jarak untuk Header Mobile yang tingginya 3.5rem (14). Di desktop (lg:mt-0) jarak ini dihapus. */}
        <main className="flex-1 p-4 lg:p-8 mt-14 lg:mt-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
