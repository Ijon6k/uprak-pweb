import { Link, useLocation } from "react-router-dom";
import { BookOpen, Search } from "lucide-react";

export default function Header() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-indigo-600 hover:opacity-80 transition"
        >
          <BookOpen className="w-6 h-6" />
          <span>MangaList</span>
        </Link>

        <div className="flex gap-2">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              location.pathname === "/"
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Library
          </Link>
          <Link
            to="/search"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              location.pathname === "/search"
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Search className="w-4 h-4" />
            Discover
          </Link>
        </div>
      </div>
    </nav>
  );
}
