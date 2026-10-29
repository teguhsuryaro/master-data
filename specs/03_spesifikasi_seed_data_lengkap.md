# 03 — Spesifikasi Seed Data Lengkap: 5 User Tim + 5 Master Data Rental Event (Revisi v3.0)
**Proyek:** Sistem Informasi Master Data Akuntansi — Kanal Tiga Rental Event & Elektronik  
**Tujuan:** Menyediakan data awal yang sangat mudah dipahami dosen, familiar untuk event kampus/umum, dan mengikuti format layar contoh dosen.

---

## 1. Dataset 1: 5 Akun Pengguna Anggota Kelompok (`users`)

Password untuk seluruh akun di-hash menggunakan `bcryptjs` dari plain text: **`123456`**

| No | `username` | `email` | Password Plain | `fullName` | `roleTitle` |
| :-: | :--- | :--- | :---: | :--- | :--- |
| 1 | `teguh` | `teguh@kanaltiga.id` | `123456` | Teguh Surya Romadon | Koordinator Utama & Akuntansi |
| 2 | `daffa` | `daffa@kanaltiga.id` | `123456` | Daffa Maisan Fathin | Manajer Inventaris & Peralatan |
| 3 | `fawwaz` | `fawwaz@kanaltiga.id` | `123456` | Muhammad Fattachul Fawwaz | Manajer Keuangan & COA |
| 4 | `awal` | `awal@kanaltiga.id` | `123456` | Awal Ramadhan Depa | Manajer Mitra & Pengadaan |
| 5 | `devin` | `devin@kanaltiga.id` | `123456` | Devin Rafa Haryanto | Manajer Layanan Pelanggan |

---

## 2. Dataset 2: Daftar Akun Akuntansi / COA (`accounts`) — 18 Akun

Menggunakan format **`X-YY-ZZ`** persis seperti foto contoh dosen (`1-01-01`, `1-01-02`, `2-11-01`, dst.) dengan Saldo Awal yang seimbang (Total Debit = Total Kredit):

| Kode Akun | Nama Akun | Tipe Akun | Saldo Normal | Saldo Awal (Rp) | Status | Keterangan Fungsi Akun |
| :--- | :--- | :--- | :---: | ---: | :---: | :--- |
| `1-01-01` | Kas Operasional | Aset Lancar | Debit | `5500000` | Aktif | Uang tunai kas kecil di markas Kanal Tiga |
| `1-01-02` | Bank BCA | Aset Lancar | Debit | `18500000` | Aktif | Rekening utama penampungan transfer sewa alat |
| `1-03-01` | Piutang Usaha Sewa | Aset Lancar | Debit | `1500000` | Aktif | Tagihan sewa acara kampus yang belum dilunasi |
| `1-15-01` | Perlengkapan Acara & Gudang | Aset Lancar | Debit | `1200000` | Aktif | Baterai cadangan, lakban gaffer, kabel ties, nota |
| `1-20-01` | Peralatan Elektronik Sewa | Aset Tetap | Debit | `42800000` | Aktif | Nilai perolehan seluruh unit HT, Proyektor, Sound, dll. |
| `1-20-02` | Akumulasi Penyusutan Peralatan | Aset Tetap | Kredit | `4300000` | Aktif | Akumulasi penyusutan nilai peralatan sewa (Kontra-Aset) |
| `2-11-01` | Utang Usaha | Liabilitas | Kredit | `3200000` | Aktif | Tagihan pembelian peralatan ke supplier yang belum lunas |
| `2-11-02` | Uang Jaminan / Deposit Penyewa | Liabilitas | Kredit | `1000000` | Aktif | Uang titipan jaminan sewa yang wajib dikembalikan |
| `3-11-01` | Modal Usaha Kanal Tiga | Ekuitas | Kredit | `55000000` | Aktif | Setoran modal awal pendirian usaha rental |
| `3-11-02` | Laba Ditahan | Ekuitas | Kredit | `6000000` | Aktif | Akumulasi laba bersih periode sebelumnya |
| `4-11-01` | Pendapatan Sewa Alat Komunikasi (HT) | Pendapatan | Kredit | `0` | Aktif | Pendapatan dari penyewaan HT Single Band & Dual Band |
| `4-11-02` | Pendapatan Sewa Proyektor & Visual | Pendapatan | Kredit | `0` | Aktif | Pendapatan dari penyewaan Proyektor, Layar, dan TV |
| `4-11-03` | Pendapatan Sewa Sound & Aksesori | Pendapatan | Kredit | `0` | Aktif | Pendapatan dari penyewaan Sound System, Mic, Tripod, Kabel |
| `4-12-01` | Pendapatan Denda Keterlambatan | Pendapatan | Kredit | `0` | Aktif | Pendapatan denda jika pelanggan terlambat mengembalikan alat |
| `5-11-01` | Beban Gaji & Kru Lapangan | Beban | Debit | `0` | Aktif | Upah operator sound dan teknisi siaga acara |
| `5-11-02` | Beban Perawatan & Servis Alat | Beban | Debit | `0` | Aktif | Biaya servis speaker, ganti baterai HT, dan perawatan rutin |
| `5-11-03` | Beban Transportasi Pengantaran | Beban | Debit | `0` | Aktif | Biaya BBM pengantaran dan penjemputan alat ke lokasi acara |
| `5-12-01` | Beban Sewa Tempat & Listrik | Beban | Debit | `0` | Aktif | Biaya listrik bulanan untuk pengisian daya alat & sewa gudang |

