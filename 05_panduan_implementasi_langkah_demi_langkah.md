# 05 — Panduan Implementasi Teknis Langkah demi Langkah (Dari 0 Sampai Selesai)
**Proyek:** Sistem Informasi Master Data Akuntansi — Kanal Tiga Rental Elektronik  
**Target Pembaca:** AI Coding Agent & Developer Pelaksana

---

## 1. Struktur Direktori Proyek

Bangun proyek menggunakan struktur folder yang bersih, modular, dan mudah dipelihara berikut:

```text
kanal-tiga-akuntansi/
├── .env.example                 # Template variabel environment
├── drizzle.config.ts            # Konfigurasi Drizzle Kit untuk Neon DB
├── package.json                 # Daftar dependensi & skrip npm
├── tailwind.config.ts           # Konfigurasi warna #F79721 & font
├── src/
│   ├── middleware.ts            # Proteksi rute & cek sesi JWT
│   ├── db/
│   │   ├── index.ts             # Inisialisasi koneksi @neondatabase/serverless
│   │   ├── schema.ts            # Skema lengkap 8 tabel & enum
│   │   └── seed.ts              # Skrip seed idempoten (5 user + seluruh master data)
│   ├── lib/
│   │   ├── auth.ts              # Fungsi sign/verify JWT (jose) & cek role
│   │   ├── code-generator.ts    # Fungsi atomic sequence generator
│   │   ├── formatters.ts        # Formatter Rupiah (IDR), tanggal Indonesia, & kalkulasi penyusutan
│   │   └── validations.ts       # Skema Zod untuk 5 Master Data + aturan bisnis
│   ├── actions/
│   │   ├── auth-actions.ts      # Server actions: login, logout, switch demo user
│   │   ├── account-actions.ts   # CRUD + Toggle Active Master Akun
│   │   ├── product-actions.ts   # CRUD + Toggle Active Master Produk
│   │   ├── supplier-actions.ts  # CRUD + Toggle Active Master Pemasok
│   │   ├── customer-actions.ts  # CRUD + Toggle Active Master Pelanggan
│   │   ├── asset-actions.ts     # CRUD + Toggle Active Master Aset
│   │   └── seed-actions.ts      # Action untuk Reset/Sinkronisasi Data Demo dari UI
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx     # Kerangka utama (Sidebar Desktop + Bottom Nav Mobile)
│   │   │   └── RoleBadge.tsx    # Indikator hak akses user aktif
│   │   ├── ui/
│   │   │   ├── MasterCodeBadge.tsx      # Komponen tag kode monospace khas Kanal Tiga
│   │   │   ├── CodeAnatomyBanner.tsx    # Visualisasi interaktif penjelasan pola kode
│   │   │   ├── SlideOverDrawer.tsx      # Panel samping untuk Form Tambah/Ubah & Detail
│   │   │   └── ConfirmDeactivateModal.tsx # Modal konfirmasi nonaktifkan data + alasan akuntansi
│   └── app/
│       ├── layout.tsx           # Konfigurasi Font (Plus Jakarta Sans, Inter, JetBrains Mono)
│       ├── globals.css          # Variabel CSS & utilitas tema #F79721
│       ├── login/
│       │   └── page.tsx         # Halaman Login + Quick-Login 5 Akun Demo
│       └── (dashboard)/
│           ├── layout.tsx       # Layout terproteksi autentikasi
│           ├── page.tsx         # Dashboard Utama & Ringkasan Akuntansi
│           ├── akun/
│           │   └── page.tsx     # Halaman Master Akun (COA)
│           ├── produk/
│           │   └── page.tsx     # Halaman Master Produk/Katalog
│           ├── pemasok/
│           │   └── page.tsx     # Halaman Master Pemasok
│           ├── pelanggan/
│           │   └── page.tsx     # Halaman Master Pelanggan
│           └── aset/
│               └── page.tsx     # Halaman Master Aset Fisik & Simulasi Penyusutan
```

---

## 2. Daftar Dependensi (`package.json`)

Gunakan paket-paket ringan dan stabil berikut:

