import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// PUT: Update Status & Keterangan
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const body = await request.json(); // Terima semua data body (status, keterangan, dll)
  const { id } = await context.params;

  const { data, error } = await supabase
    .from("transaksi")
    .update(body) // Update sesuai payload yang dikirim
    .eq("id", id)
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// GET: Use Case 9 (Detail Transaksi) - TIDAK PERLU DIUBAH
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { data, error } = await supabase
    .from("transaksi")
    .select("*, users(nama_lengkap, nim)")
    .eq("id", id)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}
