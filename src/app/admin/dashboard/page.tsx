"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, TrendingUp, TrendingDown, Users } from "lucide-react";
// Import komponen grafik
import TransactionChart from "@/components/admin/TransactionChart";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    pemasukan: 0,
    pengeluaran: 0,
    saldo: 0,
  });

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (!session) {
      router.push("/login");
      return;
    }
    const userData = JSON.parse(session);
    if (userData.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }
    setUser(userData);

    // Fetch Stats Ringkasan
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats({
          pemasukan: data.total_pemasukan || 0,
          pengeluaran: data.total_pengeluaran || 0,
          saldo: data.saldo_kas || 0,
        });
      });
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header Mobile / Desktop */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div>
          <h1 className="font-bold text-xl text-gray-800">Dashboard</h1>
          <p className="text-xs text-gray-500">Selamat datang kembali, Admin</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
            {user.nama_lengkap?.charAt(0)}
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Kartu Ringkasan (KPI Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Saldo */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Saldo Kas</p>
              <p className="text-2xl font-bold text-gray-900">
                Rp {stats.saldo.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* Pemasukan */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Pemasukan
              </p>
              <p className="text-2xl font-bold text-green-600">
                + Rp {stats.pemasukan.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* Pengeluaran */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Pengeluaran
              </p>
              <p className="text-2xl font-bold text-red-600">
                - Rp {stats.pengeluaran.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        {/* Bagian Grafik */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grafik Utama (2/3 Lebar) */}
          <div className="lg:col-span-2">
            <TransactionChart />
          </div>

          {/* Sidebar Kecil / Aktivitas (1/3 Lebar) - Placeholder Menu Cepat */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="font-bold text-gray-800 mb-4">Akses Cepat</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/admin/transactions")}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 text-left transition"
              >
                <div className="bg-blue-100 p-2 rounded-md text-blue-600">
                  <Wallet size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Input Transaksi
                  </p>
                  <p className="text-xs text-gray-500">
                    Catat pemasukan/pengeluaran
                  </p>
                </div>
              </button>

              <button
                onClick={() => router.push("/admin/users")}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 text-left transition"
              >
                <div className="bg-purple-100 p-2 rounded-md text-purple-600">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Data Mahasiswa
                  </p>
                  <p className="text-xs text-gray-500">Kelola data anggota</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
