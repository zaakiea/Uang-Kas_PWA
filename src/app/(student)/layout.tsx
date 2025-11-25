import Sidebar from "@/components/layout/Sidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="MAHASISWA" />
      <div className="flex-1 w-full">
        <main className="p-4 lg:p-8 mt-14 lg:mt-0">{children}</main>
      </div>
    </div>
  );
}
