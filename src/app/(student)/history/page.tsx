"use client";

import { useEffect, useState, useCallback } from "react";
import { Eye, Search, Filter, User, Users } from "lucide-react";
import TransactionDetailDialog from "@/components/student/TransactionDetailDialog";
import Pagination from "@/components/common/Pagination";
import { toast } from "sonner";

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [search, setSearch] = useState("");

  // State untuk Tab Aktif (personal | global)
  const [activeTab, setActiveTab] = useState<"personal" | "global">("personal");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Fetch Data Function
  const fetchTransactions = useCallback(
    async (page = 1, limit = 10) => {
      setLoading(true);
      try {
        const session = localStorage.getItem("user_session");
        if (!session) return;
        const user = JSON.parse(session);

        // Tentukan URL berdasarkan Tab
        let url = `/api/transaksi?page=${page}&limit=${limit}`;

        if (activeTab === "personal") {
          // Tab Personal: Filter user_id saya (tampilkan semua status)
          url += `&user_id=${user.id}`;
        } else {
          // Tab Global: Tanpa user_id, tapi HANYA yang VERIFIED (Transparansi)
          url += `&status=VERIFIED`;
        }

        const res = await fetch(url);
        const result = await res.json();

        if (res.ok) {
          setTransactions(result.data || []);
          setPagination({
            page: result.meta.page,
            limit: result.meta.limit,
            total: result.meta.total || 0,
            totalPages: result.meta.totalPages || 0,
          });
        } else {
          toast.error(result.error);
        }
      } catch (err) {
        toast.error("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    },
    [activeTab]
  );

  // Panggil fetch saat Tab atau Pagination berubah
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchTransactions(1, pagination.limit);
  }, [activeTab, fetchTransactions]); // fetchTransactions dimasukkan ke dependency

  // Handle Page Change
  const handlePageChange = (page: number) => {
    fetchTransactions(page, pagination.limit);
  };

  // Client-side search filter
  const filteredTransactions = transactions.filter(
    (t) =>
      t.keterangan?.toLowerCase().includes(search.toLowerCase()) ||
      t.nominal.toString().includes(search) ||
      t.users?.nama_lengkap?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Transaksi</h1>
          <p className="text-sm text-gray-500">
            Pantau riwayat pembayaranmu dan arus kas angkatan.
          </p>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex p-1 bg-gray-100 rounded-xl w-full sm:w-fit">
          <button
            onClick={() => setActiveTab("personal")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "personal"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <User size={18} />
            Riwayat Saya
          </button>
          <button
            onClick={() => setActiveTab("global")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "global"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Users size={18} />
            Semua (Transparansi)
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari keterangan, nominal, atau nama..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABEL */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-semibold whitespace-nowrap">Tanggal</th>
                {/* Tampilkan kolom 'Oleh' hanya di tab Global */}
                {activeTab === "global" && (
                  <th className="p-4 font-semibold whitespace-nowrap">
                    Oleh / Sumber
                  </th>
                )}
                <th className="p-4 font-semibold min-w-[200px]">Keterangan</th>
                <th className="p-4 font-semibold text-right whitespace-nowrap">
                  Nominal
                </th>
                <th className="p-4 font-semibold text-center whitespace-nowrap">
                  Status
                </th>
                <th className="p-4 font-semibold text-center whitespace-nowrap">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-gray-500 flex flex-col items-center justify-center gap-2"
                  >
                    <Filter className="w-8 h-8 text-gray-300" />
                    <p>Tidak ada data ditemukan.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => (
                  <tr
                    key={trx.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    {/* Tanggal */}
                    <td className="p-4 text-gray-500 whitespace-nowrap">
                      {new Date(trx.tanggal_transaksi).toLocaleDateString(
                        "id-ID",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>

                    {/* Nama (Hanya di Global) */}
                    {activeTab === "global" && (
                      <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                        {trx.users?.nama_lengkap || "Admin"}
                      </td>
                    )}

                    {/* Keterangan */}
                    <td
                      className="p-4 font-medium text-gray-900 max-w-xs truncate"
                      title={trx.keterangan}
                    >
                      {trx.keterangan}
                    </td>

                    {/* Nominal */}
                    <td
                      className={`p-4 text-right font-bold whitespace-nowrap ${
                        trx.tipe === "PEMASUKAN"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {trx.tipe === "PENGELUARAN" ? "- " : "+ "}
                      Rp {trx.nominal.toLocaleString("id-ID")}
                    </td>

                    {/* Status (DISAMAKAN DENGAN ADMIN) */}
                    <td className="p-4 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          trx.status === "VERIFIED"
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : trx.status === "REJECTED"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                        }`}
                      >
                        {trx.status}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="p-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => setSelectedTransaction(trx)}
                        className="inline-flex items-center justify-center p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginasi */}
        {!loading && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            pageSize={pagination.limit}
            totalItems={pagination.total}
            onPageChange={handlePageChange}
            onPageSizeChange={(limit) => {
              setPagination((prev) => ({ ...prev, limit }));
              fetchTransactions(1, limit);
            }}
          />
        )}
      </div>

      <TransactionDetailDialog
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
