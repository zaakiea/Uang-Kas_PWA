"use client";
import { toast } from "sonner"; // Import toast
import { useState } from "react";
import { X, Loader2, Plus } from "lucide-react";

interface AddStudentDialogProps {
  onSuccess: () => void;
}

export default function AddStudentDialog({ onSuccess }: AddStudentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nim: "",
    nama_lengkap: "",
    fakultas: "",
    prodi: "",
    angkatan: new Date().getFullYear().toString(),
    tanggal_lahir: "",
    no_hp: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/mahasiswa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      // GANTI alert DENGAN toast
      toast.success("Mahasiswa berhasil ditambahkan!");

      setFormData({
        nim: "",
        nama_lengkap: "",
        fakultas: "",
        prodi: "",
        angkatan: new Date().getFullYear().toString(),
        tanggal_lahir: "",
        no_hp: "",
        email: "",
      });
      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      // GANTI alert DENGAN toast
      toast.error(error.message || "Gagal menambahkan data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        <Plus size={16} />
        Tambah Mahasiswa
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                Tambah Mahasiswa Baru
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kolom Kiri */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      NIM *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Contoh: 12345678"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.nim}
                      onChange={(e) =>
                        setFormData({ ...formData, nim: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.nama_lengkap}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nama_lengkap: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fakultas
                    </label>
                    <input
                      type="text"
                      placeholder="Ilmu Komputer"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.fakultas}
                      onChange={(e) =>
                        setFormData({ ...formData, fakultas: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Program Studi
                    </label>
                    <input
                      type="text"
                      placeholder="Teknik Informatika"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.prodi}
                      onChange={(e) =>
                        setFormData({ ...formData, prodi: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Angkatan
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.angkatan}
                      onChange={(e) =>
                        setFormData({ ...formData, angkatan: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Lahir *
                    </label>
                    <input
                      required
                      type="date"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.tanggal_lahir}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tanggal_lahir: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor HP
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.no_hp}
                      onChange={(e) =>
                        setFormData({ ...formData, no_hp: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading && <Loader2 size={16} className="animate-spin" />}
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
