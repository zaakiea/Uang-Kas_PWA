"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Cek sesi login
    const session = localStorage.getItem("user_session");
    if (!session) {
      router.push("/login");
      return;
    }
    const userData = JSON.parse(session);

    // Proteksi sederhana: Jika admin mencoba masuk halaman mahasiswa, lempar ke admin
    if (userData.role === "ADMIN") {
      router.push("/admin/dashboard");
      return;
    }
    setUser(userData);
  }, [router]);

  if (!user) return null; // Atau loading spinner

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-600 p-6 text-white rounded-b-3xl shadow-lg">
        <h1 className="text-xl font-semibold">Halo, {user.nama_lengkap}</h1>
        <p className="text-blue-100 text-sm">
          {user.nim} - {user.prodi}
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Card Saldo (Statik dulu/ambil dari API Dashboard nanti) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Saldo Kas Angkatan</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-1">
            Rp 2.500.000
          </h2>
        </div>

        <h3 className="font-semibold text-gray-700 mt-6">Menu Cepat</h3>
        <div className="grid grid-cols-2 gap-4">
          <button className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-center hover:bg-gray-50">
            💰 Bayar Kas
          </button>
          <button className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-center hover:bg-gray-50">
            📜 Riwayat
          </button>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("user_session");
            router.push("/login");
          }}
          className="w-full mt-8 p-3 text-red-600 border border-red-200 rounded-xl"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
