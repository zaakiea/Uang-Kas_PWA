export default function AboutPage() {
  return (
    <div className="max-w-lg mx-auto text-center space-y-6 pt-10">
      <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-lg shadow-blue-200">
        K
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Uang Kas Digital</h1>
      <p className="text-gray-500">
        Aplikasi pengelolaan uang kas angkatan berbasis web (PWA) untuk
        memudahkan transparansi dan pencatatan keuangan.
      </p>
      <div className="text-sm text-gray-400 mt-10">
        Versi 1.0.0 <br />
        Dibuat dengan Next.js 15
      </div>
    </div>
  );
}
