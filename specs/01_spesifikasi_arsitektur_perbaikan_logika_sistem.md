# 01 — Spesifikasi Arsitektur, Penyederhanaan Logika Rental & Autentikasi (Revisi v3.0)
**Proyek:** Sistem Informasi Master Data Akuntansi — Kanal Tiga Rental Event & Elektronik  
**Wilayah Operasional Simulasi:** Purwokerto, Jawa Tengah  
**Status Dokumen:** Blueprint Revisi Final (v3.0) — Selaras Contoh Dosen & Mudah Dipresentasikan

---

## 1. Ringkasan Revisi Utama (Mengapa Versi 3.0 Jauh Lebih Mudah Dijelaskan)

Berdasarkan evaluasi terhadap contoh aplikasi yang ditampilkan dosen di kelas, rancangan versi 3.0 menyederhanakan arsitektur data agar **100% selaras dengan struktur tabel dosen**, tidak berbelit-belit, namun tetap mempertahankan identitas bisnis **Kanal Tiga Rental Peralatan Event**:

### 1.1 Struktur 5 Master Data (Persis Urutan Tab Contoh Dosen)
1. **Akun Akuntansi (`accounts`):** Menggunakan format kode 3 segmen **`X-YY-ZZ`** (contoh: `1-01-01` Kas, `1-20-01` Peralatan Elektronik Sewa, `4-11-01` Pendapatan Sewa). Dilengkapi kolom: *Kode Akun*, *Nama Akun*, *Tipe Akun*, *Saldo Awal (Rp)*, dan *Status*.
2. **Produk / Barang (`products`):** Menggabungkan katalog barang dan inventaris ke dalam satu tabel yang bersih dengan format kode **`BRG001`**. Dilengkapi kolom: *Kode Barang*, *Nama Barang*, *Kategori*, *Satuan*, *Harga Beli / Perolehan (Rp)*, *Harga Sewa / Hari (Rp)*, *Stok Unit*, dan *Status*.
3. **Pemasok / Supplier (`suppliers`):** Menggunakan format kode **`SUP001`**. Mencatat toko/distributor tempat Kanal Tiga membeli HT, proyektor, sound system, dan perlengkapan.
4. **Pelanggan (`customers`):** Menggunakan format kode **`CUS001`**. Mencatat penyewa alat seperti BEM/Himpunan kampus, EO, dan instansi di Purwokerto.
5. **Satuan (`units`):** Master data satuan barang seperti **`Unit`**, **`Set`**, **`Paket`**, **`Pcs`**, dan **`Roll`** (menggantikan tabel aset fisik yang rumit pada versi sebelumnya).

---

## 2. Cara Menjelaskan Logika Akuntansi Rental ke Dosen (Cheat Sheet Presentasi)

Jika dosen bertanya mengapa usaha rental menggunakan tabel seperti di layar, berikut adalah 3 argumen logis yang sudah tertanam di dalam sistem:

1. **Penjelasan Kolom "Harga Beli (Perolehan)" vs "Harga Sewa / Hari":**
   * **Harga Beli (Rp):** Adalah harga modal perolehan (*acquisition cost*) saat Kanal Tiga membeli 1 unit/set barang tersebut dari Pemasok (Supplier).
   * **Harga Sewa (Rp):** Adalah tarif sewa harian (per 24 jam) yang dikenakan kepada Pelanggan ketika menyewa alat tersebut untuk acara.
2. **Penjelasan Kode Akun (`X-YY-ZZ`):**
   * Digit Pertama (`X`): Kelompok utama akun (`1` Aset, `2` Liabilitas, `3` Ekuitas, `4` Pendapatan, `5` Beban).
   * Dua Digit Tengah (`YY`): Subkelompok akun (`01` Kas & Bank, `03` Piutang, `15` Perlengkapan Habis Pakai, `20` Aset Tetap Peralatan Sewa, `11` Utang/Pendapatan/Beban Utama).
   * Dua Digit Terakhir (`ZZ`): Nomor urut akun di dalam subkelompok tersebut (`01`, `02`, `03`, dst.).
