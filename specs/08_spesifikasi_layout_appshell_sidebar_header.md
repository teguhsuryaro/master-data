# 08 — Spesifikasi Layout Utama (`AppShell.tsx`) & Halaman Login (`login/page.tsx`)

**File Target:**
1. `src/components/layout/AppShell.tsx`
2. `src/app/login/page.tsx`

**Tujuan:** Mengubah navigasi tab horizontal lama menjadi **Arsitektur Sidebar Kiri Melengkung (*Curved Orange Sidebar*) + Top Bar Putih Menyatu** persis seperti tata letak pada `image.png`, dengan tetap mempertahankan seluruh fitur, rute, counter data, dan proteksi konfirmasi logout.

---

## 1. Spesifikasi Detail `src/components/layout/AppShell.tsx`

### 1.1 Struktur Grid / Flexbox Utama
* Seluruh aplikasi dibungkus dalam kontainer `min-h-screen bg-white flex flex-col font-sans text-[#18181B]`.
* Terdiri atas **2 bagian makro**:
  1. **Top Header Bar (`h-20 bg-white sticky top-0 z-30`)** — membentang penuh dari kiri ke kanan tanpa garis border bawah yang memotong logo.
  2. **Body Wrapper (`flex-1 flex`)** — terdiri dari:
     * **Left Sidebar (`w-[255px] shrink-0 hidden lg:flex flex-col`)** dengan latar gradien oranye Kanal Tiga (`bg-gradient-to-b from-[#F79721] via-[#EE8915] to-[#D97206] text-white rounded-tr-[42px] shadow-xl shadow-[#F79721]/15`).
     * **Main Content Area (`flex-1 min-w-0 bg-white px-5 sm:px-8 lg:px-10 py-4 overflow-y-auto`)**.

---

### 1.2 Bagian 1: Top Header Bar (Mengadopsi Bar Atas `image.png`)

```
+---------------------------+--------------------------------------------------+-------------------------------+
| [Logo] Kanal Tiga         |  ( 🔍 Cari akun, barang, pemasok, pelanggan... ) |  🔔   ❓   ⚙️  | Nama User [T] |
+---------------------------+--------------------------------------------------+-------------------------------+
  <--- Lebar 255px (Putih) ->  <----------- Sejajar Area Konten Utama -------->
```

1. **Zona Kiri (`w-[255px] shrink-0 flex items-center px-7`):**
   * Menampilkan `<img src="/logo.png" className="h-9 w-auto object-contain" />` dan teks **`Kanal Tiga`** (`font-heading text-xl font-extrabold tracking-tight text-[#18181B]`) beserta sub-label kecil `SIAKUN Master Data` (`text-[10px] font-bold text-[#C26B0A] block -mt-1`).
   * Karena berlatar putih murni, zona ini menyatu mulus dengan bagian atas sebelum **Sidebar Oranye Melengkung (`rounded-tr-[42px]`)** dimulai tepat di bawahnya (persis seperti tulisan `"Google Drive"` di atas sidebar biru pada `image.png`).

2. **Zona Tengah-Kiri (Global Quick Search Pill — Sejajar dengan Judul Konten Utama):**
   * Bentuk: `relative w-full max-w-md hidden sm:block`.
   * Styling Input: `w-full pl-11 pr-4 py-2.5 rounded-full bg-[#F4F5F7] hover:bg-[#ECEEF2] focus:bg-white border border-transparent focus:border-[#F79721] text-xs text-[#18181B] placeholder-[#9CA3AF] outline-none transition-all`.
   * Fungsi Interaktif:
     * Dilengkapi fitur **Quick Jump / Pencarian Cepat Navigasi** atau meneruskan pencarian sehingga pengguna bisa langsung mengetik nama modul/halaman (misal ketik `"Akun"`, `"HT"`, `"Debit"`, `"COA"`) atau berpindah antar modul dengan cepat.

