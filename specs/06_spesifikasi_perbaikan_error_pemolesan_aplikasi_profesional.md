# 06 — Spesifikasi Audit Error, Pembersihan Teks Akademik & Integrasi Logo (`logo.png`)
**Proyek:** Sistem Informasi Master Data Akuntansi — Kanal Tiga Rental Event & Elektronik  
**Target Eksekusi:** Gemini Flash 3.8 (Antigravity IDE)  
**Prioritas:** KRITIS (Wajib 0 Error saat Build & Runtime, Tampilan Murni Aplikasi Bisnis)

---

## 1. Daftar Masalah Utama yang Wajib Diselesaikan

Model AI wajib mengeksekusi **4 perbaikan utama** berikut secara menyeluruh di seluruh file proyek:

1. **Audit & Perbaikan Seluruh Error (Zero Error Mandate):** Menyelesaikan semua error kompilasi TypeScript, *Next.js 15 async API breaking changes* (`cookies()`, `searchParams`), koneksi database/schema mismatch, hingga error saat *build*.
2. **Ubah Dashboard & Seluruh Halaman Menjadi Aplikasi Bisnis Murni:** Hapus total semua elemen atau teks yang berbau "tugas kuliah", "panduan menjawab dosen", "cheat sheet presentasi", "mode presentasi", atau "data simulasi/dummy". Website harus tampil 100% sebagai sistem informasi internal perusahaan **Kanal Tiga** yang profesional.
3. **Hilangkan Placeholder pada Input Login:** Kosongkan atribut `placeholder` pada kolom input Username/Email dan Password di halaman `/login` agar tidak membocorkan akun atau terlihat seperti template demo.
4. **Gunakan File `logo.png` Resmi:** Cari file `logo.png` yang telah disiapkan di dalam proyek, pindahkan/pastikan berada di `public/logo.png`, dan pasang di Halaman Login, Navbar Header, serta Favicon.

---

## 2. Instruksi Teknis 1: Audit & Perbaikan Menyeluruh (Debugging Checklist)

Lakukan pemeriksaan dan perbaikan sistematis pada titik-titik yang sering menyebabkan error di **Next.js 15 + Drizzle ORM**:

### 2.1 Kompatibilitas Next.js 15 (`cookies()` dan `headers()` Wajib `await`)
Di Next.js 15, fungsi `cookies()` dari `next/headers` bersifat **asynchronous**.
* **Cek di `src/lib/auth.ts` dan `src/actions/*`:**
  * ❌ **Salah (Menyebabkan Error di Next 15):**
    ```ts
    const cookieStore = cookies();
    cookieStore.set('session', token);
    ```
  * ✅ **Benar (Wajib Diterapkan):**
    ```ts
    const cookieStore = await cookies();
    cookieStore.set('session', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 });
    ```

### 2.2 Pemisahan `'use client'` dan `'use server'`
* Pastikan **TIDAK ADA** file Server Actions (`'use server'`) yang di dalamnya mengekspor objek atau fungsi non-async, atau mengimpor komponen Client.
* Pastikan komponen interaktif yang menggunakan `useState`, `useEffect`, atau event handler (`onClick`, `onSubmit`) memiliki deklarasi `'use client';` di baris paling atas (baris 1).
* Jangan gunakan `async` langsung pada komponen yang memiliki `'use client'`. Ambil data di Server Component (`src/app/page.tsx` atau `src/app/(dashboard)/...`), lalu kirimkan sebagai `props` ke Client Component.

### 2.3 Sinkronisasi Skema Database & Tipe `bigint` / `number`
* Pada Drizzle ORM (`src/db/schema.ts`), kolom nominal uang (`initialBalance`, `purchasePrice`, `rentalPrice`) jika menggunakan `bigint({ mode: 'number' })` atau `integer()`, pastikan saat menerima input dari form HTML dikonversi menggunakan `Number(formData.get('...')) || 0` sebelum disimpan ke database agar tidak terjadi error tipe data string vs number.
* Jalankan `npx drizzle-kit push` untuk memastikan tabel di Neon DB benar-benar sinkron dengan `src/db/schema.ts`.

### 2.4 Pengecekan Akhir lewat Terminal (Wajib Lulus)
AI **wajib** menjalankan perintah berikut di terminal dan memperbaiki setiap baris merah yang muncul sampai benar-benar bersih:
1. `npx tsc --noEmit` (Harus keluar tanpa output error).
2. `npm run build` (Harus berhasil *Compiled successfully*).

---

## 3. Instruksi Teknis 2: Perombakan Dashboard & Penghapusan Teks "Tugas Kuliah / Dosen"

