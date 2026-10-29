# Prompt Lengkap Gemini AI — Pembuatan Slide Presentasi & Panduan Belajar Website Master Data Akuntansi (PPTX)

Dokumen ini berisi **Prompt Master (Siap Salin / Copy-Paste)** yang dirancang khusus untuk diberikan kepada **Google Gemini** (baik di Gemini Web, Gemini Canvas, Google Slides AI, maupun ekstensi pembuat kode Python `python-pptx`). 

Prompt ini menginstruksikan Gemini untuk menyusun **Slide Presentasi (`.pptx`) sekaligus Materi Belajar Tim** yang menjelaskan **"Mengapa" (Why)** dan **"Bagaimana" (How)** setiap bagian, angka, kode akun, dan aturan di dalam website **SIAKUN — Master Data Akuntansi Kanal Tiga** dibuat seperti itu.

---

## Cara Menggunakan Prompt Ini di Gemini
1. Salin seluruh teks yang berada di dalam kotak kode **`PROMPT UNTUK DISALIN KE GEMINI`** di bawah ini.
2. Tempelkan (*paste*) ke **Google Gemini**.
3. Jika Anda ingin Gemini langsung menghasilkan file `.pptx` yang bisa diunduh, pastikan baris paling bawah pada prompt ikut tersalin (Gemini akan menjalankan kode Python internal untuk membuat file `.pptx` siap unduh, atau menyusun struktur slide lengkap beserta *Speaker Notes*-nya).

---

## PROMPT UNTUK DISALIN KE GEMINI

