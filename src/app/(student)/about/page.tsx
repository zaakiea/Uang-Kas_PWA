import Image from "next/image";
import { Code } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-lg mx-auto text-center space-y-6 pt-10 px-4 pb-20">
      <div className="relative w-28 h-28 mx-auto shadow-lg rounded-2xl overflow-hidden bg-white p-2">
        <div className="relative w-full h-full">
          <Image
            src="/logo.webp"
            alt="DigiKas Logo"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">DigiKas</h1>
        <p className="text-blue-600 font-medium text-sm mt-1">
          Aplikasi Uang Kas Digital
        </p>
      </div>

      <p className="text-gray-500 leading-relaxed">
        Aplikasi pengelolaan uang kas digital berbasis web (PWA) untuk
        memudahkan transparansi dan pencatatan keuangan secara real-time dan
        akurat.
      </p>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-500 space-y-2">
        <p>Versi 1.0.0</p>
        <p>Dibuat dengan Next.js 15</p>
      </div>

      {/* --- WATERMARK --- */}
      <div className="pt-8 border-t border-gray-100 mt-8">
        <a
          href="https://discord.com/users/878915657591312447"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors font-semibold text-sm group"
        >
          <Code size={16} />
          <span>TunaTerbang</span>
        </a>
      </div>
      {/* ----------------------------------------- */}
    </div>
  );
}