---

## 3. Dataset 3: Daftar Satuan (`units`) — 5 Satuan

| Kode Satuan (`unitCode`) | Nama Satuan (`unitName`) | Deskripsi Penggunaan | Status |
| :--- | :--- | :--- | :---: |
| `UNIT` | Unit | Satuan per buah perangkat elektronik tunggal (HT, Proyektor, Layar) | Aktif |
| `SET` | Set Lengkap | Satuan perangkat berpasangan (Contoh: 2 Speaker Aktif + Mixer + Stand) | Aktif |
| `PCS` | Pcs | Satuan aksesori pendukung per biji (Tripod, Kabel HDMI, Converter) | Aktif |
| `PAKET` | Paket Bundling | Paket gabungan beberapa alat untuk 1 acara penuh | Aktif |
| `ROLL` | Roll / Gulung | Satuan khusus kabel listrik gulung (*kabel roll*) | Aktif |

---

## 4. Dataset 4: Daftar Produk / Barang Sewa (`products`) — 14 Barang Event Familiar

Kode menggunakan **`BRG001` s/d `BRG014`** persis seperti contoh layar dosen. Barang-barang yang dipilih sangat familiar dengan kegiatan kepanitiaan kampus dan event umum:

| Kode Barang | Nama Barang | Kategori | Satuan | Harga Beli / Perolehan (Rp) | Harga Sewa / Hari (Rp) | Stok | Status |
| :--- | :--- | :--- | :---: | ---: | ---: | :---: | :---: |
| `BRG001` | HT Single Band UHF (WLN KD-C1 + Earset) | Komunikasi | `UNIT` | `185000` | `10000` | `25` | Aktif |
| `BRG002` | HT Dual Band Layar Digital (Baofeng UV-5R) | Komunikasi | `UNIT` | `320000` | `15000` | `15` | Aktif |
| `BRG003` | Megaphone Toa Sirene Genggam | Komunikasi | `UNIT` | `450000` | `35000` | `4` | Aktif |
| `BRG004` | Proyektor Epson EB-X500 (3.600 Lumens) | Visual | `UNIT` | `5200000` | `150000` | `3` | Aktif |
| `BRG005` | Proyektor InFocus HD (4.000 Lumens) | Visual | `UNIT` | `6500000` | `200000` | `2` | Aktif |
| `BRG006` | Layar Proyektor Tripod Portable 70 Inci | Visual | `UNIT` | `680000` | `50000` | `4` | Aktif |
| `BRG007` | Layar Proyektor Fastfold Besar 2x3 Meter | Visual | `SET` | `2800000` | `175000` | `2` | Aktif |
| `BRG008` | Sound System Portable 12 Inci + 2 Mic Wireless | Audio | `SET` | `2400000` | `175000` | `3` | Aktif |
| `BRG009` | Paket Sound System Seminar (2 Speaker Aktif + Mixer) | Audio | `PAKET` | `7500000` | `400000` | `2` | Aktif |
| `BRG010` | Mic Wireless Handheld Dual (2 Pegang) | Audio | `SET` | `950000` | `75000` | `4` | Aktif |
| `BRG011` | Tripod Stand Speaker / Proyektor Besi | Aksesori | `PCS` | `220000` | `25000` | `8` | Aktif |
| `BRG012` | Kabel HDMI Fiber Optik 15 Meter | Aksesori | `PCS` | `275000` | `25000` | `6` | Aktif |
| `BRG013` | Kabel Roll Listrik Tembaga 25 Meter (4 Lubang) | Aksesori | `ROLL` | `210000` | `15000` | `10` | Aktif |
| `BRG014` | Lampu Sorot Panggung LED PAR 54 RGB | Pencahayaan | `UNIT` | `420000` | `40000` | `6` | Aktif |

