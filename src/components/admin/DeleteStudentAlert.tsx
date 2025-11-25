"use client";
import { toast } from "sonner";
import { useState } from "react";
import { Trash2, Loader2, X, AlertTriangle } from "lucide-react";

interface DeleteStudentAlertProps {
  user: any;
  onSuccess: () => void;
}

export default function DeleteStudentAlert({
  user,
  onSuccess,
}: DeleteStudentAlertProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/mahasiswa/${user.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus data");

      // GANTI alert
      toast.success("Mahasiswa berhasil dihapus");

      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
        title="Hapus Mahasiswa"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Hapus Mahasiswa?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Apakah Anda yakin ingin menghapus data{" "}
                <strong>{user.nama_lengkap}</strong>? Tindakan ini tidak dapat
                dibatalkan.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isLoading && <Loader2 size={16} className="animate-spin" />}
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
