# Rancangan Proyek Website Master Data Akuntansi --- Kanal Tiga

**Versi:** 1.0\
**Konteks:** Tugas mata kuliah Pengantar Akuntansi\
**Jenis usaha simulasi:** Penyewaan peralatan elektronik untuk acara\
**Status dokumen:** Spesifikasi awal untuk menjadi acuan desain,
pengembangan website, dan seed data dummy

------------------------------------------------------------------------

## 1. Ringkasan Proyek

Kanal Tiga dikembangkan sebagai perusahaan simulasi yang menyewakan
berbagai peralatan elektronik untuk kebutuhan acara, kampus, rapat,
seminar, konser kecil, dan kegiatan komunitas.

Website yang dibuat berfungsi sebagai **aplikasi pengelolaan master
data**, bukan aplikasi akuntansi lengkap. Fokus utamanya adalah
menyimpan, menambah, mengubah, melihat, mencari, dan menonaktifkan data
dasar perusahaan secara terstruktur.

Master data yang dikelola:

1.  **Data akun** --- daftar akun dalam bagan akun (*chart of
    accounts/COA*).
2.  **Data produk/barang** --- katalog peralatan yang disewakan.
3.  **Data pemasok** --- pihak yang memasok barang atau jasa kepada
    perusahaan.
4.  **Data pelanggan** --- pihak yang menyewa peralatan.
5.  **Data aset** --- barang milik perusahaan yang digunakan untuk
    operasional dan disewakan.

Data dummy harus saling masuk akal, konsisten, dan menggunakan pola kode
yang dapat dijelaskan. Kode bukan sekadar nomor acak: setiap segmen kode
mempunyai arti yang terdokumentasi.

> **Batasan penting:** master data tidak sama dengan transaksi. Data
> pesanan sewa, pembayaran, jurnal umum, penyusutan aktual, dan laporan
> laba rugi belum menjadi fitur utama versi ini. Master data hanya
> menyediakan fondasi agar transaksi tersebut dapat dibuat pada
> pengembangan berikutnya.

------------------------------------------------------------------------

## 2. Profil Perusahaan Simulasi

  -----------------------------------------------------------------------
  Elemen                              Rancangan
  ----------------------------------- -----------------------------------
  Nama perusahaan                     Kanal Tiga Rental Elektronik

  Bidang usaha                        Penyewaan peralatan elektronik dan
                                      pendukung acara

  Target pelanggan                    Panitia kampus, organisasi, EO,
                                      komunitas, perusahaan, dan
                                      penyelenggara acara

  Wilayah layanan                     Purwokerto dan sekitarnya

  Model bisnis                        Menyewakan barang berdasarkan jenis
                                      barang, jumlah unit, dan durasi
                                      sewa

  Contoh barang                       HT, speaker aktif, mixer audio,
                                      mikrofon, proyektor, layar
                                      proyektor, kabel, lampu panggung,
                                      dan perangkat pendukung

  Mata uang                           Rupiah (IDR)

  Status aplikasi                     Simulasi akademik dengan data dummy
  -----------------------------------------------------------------------

Nama "Kanal Tiga" dipertahankan sebagai merek. Penambahan kata "Rental
Elektronik" membantu memperjelas bahwa usaha simulasi telah berkembang
dari penyewaan HT menjadi penyewaan berbagai perangkat elektronik.

------------------------------------------------------------------------

## 3. Tujuan dan Ruang Lingkup

### 3.1 Tujuan

-   Mempraktikkan pengelompokan akun akuntansi.
-   Menerapkan sistem kode akun yang konsisten dan mudah dikembangkan.
-   Memisahkan katalog produk yang ditawarkan dari aset yang benar-benar
    dimiliki perusahaan.
-   Menyimpan data pemasok dan pelanggan dalam format terstruktur.
-   Menyediakan seed data dummy yang saling berhubungan dan realistis.
-   Membuat website CRUD (*Create, Read, Update, Delete/Deactivate*)
    untuk master data.
-   Menyediakan validasi agar kode tidak ganda dan data yang saling
    terkait tidak mudah menjadi tidak konsisten.

### 3.2 Fitur versi awal

-   Dashboard ringkas berisi jumlah akun, produk, pemasok, pelanggan,
    dan aset.
-   Daftar data dengan pencarian, filter, pengurutan, dan pagination.
-   Form tambah dan ubah data.
-   Detail data.
-   Validasi kode unik dan kolom wajib.
-   Status aktif/nonaktif untuk data yang sudah pernah dipakai.
-   Seed data dummy.
-   Relasi dasar antarentitas.
-   Tampilan responsif dan berbahasa Indonesia.

### 3.3 Di luar ruang lingkup versi awal

-   Pemesanan dan pengembalian barang.
-   Pencatatan pembayaran.
-   Jurnal umum dan buku besar.
-   Perhitungan laba rugi dan neraca otomatis.
-   Perhitungan penyusutan aset secara akuntansi.
-   Faktur, pajak, dan integrasi pembayaran.

Fitur tersebut dapat dikembangkan kemudian, tetapi tidak perlu
dipaksakan pada tugas master data.

------------------------------------------------------------------------