3. **Perbedaan Perlengkapan (`1-15-01`) vs Peralatan Sewa (`1-20-01`):**
   * **Perlengkapan Acara (`1-15-01`):** Barang habis pakai pendukung operasional seperti baterai cadangan, lakban panggung (*gaffer tape*), dan nota.
   * **Peralatan Elektronik Sewa (`1-20-01`):** Barang utama yang disewakan berulang kali kepada pelanggan seperti HT, Proyektor, Layar, dan Sound System.

---

## 3. Spesifikasi Autentikasi & 5 Akun Anggota Tim (Tanpa Tombol Quick-Demo)

> **ATURAN PENTING HALAMAN LOGIN:**  
> Pada halaman `/login`, **JANGAN TAMPILKAN** tombol *Quick-Fill / Akses Cepat Demo* apa pun. Halaman login harus bersih dan profesional seperti aplikasi bisnis sungguhan, di mana pengguna mengetik sendiri **Username atau Email** beserta **Password** mereka.

### Daftar 5 Akun Resmi Anggota Tim (Otomatis Dibuat saat Seed Database)
Seluruh akun memiliki hak akses penuh (`ADMIN`) agar setiap anggota kelompok dapat mendemonstrasikan seluruh fitur tambah, ubah, dan nonaktifkan data saat giliran berbicara di depan kelas. Password dibuat seragam dan sangat mudah diketik: **`123456`**

| No | Nama Lengkap | Username | Email | Password | Jabatan di Aplikasi |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | **Teguh Surya Romadon** | `teguh` | `teguh@kanaltiga.id` | `123456` | Koordinator Utama & Akuntansi |
| 2 | **Daffa Maisan Fathin** | `daffa` | `daffa@kanaltiga.id` | `123456` | Manajer Inventaris & Peralatan |
| 3 | **Muhammad Fattachul Fawwaz** | `fawwaz` | `fawwaz@kanaltiga.id` | `123456` | Manajer Keuangan & COA |
| 4 | **Awal Ramadhan Depa** | `awal` | `awal@kanaltiga.id` | `123456` | Manajer Mitra & Pengadaan |
| 5 | **Devin Rafa Haryanto** | `devin` | `devin@kanaltiga.id` | `123456` | Manajer Layanan Pelanggan |

*Catatan: Pengguna dapat login menggunakan **Username** (cukup ketik `teguh`, `daffa`, `fawwaz`, `awal`, atau `devin`) maupun menggunakan **Email** lengkap.*

---

## 4. Spesifikasi Tech Stack (Ringan, Cepat & 100% Gratis)

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15 (App Router) + TypeScript** | Fullstack terintegrasi dengan Server Actions tanpa perlu backend terpisah. |
| **Database** | **Neon Serverless Postgres** (`@neondatabase/serverless`) | Database PostgreSQL cloud gratis, cepat, dan tanpa *cold-start* berat. |
| **ORM** | **Drizzle ORM + Drizzle Kit** | Sangat ringan, *type-safe*, dan migrasi skema instan (`npx drizzle-kit push`). |
| **Autentikasi** | **JWT Cookie (`jose` + `bcryptjs`)** | Sesi login tersimpan aman di HTTP-Only Cookie. |
| **Styling & UI** | **Tailwind CSS + Lucide React** | Tema bersih dengan warna utama **`#F79721`** dan tata letak ramah pengguna. |

---

## 5. Panduan Pendaftaran Neon DB (Wajib Ditampilkan AI Jika `.env` Belum Ada)

Jika pengguna belum memiliki `DATABASE_URL` dari Neon DB, berikan panduan ringkas berikut:
1. Buka [https://neon.tech](https://neon.tech) dan klik **Sign Up** menggunakan akun **Google** atau **GitHub**.
2. Buat proyek baru dengan nama `kanal-tiga-master` dan pilih region **AWS Asia Pacific (Singapore)**.
3. Salin **Connection String** yang muncul (diawali dengan `postgresql://...`).
4. Buat file `.env` di folder utama proyek dan isi:
   ```env
   DATABASE_URL="tempelkan_connection_string_neon_di_sini"
   JWT_SECRET="kanal-tiga-secret-key-2026"
   ```
5. Jalankan `npm run db:push` dilanjutkan `npm run db:seed`.