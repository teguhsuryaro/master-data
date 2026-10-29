# 01 — Spesifikasi Arsitektur, Perbaikan Logika Akuntansi & Infrastruktur
**Proyek:** Sistem Informasi Master Data Akuntansi — Kanal Tiga Rental Elektronik  
**Wilayah Operasional Simulasi:** Purwokerto, Jawa Tengah  
**Status Dokumen:** Blueprint Final Siap Implementasi (v2.0)

---

## 1. Audit & Perbaikan Logika Bisnis (Dari Rancangan v1.0 ke v2.0)

Berdasarkan evaluasi terhadap dokumen rancangan awal, berikut adalah **7 celah logika (*logical gaps*)** yang telah diperbaiki dan wajib diterapkan pada kode program:

### 1.1 Resolusi Konflik "Akun Kontra" vs "5 Kelompok Utama Akun"
* **Masalah pada v1.0:** Validasi sistem menyatakan `account_group` hanya boleh berisi 5 kelompok utama (`Aset`, `Liabilitas`, `Ekuitas`, `Pendapatan`, `Beban`). Namun pada tabel seed data, akun `1410 (Akumulasi Penyusutan)` ditulis memiliki kelompok `Aset kontra` dan `3120 (Prive)` ditulis `Ekuitas kontra`. Ini akan menyebabkan error validasi database/enum.
* **Solusi v2.0:**
  * Kolom `account_group` dikunci secara ketat pada 5 enum murni: `'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE'`.
  * Ditambahkan kolom boolean `is_contra` (Default: `false`).
  * **Logika Otomatisasi Saldo Normal (`normal_balance`):**
    * Secara default: `ASSET` & `EXPENSE` = `DEBIT`; sedangkan `LIABILITY`, `EQUITY`, & `REVENUE` = `CREDIT`.
    * Jika `is_contra == true`, maka saldo normal otomatis **dibalik** (Contoh: `1410` adalah kelompok `ASSET` dengan `is_contra = true`, sehingga saldo normalnya otomatis menjadi `CREDIT`).

### 1.2 Pemisahan Akun Induk (Header) dan Akun Transaksi (Postable)
* **Masalah pada v1.0:** Disebutkan bahwa akun induk tidak boleh digunakan langsung untuk transaksi/relasi, tetapi belum ada kolom penanda di database.
* **Solusi v2.0:**
  * Ditambahkan kolom `is_postable` (Boolean). Akun induk/header memiliki `is_postable = false`, sedangkan akun detail memiliki `is_postable = true`.
  * **Aturan Validasi Relasi:** Dropdown pemilihan akun pada form **Master Produk** hanya boleh menampilkan akun dengan `account_group = 'REVENUE'` DAN `is_postable = true` DAN `is_active = true`.
  * Dropdown pemilihan akun aset pada **Master Aset** hanya boleh menampilkan akun dengan `account_group = 'ASSET'`, `is_contra = false`, `is_postable = true`, dan `is_active = true` (seperti `1310`).

### 1.3 Kelengkapan Logika Akuntansi pada Master Aset
* **Masalah pada v1.0:** Di COA terdapat akun `1410 (Akumulasi Penyusutan Peralatan)` dan `5310 (Beban Penyusutan Peralatan)`, namun pada tabel `assets` hanya ada satu `account_code` (`1310`). Selain itu, belum ada informasi umur ekonomis untuk menjelaskan kaitan aset dengan kedua akun penyusutan tersebut saat presentasi.
* **Solusi v2.0:**
  * Menambahkan kolom opsional/default pada tabel `assets`:
    * `useful_life_months` (Integer, default: `48` bulan / 4 tahun) — umur ekonomis simulasi.
    * `salvage_value` (Numeric, default: `0`) — estimasi nilai residu.
    * `accumulated_depr_account_code` (FK ke `accounts`, default: `'1410'`).
    * `expense_depr_account_code` (FK ke `accounts`, default: `'5310'`).
  * Sistem tetap tidak melakukan penjurnalan penyusutan otomatis (sesuai batasan ruang lingkup), namun mampu menampilkan **"Estimasi Penyusutan Garis Lurus per Bulan"** di halaman Detail Aset:
    $$\text{Penyusutan per Bulan} = \frac{\text{Harga Perolehan} - \text{Nilai Residu}}{\text{Umur Ekonomis (Bulan)}}$$
    Fitur ini akan memberikan nilai tambah akademik yang sangat tinggi saat demo mata kuliah Pengantar Akuntansi.

