import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: Use Case 3 (Lihat Daftar Mahasiswa)
export async function GET() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "MAHASISWA")
    .order("nama_lengkap", { ascending: true });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: Use Case 2 (Tambah Mahasiswa - Admin)
export async function POST(request: Request) {
  const body = await request.json();

  // Format password default: NIM + TglLahir (YYYYMMDD) atau sesuai input
  const { data, error } = await supabase
    .from("users")
    .insert([{ ...body, role: "MAHASISWA" }]) // Paksa role jadi mahasiswa
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
