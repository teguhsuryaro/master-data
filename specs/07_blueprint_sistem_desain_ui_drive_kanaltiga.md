# 07 — Blueprint Sistem Desain UI: "Clean Drive Workspace" Berbasis Warna Kanal Tiga (`#F79721`)

**Proyek:** SIAKUN — Sistem Informasi Master Data Akuntansi Kanal Tiga  
**Referensi Visual Utama:** `image.png` (Clean Cloud Drive Dashboard UI)  
**Warna Identitas Utama:** `#F79721` (Kanal Tiga Signal Orange)  
**Prinsip Utama:** **Hanya mengubah arsitektur UI/UX & Tata Letak.** Seluruh isi data, logika bisnis, validasi, dan materi akuntansi (`09_Pengantar_Akuntansi.pdf`) tetap dipertahankan 100%.

---

## 1. Bedah Anatomi Visual `image.png` & Adaptasi ke Kanal Tiga

Berdasarkan referensi `image.png`, antarmuka memiliki **5 ciri khas visual utama** yang wajib diadopsi secara menyeluruh ke dalam sistem kita dengan mengganti warna biru menjadi **Oranye Kanal Tiga (`#F79721` / `#E07F0B`)**:

```
+-----------------------------------------------------------------------------------+
| [Logo Kanal Tiga]       ( 🔍 Cari kode atau nama data...      )   🔔  ❓  ⚙️  Nama [A] |  <- TOP BAR PUTIH BERSIH
+----------------------+------------------------------------------------------------+
|                      |                                                            |
|  ( + Tambah Data )   |  Judul Halaman [🟧]                              [⊞]  [ⓘ]  |  <- HEADER HALAMAN
|                      |                                                            |
|  ◎ Ringkasan         |  AKSES CEPAT / KELOMPOK UTAMA                              |
|  □ Akun Akuntansi    |  +--------------+  +--------------+  +--------------+      |
|  □ Produk / Barang   |  | 🟧 AKTIF     |  | ⬜ KARTU 2   |  | ⬜ KARTU 3   |      |  <- FOLDER CARDS
|  □ Pemasok           |  | [●][●][●]    |  | [●][●]       |  | [●][●]       |      |     (QUICK ACCESS)
|  □ Pelanggan         |  | Judul Folder |  | Judul Folder |  | Judul Folder |      |
|  □ Satuan            |  +--------------+  +--------------+  +--------------+      |
|  □ Simulasi D/K      |                                                            |
|  □ Komparasi COA     |  DAFTAR DATA MASTER                                        |
|                      |  KODE & NAMA           KELOMPOK       NOMINAL     STATUS   |
|  ------------------  |  --------------------------------------------------------  |
|  STATUS MASTER DATA  |  [🟦] 1-01-01 Kas      Aset Lancar    Rp 0        Aktif ⋯  |  <- BARIS TABEL BERSIH
|  ☁ Bagan Akun (COA)  |  [🟩] 1-01-02 BCA      Aset Lancar    Rp 0        Aktif ⋯  |     TANPA GARIS VERTIKAL
|  [==========----]    |  [🟧] 2-11-01 Utang    Liabilitas     Rp 0        Aktif ⋯  |     (ALL FILES STYLE)
|  20 Akun • Saldo Rp0 |  [🟨] 4-11-01 Sewa     Pendapatan     Rp 0        Aktif ⋯  |
|                      |                                                            |
+----------------------+------------------------------------------------------------+
   ^ SIDEBAR ORANYE MELENGKUNG (rounded-tr-[40px])
```

### 1.1 Lima Pilar Transformasi UI:
1. **Kanvas Utama Putih Bersih (`#FFFFFF`) Tanpa Garis Kotak Berlebihan:**
   * Jika sebelumnya halaman dipenuhi banyak kotak ber-border abu-abu di atas latar belakang abu-abu, kini **area kerja utama adalah kanvas putih menyatu (`bg-white`)** yang sangat lega dan bersih.
2. **Sidebar Kiri Melengkung (*Curved Brand Sidebar*):**
   * Sidebar berada di sisi kiri bawah logo, menggunakan warna solid/gradien hangat **Kanal Tiga (`#F79721` ke `#D97706`)** dengan sudut kanan atas melengkung besar (`rounded-tr-[40px]`).
   * Bagian atas sidebar memiliki **Tombol Pill Putih Utama (`+ Tambah Data`)** yang menonjol seperti tombol `"Upload New File"` pada `image.png`.
   * Bagian bawah sidebar memiliki widget **"STATUS MASTER DATA"** dengan *progress bar* putih tipis (mengadopsi `"STORAGE DETAILS"` pada `image.png`).
