"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";

export default function StudentProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (session) setUser(JSON.parse(session));
  }, []);

  if (!user) return null;

  return (
    // Tambahkan 'p-4' untuk padding mobile
    <div className="max-w-md mx-auto p-4 pb-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profil Saya</h1>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Dekorasi Background Kecil */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-blue-600"></div>

        <div className="relative pt-8 text-center">
          <div className="w-24 h-24 bg-white p-1 rounded-full mx-auto shadow-md">
            <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <User size={40} />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-4">
            {user.nama_lengkap}
          </h2>
          <p className="text-gray-500 text-sm">{user.nim}</p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <label className="text-xs text-gray-400 uppercase font-bold">
              Program Studi
            </label>
            <p className="font-medium text-gray-900 mt-1">{user.prodi}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <label className="text-xs text-gray-400 uppercase font-bold">
              Angkatan
            </label>
            <p className="font-medium text-gray-900 mt-1">{user.angkatan}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <label className="text-xs text-gray-400 uppercase font-bold">
              Fakultas
            </label>
            <p className="font-medium text-gray-900 mt-1">
              {user.fakultas || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
