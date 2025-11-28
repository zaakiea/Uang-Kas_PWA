"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowDownCircle, ArrowUpCircle, Eye } from "lucide-react";
import AddTransactionDialog from "@/components/admin/AddTransactionDialog";
import TransactionDetailDialog from "@/components/student/TransactionDetailDialog";
import Pagination from "@/components/common/Pagination"; // Import Pagination
import { toast } from "sonner";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  // State Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchTransactions = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/transaksi?page=${page}&limit=${limit}`);
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
  }, []);

  useEffect(() => {
    fetchTransactions(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit, fetchTransactions]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Transaksi</h1>
        <AddTransactionDialog
          onSuccess={() => fetchTransactions(1, pagination.limit)}
        />
      </div>

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
                  <td colSpan={7} className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center">
                    Belum ada data transaksi.
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
                    <td className="p-4 text-gray-500 max-w-xs truncate">
                      {trx.keterangan}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {trx.tipe === "PEMASUKAN" ? (
                        <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs w-fit font-medium">
                          <ArrowUpCircle className="w-3 h-3" /> Masuk
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs w-fit font-medium">
                          <ArrowDownCircle className="w-3 h-3" /> Keluar
                        </span>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap">
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
                    <td
                      className={`p-4 text-right font-semibold whitespace-nowrap ${
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

        {/* PAGINASI */}
        {!loading && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            pageSize={pagination.limit}
            totalItems={pagination.total}
            onPageChange={(page) =>
              setPagination((prev) => ({ ...prev, page }))
            }
            onPageSizeChange={(limit) =>
              setPagination((prev) => ({ ...prev, limit }))
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
