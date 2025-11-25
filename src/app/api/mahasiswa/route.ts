import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nim,
      nama_lengkap,
      fakultas,
      prodi,
      angkatan,
      tanggal_lahir,
      no_hp,
      email,
    } = body;

    // 1. Validasi Input Dasar
    if (!nim || !nama_lengkap || !tanggal_lahir) {
      return NextResponse.json(
        { message: "Data wajib tidak lengkap" },
        { status: 400 }
      );
    }

    // 2. Generate Password: NIM + Tanggal Lahir (DDMMYYYY)
    // Input tanggal_lahir biasanya format YYYY-MM-DD
    const dateObj = new Date(tanggal_lahir);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = dateObj.getFullYear();

    const passwordDefault = `${nim}${day}${month}${year}`;

    // 3. Insert ke Supabase
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          nim,
          password: passwordDefault, // Di real app, hash ini dengan bcrypt!
          role: "MAHASISWA",
          nama_lengkap,
          fakultas,
          prodi,
          angkatan,
          tanggal_lahir,
          no_hp,
          email,
        },
      ])
      .select()
      .single();

    if (error) {
      // Handle duplicate NIM
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "NIM sudah terdaftar" },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ message: "Berhasil", data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
