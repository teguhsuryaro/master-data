# 10 — Spesifikasi UI Modul Edukasi (Slide 4–8) & Runbook Implementasi Lengkap

**Target File:**
1. `src/app/(dashboard)/simulasi-debit-kredit/page.tsx` (Materi Slide 4)
2. `src/app/(dashboard)/komparasi-coa/page.tsx` (Materi Slide 5–8)
3. `src/components/ui/SlideOverDrawer.tsx` & `src/components/ui/ConfirmModal.tsx`

---

## 1. Penyelarasan UI Halaman Simulasi Debit & Kredit (`/simulasi-debit-kredit`)

Tetap mempertahankan seluruh isi materi Slide 4 (`09_Pengantar_Akuntansi.pdf`), namun disusun ulang dengan pola visual `image.png`:

1. **Tingkat 1 — Baris Judul Halaman:**
   * Judul: `Penempatan Debit & Kredit` + Ikon Kotak Oranye `Scale`.
   * Kanan: Pill badge `Aset (Debit +) = Liabilitas (Kredit +) + Ekuitas (Kredit +)` + tombol kembali ke `/akun`.
2. **Tingkat 2 — Baris `ATURAN SALDO NORMAL (5 KELOMPOK AKUN)` (Folder Cards Row):**
   * 5 Kartu bergaya Folder/Soft Card (`bg-[#F4F5F7] hover:bg-[#FFF7ED] rounded-2xl p-4`):
     * Masing-masing untuk **Aset (`1-xxxx`)**, **Liabilitas (`2-xxxx`)**, **Ekuitas (`3-xxxx`)**, **Pendapatan (`4-xxxx`)**, dan **Beban (`5-xxxx`)**.
     * Menampilkan ikon kotak warna di atas, Saldo Normal (`DEBIT` / `KREDIT`), serta pill `+ Bertambah` & `- Berkurang`.
3. **Tingkat 3 — Simulator Interaktif 5 Transaksi & T-Account (`ALL FILES` + Workspace Card Style):**
   * Daftar 5 Skenario Transaksi di bagian atas/samping menggunakan gaya baris/folder `QUICK ACCESS` (saat dipilih, kartu transaksi berubah menjadi Oranye Kanal Tiga `bg-[#F79721] text-white shadow-lg`).
   * Area T-Account di bawahnya menggunakan kartu lembut (`bg-[#F4F5F7] rounded-2xl p-6`) dengan dua panel T-Account putih bersih (`bg-white rounded-2xl p-5 shadow-xs`) untuk sisi **DEBIT** dan sisi **KREDIT**.

---

## 2. Penyelarasan UI Halaman Komparasi COA Lintas Bidang (`/komparasi-coa`)

Tetap mempertahankan seluruh isi materi Slide 5–8 (`09_Pengantar_Akuntansi.pdf`), dengan tata letak baru bergaya `image.png`:

1. **Tingkat 1 — Baris Judul Halaman:**
   * Judul: `Review & Komparasi COA` + Ikon Kotak Oranye `Layers`.
2. **Tingkat 2 — Baris `PILIH BIDANG USAHA (QUICK ACCESS FOLDERS)`:**
   * 3 Kartu Folder Utama yang berfungsi sebagai pemilih tab interaktif:
     * **Folder 1:** `SLIDE 8 • BASIS KANAL TIGA` &rarr; **`Perusahaan & UMKM Jasa`** (Aktif = `bg-[#F79721] text-white`)
     * **Folder 2:** `SLIDE 7 • ALUR HPP DAGANG` &rarr; **`Perusahaan & UMKM Dagang`**
     * **Folder 3:** `SLIDE 5-6 • BIAYA PRODUKSI` &rarr; **`Manufaktur & Pabrikasi`**
3. **Tingkat 3 — Rincian Alur & Tabel Perbandingan Korporasi vs UMKM (`ALL FILES` Style):**
   * Alur Siklus Biaya/Pendapatan ditampilkan sebagai step-cards lembut (`bg-[#F4F5F7] rounded-2xl p-4`).
   * Tabel perbandingan 5 aspek (Jumlah Akun, Tingkat Detail, Akun Persediaan/Produksi, Kebutuhan Pelaporan, Sistem) menggunakan gaya baris bersih tanpa garis vertikal (`ALL FILES` table style) lengkap dengan ikon kotak berwarna di kolom pertama.

---

## 3. Penyempurnaan Komponen Modal & Drawer (`SlideOverDrawer.tsx` & `ConfirmModal.tsx`)

1. **`SlideOverDrawer.tsx`:**
   * Header drawer menggunakan latar putih bersih dengan ikon kotak oranye di sebelah judul drawer.
   * Input di dalam form menggunakan gaya lembut `bg-[#F4F5F7] focus:bg-white rounded-xl border border-transparent focus:border-[#F79721]`.
   * Tombol simpan utama berbentuk pill penuh (`rounded-full bg-[#F79721] hover:bg-[#E07F0B] text-white font-extrabold px-6 py-2.5 shadow-md shadow-[#F79721]/25`).
2. **`ConfirmModal.tsx`:**
   * Sudut modal diperhalus menjadi `rounded-3xl` dengan tombol konfirmasi dan batal berbentuk pill (`rounded-full`).

