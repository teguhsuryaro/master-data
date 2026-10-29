# 03 — Spesifikasi Seed Data Dummy Lengkap & Idempoten
**Proyek:** Sistem Informasi Master Data Akuntansi — Kanal Tiga Rental Elektronik  
**Tujuan:** Menyediakan data awal yang realistis, saling berelasi, dan bebas dari data pribadi nyata untuk keperluan demo akademik di Purwokerto.

---

## 1. Prinsip Idempotensi Seed Script (`src/db/seed.ts`)

Skrip seed harus dapat dijalankan berkali-kali (`npm run db:seed`) maupun dipicu melalui tombol **"Reset Data Demo"** di halaman Dashboard Admin tanpa menimbulkan *error duplicate key*:
1. Gunakan urutan eksekusi yang menghormati *Foreign Key*:
   * Bersihkan/Upsert: `users` $\rightarrow$ `accounts` $\rightarrow$ `product_categories` $\rightarrow$ `suppliers` $\rightarrow$ `customers` $\rightarrow$ `products` $\rightarrow$ `assets` $\rightarrow$ sinkronisasi akhir tabel `code_sequences`.
2. Pastikan tabel `code_sequences` disetel ke angka tertinggi dari masing-masing prefix setelah seed selesai, agar ketika pengguna menambah data baru saat demo presentasi (misal menambah produk HT baru), kodenya langsung melanjutkan ke `KT-HT-003` tanpa bentrok dengan `KT-HT-001` atau `KT-HT-002`.

---

## 2. Dataset 1: 5 Akun Pengguna Autentikasi (`users`)

Password untuk kelima akun di-hash menggunakan `bcryptjs` (salt rounds: 10) dari plain text: **`KanalTiga2026!`**

| Username | Email | Nama Lengkap | Jabatan (`title`) | Role |
| :--- | :--- | :--- | :--- | :--- |
| `admin` | `admin@kanaltiga.id` | Bima Saputra | Direktur Operasional | `ADMIN` |
| `akuntan` | `akuntansi@kanaltiga.id` | Nadia Kusuma, S.Ak. | Staf Akuntansi & Keuangan | `ACCOUNTANT` |
| `logistik` | `logistik@kanaltiga.id` | Hendra Wijaya | Koordinator Gudang & Teknisi | `INVENTORY` |
| `frontdesk` | `sewa@kanaltiga.id` | Tiara Putri | Front Desk & Administrasi Sewa | `FRONT_DESK` |
| `dosen` | `penguji@kanaltiga.id` | Tim Dosen Penguji | Evaluator Akademik | `AUDITOR` |

---

## 3. Dataset 2: 30 Akun Bagan Akun / COA (`accounts`)

Terdiri dari **5 Akun Induk/Header** (`is_postable = false`) dan **25 Akun Detail** (`is_postable = true`):

