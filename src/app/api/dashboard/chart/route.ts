import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Ambil semua transaksi yang VERIFIED
    const { data: transactions, error } = await supabase
      .from("transaksi")
      .select("tipe, nominal, tanggal_transaksi")
      .eq("status", "VERIFIED");

    if (error) throw error;

    // Inisialisasi array bulan (Jan - Des)
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString("id-ID", { month: "short" }), // Jan, Feb, Mar...
      pemasukan: 0,
      pengeluaran: 0,
    }));

    // Proses Agregasi Data (Group by Month)
    transactions?.forEach((trx) => {
      const date = new Date(trx.tanggal_transaksi);
      const monthIndex = date.getMonth(); // 0 = Jan, 11 = Des

      // Pastikan hanya memproses tahun saat ini (Opsional, bisa dihapus jika ingin semua tahun)
      if (date.getFullYear() === new Date().getFullYear()) {
        if (trx.tipe === "PEMASUKAN") {
          monthlyData[monthIndex].pemasukan += trx.nominal;
        } else {
          monthlyData[monthIndex].pengeluaran += trx.nominal;
        }
      }
    });

    return NextResponse.json(monthlyData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