### 3.1 Daftar Teks/Komponen yang HARUS DIHAPUS TOTAL
Cari di seluruh folder `src/` dan **hapus** segala kemunculan kalimat atau komponen berikut:
* ❌ *"Panduan Menjawab Dosen"* / *"Cheat Sheet Presentasi"*
* ❌ *"Cara Baca Kode & Tabel"* (jika isinya membahas tugas/dosen)
* ❌ *"Mode Presentasi"* / *"Simulasi Akademik"* / *"Data Dummy"*
* ❌Segala bentuk kotak tips/alert yang mengajari cara presentasi di depan kelas.

### 3.2 Desain Baru Dashboard Profesional (Seperti Aplikasi ERP / Akuntansi Bisnis Biasa)
Ubah tampilan utama / ringkasan menjadi dashboard operasional perusahaan **Kanal Tiga** yang bersih, fungsional, dan wajar seperti aplikasi bisnis pada umumnya:

1. **Baris Atas — 4 Kartu Ringkasan Metrik Utama (KPI Cards):**
   * **Total Akun Akuntansi:** Menampilkan jumlah akun aktif (contoh: `18 Akun Aktif`).
   * **Total Katalog Peralatan:** Menampilkan jumlah jenis barang & total unit fisik tersedia (contoh: `14 Jenis Barang • 104 Unit`).
   * **Mitra Pemasok:** Menampilkan jumlah supplier aktif (contoh: `6 Pemasok Terdaftar`).
   * **Pelanggan Terdaftar:** Menampilkan jumlah pelanggan aktif (contoh: `8 Pelanggan`).

2. **Baris Tengah — Navigasi 5 Tab Master Data (Sesuai Contoh Standar):**
   * Tab bersih: **`Akun Akuntansi`** | **`Produk / Barang`** | **`Pemasok`** | **`Pelanggan`** | **`Satuan`**
   * Ketika tab diklik, tampilkan tabel master data terkait lengkap dengan kolom pencarian, filter kategori/tipe, tombol **`+ Tambah Data`** (warna `#F79721`), serta tabel data yang rapi.

3. ** Mode Tampilan Ringkas (Opsional / Bila Diperlukan di Beranda):**
   * Menampilkan tabel **Daftar Akun Akuntansi** di bagian atas, serta tabel **Daftar Produk / Barang** dan **Daftar Pemasok** berdampingan di bagian bawah secara profesional (tanpa embel-embel kata "Mode Presentasi Dosen").

---

## 4. Instruksi Teknis 3: Bersihkan Halaman Login (`/login`) & Hilangkan Placeholder

Perbaiki file halaman login (`src/app/login/page.tsx`) dengan aturan ketat berikut:

1. **Hapus Semua Placeholder pada Input:**
   * Input Username / Email **TIDAK BOLEH** memiliki atribut `placeholder="..."` (atau gunakan `placeholder=""`). Jangan tampilkan contoh seperti `Masukkan username...` atau `teguh@kanaltiga.id`.
   * Input Password **TIDAK BOLEH** memiliki atribut `placeholder="..."` (jangan tampilkan `••••••••` atau `Masukkan password`).
   * Cukup gunakan `<label>` yang jelas di atas kotak input, yaitu:
     * Label 1: **Username atau Email**
     * Label 2: **Kata Sandi**
2. **Pastikan Tidak Ada Petunjuk Akun / Demo di Layar Login:**
   * Jangan tampilkan daftar username atau password apa pun di halaman `/login`.
3. **Desain Kartu Login:**
   * Tampilkan logo resmi (`logo.png`) di bagian atas kartu login.
   * Judul: **Kanal Tiga**
   * Subjudul: **Sistem Informasi Master Data Akuntansi**
   * Tombol masuk berwarna `#F79721` dengan teks **Masuk ke Sistem**.

---

## 5. Instruksi Teknis 4: Integrasi File `logo.png`

1. **Cari Lokasi `logo.png`:**
   * Periksa apakah `logo.png` berada di *root folder* proyek (`./logo.png`) atau sudah di dalam `./public/logo.png`.
   * Jika `logo.png` masih berada di *root folder* (di luar `public/`), **salin/pindahkan** ke dalam `public/logo.png` agar dapat diakses oleh komponen gambar Next.js (`/logo.png`).
2. **Gunakan `logo.png` di Seluruh Titik Identitas Brand:**
   * **Navbar / Header Utama:** Ganti ikon kotak/huruf sementara di pojok kiri atas dengan `<img src="/logo.png" alt="Logo Kanal Tiga" className="h-9 w-auto object-contain" />`.
   * **Halaman Login (`/login`):** Tampilkan `<img src="/logo.png" alt="Logo Kanal Tiga" className="h-14 w-auto mx-auto mb-3 object-contain" />` di bagian atas form login.
   * **Judul Tab Browser (`src/app/layout.tsx`):** Atur metadata icon ke `/logo.png`:
     ```ts
     export const metadata: Metadata = {
       title: 'Kanal Tiga — Sistem Master Data Akuntansi',
       description: 'Sistem Pengelolaan Master Data Akuntansi dan Inventaris Kanal Tiga',
       icons: {
         icon: '/logo.png',
       },
     };
     ```