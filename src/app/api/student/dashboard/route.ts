import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID required" },
        { status: 400 }
      );
    }

    // Ambil semua transaksi yang VERIFIED
    const { data: transactions, error } = await supabase
      .from("transaksi")
      .select("tipe, nominal, tanggal_transaksi, user_id")
      .eq("status", "VERIFIED");

    if (error) throw error;

    // Variabel Penampung
    let saldoAngkatan = 0;
    let totalPengeluaran = 0;
    let uangSaya = 0;

    // Inisialisasi Data Grafik Bulanan (Jan-Des)
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString("id-ID", { month: "short" }),
      pemasukan_angkatan: 0,
      pengeluaran_angkatan: 0,
      bayaran_saya: 0,
    }));

    const currentYear = new Date().getFullYear();

    transactions?.forEach((trx) => {
      const date = new Date(trx.tanggal_transaksi);
      const monthIndex = date.getMonth();

      // 1. Hitung Saldo Global & Pengeluaran Global
      if (trx.tipe === "PEMASUKAN") {
        saldoAngkatan += trx.nominal;
      } else {
        saldoAngkatan -= trx.nominal;
        totalPengeluaran += trx.nominal;
      }

      // 2. Hitung Uang yang Saya Bayar (Kontribusi User)
      if (trx.user_id === Number(userId) && trx.tipe === "PEMASUKAN") {
        uangSaya += trx.nominal;
      }

      // 3. Masukkan ke Data Grafik (Hanya tahun ini agar grafik relevan)
      if (date.getFullYear() === currentYear) {
        if (trx.tipe === "PEMASUKAN") {
          monthlyData[monthIndex].pemasukan_angkatan += trx.nominal;
          // Cek lagi apakah ini bayaran user
          if (trx.user_id === Number(userId)) {
            monthlyData[monthIndex].bayaran_saya += trx.nominal;
          }
        } else {
          monthlyData[monthIndex].pengeluaran_angkatan += trx.nominal;
        }
      }
    });

    return NextResponse.json({
      stats: {
        saldo_angkatan: saldoAngkatan,
        total_pengeluaran: totalPengeluaran,
        uang_saya: uangSaya,
      },
      chart_data: monthlyData,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
