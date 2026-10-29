# 04 — Sistem Desain UI/UX: "Tactile Industrial Studio" (Anti-Slop Guidelines)
**Proyek:** Sistem Informasi Master Data Akuntansi — Kanal Tiga Rental Elektronik  
**Warna Utama Brand:** `#F79721` (Kanal Tiga Signal Orange)

---

## 1. Filosofi Desain & Larangan "AI Slop"

Website ini **dilarang keras** tampil seperti template *admin dashboard* generik buatan AI pada umumnya. Terapkan aturan ketat berikut:

### 1.1 Apa yang DILARANG (Anti-Slop Rules):
1. **DILARANG** menggunakan gradasi ungu-biru, latar belakang *glassmorphism* buram yang berlebihan, atau bayangan tebal yang kabur (`shadow-2xl` generik).
2. **DILARANG** membuat kartu statistik Dashboard yang hanya berisi ikon bulat di pojok kanan dan satu angka besar tanpa konteks akuntansi.
3. **DILARANG** menyembunyikan kode akun/produk di dalam tooltip. Di aplikasi akuntansi, **Kode adalah warga negara kelas satu** dan harus selalu tampil dengan tipografi `monospace` berbingkai tegas seperti label plat nomor seri perangkat keras (*hardware serial tag*).
4. **DILARANG** menggunakan tabel yang terpotong atau sulit dioperasikan di layar HP.

### 1.2 Tema Estetika: "Tactile Industrial Studio"
Kanal Tiga adalah perusahaan penyewaan HT, sistem audio panggung, dan peralatan visual acara. Oleh karena itu, antarmuka pengguna (UI) mengadopsi karakter desain **perangkat keras audio-visual profesional** (terinspirasi dari *flight case* peralatan panggung, konsol mixer audio, dan panel kontrol studio):
* **Garis Batas Tegas (*Crisp 1px Borders*):** Setiap kartu dan tabel dibingkai dengan garis `1px solid` yang presisi dan sudut membulat tajam (`rounded-md` atau `rounded-lg`, bukan `rounded-3xl`).
* **Aksen Teknikal:** Terdapat indikator titik status seperti lampu sinyal LED pada mixer audio (Hijau Zamrud untuk *Tersedia/Aktif*, Amber `#F79721` untuk *Sedang Disewa*, Merah Karmin untuk *Rusak/Perawatan*).
* **Kemudahan Operasional (*High Scannability*):** Kontras teks sangat tinggi, jarak baris tabel proporsional, filter dapat diklik dalam 1 kali sentuh (*filter pills*), dan form tambah/ubah menggunakan **Slide-Over Drawer** dari sisi kanan layar sehingga pengguna tidak kehilangan konteks halaman tabel yang sedang dibuka.

---

## 2. Palet Warna Resmi (Berbasis `#F79721`)

Konfigurasikan variabel warna berikut pada `tailwind.config.ts` / `globals.css`:

| Peran Warna | Kode Hex | Penggunaan Utama |
| :--- | :---: | :--- |
| **Brand Primary (Signal Orange)** | `#F79721` | Tombol aksi utama (CTA), indikator tab aktif, garis aksen kiri pada baris terpilih, badge khusus kode utama. |
| **Brand Primary Hover** | `#E07F0B` | State hover dan fokus pada tombol utama. |
| **Brand Primary Soft Tint** | `#FFF6EB` | Latar belakang *highlight* lembut untuk baris aktif, banner informasi akuntansi, dan badge kode. |
| **Brand Primary Border** | `#FCD39B` | Garis tepi elemen yang menonjolkan fitur akuntansi atau rumus kode. |
| **Surface Background (Canvas)** | `#F8F7F4` | Warna latar belakang utama halaman (putih hangat kertas teknikal, tidak menyilaukan mata). |
| **Surface Card / Panel** | `#FFFFFF` | Warna permukaan tabel, kartu ringkasan, dan *Slide-Over Drawer*. |
| **Industrial Carbon (Sidebar/Header)** | `#141619` | Warna navigasi samping (*Sidebar*) bertekstur gelap khas *flight case* peralatan audio dengan aksen aktif `#F79721`. |
| **Text Primary** | `#18181B` | Teks utama, nama akun, nama produk, dan nilai nominal Rupiah. |
| **Text Secondary / Muted** | `#52525B` | Label kolom, subkelompok akun, spesifikasi teknis. |
| **Border Structural** | `#E4E4E7` | Garis pemisah tabel dan grid struktural. |
| **Semantic Debit / Asset Badge** | `#0284C7` (Teks) / `#E0F2FE` (Bg) | Penanda visual khusus Saldo Normal **DEBIT**. |
| **Semantic Credit / Liability Badge** | `#D97706` (Teks) / `#FEF3C7` (Bg) | Penanda visual khusus Saldo Normal **KREDIT**. |
| **Semantic Contra Account** | `#BE123C` (Teks) / `#FFE4E6` (Bg) | Penanda visual khusus **AKUN KONTRA** (`1410` & `3120`). |