## 4. Prinsip Akuntansi yang Digunakan

Lima kelompok akun yang menjadi pertimbangan adalah:

  ------------------------------------------------------------------------
  Kelompok                     Kode awal Makna            Contoh akun
  ---------------- --------------------- ---------------- ----------------
  Aset                                 1 Sumber daya yang Kas, bank,
                                         dikuasai         persediaan suku
                                         perusahaan       cadang,
                                                          peralatan sewa

  Liabilitas                           2 Kewajiban        Utang usaha,
                                         perusahaan       utang beban
                                         kepada pihak     
                                         lain             

  Ekuitas                              3 Hak pemilik atas Modal pemilik,
                                         aset setelah     saldo laba
                                         dikurangi        
                                         liabilitas       

  Pendapatan                           4 Penghasilan dari Pendapatan sewa
                                         aktivitas usaha  peralatan

  Beban                                5 Pengorbanan      Beban
                                         ekonomi untuk    transportasi,
                                         menjalankan      listrik,
                                         usaha            perawatan
  ------------------------------------------------------------------------

Persamaan dasar akuntansi:

**Aset = Liabilitas + Ekuitas**

Pendapatan dan beban berpengaruh terhadap laba/rugi dan pada akhirnya
terhadap ekuitas. Untuk tugas ini, kelima kelompok tersebut dipakai
sebagai struktur utama kode akun.

### Catatan tentang persediaan dan aset sewaan

Barang yang ditawarkan untuk disewakan tidak otomatis berarti seluruhnya
merupakan aset milik perusahaan. Karena itu, sistem memisahkan:

-   **Produk/katalog:** jenis barang yang bisa ditawarkan untuk disewa.
-   **Aset:** unit atau barang yang dimiliki/dikuasai perusahaan, dengan
    identitas, harga perolehan, tanggal perolehan, dan kondisi.

Contoh: "HT UHF 16-channel" adalah produk; "HT-0001" adalah salah satu
unit aset fisik dengan nomor seri dan kondisi tertentu.

Perlakuan akuntansi atas barang sewaan, persediaan, dan penyusutan harus
mengikuti kebijakan akuntansi yang ditetapkan dosen/perusahaan simulasi.
Pada aplikasi ini, klasifikasi dibuat untuk kebutuhan pembelajaran dan
bukan sebagai nasihat akuntansi profesional.

------------------------------------------------------------------------

## 5. Sistem Kode Akun (COA)

### 5.1 Pola kode yang disarankan

Gunakan kode akun **4 digit** dengan struktur:

`K T D D`

-   Digit pertama = kelompok utama akun.
-   Digit kedua = subkelompok.
-   Dua digit terakhir = nomor akun dalam subkelompok.

Contoh: `1120`

-   `1` = Aset
-   `1` = Aset lancar
-   `20` = akun ke-20 pada subkelompok tersebut
-   Nama akun contoh: Piutang usaha

Pola ini dipilih karena sederhana untuk dijelaskan dalam tugas, mudah
dibaca, dan masih menyediakan ruang untuk penambahan akun. Kode harus
disimpan sebagai **teks/string**, bukan angka, agar format tetap
konsisten jika suatu saat memakai kode dengan angka nol di depan.

### 5.2 Struktur kelompok dan subkelompok

  -----------------------------------------------------------------------
  Rentang kode            Kelompok/subkelompok    Contoh
  ----------------------- ----------------------- -----------------------
  1000--1099              Aset lancar --- kas dan Kas, rekening bank
                          bank                    

  1100--1199              Aset lancar --- piutang Piutang usaha

  1200--1299              Aset lancar ---         Perlengkapan, suku
                          perlengkapan/suku       cadang
                          cadang                  

  1300--1399              Aset tetap ---          Peralatan sewa
                          peralatan               

  1400--1499              Akumulasi penyusutan    Akumulasi penyusutan
                          aset tetap              peralatan
                          (kontra-aset)           

  2000--2099              Liabilitas jangka       Utang pemasok
                          pendek --- utang usaha  

  2100--2199              Liabilitas jangka       Utang beban
                          pendek --- beban/utang  
                          lain                    

  2200--2299              Liabilitas lain, bila   Uang jaminan pelanggan
                          diperlukan              yang masih menjadi
                                                  kewajiban

  3000--3099              Ekuitas pemilik         Modal pemilik

  3100--3199              Saldo laba/prive        Saldo laba, prive
                                                  pemilik

  4000--4099              Pendapatan sewa         Pendapatan sewa HT,
                                                  audio, visual

  4100--4199              Pendapatan lain-lain    Denda keterlambatan,
                                                  bila kebijakan
                                                  perusahaan mengakuinya

  5000--5099              Beban operasional       Transportasi
                          langsung                pengantaran, perawatan

  5100--5199              Beban administrasi dan  Internet, alat tulis,
                          umum                    administrasi

  5200--5299              Beban pemasaran         Promosi

  5300--5399              Beban penyusutan        Beban penyusutan
                                                  peralatan
  -----------------------------------------------------------------------

Rentang tersebut merupakan rancangan internal untuk proyek. Rentang kode
bukan ketentuan universal yang wajib dipakai semua perusahaan.

