"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminMenuItems, studentMenuItems } from "@/constants/menu-items";
import { LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Helper untuk menggabungkan class tailwind
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  role: "ADMIN" | "MAHASISWA";
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const menuItems = role === "ADMIN" ? adminMenuItems : studentMenuItems;

  // Handle responsive check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static" // Reset transform on desktop
        )}
      >
        <div className="flex flex-col h-full px-3 py-4 overflow-y-auto">
          {/* Logo / Brand */}
          <div className="flex items-center justify-center mb-10 mt-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
              K
            </div>
            <span className="self-center text-xl font-bold whitespace-nowrap text-gray-900">
              Uang Kas
            </span>
          </div>

          {/* Menu Items */}
          <ul className="space-y-2 font-medium flex-1">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.path;
              return (
                <li key={index}>
                  <Link
                    href={item.path}
                    onClick={() => isMobile && setIsOpen(false)}
                    className={cn(
                      "flex items-center p-3 rounded-lg group transition-colors duration-200",
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 transition duration-75",
                        isActive
                          ? "text-blue-600"
                          : "text-gray-500 group-hover:text-gray-900"
                      )}
                    />
                    <span className="ms-3">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Logout Button */}
          <div className="mt-auto border-t border-gray-200 pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 text-gray-900 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors group"
            >
              <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition duration-75" />
              <span className="ms-3">Keluar</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
