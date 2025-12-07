import { useState } from "react";
import useSWR from "swr";
import { api } from "../api";
import MangaCard from "../components/MangaCard";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const fetcher = (query) => api.searchJikan(query).then((res) => res.data);

export default function Search() {
  const [input, setInput] = useState("");
  const [searchKey, setSearchKey] = useState(null);
  const navigate = useNavigate();

  const {
    data: jikanResponse,
    error,
    isLoading,
  } = useSWR(searchKey ? `search-${searchKey}` : null, () =>
    fetcher(searchKey)
  );

  const results = jikanResponse?.data || [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!input) return;

    setSearchKey(input);
  };

  const handleAdd = async (manga) => {
    try {
      await api.addManga({
        mal_id: manga.mal_id,
        title: manga.title,
        synopsis: manga.synopsis || "No synopsis available.",
        poster_path: manga.images.jpg.image_url,
      });
      alert("Berhasil ditambahkan!");
      navigate("/");
    } catch (err) {
      alert("Gagal menyimpan (Mungkin duplikat?).");
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">
          Discover Manga
        </h1>
        <p className="text-gray-500 mb-6">Powered by Jikan API</p>

        <form
          onSubmit={handleSearch}
          className="flex shadow-sm rounded-lg overflow-hidden border border-gray-300"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-3 px-4 outline-none text-gray-700"
            placeholder="Ketik judul manga (e.g. One Piece)..."
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gray-900 text-white px-6 font-medium hover:bg-gray-800 transition flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <SearchIcon className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center text-red-500 mb-6">
          Gagal mengambil data dari Jikan API.
        </div>
      )}

      {/* Empty State (Belum cari apa-apa) */}
      {!searchKey && !isLoading && (
        <div className="text-center text-gray-400 italic mt-10">
          Mulai pencarian untuk menemukan manga favoritmu.
        </div>
      )}

      {/* Result Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {results?.map((manga) => (
          <MangaCard
            key={manga.mal_id}
            manga={manga}
            isSearch={true}
            onAdd={handleAdd}
          />
        ))}
      </div>
    </div>
  );
}
