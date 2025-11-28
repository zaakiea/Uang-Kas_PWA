"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Loader2,
  Plus,
  X,
  Wallet,
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface AddTransactionDialogProps {
  onSuccess: () => void;
}

export default function AddTransactionDialog({
  onSuccess,
}: AddTransactionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState<number | null>(null);

  // State untuk File
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    tipe: "PEMASUKAN",
    nominal: "",
    keterangan: "",
  });

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (session) {
      setAdminId(JSON.parse(session).id);
    }
  }, []);

  // Handle File Select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error("Maksimal ukuran file 2MB");
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
    if (!adminId) {
      toast.error("Sesi habis, silakan login ulang");
      return;
    }

    setLoading(true);

    try {
      let publicUrl = null;

      // 1. Upload Gambar jika ada
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `admin-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("bukti-bayar")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("bukti-bayar")
          .getPublicUrl(fileName);
        publicUrl = data.publicUrl;
      }

      // 2. Simpan Data
      const { error } = await supabase.from("transaksi").insert([
        {
          user_id: adminId,
          tipe: formData.tipe,
          nominal: parseInt(formData.nominal),
          keterangan: formData.keterangan,
          status: "VERIFIED",
          bukti_bayar: publicUrl,
          tanggal_transaksi: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast.success("Transaksi berhasil disimpan!");

      // Reset Form
      setFormData({ tipe: "PEMASUKAN", nominal: "", keterangan: "" });
      removeFile();
      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error("Gagal menyimpan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
      >
        <Plus size={16} />
        Tambah Transaksi
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-600" />
                Input Kas Manual
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Tipe Transaksi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipe Transaksi
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, tipe: "PEMASUKAN" })
                    }
                    className={`p-2.5 rounded-lg border text-sm font-medium transition-all ${
                      formData.tipe === "PEMASUKAN"
                        ? "bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Pemasukan
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, tipe: "PENGELUARAN" })
                    }
                    className={`p-2.5 rounded-lg border text-sm font-medium transition-all ${
                      formData.tipe === "PENGELUARAN"
                        ? "bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Pengeluaran
                  </button>
                </div>
              </div>

              {/* Nominal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nominal (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                  placeholder="50000"
                  value={formData.nominal}
                  onChange={(e) =>
                    setFormData({ ...formData, nominal: e.target.value })
                  }
                />
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keterangan
                </label>
                <textarea
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none bg-white text-gray-900"
                  placeholder="Contoh: Pembelian Spidol..."
                  value={formData.keterangan}
                  onChange={(e) =>
                    setFormData({ ...formData, keterangan: e.target.value })
                  }
                />
              </div>

              {/* Upload Bukti/Nota */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bukti / Nota (Opsional)
                </label>

                {!previewUrl ? (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                      <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-xs font-medium">
                        Klik untuk upload gambar
                      </p>
                      <p className="text-[10px] mt-1">JPG, PNG (Max 2MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="relative w-full h-40 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 pt-2 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 shadow-sm"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
