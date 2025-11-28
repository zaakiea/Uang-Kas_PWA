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
    const session = localStorage.getItem("user_session");
    if (!session) {
      router.push("/login");
      return;
    }
    const userData = JSON.parse(session);

    if (userData.role === "ADMIN") {
      router.push("/admin/dashboard");
      return;
    }
    setUser(userData);

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
      <div className="bg-blue-600 px-6 pt-8 pb-24 rounded-b-[2.5rem] shadow-lg text-white relative z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center mb-4">
          <div>
            <p className="text-blue-100 text-sm">Selamat Datang,</p>
            <h1 className="text-2xl font-bold">{user.nama_lengkap}</h1>
            <p className="text-sm text-blue-200 mt-1">
              {user.nim} - {user.prodi}
            </p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 -mt-20 relative z-20 space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Total Saldo Kas (Sudah diganti) */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                Total Saldo Kas
              </p>
              <h2 className="text-2xl font-bold text-gray-900">
                Rp {stats.saldo_angkatan.toLocaleString("id-ID")}
              </h2>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Wallet size={24} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                Total Pengeluaran
              </p>
              <p className="text-2xl font-bold text-gray-900">
                Rp {stats.total_pengeluaran.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <TrendingDown size={24} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                Setoran Saya
              </p>
              <p className="text-2xl font-bold text-gray-900">
                Rp {stats.uang_saya.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <CreditCard size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <StudentChart data={chartData} loading={loading} />
        </div>

        <div>
          <h3 className="font-bold text-gray-800 mb-3 text-lg">Aksi Cepat</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/pay">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block">
                      Bayar Uang Kas
                    </span>
                    <span className="text-xs text-gray-500">
                      Upload bukti transfer
                    </span>
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="text-gray-400 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </Link>

            <Link href="/history">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-200 transition">
                    <History size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block">
                      Riwayat Transaksi
                    </span>
                    <span className="text-xs text-gray-500">
                      Lihat status pembayaran
                    </span>
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="text-gray-400 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
