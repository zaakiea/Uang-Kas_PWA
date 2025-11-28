"use client";

import { useEffect, useState } from "react";

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (session) setUser(JSON.parse(session));
  }, []);

  if (!user) return null;

  return (
    // Tambahkan 'p-4' agar ada jarak di layar kecil
    <div className="max-w-md mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-bold text-gray-800">Profil Admin</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg shadow-blue-200">
          {user.nama_lengkap.charAt(0)}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{user.nama_lengkap}</h2>
        <p className="text-gray-500 font-mono text-sm">{user.nim}</p>

        <div className="mt-4 inline-block px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold tracking-wide">
          ADMINISTRATOR
        </div>

        <div className="mt-8 text-left space-y-4 border-t border-gray-100 pt-6">
          <div>
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">
              Fakultas
            </label>
            <p className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
              {user.fakultas || "-"}
            </p>
          </div>
          <div>
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">
              Program Studi
            </label>
            <p className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
              {user.prodi || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
