"use client";
import { useEffect, useState } from "react";

export default function StudentProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (session) setUser(JSON.parse(session));
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profil Saya</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Nama Lengkap</label>
            <p className="font-medium text-lg text-gray-900">
              {user.nama_lengkap}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">NIM</label>
            <p className="font-medium text-lg text-gray-900">{user.nim}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Program Studi</label>
            <p className="font-medium text-lg text-gray-900">{user.prodi}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Angkatan</label>
            <p className="font-medium text-lg text-gray-900">{user.angkatan}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