### 5.3 Contoh seed data akun

  --------------------------------------------------------------------------------
  Kode           Nama akun       Kelompok       Subkelompok         Saldo normal
  -------------- --------------- -------------- ------------------- --------------
  1010           Kas             Aset           Kas dan bank        Debit

  1020           Bank            Aset           Kas dan bank        Debit

  1110           Piutang Usaha   Aset           Piutang             Debit

  1210           Perlengkapan    Aset           Perlengkapan        Debit
                 Operasional                                        

  1220           Suku Cadang dan Aset           Perlengkapan/suku   Debit
                 Komponen                       cadang              

  1310           Peralatan       Aset           Aset tetap          Debit
                 Elektronik                                         
                 untuk Disewakan                                    

  1410           Akumulasi       Aset kontra    Akumulasi           Kredit
                 Penyusutan                     penyusutan          
                 Peralatan                                          

  2010           Utang Usaha     Liabilitas     Utang pemasok       Kredit

  2110           Utang Beban     Liabilitas     Utang beban         Kredit
                 Operasional                                        

  2210           Uang Jaminan    Liabilitas     Kewajiban lain      Kredit
                 Sewa Diterima                                      

  3010           Modal Pemilik   Ekuitas        Modal               Kredit

  3110           Saldo Laba      Ekuitas        Saldo laba          Kredit

  3120           Prive Pemilik   Ekuitas kontra Prive               Debit

  4010           Pendapatan Sewa Pendapatan     Sewa peralatan      Kredit
                 HT                                                 

  4020           Pendapatan Sewa Pendapatan     Sewa peralatan      Kredit
                 Audio                                              

  4030           Pendapatan Sewa Pendapatan     Sewa peralatan      Kredit
                 Visual                                             

  4040           Pendapatan Sewa Pendapatan     Sewa peralatan      Kredit
                 Aksesori                                           

  4110           Pendapatan      Pendapatan     Pendapatan lain     Kredit
                 Denda           lain-lain                          
                 Keterlambatan                                      

  5010           Beban           Beban          Operasional         Debit
                 Transportasi                                       
                 dan Pengantaran                                    

  5020           Beban Perawatan Beban          Operasional         Debit
                 Peralatan                                          

  5030           Beban Perbaikan Beban          Operasional         Debit
                 Peralatan                                          

  5110           Beban Internet  Beban          Administrasi        Debit
                 dan Komunikasi                                     

  5120           Beban           Beban          Administrasi        Debit
                 Administrasi                                       
                 dan ATK                                            

  5210           Beban Promosi   Beban          Pemasaran           Debit

  5310           Beban           Beban          Penyusutan          Debit
                 Penyusutan                                         
                 Peralatan                                          
  --------------------------------------------------------------------------------

**Aturan penting kode akun:**

1.  Kode akun unik dan tidak boleh dipakai dua akun.
2.  Kelompok utama ditentukan oleh digit pertama.
3.  Kode akun tidak diubah hanya karena nama akun berubah; perubahan
    kode harus diperlakukan sebagai perubahan terkontrol.
4.  Akun yang telah digunakan sebaiknya dinonaktifkan, bukan dihapus
    permanen.
5.  Akun induk dapat dibuat untuk pengelompokan, tetapi tidak digunakan
    langsung untuk transaksi jika memiliki akun anak.
6.  Kode akun tidak ditentukan berdasarkan pemasok atau pelanggan. Akun
    adalah klasifikasi akuntansi, sedangkan pemasok dan pelanggan
    merupakan master data pihak terkait.
7.  Akun `1410` merupakan akun kontra-aset sehingga saldo normalnya
    kredit meskipun berada dalam kelompok aset.
8.  Prive adalah pengurang ekuitas dan lazimnya bersaldo normal debit.

------------------------------------------------------------------------

## 6. Rancangan Lima Master Data

## 6.1 Master Data Akun

**Tujuan:** menyimpan daftar akun yang akan menjadi dasar klasifikasi
transaksi akuntansi.

Kolom yang disarankan:

  Kolom                   Wajib?   Keterangan
  ----------------------- -------- ----------------------------------------------
  `account_code`          Ya       Kode akun, unik
  `account_name`          Ya       Nama akun
  `account_group`         Ya       Aset, Liabilitas, Ekuitas, Pendapatan, Beban
  `subgroup`              Ya       Contoh: Aset Lancar atau Beban Operasional
  `normal_balance`        Ya       Debit atau Kredit
  `parent_account_code`   Tidak    Kode akun induk, jika ada
  `description`           Tidak    Penjelasan fungsi akun
  `is_active`             Ya       Aktif/nonaktif

Validasi: - `account_code` tidak boleh duplikat. - `account_group` harus
berasal dari lima kelompok utama. - `normal_balance` hanya Debit atau
Kredit. - Jika ada akun induk, akun induk harus tersedia dan tidak boleh
merujuk dirinya sendiri. - Akun yang sudah digunakan tidak boleh dihapus
permanen.

## 6.2 Master Data Produk/Barang

**Tujuan:** menyimpan katalog jenis barang yang ditawarkan untuk
disewakan.

