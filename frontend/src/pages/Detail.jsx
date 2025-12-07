import { useParams, useNavigate } from "react-router-dom";
import useSWR, { mutate } from "swr"; // Import SWR
import { api } from "../api";
import { ArrowLeft, Trash2, Save, Send } from "lucide-react";
import { useState, useEffect } from "react";
const fetcherManga = (id) => api.getMangaDetail(id).then((res) => res.data);
const fetcherNotes = (id) => api.getNotes(id).then((res) => res.data);

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState(0);

  const { data: manga, error: errManga } = useSWR(
    id ? `manga-${id}` : null,
    () => fetcherManga(id)
  );
  const { data: notes, mutate: refreshNotes } = useSWR(
    id ? `notes-${id}` : null,
    () => fetcherNotes(id)
  );

  useEffect(() => {
    if (manga) {
      setStatus(manga.status);
      setRating(manga.rating);
    }
  }, [manga]);

  async function handleUpdate() {
    await api.updateManga(id, { status, rating });
    alert("Berhasil disimpan!");

    mutate(`manga-${id}`);
  }

  async function handleDelete() {
    if (confirm("yakin mau hapus?")) {
      await api.deleteManga(id);
      navigate("/");
    }
  }

  async function handleSubmitNote(e) {
    e.preventDefault();
    if (!text) return;
    await api.addNote({ manga_id: id, content: text });
    setText("");
    refreshNotes();
  }

  if (errManga)
    return <div className="p-10 text-center">Gagal memuat data.</div>;
  if (!manga) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-gray-500"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali
      </button>

      {/* Info Manga */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-bold mb-4">{manga.title}</h1>
        <div className="flex flex-col sm:flex-row gap-6">
          <img
            src={manga.poster_path}
            alt={manga.title}
            className="w-32 rounded shadow-sm self-start"
          />
          <p className="text-gray-600 text-sm leading-relaxed">
            {manga.synopsis || "Tidak ada sinopsis."}
          </p>
        </div>
      </div>

      {/* Form Edit */}
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg mb-6">
        <h3 className="font-bold mb-4 text-sm uppercase text-gray-500">
          Update Progress
        </h3>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-xs mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="plan_to_read">Plan to Read</option>
              <option value="reading">Reading</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>
          <div className="w-24">
            <label className="block text-xs mb-1">Rating</label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full p-2 border rounded text-center"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            className="bg-black text-white px-4 py-2 rounded text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Simpan
          </button>
          <button
            onClick={handleDelete}
            className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded text-sm flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Hapus
          </button>
        </div>
      </div>

      {/* Catatan */}
      <div>
        <h3 className="font-bold mb-4">Catatan ({notes?.length || 0})</h3>
        <div className="space-y-3 mb-4">
          {notes?.map((note) => (
            <div
              key={note.id}
              className="bg-white border p-3 rounded shadow-sm"
            >
              <p>{note.note_text}</p>
              <span className="text-xs text-gray-400 mt-1 block">
                {note.created_at}
              </span>
            </div>
          ))}
          {notes?.length === 0 && (
            <p className="text-gray-400 italic">Belum ada catatan.</p>
          )}
        </div>

        <form onSubmit={handleSubmitNote} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tulis catatan..."
            className="flex-grow p-2 border rounded"
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
