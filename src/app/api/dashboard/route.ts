import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  // Hitung Pemasukan
  const { data: pemasukan } = await supabase
    .from("transaksi")
    .select("nominal")
    .eq("tipe", "PEMASUKAN")
    .eq("status", "VERIFIED");

  // Hitung Pengeluaran
  const { data: pengeluaran } = await supabase
    .from("transaksi")
    .select("nominal")
    .eq("tipe", "PENGELUARAN")
    .eq("status", "VERIFIED"); // Pengeluaran admin otomatis verified biasanya

  const totalPemasukan =
    pemasukan?.reduce((acc, curr) => acc + curr.nominal, 0) || 0;
  const totalPengeluaran =
    pengeluaran?.reduce((acc, curr) => acc + curr.nominal, 0) || 0;
  const saldo = totalPemasukan - totalPengeluaran;

  return NextResponse.json({
    total_pemasukan: totalPemasukan,
    total_pengeluaran: totalPengeluaran,
    saldo_kas: saldo,
  });
}