Kolom yang disarankan:

  Kolom             Wajib?   Keterangan
  ----------------- -------- -----------------------------------------
  `product_code`    Ya       Kode produk unik
  `product_name`    Ya       Nama produk
  `category_code`   Ya       Kategori produk
  `brand`           Tidak    Merek
  `specification`   Tidak    Spesifikasi penting
  `rental_rate`     Ya       Tarif sewa per unit per hari
  `rental_unit`     Ya       Contoh: unit, set, paket
  `account_code`    Tidak    Akun pendapatan default jika dibutuhkan
  `description`     Tidak    Catatan produk
  `is_active`       Ya       Apakah produk masih ditawarkan

Pola kode produk yang disarankan: `KT-KAT-NNN`.

-   `KT` = Kanal Tiga.
-   `KAT` = singkatan kategori, misalnya `HT`, `AUD`, `VIS`, `LGT`,
    `AKS`.
-   `NNN` = nomor urut produk.

Contoh: - `KT-HT-001` --- HT UHF 16-channel. - `KT-AUD-001` --- Speaker
aktif 12 inci. - `KT-VIS-001` --- Proyektor 4.000 lumens. - `KT-LGT-001`
--- Lampu LED PAR.

Kode produk mengidentifikasi **jenis/model barang**, bukan unit
fisiknya. Unit fisik dicatat di master aset.

## 6.3 Master Data Pemasok/Supplier

**Tujuan:** menyimpan pihak yang memasok barang, suku cadang, atau jasa
kepada perusahaan.

Kolom yang disarankan:

  Kolom              Wajib?   Keterangan
  ------------------ -------- ----------------------------------------------
  `supplier_code`    Ya       Kode supplier unik
  `supplier_name`    Ya       Nama pemasok/perusahaan
  `supplier_type`    Ya       Peralatan, suku cadang, servis, atau lainnya
  `contact_person`   Tidak    Nama kontak
  `phone`            Tidak    Nomor telepon dummy
  `email`            Tidak    Email dummy
  `address`          Tidak    Alamat dummy
  `city`             Tidak    Kota
  `notes`            Tidak    Catatan
  `is_active`        Ya       Aktif/nonaktif

Pola kode supplier: `SUP-NNNN`, misalnya `SUP-0001`.

Kode supplier bersifat identitas berurutan dan tidak perlu mengandung
kode akun. Supplier dapat memasok lebih dari satu jenis barang; hubungan
detail barang-supplier dapat ditambahkan sebagai tabel penghubung jika
diperlukan.

## 6.4 Master Data Pelanggan/Konsumen

**Tujuan:** menyimpan pihak yang berpotensi menyewa peralatan.

Kolom yang disarankan:

  Kolom              Wajib?   Keterangan
  ------------------ -------- -----------------------------------------
  `customer_code`    Ya       Kode pelanggan unik
  `customer_name`    Ya       Nama orang, organisasi, atau perusahaan
  `customer_type`    Ya       Individu, organisasi, perusahaan, EO
  `contact_person`   Tidak    Nama PIC jika pelanggan organisasi
  `phone`            Tidak    Nomor telepon dummy
  `email`            Tidak    Email dummy
  `address`          Tidak    Alamat dummy
  `city`             Tidak    Kota
  `notes`            Tidak    Preferensi/catatan layanan
  `is_active`        Ya       Aktif/nonaktif

Pola kode pelanggan: `CUS-NNNN`, misalnya `CUS-0001`.

Kode pelanggan tidak menunjukkan jumlah transaksi, jenis barang yang
disewa, atau akun akuntansi. Kode hanya menjadi identitas tetap
pelanggan.

## 6.5 Master Data Aset

**Tujuan:** mencatat setiap unit fisik yang dimiliki atau dikuasai
perusahaan dan digunakan untuk operasional/penyewaan.

Kolom yang disarankan:

  Kolom                Wajib?   Keterangan
  -------------------- -------- ------------------------------------------
  `asset_code`         Ya       Kode aset unik
  `asset_name`         Ya       Nama unit aset
  `product_code`       Ya       Jenis produk yang terkait
  `serial_number`      Tidak    Nomor seri pabrik jika tersedia
  `acquisition_date`   Ya       Tanggal perolehan
  `acquisition_cost`   Ya       Harga perolehan
  `asset_condition`    Ya       Baik, perlu perawatan, rusak
  `asset_status`       Ya       Tersedia, disewa, perawatan, tidak aktif
  `supplier_code`      Tidak    Pemasok asal jika diketahui
  `account_code`       Ya       Akun aset terkait, misalnya `1310`
  `location`           Tidak    Lokasi penyimpanan
  `notes`              Tidak    Catatan kondisi atau riwayat
  `is_active`          Ya       Aktif/nonaktif

Pola kode aset yang disarankan: `AST-KAT-NNNN`.

Contoh: - `AST-HT-0001` - `AST-AUD-0001` - `AST-VIS-0001`

Kode aset mengidentifikasi **satu unit fisik**. Dua unit HT dengan model
sama memiliki `product_code` yang sama tetapi `asset_code` yang berbeda.

