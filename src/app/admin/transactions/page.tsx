"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import AddTransactionDialog from "@/components/admin/AddTransactionDialog"; // Import Dialog

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("transaksi")
      .select(
        `
        *,
        users (nama_lengkap)
      `
      )
      .order("tanggal_transaksi", { ascending: false });

    if (!error) setTransactions(data || []);
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header dengan Tombol Tambah */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Transaksi</h1>

        {/* Tombol Tambah Transaksi */}
        <AddTransactionDialog onSuccess={fetchTransactions} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-900">
              <tr>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Nama</th>
                <th className="p-4">Keterangan</th>
                <th className="p-4">Tipe</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center">
                    Belum ada data transaksi.
                  </td>
                </tr>
              ) : (
                transactions.map((trx) => (
                  <tr
                    key={trx.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 whitespace-nowrap">
                      {formatDate(trx.tanggal_transaksi)}
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {trx.users?.nama_lengkap || "-"}
                    </td>
                    <td className="p-4 text-gray-500 max-w-xs truncate">
                      {trx.keterangan}
                    </td>
                    <td className="p-4">
                      {trx.tipe === "PEMASUKAN" ? (
                        <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs w-fit font-medium">
                          <ArrowUpCircle className="w-3 h-3" /> Masuk
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs w-fit font-medium">
                          <ArrowDownCircle className="w-3 h-3" /> Keluar
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          trx.status === "VERIFIED"
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : trx.status === "REJECTED"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                        }`}
                      >
                        {trx.status}
                      </span>
                    </td>
                    <td
                      className={`p-4 text-right font-semibold whitespace-nowrap ${
                        trx.tipe === "PEMASUKAN"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {trx.tipe === "PENGELUARAN" ? "- " : "+ "}
                      Rp {trx.nominal.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