---

## 4. Panduan Eksekusi Langkah-demi-Langkah (Untuk AI Agent / Developer)

Ikuti urutan langkah di bawah ini secara berurutan agar tidak terjadi *broken import* atau *type error*:

### Tahap 1: Pembaruan Shell Navigasi & Halaman Login
1. **Edit `src/components/layout/AppShell.tsx`:**
   * Ganti layout *top-tabs* menjadi layout **Top Bar Putih (`h-20`) + Left Sidebar Melengkung Oranye (`w-[255px] rounded-tr-[42px] bg-gradient-to-b from-[#F79721] via-[#EE8915] to-[#D97206]`)**.
   * Pasang tombol pill putih utama di atas sidebar, 8 menu navigasi vertikal dengan indikator lingkaran aktif, dan widget `"STATUS MASTER DATA"` dengan 2 *progress bar* putih di bagian bawah sidebar.
   * Pastikan *drawer menu* untuk layar mobile (`< 1024px`) tetap berfungsi penuh.
2. **Edit `src/app/login/page.tsx`:**
   * Terapkan *Split Card Layout* dengan panel kiri melengkung berwarna oranye Kanal Tiga (`rounded-tr-[42px]`) dan form login putih bersih di sisi kanan beserta tombol *Quick-Fill* 5 akun demo.

### Tahap 2: Pembaruan Halaman Dashboard & 5 Modul Master Data
3. **Edit `src/app/(dashboard)/page.tsx`:**
   * Terapkan *Page Title Row*, 4 kartu folder `QUICK ACCESS`, serta daftar pratinjau akun bergaya `ALL FILES` dengan ikon kotak berwarna.
4. **Edit `src/app/(dashboard)/akun/AccountsClient.tsx`:**
   * Terapkan *Page Title Row*, 4 kartu folder filter kelompok akun (`Semua`, `Aset`, `Liabilitas & Ekuitas`, `Pendapatan & Beban`), panel *collapsible* kaidah Saldo Awal Rp 0 & Alur Kode 4-Digit, serta tabel akun bergaya `ALL FILES` tanpa garis vertikal.
5. **Edit `src/app/(dashboard)/produk/ProductsClient.tsx`:**
   * Terapkan *Page Title Row*, 4 kartu folder filter kategori barang (`Semua`, `Komunikasi`, `Visual & Pencahayaan`, `Audio & Aksesori`), dan tabel produk bergaya `ALL FILES`.
6. **Edit `src/app/(dashboard)/pemasok/SuppliersClient.tsx`:**
   * Terapkan *Page Title Row*, 4 kartu folder ringkasan/filter pemasok, dan tabel pemasok bergaya `ALL FILES`.
7. **Edit `src/app/(dashboard)/pelanggan/CustomersClient.tsx`:**
   * Terapkan *Page Title Row*, 4 kartu folder filter segmen pelanggan (`Semua`, `Organisasi Kampus`, `Event Organizer`, `Instansi / Perusahaan`), dan tabel pelanggan bergaya `ALL FILES`.
8. **Edit `src/app/(dashboard)/satuan/UnitsClient.tsx`:**
   * Terapkan *Page Title Row*, 4 kartu folder klasifikasi satuan, dan tabel satuan bergaya `ALL FILES`.

### Tahap 3: Pembaruan Modul Edukasi & Verifikasi Akhir
9. **Edit `src/app/(dashboard)/simulasi-debit-kredit/page.tsx` & `src/app/(dashboard)/komparasi-coa/page.tsx`:**
   * Sesuaikan tata letak kartu dan tabel agar selaras dengan tema *Clean Drive Workspace* (`image.png`).
10. **Pembersihan Kode Tidak Terpakai & Validasi Build:**
    * Hapus file legacy yang tidak digunakan bila ada (seperti `src/app/(dashboard)/aset/AssetsClient.tsx` karena `/aset` sudah redirect ke `/produk`).
    * Jalankan `npm run build` untuk memastikan seluruh 19 rute bebas dari *TypeScript error* maupun *webpack error*.

---

## 5. Checklist Keberhasilan Implementasi
- [ ] Sidebar kiri berwarna Oranye Kanal Tiga (`#F79721`) dengan sudut kanan atas melengkung (`rounded-tr-[42px]`).
- [ ] Terdapat tombol pill putih di puncak sidebar dan widget *progress bar* `"STATUS MASTER DATA"` di dasar sidebar.
- [ ] Top bar putih menyatu dengan input pencarian berbentuk pill (`rounded-full bg-[#F4F5F7]`) dan profil user ber-avatar bulat oranye.
- [ ] Setiap halaman memiliki bagian `"QUICK ACCESS"` dengan kartu berbentuk folder (kartu aktif berwarna `#F79721`, kartu lain `#F4F5F7`).
- [ ] Seluruh tabel menggunakan gaya `"ALL FILES"` (header kecil uppercase, ikon kotak warna-warni di kolom pertama, baris lega tanpa garis vertikal, dan sorot lembut `hover:bg-[#FFF7ED]` saat diarahkan kursor).
- [ ] Seluruh data, fungsi CRUD, dan kaidah akuntansi (`09_Pengantar_Akuntansi.pdf`) tidak berubah sedikit pun.

