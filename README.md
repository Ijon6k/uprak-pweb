# uprak-pweb

Website ini dibuat sebagai **proyek Ujian Praktik Pemrograman Web**.  
Tujuan: mempraktikkan penggunaan React JS (frontend) dan PHP (backend) dengan konsep CRUD dan konsumsi API publik Jikan (MyAnimeList).

Preview UI:  
![Preview 1](https://i.imgur.com/FgkQEvc.png)
![Preview 2](https://i.imgur.com/8tIB57y.png)  


Teknologi:
- React JS (frontend)  
- PHP (backend)  
- API Jikan (MyAnimeList)  
- MySQL (opsional)

Petunjuk singkat dan langsung — tanpa konfigurasi .env (karena API sudah di-hardcode di frontend).

Menjalankan backend (PHP)
1. Buka terminal / CMD.  
2. Masuk ke folder backend (ganti sesuai struktur repo, contoh: `backend`, `api`, atau `server`):
   ```
   cd path/ke/backend
   ```
3. Jalankan PHP built-in server:
   ```
   php -S 127.0.0.1:8000
   ```
   Jika entry point berada di subfolder `public`:
   ```
   php -S 127.0.0.1:8000 -t public
   ```
4. Akses API/backend di:
   ```
   http://127.0.0.1:8000/
   ```

Menjalankan frontend (React)
1. Buka terminal / CMD.  
2. Masuk ke folder frontend (contoh: `client` atau `frontend`):
   ```
   cd path/ke/frontend
   ```
3. Install dependensi (jika belum):
   ```
   npm install
   ```
4. Jalankan development server seperti biasa:
   ```
   npm run dev
   ```
   (Jika project menggunakan `npm start`, jalankan `npm start` sesuai konfigurasi.)
5. Buka browser ke alamat yang ditampilkan (biasanya http://localhost:3000 atau http://localhost:5173).

Build dan preview hasil produksi (lokal)
1. Buat build production:
   ```
   npm run build
   ```
2. Preview hasil build:
   ```
   npm run preview
   ```

Catatan singkat
- Frontend sudah terhubung ke API yang di-hardcode (pastikan URL backend di kode frontend sesuai: http://127.0.0.1:8000).  
- Jika memakai database (MySQL), jalankan database sebelum mencoba fitur CRUD.  
