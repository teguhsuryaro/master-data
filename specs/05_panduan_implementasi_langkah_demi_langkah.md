# 05 — Panduan Implementasi Teknis & Prompt Eksekusi Antigravity (Revisi v3.0)

**Proyek:** Sistem Informasi Master Data Akuntansi — Kanal Tiga Rental Event & Elektronik  
**Model AI Pelaksana:** Gemini Flash 3.8 (di Antigravity IDE)

---

## 1. Struktur Folder Proyek (Ringkas & Bersih)

```text
kanal-tiga-master/
├── .env                         # Berisi DATABASE_URL (Neon DB) & JWT_SECRET
├── drizzle.config.ts            # Konfigurasi Drizzle Kit
├── package.json                 # Skrip & dependensi
├── src/
│   ├── middleware.ts            # Proteksi halaman (wajib login)
│   ├── db/
│   │   ├── index.ts             # Koneksi Neon Serverless Postgres
│   │   ├── schema.ts            # 6 Tabel: users, accounts, units, products, suppliers, customers
│   │   └── seed.ts              # Seed 5 akun nama teman + seluruh master data rental event
│   ├── lib/
│   │   ├── auth.ts              # JWT Session helper (jose + bcryptjs)
│   │   ├── code-generator.ts    # Auto-numbering BRG001, SUP001, CUS001 & helper kode X-YY-ZZ
│   │   └── formatters.ts        # Format angka ribuan Indonesia (45.000 / Rp 45.000)
│   ├── actions/
│   │   └── master-actions.ts    # Server Actions lengkap untuk CRUD ke-5 Master Data & Auth
│   ├── components/
│   │   ├── ConfirmDialog.tsx    # Modal konfirmasi wajib (Logout, Nonaktifkan Data, Batal Form)
│   │   ├── NavbarHeader.tsx     # Header Kanal Tiga (#F79721) + Info User + Tombol Logout Aman
│   │   └── MasterDashboard.tsx  # Komponen utama 5 Tab + Mode Tampilan Gabungan (Seperti Foto Dosen)
│   └── app/
│       ├── layout.tsx           # Konfigurasi Font Inter & JetBrains Mono
│       ├── globals.css          # Styling Tailwind & tema #F79721
│       ├── login/
│       │   └── page.tsx         # Halaman Login bersih (TANPA quick-demo button)
│       └── page.tsx             # Halaman Utama Master Data Akuntansi
```

---

## 2. Spesifikasi Kolom Tabel di Layar (100% Sesuai Contoh Dosen)

Pastikan setiap tabel memiliki pencarian langsung (*real-time search*), filter dropdown (Tipe Akun / Kategori / Status), pagination yang nyaman diklik, dan kolom-kolom berikut:

1. **Tab 1: Daftar Akun Akuntansi**
   * Kolom: `Kode Akun` (`1-01-01`) | `Nama Akun` | `Tipe Akun` (`Aset Lancar`, `Aset Tetap`, `Liabilitas`, `Ekuitas`, `Pendapatan`, `Beban`) | `Saldo Normal` (`Debit`/`Kredit`) | `Saldo Awal (Rp)` | `Status` (`Aktif`/`Nonaktif`) | `Aksi` (`Edit`, `Ubah Status`).
2. **Tab 2: Daftar Produk / Barang**
   * Kolom: `Kode Barang` (`BRG001`) | `Nama Barang` | `Kategori` (`Komunikasi`, `Visual`, `Audio`, `Pencahayaan`, `Aksesori`) | `Satuan` (`Unit`, `Set`, `Paket`, `Pcs`, `Roll`) | `Harga Beli / Perolehan (Rp)` | `Harga Sewa / Hari (Rp)` | `Stok` | `Status` | `Aksi`.
3. **Tab 3: Daftar Pemasok (Supplier)**
   * Kolom: `Kode` (`SUP001`) | `Nama Pemasok` | `Kontak PIC` | `Telepon` | `Spesialisasi Barang` | `Alamat` | `Status` | `Aksi`.
4. **Tab 4: Daftar Pelanggan**
   * Kolom: `Kode` (`CUS001`) | `Nama Pelanggan` | `Kategori` (`Organisasi Kampus`, `Event Organizer`, dll.) | `Kontak PIC` | `Telepon` | `Alamat / Instansi` | `Status` | `Aksi`.
5. **Tab 5: Daftar Satuan**
   * Kolom: `Kode Satuan` (`UNIT`, `SET`, dll.) | `Nama Satuan` | `Deskripsi Penggunaan` | `Jumlah Produk Terkait` | `Status` | `Aksi`.

---

## 3. Cara Memberikan Perintah (Prompt) ke Gemini Flash 3.8 di Antigravity

Simpan kelima file Markdown ini di dalam folder `specs/` pada proyek Anda:
* `specs/01_arsitektur_dan_perbaikan_logika.md`
* `specs/02_skema_database_dan_validasi.md`
* `specs/03_seed_data_lengkap.md`
* `specs/04_sistem_desain_ui_ux.md`
* `specs/05_panduan_implementasi_lengkap.md`

### OPSI A: Jika Proyek Sebelumnya Sudah Terlanjur Dibuat (Ingin Direvisi Total)
Salin dan kirimkan *prompt* tunggal ini ke Gemini Flash 3.8 di Antigravity:

```text
Tolong baca seluruh file spesifikasi revisi terbaru (Versi 3.0) di folder `specs/`:
- @specs/01_arsitektur_dan_perbaikan_logika.md
- @specs/02_skema_database_dan_validasi.md
- @specs/03_seed_data_lengkap.md
- @specs/04_sistem_desain_ui_ux.md
- @specs/05_panduan_implementasi_lengkap.md

Kita melakukan revisi menyeluruh agar proyek lebih sederhana, mudah dijelaskan ke dosen, dan tampilannya selaras dengan contoh dosen namun beraksen #F79721:
1. Perbarui `src/db/schema.ts` menjadi 6 tabel bersih (`users`, `accounts`, `units`, `products`, `suppliers`, `customers`) sesuai `02_skema_database_dan_validasi.md`. Hapus tabel aset fisik yang rumit.
2. Perbarui `src/db/seed.ts` sesuai `03_seed_data_lengkap.md`:
   - Masukkan 5 akun user anggota tim (teguh, daffa, fawwaz, awal, devin) dengan password `123456`.
   - Masukkan 18 akun COA berformat `X-YY-ZZ` (`1-01-01` s/d `5-12-01`).
   - Masukkan 5 satuan (`UNIT`, `SET`, `PCS`, `PAKET`, `ROLL`), 14 barang event familiar (`BRG001` s/d `BRG014`), 6 pemasok (`SUP001` s/d `SUP006`), dan 8 pelanggan (`CUS001` s/d `CUS008`).
   - Jalankan `npx drizzle-kit push --force` lalu `npm run db:seed`.
3. Perbarui halaman `/login`: HAPUS seluruh tombol akses cepat / quick-demo login. Buat form login yang bersih di mana user mengetik sendiri username/email dan password mereka, lengkap dengan tombol Show/Hide Password.
4. Bangun ulang tampilan utama sesuai `04_sistem_desain_ui_ux.md` dan `05_panduan_implementasi_lengkap.md`:
   - Gunakan navigasi 5 Tab Horisontal (`Akun Akuntansi`, `Produk / Barang`, `Pemasok`, `Pelanggan`, `Satuan`) + Mode Ringkasan Gabungan seperti foto dosen dengan warna identitas `#F79721`.
   - Terapkan pengamanan Anti-Salah-Pencet: Modal konfirmasi wajib saat klik Logout, modal konfirmasi saat menonaktifkan/mengaktifkan data, dan peringatan saat menutup form tambah/edit yang belum disimpan.
```

---

### OPSI B: Jika Membangun dari Folder Kosong (Dari 0)
Gunakan 3 tahapan *prompt* singkat berikut secara berurutan:

#### Langkah 1 (Setup & Database + Seed):
```text
Pelajari seluruh file spesifikasi di @specs/01_arsitektur_dan_perbaikan_logika.md, @specs/02_skema_database_dan_validasi.md, @specs/03_seed_data_lengkap.md, @specs/04_sistem_desain_ui_ux.md, dan @specs/05_panduan_implementasi_lengkap.md.

Tolong inisialisasi proyek Next.js 15 + TypeScript + Tailwind CSS + Drizzle ORM + Neon Serverless (`@neondatabase/serverless`) + `jose` + `bcryptjs` + `lucide-react`.
Buat `src/db/schema.ts` dan `src/db/seed.ts` sesuai spesifikasi v3.0. Jika saya belum memiliki file `.env`, tampilkan panduan singkat mendaftar Neon DB dari file 01. Jika `.env` sudah ada, jalankan `npx drizzle-kit push` dan `npm run db:seed`.
```

#### Langkah 2 (Autentikasi Murni & Server Actions CRUD):
```text
Lanjutkan membuat sistem autentikasi JWT (`src/lib/auth.ts`, `src/middleware.ts`), halaman `/login` (INGAT: Jangan tampilkan tombol quick-demo login, biarkan kami mengetik manual username `teguh`/`daffa`/`fawwaz`/`awal`/`devin` dan password `123456`), serta buat seluruh Server Actions di `src/actions/master-actions.ts` untuk tambah, edit, dan ubah status kelima master data (Akun, Produk, Pemasok, Pelanggan, Satuan) beserta generator kode otomatis (`BRG001`, `SUP001`, `CUS001`).
```

#### Langkah 3 (UI/UX 5 Tab seperti Contoh Dosen + Pengamanan Konfirmasi):
```text
Sekarang bangun antarmuka utama sesuai @specs/04_sistem_desain_ui_ux.md dan @specs/05_panduan_implementasi_lengkap.md:
1. Buat Header & Navigasi 5 Tab (`Akun Akuntansi`, `Produk / Barang`, `Pemasok`, `Pelanggan`, `Satuan`) plus Mode Ringkasan Semua Tabel seperti foto dosen dengan warna utama `#F79721`.
2. Pastikan semua fitur pencarian, filter, pagination, tambah data, dan edit data berfungsi mulus dan responsif di HP maupun laptop.
3. Wajib pasang `ConfirmDialog` untuk: (a) Konfirmasi sebelum Logout, (b) Konfirmasi sebelum menonaktifkan/mengaktifkan data, dan (c) Konfirmasi saat membatalkan form yang sudah diketik agar tidak ada yang terpencet secara tidak sengaja.
4. Jalankan pengecekan build/typecheck untuk memastikan aplikasi bebas error.
```