### Perbedaan produk dan aset

  -----------------------------------------------------------------------
  Produk                              Aset
  ----------------------------------- -----------------------------------
  Menjelaskan jenis/model yang        Menjelaskan unit fisik tertentu
  ditawarkan                          

  Contoh: Speaker aktif 12 inci       Contoh: Speaker aktif 12 inci nomor
                                      aset `AST-AUD-0001`

  Memiliki tarif sewa standar         Memiliki harga perolehan dan
                                      kondisi

  Satu produk dapat terkait banyak    Setiap aset terkait satu produk
  aset                                
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 7. Pola Kode untuk Semua Master Data

  -----------------------------------------------------------------------
  Master data       Format            Contoh            Logika
  ----------------- ----------------- ----------------- -----------------
  Akun              `KT` tidak wajib; `4010`            Kelompok utama +
                    4 digit numerik                     subkelompok +
                                                        urutan

  Produk            `KT-KAT-NNN`      `KT-HT-001`       Merek
                                                        perusahaan +
                                                        kategori + urutan

  Supplier          `SUP-NNNN`        `SUP-0001`        Prefix supplier +
                                                        urutan

  Pelanggan         `CUS-NNNN`        `CUS-0001`        Prefix customer +
                                                        urutan

  Aset              `AST-KAT-NNNN`    `AST-HT-0001`     Prefix aset +
                                                        kategori + nomor
                                                        unit
  -----------------------------------------------------------------------

`KT` pada kode produk berarti Kanal Tiga, bukan kode akun. Jangan
mencampur kode master operasional dengan klasifikasi akun akuntansi.

### Aturan pembuatan kode

1.  Kode dibuat otomatis oleh sistem jika memungkinkan.
2.  Sistem memeriksa keunikan kode di database, bukan hanya di tampilan.
3.  Nomor urut dibuat dari data yang sudah tersimpan dengan mekanisme
    aman agar dua pengguna tidak menghasilkan kode sama.
4.  Kode yang sudah pernah dipakai tidak digunakan kembali setelah data
    dinonaktifkan.
5.  Pengguna tidak perlu mengetik kode secara manual, kecuali tugas
    memang mengharuskan input manual.
6.  Jika pengguna memilih kategori produk, sistem dapat menentukan
    prefix kategori untuk kode produk/aset.
7.  Perubahan nama atau tarif tidak mengubah kode identitas.

------------------------------------------------------------------------

## 8. Seed Data Dummy yang Direncanakan

Seed data adalah data awal yang dimasukkan ke database agar aplikasi
tidak kosong saat demo. Data harus fiktif, konsisten, dan cukup
bervariasi untuk menguji fungsi aplikasi.

### 8.1 Jumlah seed yang disarankan

  Entitas       Jumlah awal Catatan
  ----------- ------------- ---------------------------------------------------
  Akun                   25 Mencakup kelima kelompok akun
  Produk                 12 Mencakup HT, audio, visual, pencahayaan, aksesori
  Supplier                6 Pemasok alat, komponen, dan jasa servis
  Pelanggan              10 Individu, organisasi, EO, dan perusahaan
  Aset               25--35 Beberapa unit dapat berasal dari satu produk

Jumlah tersebut cukup untuk menunjukkan pola kode dan relasi tanpa
membuat proses input terlalu berat.

### 8.2 Contoh kategori dan produk

  Kode produk    Nama produk                Kategori        Tarif sewa dummy/unit/hari
  -------------- -------------------------- ------------- ----------------------------
  `KT-HT-001`    HT UHF 16-channel          HT                                 Rp8.000
  `KT-HT-002`    HT UHF jarak menengah      HT                                Rp12.000
  `KT-AUD-001`   Speaker aktif 12 inci      Audio                            Rp150.000
  `KT-AUD-002`   Mixer audio 8-channel      Audio                            Rp100.000
  `KT-AUD-003`   Mikrofon nirkabel          Audio                             Rp75.000
  `KT-VIS-001`   Proyektor 4.000 lumens     Visual                           Rp200.000
  `KT-VIS-002`   Layar proyektor portable   Visual                            Rp50.000
  `KT-LGT-001`   Lampu LED PAR              Pencahayaan                       Rp35.000
  `KT-AKS-001`   Kabel roll 20 meter        Aksesori                          Rp15.000
  `KT-AKS-002`   Kabel XLR                  Aksesori                          Rp10.000
  `KT-AKS-003`   Tripod speaker             Aksesori                          Rp25.000
  `KT-AKS-004`   Kabel HDMI 10 meter        Aksesori                          Rp15.000

Tarif di atas adalah angka simulasi untuk kebutuhan demo, bukan daftar
harga pasar yang sudah diverifikasi.

### 8.3 Contoh supplier dummy

  Kode         Nama supplier dummy           Jenis
  ------------ ----------------------------- ----------------------
  `SUP-0001`   Sumber Audio Nusantara        Peralatan audio
  `SUP-0002`   Mitra Visual Purwokerto       Proyektor dan layar
  `SUP-0003`   Radio Komunikasi Mandiri      HT dan aksesori
  `SUP-0004`   Elektronik Teknik Sejahtera   Komponen elektronik
  `SUP-0005`   Servis Audio Prima            Servis dan perawatan
  `SUP-0006`   Cahaya Panggung Jaya          Pencahayaan