3. **Top Header Menyatu (*Seamless Top Bar*):**
   * Berlatar putih bersih (`bg-white`), menampilkan Logo di kiri (tepat di atas lengkungan sidebar), **Search Bar berbentuk Pill (`rounded-full bg-[#F4F5F7]`)** di tengah-kiri, serta deretan ikon utilitas + nama pengguna + avatar bulat berwarna `#F79721` di kanan.
4. **Baris Kartu `"QUICK ACCESS"` Berbentuk Folder (*Folder-Tab Cards*):**
   * Di bawah judul halaman, terdapat deretan 4 kartu ringkasan/filter cepat dengan bentuk tab folder di bagian atasnya (atau kartu sudut membulat lembut `rounded-2xl`).
   * Kartu yang sedang aktif/dipilih berwarna **Oranye Kanal Tiga (`bg-[#F79721] text-white shadow-lg shadow-[#F79721]/25`)**, sedangkan kartu lainnya berwarna abu-abu sejuk lembut (`bg-[#F4F5F7] hover:bg-[#FFF7ED]`).
   * Setiap kartu menampilkan deretan ikon/badge bulat bertumpuk (*overlapping circular badges*) persis seperti avatar pada kartu folder di `image.png`.
5. **Tabel Data Gaya `"ALL FILES"` (*Clean Borderless-Column List*):**
   * Tabel tidak lagi menggunakan kotak tradisional yang kaku.
   * Header kolom menggunakan huruf kapital kecil (`text-[10px] font-extrabold tracking-widest uppercase text-[#9CA3AF]`).
   * Setiap baris memiliki **ikon kotak kecil berwarna di sisi kiri** (Biru, Hijau, Merah, Oranye, Ungu — seperti ikon `.docs`, `.xlsx`, `.pdf`, `.jpg` pada `image.png`), diikuti kode & nama, badge kategori/tipe di tengah, nominal/status, serta ikon salin kode (`Link/Copy`) & menu aksi di sisi kanan.
   * Saat baris di-hover atau dipilih, seluruh baris berubah latar menjadi tint lembut (`hover:bg-[#FFF7ED]/80 rounded-xl`).

---

## 2. Sistem Token Warna (Kanal Tiga Edition)

Seluruh warna biru pada `image.png` dikonversi secara harmonis ke palet **Kanal Tiga Signal Orange**:

| Peran Elemen (Referensi `image.png`) | Token Warna Kanal Tiga | Kelas Tailwind CSS | Keterangan Penggunaan |
| :--- | :---: | :--- | :--- |
| **Sidebar Utama & Kartu Folder Aktif** | `#F79721` &rarr; `#E07F0B` | `bg-gradient-to-b from-[#F79721] to-[#E07F0B]` | Latar belakang sidebar kiri melengkung & kartu Quick Access aktif. |
| **Latar Belakang Luar (Outer Frame)** | `#F4F5F7` / `#FFFFFF` | `bg-[#FFFFFF]` | Kanvas utama aplikasi putih bersih sehingga konten tampak lega. |
| **Search Bar & Kartu Folder Nonaktif** | `#F4F5F7` | `bg-[#F4F5F7]` | Latar belakang input pencarian pill, tombol ikon kanan atas, dan kartu folder nonaktif. |
| **Hover Kartu Folder & Baris Tabel** | `#FFF7ED` | `hover:bg-[#FFF7ED]` | Efek sorot (*highlight*) lembut saat baris tabel atau kartu diarahkan kursor. |
| ** Baris Tabel Terpilih (*Selected Row*)** | `#FFF0DB` | `bg-[#FFF0DB]/70` | Warna sorot baris aktif (menggantikan sorot biru muda pada `Team JB Picture.jpg`). |
| **Teks Utama (Judul & Nama Data)** | `#18181B` | `text-[#18181B]` | Judul halaman, nama akun, nama barang, nama mitra. |
| **Teks Sekunder & Metadata** | `#6B7280` / `#71717A` | `text-[#71717A]` | Subjudul, tanggal/keterangan, dan nilai pasif. |
| **Teks Header Kolom Tabel & Section** | `#9CA3AF` | `text-[#9CA3AF]` | Label `QUICK ACCESS`, `ALL FILES`, dan header kolom tabel. |
| **Garis Pemisah Baris Tabel** | `#F3F4F6` | `divide-[#F3F4F6]` | Garis horizontal ultra-tipis antar baris data. |

---