```markdown
Kamu adalah seorang Dosen Ahli Sistem Informasi Akuntansi (SIA) sekaligus Instruktur Presentasi Akademik Terbaik.

Tugasmu adalah membuatkan **Materi Slide Presentasi PowerPoint (.pptx) yang Sangat Lengkap, Mudah Dipahami, dan Siap Dipakai Belajar Bareng Teman Sekelompok** untuk mempresentasikan proyek website kami yang bernama:
**"SIAKUN — Sistem Informasi Master Data Akuntansi Kanal Tiga (Usaha Penyewaan Peralatan Event & Elektronik di Purwokerto)"**

Tujuan utama dari slide ini BUKAN sekadar memamerkan tampilan website, melainkan **menjadi panduan belajar bagi saya dan teman-teman satu tim** agar kami benar-benar paham isi di dalam website tersebut: **kenapa dibagi menjadi menu-menu ini, kenapa angka/kode akunnya dipilih seperti itu, kenapa saldo awalnya Rp 0, kenapa masuk Debit atau Kredit, dan bagaimana cara menjawab pertanyaan dosen penguji.**

Gunakan bahasa Indonesia yang **jelas, runtut, tidak bertele-tele, mudah dicerna mahasiswa, namun tetap akurat secara kaidah Pengantar Akuntansi**.

---

# KONTEKS & DATA WEBSITE KAMI (WAJIB MASUK KE DALAM SLIDE)

1. **Profil Studi Kasus Usaha (Kanal Tiga):**
   - Bidang usaha: **UMKM Jasa Penyewaan (Rental) Peralatan Event & Elektronik** di Purwokerto (menyewakan HT, Proyektor, Sound System, Lighting, Kabel Roll).
   - Karena bergerak di bidang **Jasa Sewa**, peralatan seperti HT dan Proyektor dicatat sebagai **Aset Tetap (Peralatan Elektronik Sewa)**, BUKAN Persediaan Barang Dagang (karena alatnya disewakan lalu kembali, bukan dijual putus).

2. **Mengapa Website Dibagi Menjadi 5 Modul Master Data Utama + 2 Modul Edukasi?**
   - **Master Akun (Chart of Accounts / COA — 20 Akun):** Pondasi utama untuk menjurnal setiap transaksi ke buku besar dan laporan keuangan.
   - **Master Produk / Barang Sewa (14 Jenis Alat, 179 Total Unit Fisik):** Menyimpan tarif sewa harian (terhubung ke *Pendapatan Sewa*) dan harga beli modal (terhubung ke *Aset Tetap Peralatan*).
   - **Master Pemasok / Supplier (6 Vendor):** Menyimpan daftar toko/distributor tempat Kanal Tiga membeli alat (terhubung ke akun *Utang Usaha* saat beli kredit).
   - **Master Pelanggan / Customer (10 Penyewa):** Menyimpan data BEM Kampus, EO, dan Instansi penyewa alat (terhubung ke akun *Piutang Usaha* jika sewa belum lunas).
   - **Master Satuan / Unit (6 Satuan: UNIT, SET, PAKET, PCS, MTR, ROLL):** Menjaga konsistensi perhitungan stok fisik. Memiliki fitur **Proteksi Integritas Relasi** (satuan tidak bisa dinonaktifkan jika masih dipakai oleh produk aktif).
   - **2 Modul Edukasi Interaktif:** *Simulasi Debit & Kredit (T-Account)* dan *Komparasi COA Lintas Bidang (Jasa vs Dagang vs Manufaktur)*.

3. **Aturan Emas #1: Mengapa Saldo Awal Semua Akun di Master Data Selalu Rp 0?**
   - Sesuai kaidah baku Pengantar Akuntansi, **Master Data hanya berfungsi mendefinisikan struktur/identitas akun** (Kode, Nama, Kelompok, Saldo Normal).
   - Saldo awal periode TIDAK diinput di Master Data agar tidak merusak keseimbangan Debit-Kredit.
   - Saldo awal dimasukkan secara terpisah pada menu **Jurnal Penyesuaian -> Input Saldo Awal (Opening Balance)** pada saat awal periode akuntansi dimulai.

4. **Aturan Emas #2: Mengapa Angka Kode Akun Menggunakan Format `X-YY-ZZ` (dan Logika 4-Digit `1101`)?**
   Jelaskan arti setiap digit angka agar tim kami hafal di luar kepala:
   - **Segmen 1 (`X` / Level 1 — Kelompok Utama Laporan Keuangan):**
     - Angka **`1`** = **Aset / Harta** (Posisi Neraca)
     - Angka **`2`** = **Liabilitas / Kewajiban / Utang** (Posisi Neraca)
     - Angka **`3`** = **Ekuitas / Modal** (Posisi Neraca)
     - Angka **`4`** = **Pendapatan / Revenue** (Posisi Laba Rugi)
     - Angka **`5`** = **Beban / Expense** (Posisi Laba Rugi)
   - **Segmen 2 (`YY` / Level 2 — Sub-Kelompok Akun):**
     - Contoh di Aset (`1`): **`01`** = Aset Lancar (umur < 1 tahun / cepat cair seperti Kas, Bank, Piutang, Perlengkapan); **`02`** = Aset Tetap (umur > 1 tahun seperti Peralatan Sewa & Kendaraan).
     - Contoh di Liabilitas (`2`): **`01`** = Utang Jangka Pendek (Utang Usaha, Pendapatan Diterima di Muka); **`02`** = Utang Jangka Panjang (Utang Bank).
     - Contoh di Pendapatan (`4`): **`01`** = Pendapatan Operasional Utama; **`02`** = Pendapatan Lain-lain.
     - Contoh di Beban (`5`): **`01`** = Beban Operasional Utama; **`02`** = Beban Perawatan & Penyusutan.
   - **Segmen 3 (`ZZ` / Level 3 & 4 — Nomor Urut Akun Spesifik):**
     - Nomor urut pembeda tiap akun di dalam sub-kelompoknya:
       - `1-01-01` = Kas Operasional
       - `1-01-02` = Bank BCA (Rekening Operasional)
       - `1-01-03` = Piutang Usaha Sewa
       - `1-02-01` = Peralatan Elektronik Sewa
       - `1-02-02` = Akumulasi Penyusutan Peralatan

5. **Aturan Emas #3: Mengapa Ada Akun "Pengecualian" (Akun Kontra / Contra Account)?**
   Ini sering ditanyakan dosen penguji! Jelaskan dengan sangat gamblang:
   - **Mengapa `1-02-02 Akumulasi Penyusutan Peralatan` kodenya berawalan `1` (Aset) tapi Saldo Normalnya `KREDIT`?**
     Karena akun ini adalah **Akun Kontra-Aset (Pengurang Nilai Aset)**. Ia diletakkan di kelompok `1` supaya tampil langsung di bawah *Peralatan Elektronik Sewa* pada Neraca, namun bersaldo normal **Kredit** karena fungsinya mengurangi nilai buku peralatan yang aus dipakai sewa.
   - **Mengapa `3-01-02 Prive Pemilik` kodenya berawalan `3` (Ekuitas) tapi Saldo Normalnya `DEBIT`?**
     Karena akun ini adalah **Akun Kontra-Ekuitas (Pengurang Modal)**. Saat pemilik mengambil uang kas untuk keperluan pribadi, modal usaha berkurang sehingga dicatat di sisi **Debit**.

6. **Aturan Emas #4: Mengapa Akun Masuk ke Sisi Debit atau Kredit? (Persamaan Dasar Akuntansi)**
   - Rumus Dasar: **ASET (Debit +) = LIABILITAS (Kredit +) + EKUITAS (Kredit +)**
   - Kelompok yang berada di ruas kiri persamaan (**Aset**) dan pengurang laba (**Beban**) memiliki **Saldo Normal DEBIT** (Bertambah di Debit, Berkurang di Kredit).
   - Kelompok yang berada di ruas kanan persamaan (**Liabilitas**, **Ekuitas**) dan penambah laba (**Pendapatan**) memiliki **Saldo Normal KREDIT** (Bertambah di Kredit, Berkurang di Debit).
   - Berikan penjelasan 5 contoh simulasi transaksi di website kami:
     1. Setoran modal tunai Rp 10.000.000 -> Kas (Debit +), Modal Pemilik (Kredit +).
     2. Beli perlengkapan gudang secara kredit Rp 2.500.000 -> Perlengkapan (Debit +), Utang Usaha (Kredit +).
     3. Bayar utang ke pemasok Rp 1.000.000 -> Utang Usaha (Debit -), Kas (Kredit -).
     4. Terima uang sewa HT & Sound tunai Rp 3.000.000 -> Kas (Debit +), Pendapatan Sewa (Kredit +).
     5. Bayar listrik & internet markas Rp 500.000 -> Beban Listrik (Debit +), Kas (Kredit -).

7. **Aturan Emas #5: Mengapa COA Kanal Tiga (Jasa) Berbeda dengan Perusahaan Dagang & Manufaktur?**
   - **Perusahaan Jasa (Kanal Tiga):** Fokus pada Pendapatan Jasa Sewa & Beban Operasional. Tidak punya akun *Persediaan Barang Dagang* dan tidak menghitung *HPP (Harga Pokok Penjualan)*.
   - **Perusahaan Dagang:** Membeli barang untuk dijual kembali tanpa mengubah bentuk -> Wajib punya akun *Persediaan Barang Dagang*, *Pembelian*, dan *HPP*.
   - **Perusahaan Manufaktur (Pabrik):** Mengolah bahan mentah menjadi barang jadi -> Wajib punya 3 akun persediaan (*Bahan Baku*, *Barang Dalam Proses / WIP*, *Barang Jadi*) serta biaya pabrikasi (*Tenaga Kerja Langsung* & *Overhead Pabrik / BOP*).
   - **Perbandingan Korporasi vs UMKM:** Prinsip dasar 5 kelompok akun dan saldo normalnya 100% sama, namun UMKM seperti Kanal Tiga menggunakan jumlah akun yang lebih ramping dan langsung ke inti operasional harian.

8. **Mengapa Semua Data Menggunakan "Soft Delete" (Tombol Aktif/Nonaktif), Bukan "Hapus Permanen"?**
   - Dalam standar audit Sistem Informasi Akuntansi, akun atau barang yang pernah dipakai bertransaksi **dilarang dihapus permanen** karena akan merusak histori buku besar masa lalu (*orphan records*). Solusinya adalah mengubah status `isActive` menjadi `Nonaktif`.

---

# STRUKTUR SLIDE PRESENTASI YANG HARUS KAMU BUAT (14 SLIDE)

Buat rincian **14 Slide** berikut ini secara berurutan. Pada setiap slide, wajib tuliskan:
1. **Judul Slide & Subjudul**
2. **Poin-Poin Materi Inti di Layar (Bullet Points yang Ringkas, Visual, & Mudah Dibaca)**
3. **Penjelasan Mendalam / Naskah Bicara Presenter (Speaker Notes — ditulis dengan gaya bahasa teman menjelaskan ke teman agar kami mudah belajar)**

Daftar 14 Slide:
- **Slide 1:** Cover & Identitas Tim — SIAKUN Master Data Akuntansi Kanal Tiga
- **Slide 2:** Mengenal Studi Kasus "Kanal Tiga" — Mengapa Masuk Kategori UMKM Jasa Penyewaan?
- **Slide 3:** Peta Besar Website — Mengapa Dibagi Menjadi 5 Master Data &Bagaimana Mereka Saling Terhubung?
- **Slide 4:** Kaidah Fundamental #1 — Mengapa Saldo Awal di Master Data Selalu Rp 0?
- **Slide 5:** Kaidah Fundamental #2 — Bedah Anatomi Kode Akun (`X-YY-ZZ` & `1101`): Kenapa Angkanya Seperti Itu?
- **Slide 6:** Bedah Lengkap 20 Akun (COA) Kanal Tiga — Kelompok Neraca (1-Aset, 2-Liabilitas, 3-Ekuitas)
- **Slide 7:** Bedah Lengkap 20 Akun (COA) Kanal Tiga — Kelompok Laba Rugi (4-Pendapatan, 5-Beban)
- **Slide 8:** Rahasia "Akun Kontra" (Contra Accounts) — Kenapa Akumulasi Penyusutan (`1-02-02`) di Kredit & Prive (`3-01-02`) di Debit?
- **Slide 9:** Kaidah Fundamental #3 — Logika Penempatan Debit & Kredit Berdasarkan Persamaan Dasar Akuntansi
- **Slide 10:** Bedah 5 Simulasi Transaksi Nyata Kanal Tiga pada Buku Besar T-Account
- **Slide 11:** Komparasi COA Lintas Bidang — Mengapa COA Kanal Tiga (Jasa) Berbeda dengan Dagang & Manufaktur?
- **Slide 12:** Bedah 4 Modul Operasional Pendukung (Produk, Pemasok, Pelanggan, Satuan) & Hubungannya dengan Jurnal Akuntansi
- **Slide 13:** Standar Keamanan & Audit SIA — Mengapa Pakai *Soft Delete* (Aktif/Nonaktif) & Proteksi Relasi Satuan?
- **Slide 14:** Cheat Sheet Tanya-Jawab (Q&A) — Daftar 6 Pertanyaan Jebakan Dosen Penguji Beserta Jawaban Tepatnya

---

# INSTRUKSI TAMBAHAN OUTPUT
1. Sajikan dulu seluruh isi **14 Slide lengkap beserta penjelasan belajarnya** di ruang chat ini dengan format Markdown yang rapi, bertabel, dan mudah dibaca oleh saya dan teman-teman saya.
2. Setelah itu, jika lingkunganmu mendukung eksekusi kode Python (`python-pptx`), buatkan juga file presentasi PowerPoint **`.pptx`** dengan tema warna identitas Kanal Tiga (Putih bersih `#FFFFFF`, Abu-abu lembut `#F4F5F7`, Oranye Kanal Tiga `#F79721`, dan Teks Gelap `#111827`) agar bisa langsung kami unduh.
```

---

## Ringkasan Keunggulan Prompt Ini untuk Tim Anda
- **Menjawab Pertanyaan "Kenapa" secara Tuntas:** Menjelaskan alasan di balik pemilihan angka kode `1` s/d `5`, sub-kelompok `01` vs `02`, alasan saldo awal `Rp 0`, hingga alasan peralatan HT/Proyektor masuk ke Aset Tetap (`1-02-01`) dan bukan Persediaan Barang Dagang.
- **Membahas "Jebakan Dosen" Paling Umum:** Menjelaskan *Akun Kontra* (`1-02-02 Akumulasi Penyusutan` & `3-01-02 Prive Pemilik`) serta alasan penggunaan *Soft Delete* (`Aktif/Nonaktif`) dan *Proteksi Integritas Relasi* pada Satuan.
- **Dilengkapi *Speaker Notes* & *Q&A Cheat Sheet*:** Setiap anggota kelompok bisa membaca bagian *Speaker Notes* seperti membaca rangkuman belajar sebelum maju presentasi.

