import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// PUT: Update Status (Verifikasi)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { status } = await request.json(); // Kirim { status: 'VERIFIED' }
  const { id } = await params;

  const { data, error } = await supabase
    .from("transaksi")
    .update({ status })
    .eq("id", id)
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// GET: Use Case 9 (Detail Transaksi)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const { data, error } = await supabase
    .from("transaksi")
    .select("*, users(nama_lengkap, nim)")
    .eq("id", id)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}