## 3. Sistem Warna Ikon Baris Data (*File-Type Icon Badges*)

Pada `image.png`, setiap baris di bawah `"ALL FILES"` memiliki ikon kotak kecil berwarna di sebelah kiri nama file (Biru untuk `.docs`, Hijau untuk `.xlsx`, Merah untuk `.pdf`, Oranye untuk `.jpg`). Kita mengadopsi pola visual ini untuk memudahkan pemindaian (*scannability*) data akuntansi:

| Modul / Tipe Data | Warna Latar Ikon | Warna Ikon | Ikon Lucide | Makna Visual |
| :--- | :---: | :---: | :--- | :--- |
| **Aset Lancar & Aset Tetap** | `bg-blue-500` | `text-white` | `Wallet` / `Landmark` | Harta / Sumber daya kas & peralatan (seperti ikon biru `.docs`). |
| **Liabilitas (Utang)** | `bg-rose-500` | `text-white` | `FileWarning` / `Receipt` | Kewajiban yang harus dilunasi (seperti ikon merah `.pdf`). |
| **Ekuitas (Modal)** | `bg-purple-600` | `text-white` | `ShieldCheck` | Hak pemilik / modal usaha. |
| **Pendapatan (Revenue)** | `bg-emerald-500` | `text-white` | `TrendingUp` | Pemasukan sewa alat (seperti ikon hijau `.xlsx`). |
| **Beban (Expense)** | `bg-[#F79721]` | `text-white` | `ArrowUpRight` | Pengeluaran operasional (seperti ikon oranye `.jpg`). |
| **Produk — Komunikasi (HT)** | `bg-blue-500` | `text-white` | `Radio` | Perangkat HT & alat komunikasi. |
| **Produk — Visual & Proyektor** | `bg-purple-500` | `text-white` | `MonitorPlay` | Proyektor, layar, TV LED. |
| **Produk — Audio & Sound** | `bg-[#F79721]` | `text-white` | `Speaker` | Sound system, mixer, mikrofon. |
| **Produk — Pencahayaan & Aksesori** | `bg-emerald-500` | `text-white` | `Zap` / `Cable` | Lighting panggung, kabel roll, tripod. |

---

## 4. Tipografi & Hierarki Ukuran Teks

Tetap menggunakan 3 font yang sudah dikonfigurasi di `src/app/layout.tsx` (`Plus Jakarta Sans`, `Inter`, `JetBrains Mono`), dengan penyesuaian proporsi ala `image.png`:

1. **Judul Utama Halaman (`My Drive` style):**
   * Kelas: `font-heading text-2xl sm:text-[26px] font-extrabold text-[#18181B] tracking-tight`
2. **Judul Section (`QUICK ACCESS` & `ALL FILES` style):**
   * Kelas: `text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#52525B]`
3. **Header Kolom Tabel (`NAME`, `OWNERS`, `LAST MODIFIED`, `FILE SIZE` style):**
   * Kelas: `text-[10px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]`
4. **Kode Master (`1-01-01`, `BRG001`, `SUP001`, `CUS001`) & Angka Rupiah:**
   * Kelas: `font-mono tabular-nums font-bold`

---

## 5. Komponen Folder Card (`QUICK ACCESS` Widget Pattern)

Pada `image.png`, kartu di bawah `QUICK ACCESS` memiliki bentuk unik menyerupai **Folder** (bagian atas kiri lebih tinggi sedikit seperti tab map/folder, atau kartu `rounded-2xl` dengan 3 baris informasi).

### Struktur Isi Setiap Kartu Folder:
1. **Baris Atas (Label Kecil):** `text-[9px] font-extrabold uppercase tracking-wider` (contoh: `KELOMPOK AKUN` atau `KATEGORI ALAT`).
2. **Baris Tengah (Cluster Lingkaran / Badge):** Deretan 3–4 bulatan kecil berbingkai putih (`flex items-center -space-x-1.5 my-3`) yang menampilkan singkatan kode atau ikon sub-item (contoh: `[1-01]`, `[1-03]`, `[1-20]` atau ikon warna-warni), memberikan tampilan visual yang kaya persis seperti deretan avatar pada `image.png`.
3. **Baris Bawah (Judul & Subjudul Folder):**
   * Sub-label: `text-[10px] opacity-75 font-medium` (contoh: `20 Akun Terdaftar`)
   * Judul Folder: `text-xs sm:text-sm font-extrabold truncate` (contoh: `Semua Bagan Akun`)
4. **Interaktivitas:** Mengklik kartu folder ini langsung memfilter tabel di bawahnya tanpa me-reload halaman!

