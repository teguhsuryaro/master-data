# 04 — Sistem Desain UI/UX, Tata Letak Bersih & Pengamanan Anti-Salah-Pencet (Revisi v3.0)
**Proyek:** Sistem Informasi Master Data Akuntansi — Kanal Tiga Rental Event & Elektronik  
**Warna Utama Brand:** `#F79721` (Kanal Tiga Amber Orange)

---

## 1. Penyempurnaan Tata Letak (Mengadopsi Kejelasan Contoh Dosen + Identitas `#F79721`)

Agar tampilan website **sangat mudah dilihat dari proyektor kelas** seperti foto contoh dosen, namun tetap modern, rapi, dan tidak terlihat seperti template murahan (*anti-slop*):

### 1.1 Struktur Navigasi Horisontal Berbasis Tab + Ringkasan Atas
1. **Top Header Bar:**
   * Kiri: Logo & Nama Usaha **"Kanal Tiga — Sistem Master Data Akuntansi"** dengan badge subjudul *"Usaha Penyewaan Peralatan Event & Elektronik"*.
   * Kanan: Nama lengkap pengguna yang sedang login (misal: **Teguh Surya Romadon**), jabatan, serta tombol **Keluar (Logout)** yang dilindungi dialog konfirmasi.
2. **Navigation Tabs Bar (Persis Seperti Foto Dosen, Namun Lebih Tajam):**
   * Menampilkan 5 Tab Utama yang sejajar rapi dengan ikon yang jelas:
     1. `📖 Akun Akuntansi` (beserta badge jumlah data, misal `18`)
     2. `📦 Produk / Barang` (`14`)
     3. `🚚 Pemasok` (`6`)
     4. `👥 Pelanggan` (`8`)
     5. `📏 Satuan` (`5`)
   * Tab yang sedang aktif memiliki garis bawah tebal `3px solid #F79721`, latar belakang `#FFF7ED` (amber sangat lembut), dan teks tebal `#C26B0A` / `#18181B`.
   * Tersedia juga tombol **`📊 Ringkasan Semua Tabel (Mode Presentasi)`** yang menampilkan pratinjau gabungan seperti pada foto dosen (Daftar Akun di atas, Daftar Produk & Pemasok berdampingan di bawah).

---

## 2. Pengamanan UI/UX: Pencegahan Salah Pencet (*Anti-Misclick & Confirmation Guards*)

Bagian ini **WAJIB** diimplementasikan secara menyeluruh agar pengguna tidak pernah kehilangan data atau keluar dari aplikasi secara tidak sengaja:

### 2.1 Modal Konfirmasi Sebelum Logout (`LogoutConfirmModal`)
* Ketika pengguna mengklik tombol **"Keluar / Logout"** di pojok kanan atas, **JANGAN** langsung menghapus sesi.
* Tampilkan modal konfirmasi di tengah layar:
  * **Judul:** *"Konfirmasi Keluar dari Sistem"*
  * **Pesan:** *"Apakah Anda yakin ingin keluar dari akun **[Nama Lengkap User]**? Pastikan tidak ada perubahan data yang belum disimpan."*
  * **Tombol Batal:** *"Tetap di Sini"* (Fokus default, warna netral).
  * **Tombol Konfirmasi:** *"Ya, Keluar Sekarang"* (Warna merah/amber tegas).

### 2.2 Modal Konfirmasi Sebelum Menonaktifkan / Mengaktifkan Data (`StatusConfirmModal`)
* Pada kolom **Aksi** di tabel, pisahkan jarak antara tombol **Edit (Ikon Pensil)** dan tombol **Ubah Status / Hapus (Ikon Power/Trash)** minimal `8px` (`gap-2`) agar tidak salah terpencet.
* Ketika tombol Nonaktifkan/Hapus diklik, wajib muncul modal konfirmasi yang menyebutkan **Kode dan Nama Data** secara eksplisit:
  * **Contoh Pesan:** *"Apakah Anda yakin ingin menonaktifkan barang **BRG001 — HT Single Band UHF**? Dalam prinsip akuntansi, master data yang sudah terdaftar dinonaktifkan agar histori pencatatan tetap terjaga."*
  * Memiliki tombol **"Batal"** dan **"Ya, Nonaktifkan Data"**.

### 2.3 Proteksi Form yang Belum Disimpan (*Unsaved Changes Guard*)
* Ketika pengguna sedang membuka form **Tambah Data** atau **Edit Data** dan sudah mengetik sesuatu (*form is dirty*):
  * Klik di luar area modal (*backdrop click*) **TIDAK BOLEH** langsung menutup modal secara tiba-tiba.
  * Jika pengguna menekan tombol `X` atau `Batal` saat form sudah terisi, tampilkan peringatan kecil: *"Perubahan belum disimpan. Yakin ingin menutup formulir?"*

### 2.4 Tombol Submit Anti-Klik-Ganda (*Loading State Lock*)
* Saat tombol **"Simpan Data"** ditekan, tombol langsung berubah menjadi *disabled* dengan spinner dan teks *"Menyimpan..."* sehingga jika pengguna mengklik 2 kali dengan cepat, data tidak akan tersimpan ganda.

---

## 3. Palet Warna & Tipografi yang Nyaman di Mata

| Elemen | Kode Hex / Kelas | Keterangan |
| :--- | :--- | :--- |
| **Warna Utama Brand** | `#F79721` | Digunakan pada tombol `+ Tambah Data`, tab aktif, border fokus input, dan aksen header. |
| **Warna Hover Brand** | `#DF7E0B` | Warna saat kursor diarahkan ke tombol utama. |
| **Latar Belakang Halaman** | `#F4F6F8` | Abu-abu sejuk terang sehingga kartu tabel berwarna putih (`#FFFFFF`) tampak sangat kontras dan bersih di proyektor. |
| **Badge Status "Aktif"** | Teks `#15803D` / Bg `#DCFCE7` | Badge hijau lembut seperti pada layar contoh dosen (`Aktif`). |
| **Badge Status "Nonaktif"** | Teks `#B91C1C` / Bg `#FEE2E2` | Badge merah lembut untuk data yang dinonaktifkan. |
| **Font Kode & Nominal Rupiah** | `JetBrains Mono` (`font-mono`) | Digunakan pada kolom `Kode Akun` (`1-01-01`), `Kode Barang` (`BRG001`), dan angka Rupiah (`45.000`) agar sejajar rapi. |

---

## 4. Fitur Pembantu Presentasi: "Kartu Penjelasan Logika Kode"

Di setiap tab (Akun, Produk, Pemasok, Pelanggan, Satuan), sediakan tombol kecil **`💡 Cara Baca Kode & Tabel`** di sebelah kanan bar pencarian. Jika diklik, akan membuka kotak informasi ringkas yang menjelaskan:
* Arti format kode pada tabel tersebut (misal: arti `1-01-01` atau `BRG001`).
* Mengapa kolom tersebut dirancang demikian untuk usaha **Kanal Tiga Rental Event**.
* Fitur ini sangat membantu anggota kelompok saat menjawab pertanyaan dosen secara langsung.