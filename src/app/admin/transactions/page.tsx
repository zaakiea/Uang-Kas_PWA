"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    // Join table transactions dengan users untuk dapat nama
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
      <h1 className="text-2xl font-bold text-gray-800">Riwayat Transaksi</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
            ) : (
              transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-gray-50">
                  <td className="p-4">{formatDate(trx.tanggal_transaksi)}</td>
                  <td className="p-4 font-medium">
                    {trx.users?.nama_lengkap || "-"}
                  </td>
                  <td className="p-4 text-gray-500">{trx.keterangan}</td>
                  <td className="p-4">
                    {trx.tipe === "PEMASUKAN" ? (
                      <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs w-fit">
                        <ArrowUpCircle className="w-3 h-3" /> Masuk
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs w-fit">
                        <ArrowDownCircle className="w-3 h-3" /> Keluar
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        trx.status === "VERIFIED"
                          ? "bg-blue-100 text-blue-700"
                          : trx.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {trx.status}
                    </span>
                  </td>
                  <td
                    className={`p-4 text-right font-semibold ${
                      trx.tipe === "PEMASUKAN"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {trx.tipe === "PENGELUARAN" ? "-" : "+"}
                    Rp {trx.nominal.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
