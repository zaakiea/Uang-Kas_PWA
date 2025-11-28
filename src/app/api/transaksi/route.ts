import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const userId = searchParams.get("user_id");

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("transaksi")
    .select("*, users (nama_lengkap, nim)", { count: "exact" })
    .order("tanggal_transaksi", { ascending: false })
    .range(from, to);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, count, error } = await query;

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    data,
    meta: {
      total: count,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0,
    },
  });
}

// POST: Tambah Transaksi Baru (Dengan Validasi Saldo)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // --- VALIDASI SALDO UNTUK PENGELUARAN ---
    if (body.tipe === "PENGELUARAN") {
      // 1. Ambil semua transaksi yang sudah VERIFIED untuk hitung saldo
      const { data: transactions, error: fetchError } = await supabase
        .from("transaksi")
        .select("tipe, nominal")
        .eq("status", "VERIFIED");

      if (fetchError) throw new Error(fetchError.message);

      // 2. Hitung Saldo Saat Ini
      const totalPemasukan =
        transactions
          ?.filter((t) => t.tipe === "PEMASUKAN")
          .reduce((acc, curr) => acc + curr.nominal, 0) || 0;

      const totalPengeluaran =
        transactions
          ?.filter((t) => t.tipe === "PENGELUARAN")
          .reduce((acc, curr) => acc + curr.nominal, 0) || 0;

      const saldoSaatIni = totalPemasukan - totalPengeluaran;

      // 3. Cek apakah saldo cukup
      if (saldoSaatIni < Number(body.nominal)) {
        return NextResponse.json(
          {
            message: `Saldo tidak cukup! Saldo saat ini: Rp ${saldoSaatIni.toLocaleString(
              "id-ID"
            )}. Transaksi dibatalkan.`,
          },
          { status: 400 }
        );
      }
    }
    // ----------------------------------------

    // Jika tipe PEMASUKAN atau saldo cukup, lanjutkan simpan
    const { data, error } = await supabase
      .from("transaksi")
      .insert([body])
      .select();

    if (error)
      return NextResponse.json({ message: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Error" },
      { status: 500 }
    );
  }
}
