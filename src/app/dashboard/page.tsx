"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wallet,
  TrendingDown,
  CreditCard,
  ArrowRight,
  User,
  History,
} from "lucide-react";
import StudentChart from "@/components/student/StudentChart";
import Link from "next/link";

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    saldo_angkatan: 0,
    total_pengeluaran: 0,
    uang_saya: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Cek Sesi
    const session = localStorage.getItem("user_session");
    if (!session) {
      router.push("/login");
      return;
    }
    const userData = JSON.parse(session);

    // Proteksi Role
    if (userData.role === "ADMIN") {
      router.push("/admin/dashboard");
      return;
    }
    setUser(userData);

    // 2. Ambil Data Dashboard dari API
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(
          `/api/student/dashboard?user_id=${userData.id}`
        );
        const data = await res.json();

        if (res.ok) {
          setStats(data.stats);
          setChartData(data.chart_data);
        }
      } catch (error) {
        console.error("Gagal memuat data dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Welcome */}
      <div className="bg-blue-600 px-6 pt-8 pb-20 rounded-b-[2.5rem] shadow-lg text-white relative z-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-blue-100 text-sm">Selamat Datang,</p>
            <h1 className="text-2xl font-bold">{user.nama_lengkap}</h1>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>
        <p className="text-sm text-blue-200">
          {user.nim} - {user.prodi}
        </p>
      </div>

      <div className="px-6 -mt-14 relative z-20 space-y-6">
        {/* 3 Kartu Utama (Statistik) */}
        <div className="grid gap-4">
          {/* Card 1: Saldo Kas Angkatan (Highlight Utama) */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                Saldo Kas Angkatan
              </p>
              <h2 className="text-2xl font-bold text-gray-900">
                Rp {stats.saldo_angkatan.toLocaleString("id-ID")}
              </h2>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Wallet size={24} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Card 2: Pengeluaran Angkatan */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg w-fit mb-3">
                <TrendingDown size={20} />
              </div>
              <p className="text-gray-500 text-xs font-medium mb-1">
                Total Pengeluaran
              </p>
              <p className="text-lg font-bold text-gray-900">
                Rp {stats.total_pengeluaran.toLocaleString("id-ID")}
              </p>
            </div>

            {/* Card 3: Setoran Saya */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg w-fit mb-3">
                <CreditCard size={20} />
              </div>
              <p className="text-gray-500 text-xs font-medium mb-1">
                Kas Saya Dibayar
              </p>
              <p className="text-lg font-bold text-gray-900">
                Rp {stats.uang_saya.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        {/* Grafik */}
        <StudentChart data={chartData} loading={loading} />

        {/* Menu Cepat */}
        <div>
          <h3 className="font-bold text-gray-800 mb-3 text-lg">Aksi Cepat</h3>
          <div className="grid gap-3">
            <Link href="/pay">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <CreditCard size={20} />
                  </div>
                  <span className="font-medium text-gray-700">
                    Bayar Uang Kas
                  </span>
                </div>
                <ArrowRight size={18} className="text-gray-400" />
              </div>
            </Link>

            <Link href="/history">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <History size={20} />
                  </div>
                  <span className="font-medium text-gray-700">
                    Riwayat Transaksi
                  </span>
                </div>
                <ArrowRight size={18} className="text-gray-400" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
