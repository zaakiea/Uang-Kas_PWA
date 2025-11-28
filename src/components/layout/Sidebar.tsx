"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminMenuItems, studentMenuItems } from "@/constants/menu-items";
import { LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  role: "ADMIN" | "MAHASISWA";
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = role === "ADMIN" ? adminMenuItems : studentMenuItems;

  // Tutup sidebar otomatis saat pindah halaman (UX Mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Cegah scroll body saat sidebar terbuka di mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    window.location.href = "/login";
  };

  return (
    <>
      {/* --- MOBILE HEADER (Hanya muncul di HP) --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm h-16 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            K
          </div>
          <span className="font-bold text-gray-900 text-lg">Uang Kas</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md active:scale-95 transition-transform"
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* --- OVERLAY BACKGROUND (Mobile Only) --- */}
      {/* Muncul saat sidebar terbuka untuk menggelapkan konten belakang */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 backdrop-blur-sm",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* --- SIDEBAR CONTAINER --- */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-xl lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header Sidebar (Desktop) & Tombol Close (Mobile) */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                K
              </div>
              <span className="text-xl font-bold text-gray-900">Uang Kas</span>
            </div>
            {/* Tombol Close khusus Mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Items (Scrollable) */}
          <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-200">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={index}
                  href={item.path}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 mr-3 transition-colors",
                      isActive
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    )}
                  />
                  {item.title}
                </Link>
              );
            })}
          </div>

          {/* Footer / Logout */}
          <div className="p-4 border-t border-gray-100 shrink-0 bg-white">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
            >
              <LogOut className="w-5 h-5 mr-3 group-hover:text-red-700 transition-colors" />
              Keluar
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
