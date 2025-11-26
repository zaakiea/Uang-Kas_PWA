"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, UploadCloud, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function PayPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // State untuk Form
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nominal: "",
    keterangan: "",
  });

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (session) {
      setUserId(JSON.parse(session).id);
    } else {
      router.push("/login");
    }
  }, [router]);

  // Handle pemilihan file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validasi: Maksimal 2MB
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar (Maksimal 2MB)");
        return;
      }

      // Validasi: Harus Gambar
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Mohon upload file gambar (JPG/PNG)");
        return;
      }

      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (!file) {
      toast.error("Wajib upload bukti pembayaran!");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload Gambar ke Supabase Storage
      // Nama file unik: userId-timestamp.ext
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload ke bucket 'bukti-bayar'
      const { error: uploadError } = await supabase.storage
        .from("bukti-bayar")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Dapatkan Public URL gambar
      const { data: urlData } = supabase.storage
        .from("bukti-bayar")
        .getPublicUrl(filePath);

      // 3. Simpan Data Transaksi ke Database
      const { error: insertError } = await supabase.from("transaksi").insert([
        {
          user_id: userId,
          tipe: "PEMASUKAN",
          nominal: parseInt(formData.nominal),
          keterangan: formData.keterangan,
          status: "PENDING", // Status awal pending
          bukti_bayar: urlData.publicUrl, // Simpan URL gambar
          tanggal_transaksi: new Date().toISOString(),
        },
      ]);

      if (insertError) throw insertError;

      toast.success("Pembayaran berhasil dikirim! Menunggu verifikasi admin.");
      router.push("/history"); // Redirect ke halaman history
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Gagal mengirim pembayaran");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Setor Uang Kas</h1>
        <p className="text-gray-500 text-sm">
          Isi form di bawah untuk membayar iuran.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input Nominal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nominal (Rp) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                Rp
              </span>
              <input
                type="number"
                required
                min="1000"
                placeholder="50.000"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 text-lg font-semibold placeholder:font-normal"
                value={formData.nominal}
                onChange={(e) =>
                  setFormData({ ...formData, nominal: e.target.value })
                }
              />
            </div>
          </div>

          {/* Input Keterangan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keterangan / Bulan <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              placeholder="Contoh: Iuran Kas Bulan November 2025"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none bg-white text-gray-900"
              value={formData.keterangan}
              onChange={(e) =>
                setFormData({ ...formData, keterangan: e.target.value })
              }
            />
          </div>

          {/* Upload Bukti Transfer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bukti Transfer <span className="text-red-500">*</span>
            </label>

            {!previewUrl ? (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="p-3 bg-blue-50 rounded-full mb-3 group-hover:bg-blue-100 transition-colors">
                    <UploadCloud className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="mb-1 text-sm text-gray-700 font-medium">
                    Klik untuk upload gambar
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG (Max. 2MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group">
                <Image
                  src={previewUrl}
                  alt="Preview Bukti"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={removeFile}
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-transform transform hover:scale-110"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                  <ImageIcon size={12} />
                  {file?.name.length! > 20
                    ? file?.name.substring(0, 20) + "..."
                    : file?.name}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mengirim...
                </>
              ) : (
                "Kirim Pembayaran"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
