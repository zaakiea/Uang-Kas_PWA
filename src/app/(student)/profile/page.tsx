"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  GraduationCap,
} from "lucide-react";

export default function StudentProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (session) setUser(JSON.parse(session));
  }, []);

  if (!user) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-lg mx-auto p-4 pb-24 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Profil Saya</h1>

      {/* Header Profile */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-blue-600"></div>

        <div className="relative pt-10 mb-4">
          <div className="w-28 h-28 bg-white p-1.5 rounded-full mx-auto shadow-md">
            <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <User size={48} />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900">{user.nama_lengkap}</h2>
        <p className="text-gray-500">{user.nim}</p>
        <div className="mt-3">
          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
            Mahasiswa Aktif
          </span>
        </div>
      </div>

      {/* Info Lengkap */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-gray-800">Informasi Lengkap</h3>
        </div>

        <div className="p-4 space-y-5">
          {/* Akademik */}
          <div className="grid grid-cols-[24px_1fr] gap-4 items-center">
            <GraduationCap size={20} className="text-blue-500" />
            <div>
              <p className="text-xs text-gray-400">Fakultas & Prodi</p>
              <p className="text-sm font-medium text-gray-900">
                {user.fakultas} &bull; {user.prodi}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[24px_1fr] gap-4 items-center">
            <Briefcase size={20} className="text-blue-500" />
            <div>
              <p className="text-xs text-gray-400">Angkatan</p>
              <p className="text-sm font-medium text-gray-900">
                {user.angkatan}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 my-2"></div>

          {/* Kontak */}
          <div className="grid grid-cols-[24px_1fr] gap-4 items-center">
            <Mail size={20} className="text-orange-500" />
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-900">
                {user.email || "-"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[24px_1fr] gap-4 items-center">
            <Phone size={20} className="text-green-500" />
            <div>
              <p className="text-xs text-gray-400">Nomor HP</p>
              <p className="text-sm font-medium text-gray-900">
                {user.no_hp || "-"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[24px_1fr] gap-4 items-center">
            <Calendar size={20} className="text-purple-500" />
            <div>
              <p className="text-xs text-gray-400">Tanggal Lahir</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(user.tanggal_lahir)}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Tombol Logout dihapus sesuai permintaan */}
    </div>
  );
}
