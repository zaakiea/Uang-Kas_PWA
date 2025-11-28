"use client";

import { useEffect, useState } from "react";
import { User, Mail, Phone, Calendar, BookOpen, Hash } from "lucide-react";

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (session) setUser(JSON.parse(session));
  }, []);

  if (!user) return null;

  // Helper untuk format tanggal
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-bold text-gray-800">Profil Admin</h1>

      {/* Kartu Utama */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Biru */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800 relative"></div>

        <div className="px-6 pb-6 relative">
          {/* Foto Profil / Inisial */}
          <div className="-mt-12 mb-4">
            <div className="w-24 h-24 bg-white p-1 rounded-full shadow-lg inline-block">
              <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
                {user.nama_lengkap?.charAt(0) || <User />}
              </div>
            </div>
          </div>

          {/* Nama & Role */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.nama_lengkap}
              </h2>
              <p className="text-gray-500">{user.nim}</p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
              ADMINISTRATOR
            </span>
          </div>

          {/* Detail Informasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kolom Kiri: Akademik */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                Data Akademik
              </h3>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                  <BookOpen size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Fakultas</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.fakultas || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                  <Hash size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Program Studi</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.prodi || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Angkatan</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.angkatan || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Pribadi */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                Kontak & Pribadi
              </h3>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.email || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Nomor HP</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.no_hp || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tanggal Lahir</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(user.tanggal_lahir)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