| Kode | Nama Akun | Kelompok (`account_group`) | Subkelompok (`subgroup`) | Kontra? (`is_contra`) | Saldo Normal | Postable? | Induk | Deskripsi |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `1000` | **ASET (INDUK)** | `ASSET` | Header Aset | `false` | `DEBIT` | `false` | `null` | Kelompok utama seluruh sumber daya ekonomi perusahaan |
| `1010` | Kas Operasional | `ASSET` | Aset Lancar - Kas & Bank | `false` | `DEBIT` | `true` | `1000` | Uang tunai di brankas kantor Purwokerto |
| `1020` | Rekening Bank Operasional | `ASSET` | Aset Lancar - Kas & Bank | `false` | `DEBIT` | `true` | `1000` | Saldo rekening bank untuk transaksi transfer sewa |
| `1110` | Piutang Usaha Sewa | `ASSET` | Aset Lancar - Piutang | `false` | `DEBIT` | `true` | `1000` | Tagihan sewa peralatan kepada pelanggan yang belum lunas |
| `1210` | Perlengkapan Operasional | `ASSET` | Aset Lancar - Perlengkapan | `false` | `DEBIT` | `true` | `1000` | Baterai cadangan sekali pakai, lakban panggung, kabel ties |
| `1220` | Persediaan Suku Cadang & Komponen | `ASSET` | Aset Lancar - Perlengkapan | `false` | `DEBIT` | `true` | `1000` | Antena HT cadangan, konektor XLR, spul mikrofon, lampu proyektor |
| `1310` | Peralatan Elektronik untuk Disewakan | `ASSET` | Aset Tetap - Peralatan | `false` | `DEBIT` | `true` | `1000` | Nilai perolehan seluruh unit HT, audio, visual, lighting milik Kanal Tiga |
| `1410` | Akumulasi Penyusutan Peralatan | `ASSET` | Akumulasi Penyusutan | `true` | `CREDIT` | `true` | `1000` | Akun kontra-aset pengurang nilai buku peralatan sewa |
| `2000` | **LIABILITAS (INDUK)** | `LIABILITY` | Header Liabilitas | `false` | `CREDIT` | `false` | `null` | Kelompok utama kewajiban perusahaan kepada pihak ketiga |
| `2010` | Utang Usaha Pemasok | `LIABILITY` | Liabilitas Jangka Pendek | `false` | `CREDIT` | `true` | `2000` | Kewajiban pembelian alat/suku cadang ke supplier secara kredit |
| `2110` | Utang Beban Operasional | `LIABILITY` | Liabilitas Jangka Pendek | `false` | `CREDIT` | `true` | `2000` | Beban listrik, internet, atau honor teknisi yang belum dibayar |
| `2210` | Uang Jaminan Sewa Diterima | `LIABILITY` | Liabilitas Jangka Pendek | `false` | `CREDIT` | `true` | `2000` | Deposit pelanggan yang wajib dikembalikan saat alat kembali utuh |
| `3000` | **EKUITAS (INDUK)** | `EQUITY` | Header Ekuitas | `false` | `CREDIT` | `false` | `null` | Kelompok utama hak pemilik atas aset bersih perusahaan |
| `3010` | Modal Pemilik Kanal Tiga | `EQUITY` | Ekuitas Pemilik | `false` | `CREDIT` | `true` | `3000` | Setoran modal awal dan tambahan investasi peralatan dari pemilik |
| `3110` | Saldo Laba Ditahan | `EQUITY` | Saldo Laba | `false` | `CREDIT` | `true` | `3000` | Akumulasi laba bersih operasional periode sebelumnya |
| `3120` | Prive Pemilik | `EQUITY` | Prive | `true` | `DEBIT` | `true` | `3000` | Akun kontra-ekuitas atas penarikan dana pribadi oleh pemilik |
| `4000` | **PENDAPATAN (INDUK)** | `REVENUE` | Header Pendapatan | `false` | `CREDIT` | `false` | `null` | Kelompok utama penghasilan dari kegiatan penyewaan alat |
| `4010` | Pendapatan Sewa HT & Komunikasi | `REVENUE` | Pendapatan Sewa | `false` | `CREDIT` | `true` | `4000` | Penghasilan sewa unit Handy Talky dan repeater |
| `4020` | Pendapatan Sewa Sistem Audio | `REVENUE` | Pendapatan Sewa | `false` | `CREDIT` | `true` | `4000` | Penghasilan sewa speaker aktif, mixer audio, dan mikrofon |
| `4030` | Pendapatan Sewa Perangkat Visual | `REVENUE` | Pendapatan Sewa | `false` | `CREDIT` | `true` | `4000` | Penghasilan sewa proyektor dan layar proyektor |
| `4040` | Pendapatan Sewa Pencahayaan & Aksesori | `REVENUE` | Pendapatan Sewa | `false` | `CREDIT` | `true` | `4000` | Penghasilan sewa lampu panggung LED PAR, kabel roll, stand, HDMI |
| `4110` | Pendapatan Denda Keterlambatan & Ganti Rugi | `REVENUE` | Pendapatan Lain-lain | `false` | `CREDIT` | `true` | `4000` | Penerimaan denda keterlambatan pengembalian alat dari penyewa |
| `5000` | **BEBAN (INDUK)** | `EXPENSE` | Header Beban | `false` | `DEBIT` | `false` | `null` | Kelompok utama pengorbanan ekonomi operasional usaha |
| `5010` | Beban Transportasi & Pengantaran Alat | `EXPENSE` | Beban Operasional | `false` | `DEBIT` | `true` | `5000` | Biaya BBM mobil operasional untuk antar-jemput alat ke lokasi acara |
| `5020` | Beban Perawatan Rutin Peralatan | `EXPENSE` | Beban Operasional | `false` | `DEBIT` | `true` | `5000` | Biaya pembersihan alat, kalibrasi frekuensi HT, dan cek rutin |
| `5030` | Beban Perbaikan & Servis Peralatan | `EXPENSE` | Beban Operasional | `false` | `DEBIT` | `true` | `5000` | Biaya perbaikan unit rusak ke vendor servis eksternal |
| `5110` | Beban Listrik, Air & Internet Gudang | `EXPENSE` | Beban Administrasi & Umum | `false` | `DEBIT` | `true` | `5000` | Tagihan utilitas bulanan markas dan gudang Kanal Tiga |
| `5120` | Beban Administrasi & ATK | `EXPENSE` | Beban Administrasi & Umum | `false` | `DEBIT` | `true` | `5000` | Kertas nota sewa, materai, map kontrak penyewaan |
| `5210` | Beban Promosi & Kemitraan Kampus | `EXPENSE` | Beban Pemasaran | `false` | `DEBIT` | `true` | `5000` | Biaya iklan media sosial dan sponsorship acara mahasiswa |
| `5310` | Beban Penyusutan Peralatan Sewa | `EXPENSE` | Beban Penyusutan | `false` | `DEBIT` | `true` | `5000` | Alokasi biaya penyusutan periodik atas aset tetap peralatan |

