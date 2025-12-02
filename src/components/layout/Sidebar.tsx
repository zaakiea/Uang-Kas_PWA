"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminMenuItems, studentMenuItems } from "@/constants/menu-items";
import { LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

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

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
      {/* --- MOBILE HEADER --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm h-16 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9">
            <Image
              src="/logo.webp"
              alt="DigiKas Logo"
              fill
              className="object-contain rounded-md"
            />
          </div>
          <span className="font-bold text-blue-600 text-lg">DigiKas</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md active:scale-95 transition-transform"
        >
          <Menu size={26} />
        </button>
      </div>

      {/* --- OVERLAY BACKGROUND --- */}
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
          "fixed top-0 left-0 z-50 h-[100dvh] w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-xl lg:shadow-none flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* 1. Header Sidebar Desktop */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3 w-full">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src="/logo.webp"
                alt="DigiKas Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold text-blue-600 truncate">
              DigiKas
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* 2. Menu Items (Flex Grow / Fill Space) */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-200">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={index}
                href={item.path}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
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
                <span className="text-sm">{item.title}</span>
              </Link>
            );
          })}
        </div>

        {/* 3. Footer Logout (Fixed at Bottom of Sidebar) */}
        <div className="p-4 border-t border-gray-100 shrink-0 bg-white mb-safe">
          {/* mb-safe ditambahkan untuk safety area di iPhone X ke atas jika dibutuhkan */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:text-red-700 transition-colors" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