```json
{
  "name": "kanal-tiga-master-akuntansi",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "db:push": "drizzle-kit push",
    "db:seed": "tsx src/db/seed.ts",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.10.4",
    "bcryptjs": "^2.4.3",
    "clsx": "^2.1.1",
    "drizzle-orm": "^0.38.0",
    "jose": "^5.9.6",
    "lucide-react": "^0.468.0",
    "next": "15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^2.5.5",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "dotenv": "^16.4.7",
    "drizzle-kit": "^0.30.0",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2"
  }
}
```

---

## 3. Spesifikasi Fungsional Setiap Halaman

### 3.1 Halaman Login (`/login`)
* Menampilkan identitas **Kanal Tiga Rental Elektronik — Sistem Master Data Akuntansi (Purwokerto)**.
* Form input `Username / Email` dan `Password`.
* **Panel "Akses Cepat Demo Akademik":** Menampilkan 5 kartu klik-langsung untuk akun `admin`, `akuntan`, `logistik`, `frontdesk`, dan `dosen`. Ketika salah satu kartu diklik, kolom username & password langsung terisi otomatis dan menjelaskan hak akses peran tersebut.

### 3.2 Halaman Dashboard (`/`)
* **Baris Pertama (KPI Cards):**
  1. **Total Akun COA Aktif** (dirinci per 5 kelompok akun).
  2. **Katalog Produk Sewa** (beserta jumlah kategori).
  3. **Unit Aset Fisik** (dirinci: *Siap Sewa*, *Sedang Disewa*, *Dalam Perawatan*).
  4. **Total Nilai Perolehan Aset Tetap (`1310`)** dalam format Rupiah (`Rp 24.470.000`).
  5. **Mitra Terdaftar** (Total Pemasok & Pelanggan Aktif).
* **Baris Kedua (Panel Interaktif):**
  * **Peta Relasi Master Data:** Diagram interaktif yang memperlihatkan bagaimana Akun `4010–4040` terhubung ke Produk, dan Akun `1310`, `1410`, `5310` serta Supplier terhubung ke Unit Aset Fisik.
  * **Panduan Skenario Presentasi Dosen:** Checklist interaktif 9 langkah demo sesuai dokumen rancangan, sehingga pengguna tinggal mengklik langkah ke-1 hingga ke-9 saat presentasi di kelas.

### 3.3 Halaman Master Akun (`/akun`)
* **Banner Anatomi Kode:** Menjelaskan struktur `K T D D` (4 digit) dan konsep Saldo Normal vs Akun Kontra.
* **Fitur Filter & Pencarian:**
  * Filter *Pills* berdasarkan kelompok: `Semua`, `1 - Aset`, `2 - Liabilitas`, `3 - Ekuitas`, `4 - Pendapatan`, `5 - Beban`.
  * Filter Saldo Normal (`Debit` / `Kredit`) dan Status (`Aktif` / `Nonaktif`).
* **Tampilan Hierarki:** Akun Induk (`1000`, `2000`, dst.) ditampilkan dengan latar penegas dan huruf tebal, sedangkan akun detail di bawahnya sedikit menjorok ke dalam (*indented*) untuk memperlihatkan struktur pohon COA.
* **Form Tambah/Ubah Akun:**
  * Ketika pengguna memilih `Kelompok Akun`, digit pertama kode otomatis dikunci dan `Saldo Normal` otomatis terisi.
  * Tersedia checkbox **"Ini adalah Akun Kontra (Pengurang Kelompok)"** yang secara dinamis membalikkan `Saldo Normal` dan menampilkan penjelasan akuntansi (seperti pada Akumulasi Penyusutan & Prive).

### 3.4 Halaman Master Produk/Barang (`/produk`)
* **Banner Anatomi Kode:** Menjelaskan pola `KT-KAT-NNN` dan perbedaan mendasar antara **Katalog Produk** (jenis & tarif sewa) vs **Aset Fisik** (unit bernomor seri).
* **Kolom Tabel:**
  * Kode Produk (`KT-HT-001`), Nama & Merek, Kategori, Tarif Sewa/Hari, Akun Pendapatan Default (badge `4010 - Pendapatan Sewa HT`), **Stok Unit Fisik (Tersedia / Total Unit)**, Status, dan Aksi.
