"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Check, X, Search, Eye, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function VerificationsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // State untuk Dialog Penolakan
  const [rejectDialog, setRejectDialog] = useState<{
    isOpen: boolean;
    id: number | null;
    originalKeterangan: string;
  }>({ isOpen: false, id: null, originalKeterangan: "" });
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("transaksi")
      .select(`*, users(nama_lengkap, nim, prodi)`)
      .eq("status", "PENDING")
      .eq("tipe", "PEMASUKAN")
      .order("tanggal_transaksi", { ascending: true });

    if (error) {
      toast.error("Gagal memuat data: " + error.message);
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  const handleApprove = async (id: number) => {
    if (!confirm("Terima setoran ini?")) return;

    const { error } = await supabase
      .from("transaksi")
      .update({ status: "VERIFIED" })
      .eq("id", id);

    if (!error) {
      toast.success("Setoran diterima");
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } else {
      toast.error("Gagal memproses: " + error.message);
    }
  };

  // Membuka dialog tolak
  const openRejectDialog = (id: number, currentKeterangan: string) => {
    setRejectDialog({
      isOpen: true,
      id,
      originalKeterangan: currentKeterangan,
    });
    setRejectReason(""); // Reset alasan
  };

  // Submit penolakan
  const submitRejection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectDialog.id) return;

    setIsRejecting(true);

    // Format keterangan baru: "Keterangan Asli [DITOLAK: Alasan]"
    const newKeterangan = `${rejectDialog.originalKeterangan} [DITOLAK: ${rejectReason}]`;

    const { error } = await supabase
      .from("transaksi")
      .update({
        status: "REJECTED",
        keterangan: newKeterangan,
      })
      .eq("id", rejectDialog.id);

    if (!error) {
      toast.success("Setoran ditolak");
      setRequests((prev) => prev.filter((req) => req.id !== rejectDialog.id));
      setRejectDialog({ isOpen: false, id: null, originalKeterangan: "" });
    } else {
      toast.error("Gagal menolak: " + error.message);
    }

    setIsRejecting(false);
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.users.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
      req.users.nim.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Verifikasi Setoran
          </h1>
          <p className="text-sm text-gray-500">
            {requests.length} permintaan menunggu persetujuan
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari Nama / NIM..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white text-gray-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
              <tr>
                <th className="p-4 whitespace-nowrap">Tanggal</th>
                <th className="p-4">Mahasiswa</th>
                <th className="p-4">Nominal</th>
                <th className="p-4">Keterangan</th>
                <th className="p-4 text-center">Bukti</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-gray-500 flex flex-col items-center gap-2"
                  >
                    <AlertCircle className="w-8 h-8 text-gray-300" />
                    <p>Tidak ada data yang perlu diverifikasi.</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="p-4 whitespace-nowrap text-gray-500">
                      {new Date(req.tanggal_transaksi).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {req.users.nama_lengkap}
                      </div>
                      <div className="text-xs text-gray-500">
                        {req.users.nim}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-green-600 whitespace-nowrap">
                      Rp {req.nominal.toLocaleString("id-ID")}
                    </td>
                    <td className="p-4 max-w-xs truncate text-gray-900">
                      {req.keterangan}
                    </td>
                    <td className="p-4 text-center">
                      {req.bukti_bayar ? (
                        <button
                          onClick={() => setSelectedImage(req.bukti_bayar)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md hover:bg-blue-100 transition"
                        >
                          <Eye size={14} /> Lihat
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          Tanpa Bukti
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm transition-all"
                          title="Terima"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() =>
                            openRejectDialog(req.id, req.keterangan)
                          }
                          className="p-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Tolak"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Preview Gambar */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <Image
              src={selectedImage}
              alt="Bukti"
              width={800}
              height={800}
              className="object-contain max-h-full rounded-lg"
            />
            <button className="absolute top-2 right-2 p-2 bg-white/20 text-white rounded-full">
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Modal Tolak dengan Alasan */}
      {rejectDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Tolak Pembayaran
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Silakan masukkan alasan mengapa pembayaran ini ditolak. Alasan ini
              akan muncul di riwayat mahasiswa.
            </p>

            <form onSubmit={submitRejection}>
              <textarea
                required
                autoFocus
                placeholder="Contoh: Bukti transfer tidak terbaca, Nominal tidak sesuai..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm bg-white text-gray-900 h-32 resize-none"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() =>
                    setRejectDialog({ ...rejectDialog, isOpen: false })
                  }
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isRejecting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-70"
                >
                  {isRejecting && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  Tolak Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
