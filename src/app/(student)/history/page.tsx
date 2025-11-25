"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Riwayat Transaksi Saya
      </h1>

      <div className="space-y-3">
        {loading ? (
          <p>Memuat...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500">Belum ada riwayat transaksi.</p>
        ) : (
          transactions.map((trx) => (
            <div
              key={trx.id}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-800">{trx.keterangan}</p>
                <p className="text-xs text-gray-500">
                  {new Date(trx.tanggal_transaksi).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  Rp {trx.nominal.toLocaleString()}
                </p>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    trx.status === "VERIFIED"
                      ? "bg-green-100 text-green-700"
                      : trx.status === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {trx.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
