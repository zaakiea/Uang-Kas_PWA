import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const userId = searchParams.get("user_id");

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Build Query
  let query = supabase
    .from("transaksi")
    .select("*, users (nama_lengkap, nim)", { count: "exact" })
    .order("tanggal_transaksi", { ascending: false })
    .range(from, to);

  // Jika ada filter user
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

// POST: Use Case 5 (Input Pemasukan), 6 (Pengeluaran), 5 Mhs (Bayar)
export async function POST(request: Request) {
  const body = await request.json();

  /* Body structure:
     {
       user_id: 1,
       tipe: 'PEMASUKAN' | 'PENGELUARAN',
       nominal: 50000,
       keterangan: 'Iuran Jan',
       bukti_bayar: 'url_gambar',
       status: 'PENDING' (Default) / 'VERIFIED' (Kalau admin yg input)
     }
  */

  const { data, error } = await supabase
    .from("transaksi")
    .insert([body])
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
