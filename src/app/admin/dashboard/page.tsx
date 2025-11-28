"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
  ArrowRight,
} from "lucide-react";
import TransactionChart from "@/components/admin/TransactionChart"; // Pastikan komponen ini ada

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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-20">
        <div>
          <h1 className="font-bold text-2xl text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Ringkasan keuangan angkatan</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-100 px-3 py-1.5 rounded-full">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
            {user.nama_lengkap?.charAt(0)}
          </div>
          <span className="text-sm font-medium text-gray-700 pr-2">
            {user.nama_lengkap}
          </span>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* --- GRID RESPONSIF (KPI CARDS) --- */}
        {/* Mobile: 1 Kolom, Tablet: 2 Kolom, Desktop: 3 Kolom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Saldo */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-sm">
              <Wallet size={28} />
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
            <div className="p-3 bg-green-50 text-green-600 rounded-xl shadow-sm">
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Pemasukan
              </p>
              <p className="text-xl lg:text-2xl font-bold text-green-600">
                + Rp {stats.pemasukan.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* Pengeluaran */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 sm:col-span-2 lg:col-span-1">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl shadow-sm">
              <TrendingDown size={28} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Pengeluaran
              </p>
              <p className="text-xl lg:text-2xl font-bold text-red-600">
                - Rp {stats.pengeluaran.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        {/* --- GRID GRAFIK & WIDGET --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grafik Utama (Mengambil 2 kolom di desktop) */}
          <div className="lg:col-span-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
            <TransactionChart />
          </div>

          {/* Sidebar Kecil / Menu Cepat (1 kolom di desktop) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">
              Akses Cepat
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/admin/transactions")}
                className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 border border-gray-100 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Wallet size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Input Transaksi
                    </p>
                    <p className="text-xs text-gray-500">Catat arus kas baru</p>
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="text-gray-300 group-hover:text-blue-500 transition-colors"
                />
              </button>

              <button
                onClick={() => router.push("/admin/users")}
                className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 border border-gray-100 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                    <Users size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      Data Mahasiswa
                    </p>
                    <p className="text-xs text-gray-500">Kelola anggota</p>
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="text-gray-300 group-hover:text-purple-500 transition-colors"
                />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