---

## 5. Dataset 5: Daftar Pemasok / Supplier (`suppliers`) — 6 Pemasok

| Kode | Nama Pemasok | Kontak PIC | Telepon | Kategori Barang yang Dipasok | Alamat | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `SUP001` | PT Sumber Audio Nusantara | Hendro Wibowo | `0281-631011` | Sound System, Speaker & Mic | Jl. Jend. Sudirman No. 112, Purwokerto | Aktif |
| `SUP002` | CV Mitra Visual Proyeksi | Sinta Maharani | `0281-632022` | Proyektor, Layar Tripod & HDMI | Jl. HR Bunyamin No. 45, Purwokerto | Aktif |
| `SUP003` | Toko Radio Komunikasi Mandiri | Antonius Eko | `0281-633033` | HT Single Band, Dual Band & Earset | Jl. Kombas No. 28, Purwokerto | Aktif |
| `SUP004` | PD Elektrik & Kabel Sejahtera | Bambang Sutrisno | `0281-634044` | Kabel Roll, Baterai & Aksesori Listrik | Ruko Kebondalem Blok B4, Purwokerto | Aktif |
| `SUP005` | Cahaya Panggung Lighting Jaya | Dedi Hermawan | `0281-635055` | Lampu Sorot LED PAR & Stand Tripod | Jl. Gerilya Timur No. 88, Purwokerto | Aktif |
| `SUP006` | Bengkel Servis Elektronik Prima | Wahyu Kurniawan | `0281-636066` | Suku Cadang & Jasa Servis Peralatan | Jl. Kampus No. 19, Grendeng, Purwokerto | Aktif |

---

## 6. Dataset 6: Daftar Pelanggan (`customers`) — 8 Pelanggan

| Kode | Nama Pelanggan | Kategori Pelanggan | Kontak PIC | Telepon | Alamat / Instansi | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `CUS001` | BEM Universitas Jenderal Soedirman | Organisasi Kampus | Farhan Ramadhan | `0812-2700-1001` | Kompleks PKM Unsoed, Grendeng | Aktif |
| `CUS002` | Himpunan Mahasiswa Informatika | Organisasi Kampus | Aulia Rahma | `0812-2700-1002` | Kampus Teknik, Kalimanah | Aktif |
| `CUS003` | UKM Musik & Kesenian Kampus | Organisasi Kampus | Bagus Setiawan | `0812-2700-1003` | Gedung UKM Lt. 2, Purwokerto Utara | Aktif |
| `CUS004` | Kreasi Muda Event Organizer (EO) | Event Organizer | Gilang Prakoso | `0812-2700-1004` | Jl. Dr. Angka No. 54, Purwokerto | Aktif |
| `CUS005` | Panitia Seminar Nasional Ekonomi | Organisasi Kampus | Nabila Azzahra | `0812-2700-1005` | Aula Fakultas Ekonomi, Purwokerto | Aktif |
| `CUS006` | Komunitas Standup & Kreatif Banyumas | Komunitas | Sekar Arum | `0812-2700-1006` | Jl. Masjid No. 17, Alun-Alun Purwokerto | Aktif |
| `CUS007` | PT Satria Mandiri Utama | Instansi / Perusahaan | Yudhistira Putra | `0812-2700-1007` | Jl. S. Parman No. 90, Purwokerto Selatan | Aktif |
| `CUS008` | Raka Pratama (Acara Pernikahan/Keluarga) | Umum / Individu | Raka Pratama | `0812-2700-1008` | Perumahan Griya Satria Blok C-14 | Aktif |