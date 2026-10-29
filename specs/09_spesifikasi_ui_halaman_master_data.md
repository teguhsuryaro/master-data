# 09 — Spesifikasi UI Halaman Dashboard & 5 Modul Master Data (Gaya `image.png`)

**Target File:**
1. `src/app/(dashboard)/page.tsx` (Ringkasan Utama)
2. `src/app/(dashboard)/akun/AccountsClient.tsx` (Master Akun COA)
3. `src/app/(dashboard)/produk/ProductsClient.tsx` (Master Produk / Barang)
4. `src/app/(dashboard)/pemasok/SuppliersClient.tsx` (Master Pemasok)
5. `src/app/(dashboard)/pelanggan/CustomersClient.tsx` (Master Pelanggan)
6. `src/app/(dashboard)/satuan/UnitsClient.tsx` (Master Satuan)

**Aturan Penting:** Seluruh data, fungsi tambah/edit/nonaktifkan, validasi Zod, Server Actions, dan kaidah akuntansi (`Saldo Awal = Rp 0`) **TIDAK DIUBAH**. Hanya struktur tata letak (UI/UX) yang ditransformasi agar mengadopsi hierarki visual `image.png`.

---

## 1. Pola Tata Letak Seragam di Seluruh Halaman (`The 3-Tier Drive Layout`)

Setiap halaman di dalam area konten utama (`bg-white`) wajib mengikuti **3 Tingkat Baris Visual** dari `image.png`:

### Tingkat 1: Baris Judul Halaman (`"My Drive [icon] ... [grid] [info]"` Pattern)
```tsx
<div className="flex items-center justify-between gap-4 pb-6">
  {/* Kiri: Judul Besar + Ikon Kotak Oranye */}
  <div className="flex items-center gap-3">
    <h1 className="font-heading text-2xl sm:text-[26px] font-extrabold text-[#18181B] tracking-tight">
      {pageTitle}
    </h1>
    <div className="w-9 h-9 rounded-xl bg-[#F79721] text-white flex items-center justify-center shadow-sm shadow-[#F79721]/30">
      <PageIcon className="w-4 h-4 stroke-[2.2]" />
    </div>
  </div>

  {/* Kanan: Tombol Tambah Data + Tombol Ikon Info/Panduan (Kotak Abu-abu Lembut) */}
  <div className="flex items-center gap-2">
    {onAddClick && (
      <button
        onClick={onAddClick}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F79721] hover:bg-[#E07F0B] text-white text-xs font-extrabold shadow-sm shadow-[#F79721]/25 transition-all active:scale-95"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>{addButtonLabel}</span>
      </button>
    )}
    <button
      onClick={onToggleInfo}
      className="w-9 h-9 rounded-xl bg-[#F4F5F7] hover:bg-[#FFF7ED] text-[#52525B] hover:text-[#C26B0A] flex items-center justify-center transition-colors"
      title="Informasi & Kaidah Akuntansi"
    >
      <Info className="w-4 h-4" />
    </button>
  </div>
</div>
```

---

### Tingkat 2: Baris `"QUICK ACCESS"` Folder Cards (4 Kartu per Halaman)
* **Header Section:**
  ```tsx
  <div className="flex items-center justify-between mb-3.5">
    <h2 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#52525B]">
      {quickAccessTitle}
    </h2>
    <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
  </div>
  ```
* **Desain Visual Kartu Folder:**
  * Grid: `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4`.
  * Setiap kartu memiliki siluet tab folder di bagian atas atau sudut `rounded-2xl p-5 transition-all cursor-pointer relative overflow-hidden`.
  * **Kartu Aktif (Terpilih):**
    * Latar belakang: `bg-[#F79721] text-white shadow-lg shadow-[#F79721]/25`.
    * Label kecil atas: `text-[9px] font-extrabold uppercase tracking-wider text-white/80`.
    * Deretan bulatan/badge tengah (`flex items-center -space-x-1.5 my-3.5`): Lingkaran warna-warni berbingkai putih (`ring-2 ring-[#F79721]`).
    * Sub-label bawah: `text-[10px] font-semibold text-white/80 uppercase`.
    * Judul Folder bawah: `text-sm font-extrabold text-white`.
  * **Kartu Nonaktif (Standar):**
    * Latar belakang: `bg-[#F4F5F7] hover:bg-[#FFF7ED] text-[#18181B]`.
    * Label kecil atas: `text-[9px] font-extrabold uppercase tracking-wider text-[#9CA3AF]`.
    * Deretan bulatan/badge tengah: Lingkaran warna-warni (`bg-blue-500`, `bg-emerald-500`, `bg-amber-500`, `bg-purple-500` dengan `text-white text-[9px] font-mono font-bold`).
    * Sub-label bawah: `text-[10px] font-semibold text-[#9CA3AF] uppercase`.
    * Judul Folder bawah: `text-sm font-extrabold text-[#C26B0A] group-hover:text-[#9A3412]`.

