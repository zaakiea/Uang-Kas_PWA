import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const userId = searchParams.get("user_id");
  const status = searchParams.get("status");
  const search = searchParams.get("search"); // Param baru: Nama Mahasiswa
  const tipe = searchParams.get("tipe"); // Param baru: PEMASUKAN/PENGELUARAN

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // PENTING: Gunakan users!inner jika melakukan pencarian nama agar filter join bekerja
  const selectQuery = search
    ? "*, users!inner(nama_lengkap, nim)"
    : "*, users(nama_lengkap, nim)";

  let query = supabase
    .from("transaksi")
    .select(selectQuery, { count: "exact" })
    .order("tanggal_transaksi", { ascending: false })
    .range(from, to);

  // 1. Filter User ID (Jika ada)
  if (userId) {
    query = query.eq("user_id", userId);
  }

  // 2. Filter Status (Jika ada)
  if (status) {
    query = query.eq("status", status);
  }

  // 3. Filter Tipe (Jika ada dan bukan 'ALL')
  if (tipe && tipe !== "ALL") {
    query = query.eq("tipe", tipe);
  }

  // 4. Search Nama Mahasiswa
  if (search) {
    query = query.ilike("users.nama_lengkap", `%${search}%`);
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

export async function POST(request: Request) {
  // ... (Bagian POST biarkan tetap sama seperti sebelumnya)
  try {
    const body = await request.json();

    if (body.tipe === "PENGELUARAN") {
      const { data: transactions, error: fetchError } = await supabase
        .from("transaksi")
        .select("tipe, nominal")
        .eq("status", "VERIFIED");

      if (fetchError) throw new Error(fetchError.message);

      const totalPemasukan =
        transactions
          ?.filter((t) => t.tipe === "PEMASUKAN")
          .reduce((acc, curr) => acc + curr.nominal, 0) || 0;

      const totalPengeluaran =
        transactions
          ?.filter((t) => t.tipe === "PENGELUARAN")
          .reduce((acc, curr) => acc + curr.nominal, 0) || 0;

      const saldoSaatIni = totalPemasukan - totalPengeluaran;

      if (saldoSaatIni < Number(body.nominal)) {
        return NextResponse.json(
          {
            message: `Saldo tidak cukup! Saldo: Rp ${saldoSaatIni.toLocaleString(
              "id-ID"
            )}`,
          },
          { status: 400 }
        );
      }
    }

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
