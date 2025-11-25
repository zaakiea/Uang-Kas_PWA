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
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Profil Admin</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
          {user.nama_lengkap.charAt(0)}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{user.nama_lengkap}</h2>
        <p className="text-gray-500">{user.nim}</p>
        <div className="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          ADMINISTRATOR
        </div>

        <div className="mt-6 text-left space-y-3 border-t border-gray-100 pt-4">
          <div>
            <label className="text-xs text-gray-400 block">Fakultas</label>
            <p className="text-sm font-medium">{user.fakultas || "-"}</p>
          </div>
          <div>
            <label className="text-xs text-gray-400 block">Prodi</label>
            <p className="text-sm font-medium">{user.prodi || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