* **Form Tambah/Ubah Produk:**
  * Saat memilih Kategori (misal: `AUD - Audio`), sistem otomatis memilihkan `Akun Pendapatan Default` (`4020`) dan menampilkan pratinjau kode otomatis berikutnya (`KT-AUD-004`).

### 3.5 Halaman Master Pemasok (`/pemasok`) & Pelanggan (`/pelanggan`)
* **Banner Anatomi Kode:** Menjelaskan pola `SUP-NNNN` dan `CUS-NNNN` serta alasan mengapa kode pihak ketiga tidak boleh dicampur dengan kode akun akuntansi.
* **Fitur Tambahan pada Detail Pemasok:** Menampilkan daftar unit Aset Fisik yang dibeli dari pemasok tersebut beserta total nilai perolehannya.
* **Fitur Tambahan pada Pelanggan:** Filter berdasarkan jenis pelanggan (`Organisasi Kampus`, `EO`, `Perusahaan`, `Individu`) dengan penanda khusus bahwa data kontak merupakan data simulasi.

### 3.6 Halaman Master Aset Fisik (`/aset`)
* **Banner Anatomi Kode:** Menjelaskan pola `AST-KAT-NNNN` dan hubungan 1-ke-banyak antara 1 Produk dengan banyak Unit Aset.
* **Filter Cepat:** Berdasarkan Kategori, Kondisi (`Baik`, `Perlu Perawatan`, `Rusak`), dan Status Ketersediaan (`Tersedia`, `Disewa`, `Perawatan`, `Nonaktif`).
* **Panel Detail Aset & Simulasi Akuntansi:**
  * Saat salah satu aset diklik **"Lihat Detail"**, tampilkan kartu spesifikasi fisik lengkap beserta **Kartu Informasi Akuntansi Aset**:
    * Akun Aset Tetap: `1310 - Peralatan Elektronik untuk Disewakan`
    * Akun Kontra: `1410 - Akumulasi Penyusutan Peralatan`
    * Akun Beban: `5310 - Beban Penyusutan Peralatan`
    * Harga Perolehan, Tanggal Perolehan, Umur Ekonomis (Bulan), Penyusutan per Bulan, Akumulasi Penyusutan s.d. Bulan Ini, dan **Estimasi Nilai Buku Saat Ini**.

---

## 4. Urutan Eksekusi untuk AI Coding Agent

Ketika pengguna meminta untuk mulai membangun kode dari kelima dokumen ini, ikuti urutan eksekusi berikut:
1. **Tahap 1 (Inisialisasi & Panduan Neon DB):** Tampilkan instruksi pembuatan database Neon DB (dari File `01`), lalu buat konfigurasi proyek (`package.json`, `tailwind.config.ts`, `drizzle.config.ts`, `src/db/index.ts`, dan `src/db/schema.ts`).
2. **Tahap 2 (Seed Data & Logika Inti):** Buat `src/lib/code-generator.ts`, `src/lib/validations.ts`, `src/lib/auth.ts`, dan `src/db/seed.ts` lengkap dengan 5 akun pengguna, 30 akun COA, 5 kategori, 12 produk, 6 supplier, 10 pelanggan, dan 28 unit aset.
3. **Tahap 3 (Server Actions & Autentikasi):** Buat seluruh file di `src/actions/*`, `src/middleware.ts`, dan halaman `/login` dengan fitur *1-Click Demo Account Switcher*.
4. **Tahap 4 (Desain Layout & Komponen Anti-Slop):** Buat `AppShell.tsx`, `MasterCodeBadge.tsx`, `CodeAnatomyBanner.tsx`, dan `SlideOverDrawer.tsx` dengan skema warna `#F79721` dan tema *Tactile Industrial Studio*.
5. **Tahap 5 (Implementasi Halaman Dashboard & 5 Modul Master Data):** Bangun halaman Dashboard, Master Akun, Master Produk, Master Pemasok, Master Pelanggan, dan Master Aset secara lengkap dan responsif.