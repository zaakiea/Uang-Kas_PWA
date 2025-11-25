// src/app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // Redirect otomatis ke halaman login saat aplikasi dibuka
  redirect("/login");
}
