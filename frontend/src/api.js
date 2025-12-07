import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const localApi = axios.create({ baseURL: API_BASE });
const jikanApi = axios.create({ baseURL: "https://api.jikan.moe/v4" });
export const api = {
  searchJikan: (query) => jikanApi.get(`/manga?q=${query}&limit=12&sfw`),
  getReadlist: () => localApi.get("/manga"),
  getMangaDetail: (id) => localApi.get(`/manga/${id}`),
  addManga: (data) => localApi.post("/manga", data),
  updateManga: (id, data) => localApi.put(`/manga/${id}`, data),
  deleteManga: (id) => localApi.delete(`/manga/${id}`),

  getNotes: (mangaId) => localApi.get(`/notes/${mangaId}`),
  addNote: (data) => localApi.post("/notes", data),
};
