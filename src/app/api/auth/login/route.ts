import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const { nim, password } = await request.json();

  // Cari user berdasarkan NIM
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("nim", nim)
    .single();

  if (error || !user) {
    return NextResponse.json(
      { message: "User tidak ditemukan" },
      { status: 404 }
    );
  }

  // Cek Password (Simple check, disarankan pakai bcrypt di real app)
  // Sesuai soal: Password default bisa NIM + Tgl Lahir
  if (user.password !== password) {
    return NextResponse.json({ message: "Password salah" }, { status: 401 });
  }

  // Jika sukses, kembalikan data user (tanpa password)
  const { password: _, ...userWithoutPassword } = user;

  return NextResponse.json({
    message: "Login berhasil",
    user: userWithoutPassword,
  });
}
