// src/constants/menu-items.ts
import {
  LayoutDashboard,
  Users,
  Wallet,
  ReceiptText,
  CheckCircle,
  User,
  History,
  Info,
  LogOut,
  CreditCard,
} from "lucide-react";

export type MenuItem = {
  title: string;
  path: string;
  icon: any;
};

export const adminMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Data Mahasiswa",
    path: "/admin/users",
    icon: Users,
  },
  {
    title: "Daftar Transaksi",
    path: "/admin/transactions",
    icon: ReceiptText,
  },
  {
    title: "Input Kas",
    path: "/admin/transactions/create",
    icon: Wallet,
  },
  {
    title: "Verifikasi Setoran",
    path: "/admin/verifications",
    icon: CheckCircle,
  },
  {
    title: "Profil Admin",
    path: "/admin/profile",
    icon: User,
  },
];

export const studentMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Bayar Kas",
    path: "/dashboard/pay",
    icon: CreditCard,
  },
  {
    title: "Riwayat Transaksi",
    path: "/dashboard/history",
    icon: History,
  },
  {
    title: "Profil Saya",
    path: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Tentang Aplikasi",
    path: "/about",
    icon: Info,
  },
];