3. **Zona Kanan (Ikon Utilitas, Profil Pengguna & Tombol Logout):**
   * **Deretan 3 Ikon Utilitas (`flex items-center gap-1.5 text-[#71717A]`):**
     1. **Ikon Notifikasi / Status Kaidah (`Bell` dengan titik oranye kecil):** Menampilkan tooltip/popover singkat: *"Status Sistem: Aktif • Kaidah Saldo Awal Master Data = Rp 0"*.
     2. **Ikon Bantuan Materi (`HelpCircle`):** Link cepat menuju `/simulasi-debit-kredit` (*Panduan & Simulator Pengantar Akuntansi*).
     3. **Ikon Komparasi COA (`Settings` / `Layers`):** Link cepat menuju `/komparasi-coa` (*Review COA Jasa, Dagang, Manufaktur*).
   * **Profil Pengguna (Persis seperti `"Jessica [J]"` di `image.png`):**
     * Menampilkan nama pengguna (`text-xs sm:text-sm font-bold text-[#6B7280]`) di sebelah kiri avatar.
     * Avatar Bulat Berwarna Brand: `w-9 h-9 rounded-full bg-[#F79721] text-white font-mono font-extrabold text-xs flex items-center justify-center shadow-sm ring-2 ring-[#FFF7ED]`.
   * **Tombol Logout & Menu Mobile:**
     * Tombol Logout (`LogOut` icon / menu button) yang memicu `ConfirmModal` (*"Konfirmasi Keluar dari Sistem"*).
     * Pada layar Mobile/Tablet (`< 1024px`), tombol hamburger (`Menu`) membuka *Slide-Over Sidebar Drawer* berdesain sama.

---

### 1.3 Bagian 2: Left Sidebar Melengkung (`rounded-tr-[42px]`)

Sidebar kiri memiliki 3 bagian vertikal seperti pada `image.png`:

#### A. Tombol Aksi Utama Berbentuk Pill Putih (`"Upload New File"` Equivalent)
* Posisi: Bagian paling atas di dalam sidebar (`pt-8 px-6 pb-6`).
* Tampilan:
  ```tsx
  <Link
    href={activeActionHref}
    className="w-full py-3 px-5 rounded-full bg-white text-[#C26B0A] hover:bg-[#FFF7ED] font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
  >
    <Plus className="w-4 h-4 stroke-[2.5]" />
    <span>{activeActionLabel}</span>
  </Link>
  ```
* Teks tombol menyesuaikan halaman aktif atau mengarah ke modul utama (misal: `+ Kelola Master Akun` atau memicu pembukaan form tambah pada halaman terkait).

#### B. Daftar Menu Navigasi Vertikal (8 Menu)
* Posisi: `px-4 space-y-1 flex-1`.
* Daftar Item Menu (Isi & Rute Tetap Sama):
  1. **Ringkasan** (`/`) — Ikon: `Compass` / `LayoutGrid`
  2. **Akun Akuntansi** (`/akun`) — Ikon: `BookOpen` (Badge: `counts.accounts`)
  3. **Produk / Barang** (`/produk`) — Ikon: `Package` (Badge: `counts.products`)
  4. **Pemasok** (`/pemasok`) — Ikon: `Truck` (Badge: `counts.suppliers`)
  5. **Pelanggan** (`/pelanggan`) — Ikon: `Users2` (Badge: `counts.customers`)
  6. **Satuan** (`/satuan`) — Ikon: `Ruler` (Badge: `counts.units`)
  7. **Simulasi Debit-Kredit** (`/simulasi-debit-kredit`) — Ikon: `Scale`
  8. **Komparasi COA** (`/komparasi-coa`) — Ikon: `Layers`
* **Visual Item Aktif vs Nonaktif (Mengadopsi gaya `"My drive"` di `image.png`):**
  * **Item Aktif:**
    * Teks putih tebal (`text-white font-extrabold bg-white/18 rounded-full py-2.5 px-4 shadow-2xs`).
    * Ikon di sebelah kiri dibungkus lingkaran putih transparan (`w-6 h-6 rounded-full bg-white/25 border border-white/60 flex items-center justify-center`) persis seperti lingkaran pada ikon `"My drive"` di `image.png`!
  * **Item Nonaktif:**
    * `text-white/80 hover:text-white hover:bg-white/10 rounded-full py-2.5 px-4 font-medium transition-all`.
  * **Counter Badge di Kanan Item:**
    * Bulatan/pill kecil transparan (`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/15 text-white`).