Nama di atas merupakan nama fiktif untuk seed data.

### 8.4 Contoh pelanggan dummy

  Kode         Nama pelanggan dummy             Jenis
  ------------ -------------------------------- ------------
  `CUS-0001`   BEM Fakultas Teknik              Organisasi
  `CUS-0002`   Himpunan Mahasiswa Informatika   Organisasi
  `CUS-0003`   Event Kampus Bersama             EO
  `CUS-0004`   Komunitas Kreatif Banyumas       Organisasi
  `CUS-0005`   PT Acara Gemilang                Perusahaan
  `CUS-0006`   Panitia Seminar Teknologi        Organisasi
  `CUS-0007`   Raka Pratama                     Individu
  `CUS-0008`   Studio Kreasi Lokal              Perusahaan
  `CUS-0009`   Panitia Dies Natalis             Organisasi
  `CUS-0010`   Komunitas Musik Sore             Organisasi

Nama pelanggan ini fiktif. Nomor telepon, email, dan alamat pada data
demo juga harus menggunakan nilai dummy yang jelas, bukan data kontak
orang nyata tanpa izin.

### 8.5 Contoh relasi aset dummy

  ----------------------------------------------------------------------------------
  Kode aset        Kode produk    Nama unit            Harga Kondisi     Status
                                                   perolehan             
                                                       dummy             
  ---------------- -------------- ----------- -------------- ----------- -----------
  `AST-HT-0001`    `KT-HT-001`    HT UHF unit      Rp250.000 Baik        Tersedia
                                  1                                      

  `AST-HT-0002`    `KT-HT-001`    HT UHF unit      Rp250.000 Baik        Tersedia
                                  2                                      

  `AST-HT-0003`    `KT-HT-001`    HT UHF unit      Rp250.000 Perlu       Perawatan
                                  3                          perawatan   

  `AST-AUD-0001`   `KT-AUD-001`   Speaker        Rp2.000.000 Baik        Tersedia
                                  aktif unit                             
                                  1                                      

  `AST-AUD-0002`   `KT-AUD-001`   Speaker        Rp2.000.000 Baik        Tersedia
                                  aktif unit                             
                                  2                                      

  `AST-VIS-0001`   `KT-VIS-001`   Proyektor      Rp4.500.000 Baik        Tersedia
                                  unit 1                                 

  `AST-VIS-0002`   `KT-VIS-002`   Layar            Rp750.000 Baik        Tersedia
                                  portable                               
                                  unit 1                                 

  `AST-LGT-0001`   `KT-LGT-001`   Lampu LED        Rp350.000 Baik        Tersedia
                                  PAR unit 1                             
  ----------------------------------------------------------------------------------

Nilai perolehan hanya contoh untuk simulasi. Jangan menyimpulkan nilai
pasar atau masa manfaat dari contoh tersebut.

### 8.6 Pemeriksaan konsistensi seed data

Seed data akhir perlu memenuhi aturan berikut:

-   Semua `account_code` aset merujuk ke akun yang benar-benar ada,
    seperti `1310`.
-   Semua `product_code` pada aset merujuk ke produk yang tersedia.
-   Semua `supplier_code` pada aset merujuk ke supplier yang ada atau
    bernilai kosong jika tidak diketahui.
-   Akun pendapatan default produk, bila digunakan, harus sesuai
    kategori pendapatan. Contoh HT → `4010`, audio → `4020`, visual →
    `4030`, aksesori → `4040`.
-   Harga sewa harus lebih besar dari atau sama dengan nol; harga
    perolehan aset juga tidak boleh negatif.
-   Tanggal perolehan tidak boleh berada di masa depan jika aturan
    aplikasi melarangnya.
-   Nomor seri, jika diisi, tidak boleh duplikat apabila diasumsikan
    unik.
-   Jumlah aset untuk satu produk dapat lebih dari satu.
-   Status aset `Perawatan` tidak sama dengan status produk `Nonaktif`.
-   Data demo tidak boleh memuat informasi pribadi nyata yang tidak
    diperlukan.

------------------------------------------------------------------------

## 9. Hubungan Antarentitas

Hubungan data yang disarankan:

-   **Produk 1 --- banyak Aset:** satu model produk dapat memiliki
    beberapa unit fisik.
-   **Supplier 1 --- banyak Aset (opsional):** satu supplier dapat
    menjadi pemasok beberapa aset; supplier pada aset boleh kosong jika
    asal barang tidak diketahui.
-   **Akun --- Produk (opsional):** satu akun pendapatan default dapat
    digunakan oleh banyak produk.
-   **Akun --- Aset:** satu akun aset dapat digunakan oleh banyak unit
    aset.
-   **Supplier dan Produk:** jika perlu mencatat bahwa supplier tertentu
    memasok banyak jenis produk dan suatu produk dapat berasal dari
    banyak supplier, buat tabel penghubung `supplier_products`.

Pelanggan belum perlu memiliki relasi langsung ke aset karena penyewaan
merupakan transaksi, bukan master data. Jika aplikasi nanti mempunyai
modul transaksi sewa, relasinya menjadi pelanggan → transaksi sewa →
detail transaksi → produk/aset.

