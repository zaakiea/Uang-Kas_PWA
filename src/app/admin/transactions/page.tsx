"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Eye,
  Search,
  Filter,
} from "lucide-react";
import AddTransactionDialog from "@/components/admin/AddTransactionDialog";
import TransactionDetailDialog from "@/components/student/TransactionDetailDialog";
import Pagination from "@/components/common/Pagination";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  // State Filter & Search
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  // Pagination State
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const debouncedSearch = useDebounce(search, 500);

  const fetchTransactions = useCallback(
    async (page = 1, limit = 10, searchTerm = "", type = "ALL") => {
      setLoading(true);
      try {
        let url = `/api/transaksi?page=${page}&limit=${limit}`;
        if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
        if (type !== "ALL") url += `&tipe=${type}`;

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
        toast.error("Gagal memuat transaksi");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (debouncedSearch !== "" && pagination.page !== 1) {
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchTransactions(1, pagination.limit, debouncedSearch, filterType);
    } else {
      fetchTransactions(
        pagination.page,
        pagination.limit,
        debouncedSearch,
        filterType
      );
    }
  }, [
    debouncedSearch,
    filterType,
    pagination.page,
    pagination.limit,
    fetchTransactions,
  ]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Transaksi</h1>
      </div>

      {/* --- FILTER SECTION (SEJAJAR DENGAN TOMBOL) --- */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        {/* Search Nama (Flexible Width) */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari nama mahasiswa..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50 focus:bg-white transition-all text-gray-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Filter Tipe */}
          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50 focus:bg-white transition-all text-gray-900 appearance-none cursor-pointer"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            >
              <option value="ALL">Semua Tipe</option>
              <option value="PEMASUKAN">Pemasukan</option>
              <option value="PENGELUARAN">Pengeluaran</option>
            </select>
          </div>

          {/* Tombol Tambah Transaksi (Disini) */}
          <div className="w-full sm:w-auto">
            <AddTransactionDialog
              onSuccess={() =>
                fetchTransactions(
                  1,
                  pagination.limit,
                  debouncedSearch,
                  filterType
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-900">
              <tr>
                <th className="p-4 whitespace-nowrap">Tanggal</th>
                <th className="p-4 whitespace-nowrap">Nama</th>
                <th className="p-4 min-w-[200px]">Keterangan</th>
                <th className="p-4 whitespace-nowrap">Tipe</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 text-right whitespace-nowrap">Nominal</th>
                <th className="p-4 text-center whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 text-gray-300" />
                      <p>Tidak ada transaksi ditemukan.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((trx) => (
                  <tr
                    key={trx.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 whitespace-nowrap">
                      {formatDate(trx.tanggal_transaksi)}
                    </td>
                    <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                      {trx.users?.nama_lengkap || "-"}
                    </td>
                    <td
                      className="p-4 text-gray-500 max-w-xs truncate"
                      title={trx.keterangan}
                    >
                      {trx.keterangan}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {trx.tipe === "PEMASUKAN" ? (
                        <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs w-fit font-medium border border-green-100">
                          <ArrowUpCircle className="w-3 h-3" /> Masuk
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs w-fit font-medium border border-red-100">
                          <ArrowDownCircle className="w-3 h-3" /> Keluar
                        </span>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${
                          trx.status === "VERIFIED"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : trx.status === "REJECTED"
                            ? "bg-red-50 text-red-700 border-red-100"
                            : "bg-yellow-50 text-yellow-700 border-yellow-100"
                        }`}
                      >
                        {trx.status}
                      </span>
                    </td>
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
                    <td className="p-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => setSelectedTransaction(trx)}
                        className="p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
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
            onPageSizeChange={(limit) =>
              setPagination((prev) => ({ ...prev, limit, page: 1 }))
            }
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
