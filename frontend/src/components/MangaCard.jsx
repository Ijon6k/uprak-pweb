import { Link } from "react-router-dom";
import { Star, Plus } from "lucide-react";

export default function MangaCard({ manga, isSearch, onAdd }) {
  const title = isSearch ? manga.title : manga.title;
  const image = isSearch ? manga.images.jpg.image_url : manga.poster_path;
  const id = isSearch ? manga.mal_id : manga.id;

  const CardContent = () => (
    <>
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {!isSearch && (
          <div className="absolute top-2 right-2 bg-white/90 text-gray-800 text-xs px-2 py-1 rounded shadow-sm flex items-center gap-1 font-bold">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            {manga.rating || "-"}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-3 flex-grow">
          {title}
        </h3>

        {isSearch ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              onAdd(manga);
            }}
            className="w-full mt-auto bg-gray-900 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-600 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add to Library
          </button>
        ) : (
          <div className="mt-auto">
            <div
              className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                manga.status === "reading"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : manga.status === "completed"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : manga.status === "dropped"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              {manga.status ? manga.status.replace(/_/g, " ") : "Plan to Read"}
            </div>
          </div>
        )}
      </div>
    </>
  );

  if (isSearch) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition flex flex-col h-full">
        <CardContent />
      </div>
    );
  }

  return (
    <Link
      to={`/manga/${id}`}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-300 transition flex flex-col h-full"
    >
      <CardContent />
    </Link>
  );
}
