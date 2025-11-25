"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search } from "lucide-react";
import AddStudentDialog from "@/components/admin/AddStudentDialog";
import EditStudentDialog from "@/components/admin/EditStudentDialog"; // Import Baru
import DeleteStudentAlert from "@/components/admin/DeleteStudentAlert"; // Import Baru

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "MAHASISWA")
      .order("nama_lengkap", { ascending: true });

    if (!error) setUsers(data || []);
    setLoading(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
      user.nim.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Data Mahasiswa</h1>

        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari Nama / NIM..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white text-gray-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <AddStudentDialog onSuccess={fetchUsers} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
              <tr>
                <th className="p-4">NIM</th>
                <th className="p-4">Nama Lengkap</th>
                <th className="p-4">Prodi</th>
                <th className="p-4">Angkatan</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-gray-900">{user.nim}</td>
                    <td className="p-4 font-medium text-gray-900">
                      {user.nama_lengkap}
                    </td>
                    <td className="p-4 text-gray-900">{user.prodi}</td>
                    <td className="p-4 text-gray-900">{user.angkatan}</td>
                    <td className="p-4 flex justify-center gap-2">
                      {/* Tombol Edit */}
                      <EditStudentDialog user={user} onSuccess={fetchUsers} />

                      {/* Tombol Delete */}
                      <DeleteStudentAlert user={user} onSuccess={fetchUsers} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