#### C. Widget Bawah Sidebar: `"STATUS MASTER DATA"` (Mengadopsi `"STORAGE DETAILS"` di `image.png`)
* Posisi: Bagian bawah sidebar (`mt-auto px-6 pt-5 pb-7 border-t border-white/20 space-y-4`).
* **Judul Kecil:** `STATUS MASTER DATA` (`text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/75`).
* **Item Progress 1 — Bagan Akun (COA):**
  * Baris Judul: Ikon `Cloud` / `Database` + teks `Bagan Akun (COA)` (`text-xs font-bold text-white`).
  * Progress Bar: Track `w-full h-1.5 bg-black/20 rounded-full overflow-hidden`, Fill `bg-white h-full w-[85%] rounded-full`.
  * Sub-teks: `{counts?.accounts ?? 20} Akun Aktif • Saldo Awal Rp 0` (`text-[10px] text-white/85`).
* **Item Progress 2 — Katalog & Mitra Usaha:**
  * Baris Judul: Ikon `Boxes` + teks `Katalog & Mitra` (`text-xs font-bold text-white`).
  * Progress Bar: Track `w-full h-1.5 bg-black/20 rounded-full overflow-hidden`, Fill `bg-white h-full w-[72%] rounded-full`.
  * Sub-teks: `{counts?.products ?? 14} Barang • {(counts?.suppliers ?? 6) + (counts?.customers ?? 10)} Mitra Terdaftar` (`text-[10px] text-white/85`).
* **Link Bawah (`"Upgrade Storage ↗"` Equivalent):**
  * Link menuju `/simulasi-debit-kredit`: `Panduan Materi PDF ↗` (`inline-flex items-center gap-1.5 text-xs font-extrabold text-white hover:underline pt-1`).

---

## 2. Spesifikasi Detail Halaman Login (`src/app/login/page.tsx`)

Agar selaras dengan tampilan aplikasi utama (`image.png`), halaman Login disusun ulang menggunakan **Split / Card Layout bergaya Clean Drive dengan Panel Samping Melengkung (`#F79721`)**:

1. **Latar Belakang Luar:**
   * Hangat dan bersih (`bg-[#F4F5F7]`) dengan kartu utama berbentuk aplikasi mini (`max-w-4xl w-full bg-white rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 border border-white`).
2. **Sisi Kiri Kartu Login (`md:col-span-5`, Panel Oranye Melengkung `rounded-tr-[42px]`):**
   * Menggunakan gradien khas sidebar (`bg-gradient-to-b from-[#F79721] to-[#D97206] text-white p-8 flex flex-col justify-between`).
   * Menampilkan identitas **Kanal Tiga Rental • SIAKUN**, ringkasan 5 Modul Master Data, serta widget mini *"Kaidah Baku: Saldo Awal Master Data = Rp 0"* dengan progress bar putih khas `image.png`.
3. **Sisi Kanan Kartu Login (`md:col-span-7`, Kanvas Putih `bg-white p-8 sm:p-10`):**
   * Form Login dengan input bergaya pill/soft-rounded (`bg-[#F4F5F7] focus:bg-white rounded-2xl border border-transparent focus:border-[#F79721]`).
   * Tombol Submit berbentuk pill penuh (`rounded-full bg-[#F79721] hover:bg-[#E07F0B] text-white font-extrabold py-3 shadow-md shadow-[#F79721]/25`).
   * Bagian bawah tetap menyediakan **5 Tombol Quick-Fill Akun Demo (`teguh`, `daffa`, `fawwaz`, `awal`, `devin`)** berbentuk chip lembut (`bg-[#F4F5F7] hover:bg-[#FFF7ED]`) agar pengujian dan demo presentasi berjalan instan.