---

### Tingkat 3: Bagian `"ALL FILES"` — Tabel Baris Bersih Tanpa Garis Vertikal
* **Header Section & Filter Sebaris:**
  * Di sisi kiri: Judul section uppercase (`DAFTAR AKUN AKUNTANSI`, `SEMUA PRODUK & BARANG`, dll.) dengan kelas `text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#52525B]`.
  * Di sisi kanan: Input pencarian lokal berbentuk pill (`bg-[#F4F5F7] rounded-full px-3.5 py-1.5 text-xs`) + dropdown filter status/kategori berbentuk pill lembut.
* **Desain Baris Data (`ALL FILES` Style):**
  * **Header Kolom:** `text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#9CA3AF] border-b border-[#F3F4F6] pb-3`.
  * **Baris Item (`<tr>`):**
    * `group hover:bg-[#FFF7ED]/80 transition-colors border-b border-[#F4F5F7] last:border-none`.
    * **Kolom 1 (Ikon Berwarna + Nama & Kode):**
      * Kotak ikon `w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs` (Biru/Hijau/Merah/Oranye/Ungu sesuai tipe data).
      * Nama utama (`font-bold text-xs text-[#18181B]`) + Kode (`font-mono text-[11px] font-bold text-[#C26B0A] bg-[#FFF7ED] px-2 py-0.5 rounded-md`).
    * **Kolom Tengah (Badge Kelompok / Avatar / Nominal):**
      * Ditampilkan sejajar rapi di tengah seperti kolom `OWNERS`, `LAST MODIFIED`, dan `FILE SIZE` pada `image.png`.
    * **Kolom Kanan (Ikon Salin Kode + Aksi):**
      * Tombol salin kode (`Link2` / `Copy` icon — mengadopsi ikon rantai *link* di sebelah kiri titik tiga pada `image.png`!).
      * Tombol Edit (`Edit2`) & Toggle Status (`Power` / `PowerOff`).

---

## 2. Rincian Adaptasi per Halaman

### 2.1 Halaman 1: Ringkasan Utama (`src/app/(dashboard)/page.tsx`)
1. **Judul Halaman:** `Ringkasan Master Data` + Ikon Kotak Oranye `LayoutGrid`.
2. **Baris `QUICK ACCESS` (4 Kartu Folder Utama + 1 Kartu Info Kaidah):**
   * **Folder 1 (Aktif Oranye `#F79721`):** `MODUL INTI` &rarr; Deretan badge `[1-01] [2-11] [3-11] [4-11]` &rarr; `20 Akun • Saldo Rp 0` &rarr; **`Bagan Akun (COA)`** (Link ke `/akun`).
   * **Folder 2 (`#F4F5F7`):** `INVENTARIS SEWA` &rarr; Deretan badge `[HT] [PRJ] [SND]` &rarr; `14 Jenis • Total Stok Unit` &rarr; **`Katalog Produk & Alat`** (Link ke `/produk`).
   * **Folder 3 (`#F4F5F7`):** `MITRA & REKANAN` &rarr; Deretan badge `[SUP] [CUS]` &rarr; `6 Pemasok • 10 Penyewa` &rarr; **`Pemasok & Pelanggan`** (Link ke `/pemasok`).
   * **Folder 4 (Kartu Dokumen Kaidah — seperti kartu ke-4 di `image.png`):** Ikon `Scale` + Judul **`Persamaan Dasar: Aset = Liabilitas + Ekuitas`** + Sub-teks `Kaidah Baku: Saldo Awal Master = Rp 0` (Link ke `/simulasi-debit-kredit`).