---

## 4. Dataset 3: 5 Kategori Produk (`product_categories`) & 12 Produk (`products`)

### 4.1 Kategori Produk (`product_categories`)
* `HT` — Komunikasi & Handy Talky (Default Akun: `4010`)
* `AUD` — Sistem Tata Suara / Audio (Default Akun: `4020`)
* `VIS` — Proyeksi & Visual (Default Akun: `4030`)
* `LGT` — Pencahayaan Panggung / Lighting (Default Akun: `4040`)
* `AKS` — Kabel, Stand & Aksesori Pendukung (Default Akun: `4040`)

### 4.2 Daftar 12 Katalog Produk (`products`)

| Kode Produk | Nama Produk | Kategori | Merek | Spesifikasi Singkat | Tarif Sewa/Hari (IDR) | Satuan | Kode Akun Pendapatan |
| :--- | :--- | :---: | :--- | :--- | :---: | :---: | :---: |
| `KT-HT-001` | HT UHF 16-Channel Standard | `HT` | WLN / Retevis | UHF 400-470MHz, Baterai Li-Ion 1500mAh, Termasuk Earset & Charger Dock | `8000` | `UNIT` | `4010` |
| `KT-HT-002` | HT Dual-Band Jarak Menengah | `HT` | Baofeng | VHF/UHF 5 Watt Dual Band, Layar LCD, Jangkauan hingga 3 KM area terbuka | `12000` | `UNIT` | `4010` |
| `KT-AUD-001` | Speaker Aktif 12 Inci 500W | `AUD` | Huper | 12" Two-Way Active Speaker, 500W Bi-Amp, Input XLR/TRS | `150000` | `UNIT` | `4020` |
| `KT-AUD-002` | Mixer Audio Analog 8-Channel | `AUD` | Yamaha | 8 Input (4 Mic/Line + 2 Stereo), 1-Knob Comp, SPX Digital Effects | `100000` | `UNIT` | `4020` |
| `KT-AUD-003` | Mikrofon Nirkabel Dual Handheld | `AUD` | Shure / Krezt | 2x Handheld Mic UHF True Diversity, Receiver Rackmount | `75000` | `SET` | `4020` |
| `KT-VIS-001` | Proyektor XGA 4.000 Lumens | `VIS` | Epson | 3LCD Technology, 4.000 ANSI Lumens, Port HDMI & VGA | `200000` | `UNIT` | `4030` |
| `KT-VIS-002` | Layar Proyektor Tripod 70 Inci | `VIS` | World Screen | Ukuran 178 x 178 cm (70" Diagonal), Matte White, Kokoh & Mudah Dilipat | `50000` | `UNIT` | `4030` |
| `KT-LGT-001` | Lampu Sorot Panggung LED PAR 54 | `LGT` | Spark | 54x3W RGBW Full Color, Mendukung DMX-512 & Sound Active | `35000` | `UNIT` | `4040` |
| `KT-AKS-001` | Kabel Roll Listrik Industrial 20m | `AKS` | Uticon / Broco | Kabel Tembaga Murni 3x1.5mm panjang 20 Meter, 4 Lubang Stopkontak | `15000` | `UNIT` | `4040` |
| `KT-AKS-002` | Kabel Audio XLR Balanced 10m | `AKS` | Canare | Kabel Low-Noise 10 Meter dengan Konektor Neutrik XLR Male-to-Female | `10000` | `UNIT` | `4040` |
| `KT-AKS-003` | Tripod Stand Speaker Heavy Duty | `AKS` | Samson | Bahan Baja Hitam, Beban Maks 50 Kg, Tinggi Maksimal 180 cm + Pin Pengunci | `25000` | `UNIT` | `4040` |
| `KT-AKS-004` | Kabel HDMI Fiber Optic 10m | `AKS` | Vention | HDMI 2.0 High Speed 4K@60Hz tanpa kehilangan sinyal untuk jarak jauh | `15000` | `UNIT` | `4040` |

---

## 5. Dataset 4: 6 Pemasok (`suppliers`) & 10 Pelanggan (`customers`)

### 5.1 Daftar 6 Pemasok (`suppliers`)
| Kode | Nama Pemasok | Jenis (`supplier_type`) | Kontak PIC | Telepon Dummy | Email Dummy | Alamat Simulasi | Kota |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| `SUP-0001` | Sumber Audio Nusantara | `EQUIPMENT` | Hendro Wibowo | `0281-630101` | `sales@sumberaudio.example.id` | Jl. Jend. Sudirman No. 112 | Purwokerto |
| `SUP-0002` | Mitra Visual Purwokerto | `EQUIPMENT` | Sinta Maharani | `0281-630102` | `info@mitravisual.example.id` | Jl. HR Bunyamin No. 45, Bancarkembar | Purwokerto |
| `SUP-0003` | Radio Komunikasi Mandiri | `EQUIPMENT` | Antonius Eko | `0281-630103` | `order@radiokomunikasi.example.id` | Jl. Komisaris Bambang Suprapto No. 28 | Purwokerto |
| `SUP-0004` | Elektronik Teknik Sejahtera | `SPAREPART` | Bambang Sutrisno | `0281-630104` | `part@elektronikteknik.example.id` | Kompleks Ruko Kebondalem Blok B4 | Purwokerto |
| `SUP-0005` | Servis Audio Prima | `SERVICE` | Wahyu Kurniawan | `0281-630105` | `teknisi@servisprima.example.id` | Jl. Kampus No. 19, Grendeng | Purwokerto |
| `SUP-0006` | Cahaya Panggung Jaya | `EQUIPMENT` | Dedi Hermawan | `0281-630106` | `kontak@cahayapanggung.example.id` | Jl. Gerilya Timur No. 88 | Purwokerto |

### 5.2 Daftar 10 Pelanggan (`customers`)
| Kode | Nama Pelanggan | Jenis (`customer_type`) | Kontak PIC | Telepon Dummy | Email Dummy | Alamat Simulasi | Kota |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| `CUS-0001` | BEM Fakultas Teknik | `ORGANIZATION` | Farhan Ramadhan | `0812-0000-1001` | `bem.ft@kampus-simulasi.example.id` | Gedung Sekretariat Ormawa FT | Purwokerto |
| `CUS-0002` | Himpunan Mahasiswa Informatika | `ORGANIZATION` | Aulia Rahma | `0812-0000-1002` | `hmif@kampus-simulasi.example.id` | Jl. Raya Kampus Timur No. 12 | Purwokerto |
| `CUS-0003` | Event Kampus Bersama | `EO` | Gilang Prakoso | `0812-0000-1003` | `halo@eventkampus.example.id` | Jl. Dr. Angka No. 54 | Purwokerto |
| `CUS-0004` | Komunitas Kreatif Banyumas | `ORGANIZATION` | Sekar Arum | `0812-0000-1004` | `info@kreatifbanyumas.example.id` | Jl. Masjid No. 17, Alun-Alun | Purwokerto |
| `CUS-0005` | PT Acara Gemilang | `COMPANY` | Yudhistira Putra | `0812-0000-1005` | `procurement@acaragemilang.example.id` | Jl. S. Parman No. 90 | Purwokerto |
| `CUS-0006` | Panitia Seminar Teknologi | `ORGANIZATION` | Kevin Sanjaya | `0812-0000-1006` | `semnas.tekno@kampus-simulasi.example.id` | Aula Pusat Kegiatan Mahasiswa Lt. 2 | Purwokerto |
| `CUS-0007` | Raka Pratama | `INDIVIDUAL` | Raka Pratama | `0812-0000-1007` | `raka.pratama@mail-dummy.example.id` | Perumahan Griya Satria Blok C-14 | Purwokerto |
| `CUS-0008` | Studio Kreasi Lokal | `COMPANY` | Dimas Aditya | `0812-0000-1008` | `admin@studiokreasilokal.example.id` | Jl. Prof. Dr. Suharso No. 31 | Purwokerto |
| `CUS-0009` | Panitia Dies Natalis | `ORGANIZATION` | Nabila Azzahra | `0812-0000-1009` | `diesnatalis@kampus-simulasi.example.id` | Jl. Kampus Utara No. 3 | Purwokerto |
| `CUS-0010` | Komunitas Musik Sore | `ORGANIZATION` | Bagus Setiawan | `0812-0000-1010` | `musiksore@komunitas.example.id` | Taman Andhang Pangrenan | Purwokerto |

---

## 6. Dataset 5: 28 Unit Aset Fisik (`assets`)

Seluruh aset terhubung ke akun aset `1310`, akun akumulasi penyusutan `1410`, dan akun beban penyusutan `5310`:

| Kode Aset | Kode Produk | Nama Unit Aset | Nomor Seri (`serial_number`) | Tgl Perolehan | Harga Perolehan (IDR) | Umur (Bln) | Kondisi | Status | Kode Supplier | Lokasi Rak |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `AST-HT-0001` | `KT-HT-001` | HT UHF 16-Ch Unit #01 | `SN-WLN-24001` | `2025-01-15` | `250000` | `36` | `GOOD` | `AVAILABLE` | `SUP-0003` | Loker HT Rak A-1 |
| `AST-HT-0002` | `KT-HT-001` | HT UHF 16-Ch Unit #02 | `SN-WLN-24002` | `2025-01-15` | `250000` | `36` | `GOOD` | `AVAILABLE` | `SUP-0003` | Loker HT Rak A-1 |
| `AST-HT-0003` | `KT-HT-001` | HT UHF 16-Ch Unit #03 | `SN-WLN-24003` | `2025-01-15` | `250000` | `36` | `GOOD` | `RENTED` | `SUP-0003` | Disewa BEM FT |
| `AST-HT-0004` | `KT-HT-001` | HT UHF 16-Ch Unit #04 | `SN-WLN-24004` | `2025-01-15` | `250000` | `36` | `GOOD` | `RENTED` | `SUP-0003` | Disewa BEM FT |
| `AST-HT-0005` | `KT-HT-001` | HT UHF 16-Ch Unit #05 | `SN-WLN-24005` | `2025-01-15` | `250000` | `36` | `MAINTENANCE_NEEDED` | `MAINTENANCE` | `SUP-0003` | Meja Servis (Klip Patah) |
| `AST-HT-0006` | `KT-HT-002` | HT Dual-Band Unit #01 | `SN-BFG-25011` | `2025-03-10` | `380000` | `36` | `GOOD` | `AVAILABLE` | `SUP-0003` | Loker HT Rak A-2 |
| `AST-HT-0007` | `KT-HT-002` | HT Dual-Band Unit #02 | `SN-BFG-25012` | `2025-03-10` | `380000` | `36` | `GOOD` | `AVAILABLE` | `SUP-0003` | Loker HT Rak A-2 |
| `AST-HT-0008` | `KT-HT-002` | HT Dual-Band Unit #03 | `SN-BFG-25013` | `2025-03-10` | `380000` | `36` | `GOOD` | `AVAILABLE` | `SUP-0003` | Loker HT Rak A-2 |
| `AST-AUD-0001` | `KT-AUD-001` | Speaker Aktif 12" Unit #01 (L) | `SN-HPR-12001` | `2025-02-01` | `2200000` | `60` | `GOOD` | `AVAILABLE` | `SUP-0001` | Zona Audio B-1 |
| `AST-AUD-0002` | `KT-AUD-001` | Speaker Aktif 12" Unit #02 (R) | `SN-HPR-12002` | `2025-02-01` | `2200000` | `60` | `GOOD` | `AVAILABLE` | `SUP-0001` | Zona Audio B-1 |
| `AST-AUD-0003` | `KT-AUD-001` | Speaker Aktif 12" Unit #03 (Mon) | `SN-HPR-12003` | `2025-06-12` | `2250000` | `60` | `GOOD` | `AVAILABLE` | `SUP-0001` | Zona Audio B-1 |
| `AST-AUD-0004` | `KT-AUD-002` | Mixer Audio 8-Ch Unit #01 | `SN-YMH-08001` | `2025-02-05` | `1850000` | `48` | `GOOD` | `AVAILABLE` | `SUP-0001` | Lemari Hardcase B-2 |
| `AST-AUD-0005` | `KT-AUD-002` | Mixer Audio 8-Ch Unit #02 | `SN-YMH-08002` | `2025-07-20` | `1850000` | `48` | `MAINTENANCE_NEEDED` | `MAINTENANCE` | `SUP-0001` | Servis Audio Prima (Fader Ch-3) |
| `AST-AUD-0006` | `KT-AUD-003` | Mic Wireless Dual Set #01 | `SN-SHR-99001` | `2025-02-10` | `1200000` | `48` | `GOOD` | `AVAILABLE` | `SUP-0001` | Lemari Hardcase B-3 |
| `AST-AUD-0007` | `KT-AUD-003` | Mic Wireless Dual Set #02 | `SN-SHR-99002` | `2025-02-10` | `1200000` | `48` | `GOOD` | `RENTED` | `SUP-0001` | Disewa BEM FT |
| `AST-VIS-0001` | `KT-VIS-001` | Proyektor 4000Lm Unit #01 | `SN-EPS-4001` | `2025-01-20` | `4500000` | `48` | `GOOD` | `AVAILABLE` | `SUP-0002` | Loker Optik C-1 |
| `AST-VIS-0002` | `KT-VIS-001` | Proyektor 4000Lm Unit #02 | `SN-EPS-4002` | `2025-04-18` | `4500000` | `48` | `GOOD` | `AVAILABLE` | `SUP-0002` | Loker Optik C-1 |
| `AST-VIS-0003` | `KT-VIS-002` | Layar Tripod 70" Unit #01 | `SN-WSC-7001` | `2025-01-20` | `750000` | `48` | `GOOD` | `AVAILABLE` | `SUP-0002` | Rak Panjang C-2 |
| `AST-VIS-0004` | `KT-VIS-002` | Layar Tripod 70" Unit #02 | `SN-WSC-7002` | `2025-04-18` | `750000` | `48` | `GOOD` | `AVAILABLE` | `SUP-0002` | Rak Panjang C-2 |
| `AST-LGT-0001` | `KT-LGT-001` | Lampu LED PAR 54 Unit #01 | `SN-SPK-5401` | `2025-05-01` | `350000` | `36` | `GOOD` | `AVAILABLE` | `SUP-0006` | Box Lighting D-1 |
| `AST-LGT-0002` | `KT-LGT-001` | Lampu LED PAR 54 Unit #02 | `SN-SPK-5402` | `2025-05-01` | `350000` | `36` | `GOOD` | `AVAILABLE` | `SUP-0006` | Box Lighting D-1 |
| `AST-LGT-0003` | `KT-LGT-001` | Lampu LED PAR 54 Unit #03 | `SN-SPK-5403` | `2025-05-01` | `350000` | `36` | `GOOD` | `AVAILABLE` | `SUP-0006` | Box Lighting D-1 |
| `AST-LGT-0004` | `KT-LGT-001` | Lampu LED PAR 54 Unit #04 | `SN-SPK-5404` | `2025-05-01` | `350000` | `36` | `DAMAGED` | `INACTIVE` | `SUP-0006` | Gudang Afkir (IC Power Terbakar) |
| `AST-AKS-0001` | `KT-AKS-001` | Kabel Roll 20m Unit #01 | `SN-UTC-2001` | `2025-01-12` | `180000` | `24` | `GOOD` | `AVAILABLE` | `SUP-0004` | Gantungan Kabel E-1 |
| `AST-AKS-0002` | `KT-AKS-001` | Kabel Roll 20m Unit #02 | `SN-UTC-2002` | `2025-01-12` | `180000` | `24` | `GOOD` | `AVAILABLE` | `SUP-0004` | Gantungan Kabel E-1 |
| `AST-AKS-0003` | `KT-AKS-002` | Kabel XLR 10m Unit #01 | `SN-CNR-1001` | `2025-02-01` | `120000` | `24` | `GOOD` | `AVAILABLE` | `SUP-0004` | Gantungan Kabel E-2 |
| `AST-AKS-0004` | `KT-AKS-003` | Tripod Speaker Stand Unit #01 | `SN-SMS-3001` | `2025-02-01` | `320000` | `48` | `GOOD` | `AVAILABLE` | `SUP-0001` | Rak Panjang C-3 |
| `AST-AKS-0005` | `KT-AKS-004` | Kabel HDMI Fiber 10m Unit #01 | `SN-VNT-4001` | `2025-04-18` | `210000` | `24` | `GOOD` | `AVAILABLE` | `SUP-0002` | Gantungan Kabel E-3 |

---

## 7. Nilai Awal Tabel `code_sequences` Setelah Seed

Pastikan skrip seed mengisi nilai akhir berikut pada tabel `code_sequences`:
* `KT-HT`: `2`
* `KT-AUD`: `3`
* `KT-VIS`: `2`
* `KT-LGT`: `1`
* `KT-AKS`: `4`
* `SUP`: `6`
* `CUS`: `10`
* `AST-HT`: `8`
* `AST-AUD`: `7`
* `AST-VIS`: `4`
* `AST-LGT`: `4`
* `AST-AKS`: `5`