### Sketsa ERD konseptual

``` text
ACCOUNTS
- account_code (PK)
- account_name
- account_group
- normal_balance
        |
        | optional default revenue account
        v
PRODUCTS -------------------- ASSETS
- product_code (PK)  1 --- * - asset_code (PK)
- product_name              - product_code (FK)
- category_code             - supplier_code (FK, nullable)
- rental_rate               - account_code (FK)
                                  ^
                                  |
SUPPLIERS ------------------------+
- supplier_code (PK)

CUSTOMERS
- customer_code (PK)
- customer_name
```

`PK` berarti primary key (identitas unik utama), sedangkan `FK` berarti
foreign key (rujukan ke data lain).

------------------------------------------------------------------------

## 10. Rancangan Halaman Website

### 10.1 Navigasi utama

1.  Dashboard
2.  Master Akun
3.  Master Produk/Barang
4.  Master Supplier
5.  Master Pelanggan
6.  Master Aset

### 10.2 Dashboard

Tampilkan kartu ringkasan: - Total akun aktif. - Total produk aktif. -
Total supplier aktif. - Total pelanggan aktif. - Total aset aktif. -
Jumlah aset tersedia, perawatan, dan tidak aktif.

Angka dashboard dihitung dari database, bukan ditulis tetap di kode.

### 10.3 Halaman daftar master

Setiap halaman daftar memiliki: - Judul dan deskripsi singkat. - Tombol
"Tambah Data". - Kolom pencarian. - Filter yang sesuai. - Tabel dengan
kode, nama, informasi utama, status, dan aksi. - Aksi lihat detail,
ubah, dan nonaktifkan. - Konfirmasi sebelum menonaktifkan data.

### 10.4 Form tambah/ubah

-   Label berbahasa Indonesia.
-   Kolom wajib ditandai dengan jelas.
-   Validasi dilakukan di frontend dan backend.
-   Dropdown untuk relasi seperti kategori, akun, produk, dan supplier.
-   Pesan kesalahan menjelaskan apa yang perlu diperbaiki.
-   Kode otomatis ditampilkan setelah dibuat.
-   Jangan menyimpan form jika kode duplikat atau foreign key tidak
    valid.

### 10.5 Desain UI

Arah desain: - Minimalis, rapi, dan profesional. - Sidebar navigasi di
desktop. - Navigasi ringkas di layar kecil. - Tabel mudah dibaca, jarak
antarbaris cukup. - Warna utama hijau gelap sebagai identitas Kanal
Tiga, dipadukan dengan latar netral. - Gunakan istilah Indonesia;
istilah Inggris dapat ditampilkan dalam tanda kurung bila membantu
pembelajaran.

------------------------------------------------------------------------

## 11. Aturan Validasi dan Logika Sistem

1.  **Kode unik:** setiap tabel mempunyai batasan unik pada kolom kode.
2.  **Relasi valid:** produk, supplier, dan akun yang dirujuk harus
    tersedia.
3.  **Data historis:** gunakan status nonaktif, bukan penghapusan
    permanen, jika data pernah dirujuk oleh data lain.
4.  **Harga:** nilai uang harus berupa angka desimal/tipe numerik yang
    sesuai, bukan teks yang mengandung `Rp`.
5.  **Tanggal:** simpan dalam format tanggal standar di database, lalu
    tampilkan sesuai format Indonesia.
6.  **Kategori:** gunakan tabel referensi atau enum yang konsisten,
    bukan variasi penulisan bebas.
7.  **Saldo normal:** ditentukan dari jenis akun, tetapi akun kontra
    seperti akumulasi penyusutan dan prive perlu pengecualian eksplisit.
8.  **Pembuatan kode:** lakukan di backend/database agar aman dari kode
    ganda ketika beberapa pengguna menyimpan data bersamaan.
9.  **Audit sederhana:** jika waktu memungkinkan, simpan `created_at`,
    `updated_at`, dan `is_active`.
10. **Seed idempoten:** menjalankan seed berulang tidak boleh
    menghasilkan duplikasi. Gunakan upsert atau strategi reset khusus
    lingkungan pengembangan.

------------------------------------------------------------------------

## 12. Rekomendasi Struktur Database

Untuk versi awal, tabel utama dapat berupa:

-   `accounts`
-   `product_categories`
-   `products`
-   `suppliers`
-   `customers`
-   `assets`

Tabel opsional: - `supplier_products` --- hubungan supplier dengan
produk. - `users` --- jika aplikasi memerlukan login. - `audit_logs` ---
jika ingin mencatat aktivitas perubahan.

Kolom umum yang bisa diterapkan: - `id` --- primary key internal. -
`created_at` - `updated_at` - `is_active`

Kode bisnis tetap dipertahankan sebagai kolom unik tersendiri, misalnya
`account_code`, `product_code`, atau `asset_code`. Untuk implementasi
SQL, foreign key sebaiknya merujuk pada primary key internal atau kolom
kode unik dengan aturan konsistensi yang jelas.

### Teknologi

