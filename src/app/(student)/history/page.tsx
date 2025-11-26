"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Eye, Search, Filter } from "lucide-react";
import TransactionDetailDialog from "@/components/student/TransactionDetailDialog";

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (session) {
      const user = JSON.parse(session);
      fetchHistory(user.id);
    }
  }, []);

  const fetchHistory = async (userId: number) => {
    setLoading(true);
    const { data } = await supabase
      .from("transaksi")
      .select("*")
      .eq("user_id", userId)
      .order("tanggal_transaksi", { ascending: false });

    if (data) setTransactions(data);
    setLoading(false);
  };

  // Filter logika sederhana (bisa dikembangkan)
  const filteredTransactions = transactions.filter(
    (t) =>
      t.keterangan.toLowerCase().includes(filter.toLowerCase()) ||
      t.nominal.toString().includes(filter)
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Kas Saya</h1>
          <p className="text-sm text-gray-500">
            Daftar semua riwayat kas Anda.
          </p>
        </div>

        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari riwayat..."
            className="w-full sm:w-64 pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Tabel Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-semibold">Tanggal</th>
                <th className="p-4 font-semibold">Keterangan</th>
                <th className="p-4 font-semibold text-right">Nominal</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-gray-500 flex flex-col items-center justify-center gap-2"
                  >
                    <Filter className="w-8 h-8 text-gray-300" />
                    <p>Tidak ada riwayat transaksi ditemukan.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => (
                  <tr
                    key={trx.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    {/* Tanggal */}
                    <td className="p-4 text-gray-500 whitespace-nowrap">
                      {new Date(trx.tanggal_transaksi).toLocaleDateString(
                        "id-ID",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>

                    {/* Keterangan */}
                    <td className="p-4 font-medium text-gray-900 max-w-xs truncate">
                      {trx.keterangan}
                    </td>

                    {/* Nominal */}
                    <td
                      className={`p-4 text-right font-bold whitespace-nowrap ${
                        trx.tipe === "PEMASUKAN"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {trx.tipe === "PENGELUARAN" ? "- " : "+ "}
                      Rp {trx.nominal.toLocaleString("id-ID")}
                    </td>

                    {/* Status */}
                    <td className="p-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          trx.status === "VERIFIED"
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : trx.status === "REJECTED"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                        }`}
                      >
                        {trx.status === "VERIFIED"
                          ? "Selesai"
                          : trx.status === "REJECTED"
                          ? "Ditolak"
                          : "Proses"}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="p-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => setSelectedTransaction(trx)}
                        className="inline-flex items-center justify-center p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog Detail */}
      <TransactionDetailDialog
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
