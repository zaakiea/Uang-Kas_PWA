import Sidebar from "@/components/layout/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Admin */}
      <Sidebar role="ADMIN" />

      {/* Main Content Area */}
      <div className="flex-1 w-full lg:ml-0">
        {/* Note: Sidebar di set 'static' di desktop jadi tidak perlu margin-left manual jika pakai flex */}
        <main className="p-4 lg:p-8 mt-14 lg:mt-0">{children}</main>
      </div>
    </div>
  );
}
