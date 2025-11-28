import Sidebar from "@/components/layout/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (Fixed position handled inside component) */}
      <Sidebar role="ADMIN" />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:pl-64">
        {/* pt-16: Memberi ruang untuk header mobile di layar kecil 
           lg:pt-0: Menghilangkan ruang header di desktop (karena sidebar di samping)
        */}
        <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8 overflow-x-hidden w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
