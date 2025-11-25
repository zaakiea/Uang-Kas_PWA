import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: Use Case 8 (Lihat Daftar Transaksi) & Use Case 3 (Histori Mhs)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id"); // Filter by user jika ada

  let query = supabase
    .from("transaksi")
    .select(
      `
      *,
      users (nama_lengkap, nim)
    `
    )
    .order("tanggal_transaksi", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
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