### 1.4 Sinkronisasi Status Aset vs Ketersediaan Stok Katalog Produk
* **Masalah pada v1.0:** Produk dan Aset sudah dipisahkan, namun pengguna tidak tahu berapa jumlah unit fisik yang siap disewa dari halaman Katalog Produk.
* **Solusi v2.0:**
  * Pada halaman **Master Produk**, tambahkan kolom terhitung (*computed/aggregated field*):
    * **Total Unit Fisik:** Jumlah seluruh aset aktif dengan `product_code` terkait.
    * **Unit Siap Sewa:** Jumlah aset aktif dengan `asset_status = 'AVAILABLE'` dan `asset_condition = 'GOOD'`.
  * **Aturan Bisnis Kondisi vs Status Aset:** Jika `asset_condition` diubah menjadi `'DAMAGED'` (Rusak) atau `'MAINTENANCE_NEEDED'` (Perlu Perawatan), maka sistem secara otomatis memaksa `asset_status` tidak boleh bernilai `'AVAILABLE'` (diarahkan ke `'MAINTENANCE'` atau `'INACTIVE'`).

### 1.5 Pencegahan *Orphaned Data* saat Penonaktifan (*Cascading Guardrails*)
* **Masalah pada v1.0:** Disebutkan data tidak dihapus permanen melainkan dinonaktifkan (`is_active = false`), tetapi belum ada aturan apa yang terjadi jika sebuah data yang masih dipakai oleh entitas lain hendak dinonaktifkan.
* **Solusi v2.0:**
  * **Akun:** Tidak dapat dinonaktifkan jika masih menjadi akun default pada Produk aktif atau Aset aktif.
  * **Produk:** Tidak dapat dinonaktifkan jika masih memiliki unit Aset yang berstatus `'RENTED'` (Sedang Disewa).
  * **Aset:** Ketika `is_active` diubah menjadi `false`, maka `asset_status` otomatis berubah menjadi `'INACTIVE'`.

### 1.6 Generator Kode Otomatis yang Bebas Bentrok (*Atomic Sequence*)
* **Masalah pada v1.0:** Pembuatan kode urut seperti `KT-HT-001` atau `AST-HT-0001` dengan cara menghitung `COUNT(*) + 1` akan gagal/duplikat jika ada data yang dihapus atau jika dua request masuk bersamaan.
* **Solusi v2.0:**
  * Menggunakan tabel khusus `code_sequences` di PostgreSQL yang menyimpan `prefix_key` (misal: `'PRD-HT'`, `'AST-AUD'`, `'SUP'`, `'CUS'`) dan `current_value`.
  * Pengambilan nomor urut baru dilakukan menggunakan satu query atomik:
    `INSERT INTO code_sequences ... ON CONFLICT (prefix_key) DO UPDATE SET current_value = code_sequences.current_value + 1 RETURNING current_value;`

### 1.7 Penyelarasan Identitas Visual Brand
* **Masalah pada v1.0:** Bagian 10.5 menyebutkan warna hijau gelap, sedangkan spesifikasi terbaru menetapkan warna utama **#F79721**.
* **Solusi v2.0:** Seluruh sistem desain menggunakan **#F79721 (Kanal Tiga Signal Orange)** yang dipadukan dengan estetika industrial audio-visual profesional (*industrial warm slate & carbon*).

