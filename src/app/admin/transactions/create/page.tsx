"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

export default function CreateTransactionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipe: "PEMASUKAN",
    nominal: "",
    keterangan: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const session = JSON.parse(localStorage.getItem("user_session") || "{}");

    try {
      const res = await fetch("/api/transaksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          user_id: session.id,
          status: "VERIFIED",
          tanggal_transaksi: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan transaksi");

      alert("Transaksi berhasil disimpan!");
      router.push("/admin/transactions");
    } catch (error) {
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Input Kas Baru</h1>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Transaksi
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tipe: "PEMASUKAN" })}
                className={`py-3 rounded-lg border font-medium transition ${
                  formData.tipe === "PEMASUKAN"
                    ? "bg-green-50 border-green-500 text-green-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Pemasukan (+)
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, tipe: "PENGELUARAN" })
                }
                className={`py-3 rounded-lg border font-medium transition ${
                  formData.tipe === "PENGELUARAN"
                    ? "bg-red-50 border-red-500 text-red-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Pengeluaran (-)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nominal (Rp)
            </label>
            <input
              type="number"
              required
              // PERBAIKAN: Tambahkan text-gray-900 bg-white
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
              placeholder="Contoh: 50000"
              value={formData.nominal}
              onChange={(e) =>
                setFormData({ ...formData, nominal: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keterangan
            </label>
            <textarea
              required
              rows={3}
              // PERBAIKAN: Tambahkan text-gray-900 bg-white
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
              placeholder="Contoh: Beli perlengkapan acara..."
              value={formData.keterangan}
              onChange={(e) =>
                setFormData({ ...formData, keterangan: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {loading ? "Menyimpan..." : "Simpan Transaksi"}
          </button>
        </form>
      </div>
    </div>
  );
}
