"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PayPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nominal: "",
    keterangan: "",
  });

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (session) setUserId(JSON.parse(session).id);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);

    // Simpan data transaksi (Status PENDING)
    const { error } = await supabase.from("transaksi").insert([
      {
        user_id: userId,
        tipe: "PEMASUKAN",
        nominal: parseInt(formData.nominal),
        keterangan: formData.keterangan,
        status: "PENDING",
        // bukti_bayar: ... (Implementasi upload file butuh setup bucket storage)
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Gagal: " + error.message);
    } else {
      alert("Pembayaran berhasil dikirim! Menunggu verifikasi admin.");
      router.push("/history");
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Bayar Uang Kas</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nominal (Rp)
            </label>
            <input
              type="number"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.nominal}
              onChange={(e) =>
                setFormData({ ...formData, nominal: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keterangan
            </label>
            <textarea
              required
              placeholder="Cth: Iuran Bulan Mei"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
              value={formData.keterangan}
              onChange={(e) =>
                setFormData({ ...formData, keterangan: e.target.value })
              }
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Mengirim..." : "Kirim Pembayaran"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