Teknologi boleh mengikuti kemampuan tim dan arahan dosen. Bila ingin
meneruskan ekosistem website Kanal Tiga yang sudah ada, opsi yang masuk
akal adalah: - Frontend: Next.js dan React. - Database dan backend:
Supabase/PostgreSQL. - Validasi form: library validasi yang sesuai
proyek. - Seed data: file SQL atau skrip TypeScript yang dapat
dijalankan ulang dengan aman.

Pilihan teknologi bukan bagian wajib dari konsep akuntansi; yang paling
penting adalah struktur data, logika kode, dan validasinya.

------------------------------------------------------------------------

## 13. Skenario Demo Presentasi

Skenario demo yang disarankan:

1.  Buka dashboard dan tunjukkan ringkasan jumlah master data.
2.  Buka master akun, jelaskan mengapa kode `1010` termasuk aset dan
    `4010` termasuk pendapatan.
3.  Tambahkan produk baru, misalnya "Mikrofon Kabel", dan tunjukkan kode
    produk otomatis.
4.  Tambahkan supplier fiktif dan jelaskan pola `SUP-NNNN`.
5.  Tambahkan pelanggan fiktif dan jelaskan pola `CUS-NNNN`.
6.  Tambahkan aset fisik yang terhubung ke produk tertentu.
7.  Tunjukkan bahwa dua unit dari produk sama memiliki kode aset
    berbeda.
8.  Coba memasukkan kode duplikat atau mengisi relasi yang tidak
    tersedia, lalu tunjukkan validasi.
9.  Nonaktifkan data demo dan jelaskan alasan data tidak langsung
    dihapus permanen.

### Narasi singkat untuk menjelaskan kode akun

"Kode akun Kanal Tiga menggunakan empat digit. Digit pertama menunjukkan
kelompok utama: 1 untuk aset, 2 untuk liabilitas, 3 untuk ekuitas, 4
untuk pendapatan, dan 5 untuk beban. Digit kedua menunjukkan
subkelompok, sedangkan dua digit terakhir merupakan nomor urut akun
dalam subkelompok tersebut. Dengan pola ini, akun baru bisa ditambahkan
secara konsisten tanpa mengubah arti akun yang sudah ada."

------------------------------------------------------------------------

## 14. Urutan Pengerjaan yang Paling Efisien

1.  **Tetapkan aturan kode akun dan kode master** terlebih dahulu.
2.  Buat skema database dan relasi.
3.  Buat seed data akun dan kategori produk.
4.  Buat seed produk, supplier, pelanggan, lalu aset agar foreign key
    sudah tersedia.
5.  Implementasikan CRUD master akun.
6.  Implementasikan CRUD produk.
7.  Implementasikan CRUD supplier dan pelanggan.
8.  Implementasikan CRUD aset.
9.  Tambahkan pencarian, filter, validasi, status aktif/nonaktif.
10. Buat dashboard dan uji seluruh relasi.
11. Siapkan narasi presentasi serta contoh penjelasan kode.

Urutan seed yang aman: `accounts` dan `product_categories` → `suppliers`
dan `customers` → `products` → `assets`.

------------------------------------------------------------------------

## 15. Kriteria Keberhasilan

Proyek dianggap memenuhi tujuan tugas apabila:

-   Kelima master data tersedia dan dapat dikelola melalui website.
-   Setiap kode mengikuti pola yang terdokumentasi.
-   Kode tidak ganda dan tidak berubah saat nama data diedit.
-   Lima kelompok akun tercakup.
-   Seed data mencakup contoh dari setiap kelompok akun dan kategori
    barang utama.
-   Data aset terhubung ke produk dan akun yang valid.
-   Data supplier dan pelanggan menggunakan identitas dummy.
-   Tabel daftar memiliki pencarian dan status.
-   Relasi dan validasi dapat didemonstrasikan.
-   Mahasiswa mampu menjelaskan alasan pemilihan kode akun, bukan
    sekadar menunjukkan hasilnya.

------------------------------------------------------------------------

## 16. Keputusan yang Perlu Dikonfirmasi dengan Dosen

Sebelum implementasi final, pastikan:

1.  Apakah dosen menetapkan format kode akun tertentu, misalnya 1 digit,
    3 digit, 4 digit, atau format bertingkat? Jika ada, format dosen
    harus diutamakan.
2.  Apakah yang diminta hanya master data atau juga transaksi dan
    jurnal?
3.  Apakah aset harus mencakup nilai buku, umur manfaat, metode
    penyusutan, dan akumulasi penyusutan, atau cukup identitas serta
    harga perolehan?
4.  Apakah "daftar produk/barang" dimaksudkan sebagai katalog barang
    yang disewakan atau inventaris unit fisik? Rancangan ini memisahkan
    katalog produk dari aset agar keduanya tidak tercampur.
5.  Apakah aplikasi wajib menggunakan teknologi tertentu?

Jika belum ada aturan khusus dari dosen, rancangan ini dapat dijadikan
baseline awal. Hindari mengklaim pola kode ini sebagai standar
universal; jelaskan bahwa pola tersebut merupakan kebijakan pengkodean
yang dirancang untuk perusahaan simulasi Kanal Tiga.
