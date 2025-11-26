"use client";

import { X, ArrowUpCircle, ArrowDownCircle, FileText } from "lucide-react";
import Image from "next/image";

interface TransactionDetailDialogProps {
  transaction: any;
  onClose: () => void;
}

export default function TransactionDetailDialog({
  transaction,
  onClose,
}: TransactionDetailDialogProps) {
  if (!transaction) return null;

  const isIncome = transaction.tipe === "PEMASUKAN";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Detail Transaksi</h3>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto">
          {/* Status & Nominal */}
          <div className="text-center mb-8">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${
                transaction.status === "VERIFIED"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : transaction.status === "REJECTED"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}
            >
              {transaction.status === "VERIFIED"
                ? "BERHASIL"
                : transaction.status === "REJECTED"
                ? "DITOLAK"
                : "MENUNGGU KONFIRMASI"}
            </span>

            <h2
              className={`text-3xl font-bold mt-3 ${
                isIncome ? "text-green-600" : "text-red-600"
              }`}
            >
              {isIncome ? "+" : "-"} Rp{" "}
              {transaction.nominal.toLocaleString("id-ID")}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {new Date(transaction.tanggal_transaksi).toLocaleDateString(
                "id-ID",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </p>
          </div>

          {/* Detail Grid */}
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div
                className={`p-3 rounded-lg mr-4 ${
                  isIncome
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {isIncome ? (
                  <ArrowUpCircle size={24} />
                ) : (
                  <ArrowDownCircle size={24} />
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">
                  Tipe Transaksi
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {isIncome ? "Pemasukan / Setoran" : "Pengeluaran"}
                </p>
              </div>
            </div>

            <div className="flex p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="p-3 rounded-lg mr-4 bg-blue-100 text-blue-600 h-fit">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">
                  Keterangan
                </p>
                <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                  {transaction.keterangan}
                </p>
              </div>
            </div>

            {/* Bukti Bayar Section */}
            {transaction.bukti_bayar && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 font-medium uppercase mb-2">
                  Bukti Pembayaran
                </p>
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 group">
                  <Image
                    src={transaction.bukti_bayar}
                    alt="Bukti Bayar"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <a
                    href={transaction.bukti_bayar}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium text-sm underline"
                  >
                    Lihat Gambar Penuh
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition active:scale-[0.98]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
