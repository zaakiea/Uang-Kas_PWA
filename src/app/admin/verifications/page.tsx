"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Check, X } from "lucide-react";

export default function VerificationsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("transaksi")
      .select(`*, users(nama_lengkap, nim)`)
      .eq("status", "PENDING")
      .eq("tipe", "PEMASUKAN") // Hanya verifikasi uang masuk
      .order("tanggal_transaksi", { ascending: true });

    setRequests(data || []);
    setLoading(false);
  };

  const handleVerification = async (
    id: number,
    status: "VERIFIED" | "REJECTED"
  ) => {
    const confirmMsg =
      status === "VERIFIED"
        ? "Terima pembayaran ini?"
        : "Tolak pembayaran ini?";
    if (!confirm(confirmMsg)) return;

    const { error } = await supabase
      .from("transaksi")
      .update({ status })
      .eq("id", id);

    if (!error) {
      // Refresh list
      setRequests(requests.filter((req) => req.id !== id));
    } else {
      alert("Gagal memproses: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Verifikasi Setoran</h1>

      {loading ? (
        <p>Memuat data...</p>
      ) : requests.length === 0 ? (
        <div className="bg-white p-8 rounded-xl text-center text-gray-500 border border-gray-100">
          Tidak ada permintaan setoran pending saat ini.
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">
                    {req.users.nama_lengkap}
                  </h3>
                  <p className="text-xs text-gray-500">{req.users.nim}</p>
                </div>
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded font-medium">
                  Pending
                </span>
              </div>

              <div className="py-3 border-t border-b border-gray-100 my-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Nominal</span>
                  <span className="font-bold text-green-600">
                    Rp {req.nominal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Keterangan</span>
                  <span className="text-gray-800">{req.keterangan}</span>
                </div>
                {req.bukti_bayar && (
                  <div className="mt-2">
                    <a
                      href={req.bukti_bayar}
                      target="_blank"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Lihat Bukti Pembayaran
                    </a>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleVerification(req.id, "REJECTED")}
                  className="flex-1 flex items-center justify-center gap-2 p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium"
                >
                  <X size={16} /> Tolak
                </button>
                <button
                  onClick={() => handleVerification(req.id, "VERIFIED")}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  <Check size={16} /> Terima
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
