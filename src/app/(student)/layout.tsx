import Sidebar from "@/components/layout/Sidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="MAHASISWA" />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        <main className="flex-1 p-4 lg:p-8 mt-14 lg:mt-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