> **Catatan Kontras Aksesibilitas (WCAG AA):** Ketika menggunakan `#F79721` sebagai latar belakang tombol, gunakan teks berwarna **`#141619` (Hitam Karbon)** dengan `font-semibold` atau putih dengan kontras teruji agar sangat tajam dan mudah dibaca di segala kondisi pencahayaan proyektor kelas saat presentasi.

---

## 3. Tipografi (Google Fonts)

Gunakan kombinasi 3 jenis huruf dari `next/font/google`:
1. **Heading & Navigasi:** `Plus Jakarta Sans` (Weights: `600`, `700`) — Memberikan kesan modern, korporat, dan tegas.
2. **Body & Form Input:** `Inter` (Weights: `400`, `500`, `600`) — Sangat nyaman dibaca pada tabel padat data.
3. **Kode Akun, Kode Aset & Nominal Rupiah:** `JetBrains Mono` (Weights: `500`, `600`) — **WAJIB** digunakan untuk semua kolom Kode (`1010`, `KT-HT-001`, `AST-HT-0001`), Nomor Seri, dan angka Rupiah (`Rp 2.200.000`) agar digit angka sejajar vertikal (*tabular-nums*).

---

## 4. Komponen UI Khas yang Wajib Ada (Pembeda dari Website Standar)

### 4.1 "Interactive Code Anatomy Visualizer" (Pendamping Presentasi)
Di bagian atas setiap halaman Master Data (dapat dibuka/tutup dengan 1 klik), sediakan **Panel Anatomi Kode Interaktif**.
* Contoh di halaman **Master Akun**: Menampilkan pembedahan kode secara visual:
  `[ 1 ] Kelompok: Aset` + `[ 3 ] Subkelompok: Aset Tetap` + `[ 10 ] Nomor Urut` = **`1310`**.
* Contoh di halaman **Master Aset**:
  `[ AST ] Prefix Aset Fisik` - `[ HT ] Kategori Produk` - `[ 0001 ] Nomor Unit` = **`AST-HT-0001`**.
* Ini membantu pengguna/mahasiswa menjelaskan logika pengkodean secara langsung kepada dosen tanpa perlu membuka slide PowerPoint terpisah.

### 4.2 "Hardware Spec Tag" untuk Setiap Kode Master
Setiap kode (`account_code`, `product_code`, `supplier_code`, `customer_code`, `asset_code`) ditampilkan menggunakan komponen khusus `<MasterCodeBadge />`:
* Berupa kotak berbingkai tegas dengan latar `#FFF6EB` atau `#F4F4F5`, tepi kiri tebal `3px solid #F79721`, font `JetBrains Mono`, dan tombol *copy-to-clipboard* mikro saat di-hover.

### 4.3 "Accounting Equation & COA Balance Bar" di Dashboard
Di halaman Dashboard, selain menampilkan jumlah master data, tampilkan **Visualisasi Struktur Bagan Akun**:
* Menampilkan distribusi akun berdasarkan persamaan dasar akuntansi:
  $$\text{Aset (1xxx)} = \text{Liabilitas (2xxx)} + \text{Ekuitas (3xxx)} + [\text{Pendapatan (4xxx)} - \text{Beban (5xxx)}]$$
* Menampilkan total nilai perolehan seluruh aset tetap aktif (`SUM(acquisition_cost)`), estimasi akumulasi penyusutan berjalan, dan rasio kesiapan operasional alat (Tersedia vs Disewa vs Servis).

---

## 5. Responsivitas Lintas Perangkat (Mobile, Tablet, Desktop)

1. **Desktop ($\ge 1024\text{px}$):**
   * *Fixed Left Sidebar* (`260px`) berwarna `#141619` dengan indikator peran pengguna yang sedang login di bagian bawah.
   * Area kerja utama menampilkan *Filter Bar*, *Search Input*, dan *Data Table* utuh dengan *sticky header*.
2. **Tablet ($768\text{px} - 1023\text{px}$):**
   * Sidebar dapat dilipat (*collapsible drawer*), tabel mendukung *horizontal scroll* halus dengan kolom Kode & Nama terkunci (*sticky left column*).
3. **Mobile ($< 768\text{px}$):**
   * Navigasi utama berpindah ke **Top Header + Bottom Quick Navigation Bar** (5 ikon akses cepat ke Akun, Produk, Aset, Mitra, Dashboard).
   * **Adaptive Data View:** Pada layar HP, tabel lebar otomatis bertransformasi menjadi **Tactile Specification Cards** (Kartu Data Ringkas) sehingga pengguna tidak perlu menggeser tabel ke kanan-kiri untuk melihat tarif sewa, kondisi aset, atau menekan tombol Detail/Edit.