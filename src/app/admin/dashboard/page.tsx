// src/app/admin/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Cek sesi sederhana
    const session = localStorage.getItem("user_session");
    if (!session) {
      router.push("/login");
    } else {
      const userData = JSON.parse(session);
      if (userData.role !== "ADMIN") router.push("/login"); // Proteksi role
      setUser(userData);
    }
  }, [router]);

  if (!user)
    return <div className="p-10 text-center">Loading Dashboard Admin...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-2xl font-bold text-blue-800">Dashboard Admin</h1>
      <p>Halo, {user.nama_lengkap} (Admin)</p>
      <div className="mt-5 bg-white p-5 rounded shadow">
        <p>Menu Admin akan tampil di sini.</p>
        <button
          onClick={() => {
            localStorage.removeItem("user_session");
            router.push("/login");
          }}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