---

## 2. Spesifikasi Tech Stack (Ringan, Cepat, Serverless, 100% Gratis)

Untuk memastikan website berjalan sangat cepat, mudah di-deploy, gratis sepenuhnya, dan memiliki validasi tipe data yang ketat dari database hingga ke tampilan:

| Lapisan | Teknologi yang Dipilih | Alasan Pemilihan |
| :--- | :--- | :--- |
| **Framework Utama** | **Next.js 15 (App Router) + TypeScript** | Mendukung Server Components & Server Actions sehingga tidak perlu membuat backend terpisah. Ringan dan gratis di-host di Vercel. |
| **Database** | **Neon Serverless Postgres** (`@neondatabase/serverless`) | Database PostgreSQL serverless berbasis cloud dengan *free tier* yang sangat lega, *cold start* instan, dan koneksi melalui HTTP/WebSockets yang sangat ringan. |
| **ORM & Migrasi** | **Drizzle ORM + Drizzle Kit** | Jauh lebih ringan dan cepat dibandingkan Prisma, ukuran bundle sangat kecil, mendukung penuh Neon HTTP driver, dan *type-safe* 100%. |
| **Autentikasi** | **Custom Stateless JWT (`jose` + `bcryptjs`)** | Menggunakan HTTP-Only Cookie bawaan Next.js. Sangat ringan, tanpa biaya langganan layanan auth pihak ketiga, dan sangat mudah di-seed dengan 5 akun pengguna bawaan. |
| **Validasi Data** | **Zod** | Satu skema validasi yang sama digunakan di Frontend (Form) dan Backend (Server Actions). |
| **Styling & UI** | **Tailwind CSS + Lucide Icons** | Dikustomisasi penuh dengan tema *Industrial Audio-Visual Equipment* dan warna utama `#F79721`. |

---

## 3. Spesifikasi Sistem Autentikasi & 5 Akun Bawaan

Aplikasi wajib dilindungi oleh middleware autentikasi (`middleware.ts`). Seluruh halaman di dalam rute utama (`/`, `/akun`, `/produk`, `/pemasok`, `/pelanggan`, `/aset`) hanya dapat diakses setelah pengguna login.

### 3.1 Hak Akses Berdasarkan Peran (Role-Based Access Control)
1. **`ADMIN` (Direktur / Administrator Sistem):** Akses penuh ke seluruh 5 Master Data (Tambah, Ubah, Aktif/Nonaktifkan) dan fitur Reset/Reseed Data Demo.
2. **`ACCOUNTANT` (Staf Akuntansi & Keuangan):** Akses penuh (Tambah/Ubah/Nonaktifkan) pada **Master Akun (COA)** dan **Master Aset**, serta akses *Lihat Saja (Read-Only)* pada Produk, Pemasok, dan Pelanggan.
3. **`INVENTORY` (Manajer Logistik & Peralatan):** Akses penuh pada **Master Produk**, **Master Aset**, dan **Master Pemasok**, serta akses *Lihat Saja* pada Master Akun dan Pelanggan.
4. **`FRONT_DESK` (Staf Operasional Sewa):** Akses penuh pada **Master Pelanggan**, serta akses *Lihat Saja* pada Katalog Produk dan ketersediaan Aset.
5. **`AUDITOR` (Dosen Penguji / Pemeriksa):** Akses *Lihat Saja (Read-Only)* ke seluruh modul, lengkap dengan kemampuan melihat penjelasan logika kode dan mengekspor/melihat ringkasan struktur COA.

### 3.2 Daftar 5 Akun Pengguna (Otomatis Dibuat saat Seed Database)
Agar memudahkan saat pengujian dan presentasi di depan dosen, halaman Login juga menyediakan tombol **"Quick Fill Akun Demo"** untuk kelima akun berikut:

