// src/app/api/mahasiswa/[id]/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Helper untuk mengambil params id
async function getParams(context: { params: Promise<{ id: string }> }) {
  return await context.params;
}

// DELETE: Hapus Mahasiswa
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);

  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "User berhasil dihapus" });
}

// PUT: Edit Data Mahasiswa
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await getParams(context);
  const body = await request.json();

  // Destructure data yang boleh diupdate (NIM tidak boleh diubah sembarangan karena unique)
  const {
    nama_lengkap,
    fakultas,
    prodi,
    angkatan,
    tanggal_lahir,
    no_hp,
    email,
  } = body;

  const { data, error } = await supabase
    .from("users")
    .update({
      nama_lengkap,
      fakultas,
      prodi,
      angkatan,
      tanggal_lahir,
      no_hp,
      email,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Data berhasil diperbarui", data });
}