3. **Bagian `DISTRIBUSI KELOMPOK AKUN & PRATINJAU COA` (`ALL FILES` Style):**
   * Menampilkan strip ringkas 5 kelompok akun (Aset, Liabilitas, Ekuitas, Pendapatan, Beban).
   * Diikuti daftar pratinjau akun akuntansi dengan ikon kotak warna-warni di sisi kiri, kode akun, tipe akun, badge Debit/Kredit, dan `Saldo Awal: Rp 0`.

---

### 2.2 Halaman 2: Master Akun Akuntansi (`src/app/(dashboard)/akun/AccountsClient.tsx`)
1. **Judul Halaman:** `Akun Akuntansi (COA)` + Ikon Kotak Oranye `BookOpen`.
   * Di sebelah kanan judul: Tombol pill `+ Tambah Akun`, tombol `Alur Kode 4-Digit (Slide 3)`, dan tombol info `Tentang Saldo Awal Rp 0`.
2. **Baris `QUICK ACCESS — KELOMPOK AKUN` (4 Kartu Folder Filter Interaktif):**
   * Mengklik salah satu kartu folder langsung menyaring tabel di bawahnya:
     * **Folder 1:** `SEMUA KELOMPOK` &rarr; **`Semua Bagan Akun (20)`**
     * **Folder 2:** `KELOMPOK 1-XXXX (DEBIT)` &rarr; **`Aset Lancar & Tetap`**
     * **Folder 3:** `KELOMPOK 2 & 3 (KREDIT)` &rarr; **`Liabilitas & Ekuitas`**
     * **Folder 4:** `LABA RUGI 4 & 5` &rarr; **`Pendapatan & Beban`**
3. **Panel Collapsible Slide 1–3 (Tetap Tersedia & Rapi):**
   * Kotak penjelasan **"Kaidah Baku: Saldo Awal Otomatis Rp 0"** dan **"6 Tahap Alur Logika Kode Akun (Slide 3)"** tampil dengan gaya kartu lembut (`bg-[#F4F5F7] rounded-2xl p-5`) yang bersih.
4. **Tabel `DAFTAR AKUN AKUNTANSI` (`ALL FILES` Style):**
   * Kolom:
     * `AKUN & KODE` (Ikon kotak warna sesuai kelompok: Biru=Aset, Merah=Liabilitas, Ungu=Ekuitas, Hijau=Pendapatan, Oranye=Beban + Nama Akun + Kode `1-01-01`)
     * `KELOMPOK AKUN` (Badge Tipe Akun)
     * `SALDO NORMAL` (Lingkaran/Pill `Debit` Biru atau `Kredit` Oranye)
     * `SALDO AWAL` (`Rp 0` dengan ikon gembok kecil)
     * `STATUS` (`Aktif` / `Nonaktif`)
     * `AKSI` (Ikon Salin Kode `Link2`, `Edit2`, `Power`)

---

### 2.3 Halaman 3: Master Produk / Barang (`src/app/(dashboard)/produk/ProductsClient.tsx`)
1. **Judul Halaman:** `Produk / Barang Sewa` + Ikon Kotak Oranye `Package`.
2. **Baris `QUICK ACCESS — KATEGORI PERALATAN` (4 Kartu Folder Filter Interaktif):**
   * Mengklik kartu langsung memfilter kategori barang:
     * **Folder 1:** `SEMUA KATALOG` &rarr; **`Semua Peralatan (14)`**
     * **Folder 2:** `KOMUNIKASI EVENT` &rarr; **`HT & Alat Komunikasi`**
     * **Folder 3:** `VISUAL & PANGGUNG` &rarr; **`Proyektor, Layar & Lighting`**
     * **Folder 4:** `AUDIO & PENDUKUNG` &rarr; **`Sound System & Aksesori`**