| No | Username | Email | Password Default | Nama Lengkap | Role | Tugas Utama saat Demo |
| :-: | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `admin` | `admin@kanaltiga.id` | `KanalTiga2026!` | Bima Saputra (Direktur) | `ADMIN` | Akses penuh seluruh sistem |
| 2 | `akuntan` | `akuntansi@kanaltiga.id` | `KanalTiga2026!` | Nadia Kusuma (Akuntan) | `ACCOUNTANT` | Mengelola COA & Nilai Perolehan Aset |
| 3 | `logistik` | `logistik@kanaltiga.id` | `KanalTiga2026!` | Hendra Wijaya (Kepala Gudang) | `INVENTORY` | Mengelola Katalog, Unit Fisik & Servis |
| 4 | `frontdesk` | `sewa@kanaltiga.id` | `KanalTiga2026!` | Tiara Putri (Admin Sewa) | `FRONT_DESK` | Mengelola Data Pelanggan & Cek Alat |
| 5 | `dosen` | `penguji@kanaltiga.id` | `KanalTiga2026!` | Dosen Penguji Akuntansi | `AUDITOR` | Menginspeksi struktur data & laporan |

---

## 4. Instruksi Khusus untuk Model AI Pelaksana: Panduan Pendaftaran Neon DB

> **INSTRUKSI WAJIB BAGI AI CODING AGENT:**  
> Pengguna saat ini **belum memiliki akun dan database di Neon DB**. Ketika Anda memulai implementasi proyek ini, Anda **wajib** menyertakan panduan langkah demi langkah berikut kepada pengguna dengan bahasa yang ramah dan jelas agar pengguna dapat mengambil `DATABASE_URL` mereka:

### Langkah-Langkah Mendaftar & Mendapatkan `DATABASE_URL` di Neon DB (Gratis Tanpa Kartu Kredit):
1. **Buka Situs Resmi Neon:** Kunjungi [https://neon.tech](https://neon.tech) melalui browser Anda.
2. **Daftar Akun Gratis (*Sign Up*):**
   * Klik tombol **"Sign Up"** di pojok kanan atas.
   * Pilih masuk menggunakan akun **GitHub** atau **Google** Anda agar proses pendaftaran selesai dalam 1 klik tanpa verifikasi yang rumit.
3. **Buat Proyek Pertama (*Create a Project*):**
   * Setelah masuk ke halaman konsol Neon, Anda akan langsung diminta membuat proyek baru.
   * **Project Name:** Ketik `kanal-tiga-akuntansi`
   * **Postgres Version:** Biarkan default (`16` atau `17`).
   * **Cloud Provider & Region:** Pilih **AWS — Asia Pacific (Singapore) `ap-southeast-1`** (agar koneksi dari Purwokerto/Indonesia sangat cepat dan latensinya rendah).
   * Klik tombol **"Create project"**.
4. **Salin Connection String (`DATABASE_URL`):**
   * Begitu proyek selesai dibuat (hanya memakan waktu sekitar 3 detik), sebuah jendela berjudul **"Connect to your database"** akan muncul.
   * Pastikan opsi **"Pooled connection"** dicentang.
   * Salin (*Copy*) URL koneksi yang tampil. Bentuknya seperti ini:
     `postgresql://neondb_owner:xxxxxxxxxxxx@ep-nama-acak-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
5. **Tempelkan ke File `.env` Proyek:**
   * Buat file bernama `.env` di folder paling luar (*root*) proyek Anda.
   * Isi dengan format berikut:
     ```env
     DATABASE_URL="tempelkan_url_neon_anda_di_sini"
     JWT_SECRET="kanal-tiga-secret-key-purwokerto-2026-aman"
     ```
6. **Jalankan Migrasi & Seed Data Otomatis:**
   * Setelah `.env` tersimpan, jalankan perintah `npm run db:push` lalu `npm run db:seed` di terminal. Seluruh tabel, 5 akun login, dan puluhan master data dummy akan langsung terisi secara otomatis!