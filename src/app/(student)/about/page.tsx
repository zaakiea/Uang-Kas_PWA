import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="max-w-lg mx-auto text-center space-y-6 pt-10 px-4">
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
      <h1 className="text-2xl font-bold text-gray-900">DigiKas</h1>
      <p className="text-gray-500">
        Aplikasi pengelolaan uang kas digital berbasis web (PWA) untuk
        memudahkan transparansi dan pencatatan keuangan.
      </p>
      <div className="text-sm text-gray-400 mt-10">
        Versi 1.0.0 <br />
        Dibuat dengan Next.js 15
      </div>
    </div>
  );
}
