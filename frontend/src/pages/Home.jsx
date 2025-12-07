import useSWR from "swr";
import { api } from "../api";
import MangaCard from "../components/MangaCard";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const fetcher = () => api.getReadlist().then((res) => res.data);

export default function Home() {
  const { data: mangas, error } = useSWR("/manga", fetcher);

  const loading = !mangas && !error;

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">Loading library...</div>
    );

  if (error)
    return (
      <div className="container mx-auto px-4 py-10 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Connection Error</h2>
        <p className="text-gray-600 mt-2">Gagal terhubung ke Backend.</p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Manga-mu</h1>
          <p className="text-gray-500 text-sm mt-1">
            Bantu kelola daftar mangamu
          </p>
        </div>
        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
          {mangas?.length || 0} ITEMS
        </span>
      </div>

      {mangas?.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-xl bg-white">
          <p className="text-gray-500 mb-4">Library kosong.</p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Cari Manga
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {/* Pakai Optional Chaining (?.) biar aman */}
          {mangas?.map((manga) => (
            <MangaCard key={manga.id} manga={manga} isSearch={false} />
          ))}
        </div>
      )}
    </div>
  );
}