3. **Tabel `DAFTAR PRODUK & BARANG` (`ALL FILES` Style):**
   * Kolom:
     * `NAMA & KODE BARANG` (Ikon kotak warna sesuai kategori + Nama Barang + Kode `BRG001`)
     * `KATEGORI & SATUAN` (Badge Kategori + Satuan `UNIT`/`SET`)
     * `HARGA BELI (MODAL)` (Format Rupiah `font-mono`)
     * `TARIF SEWA / HARI` (Format Rupiah `font-mono font-bold text-[#C26B0A]`)
     * `STOK & STATUS` (Jumlah Unit + Status `Aktif`/`Nonaktif`)
     * `AKSI` (Salin Kode, Edit, Toggle Status)

---

### 2.4 Halaman 4: Master Pemasok (`src/app/(dashboard)/pemasok/SuppliersClient.tsx`)
1. **Judul Halaman:** `Mitra Pemasok (Supplier)` + Ikon Kotak Oranye `Truck`.
2. **Baris `QUICK ACCESS — KATEGORI VENDOR` (4 Kartu Folder):**
   * **Folder 1:** `SEMUA REKANAN` &rarr; **`Semua Pemasok (${items.length})`**
   * **Folder 2:** `STATUS AKTIF` &rarr; **`Vendor Aktif Berjalan`**
   * **Folder 3:** `PENGADAAN ALAT` &rarr; **`Distributor HT, Audio & Visual`**
   * **Folder 4 (Kartu Info Akuntansi):** `RELASI AKUN 2-11-01` &rarr; **`Terhubung ke Utang Usaha & Aset`**
3. **Tabel `DAFTAR PEMASOK TERDAFTAR` (`ALL FILES` Style):**
   * Kolom: `PEMASOK & KODE` (Ikon kotak + Nama Pemasok + `SUP001`), `KONTAK PIC` (Avatar inisial bulat + nama PIC), `TELEPON & EMAIL`, `SPESIALISASI BARANG`, `STATUS`, `AKSI`.

---

### 2.5 Halaman 5: Master Pelanggan (`src/app/(dashboard)/pelanggan/CustomersClient.tsx`)
1. **Judul Halaman:** `Pelanggan Penyewa (Customer)` + Ikon Kotak Oranye `Users2`.
2. **Baris `QUICK ACCESS — SEGMEN PENYEWA` (4 Kartu Folder Filter Interaktif):**
   * Mengklik kartu langsung memfilter `typeFilter`:
     * **Folder 1:** `SEMUA SEGMEN` &rarr; **`Semua Pelanggan (${items.length})`**
     * **Folder 2:** `SEGMEN UTAMA` &rarr; **`Organisasi Kampus`**
     * **Folder 3:** `MITRA ACARA` &rarr; **`Event Organizer (EO)`**
     * **Folder 4:** `KORPORAT & PUBLIK` &rarr; **`Instansi / Perusahaan`**
3. **Tabel `DAFTAR PELANGGAN PENYEWA` (`ALL FILES` Style):**
   * Kolom: `PELANGGAN & KODE` (Ikon kotak warna per tipe + Nama Pelanggan + `CUS001`), `SEGMEN`, `PENANGGUNG JAWAB (PIC)`, `KONTAK & ALAMAT`, `STATUS`, `AKSI`.

---

### 2.6 Halaman 6: Master Satuan (`src/app/(dashboard)/satuan/UnitsClient.tsx`)
1. **Judul Halaman:** `Master Satuan Barang` + Ikon Kotak Oranye `Ruler`.
2. **Baris `QUICK ACCESS — KLASIFIKASI SATUAN` (4 Kartu Folder):**
   * **Folder 1:** `SEMUA SATUAN` &rarr; **`Seluruh Satuan Ukur (${items.length})`**
   * **Folder 2:** `SATUAN TUNGGAL` &rarr; **`UNIT & PCS (Per Biji)`**
   * **Folder 3:** `SATUAN BUNDLING` &rarr; **`SET & PAKET (Rakitan)`**
   * **Folder 4:** `SATUAN INSTALASI` &rarr; **`MTR & ROLL (Kabel)`**
3. **Tabel `DAFTAR SATUAN UKUR` (`ALL FILES` Style):**
   * Kolom: `KODE & NAMA SATUAN` (Ikon kotak warna + `UNIT` + Nama Satuan), `KETERANGAN PENGGUNAAN`, `DIGUNAKAN OLEH` (Badge jumlah produk terkait), `STATUS`, `AKSI`.

