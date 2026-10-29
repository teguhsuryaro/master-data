# Workspace Guidelines & Anti-Slop System Rules

Proyek: **SIAKUN — Master Data Akuntansi Kanal Tiga**  
Referensi Materi Utama: `09_Pengantar_Akuntansi.pdf`

## Standar Desain UI/UX & Pencegahan "Slop"
1. **Kejelasan & Kemudahan Presentasi:**
   - Seluruh tampilan harus langsung dapat dipahami oleh dosen penguji atau mahasiswa baru.
   - Hindari grafik atau kartu angka yang tidak memiliki penjelasan kontekstual.
   - Tata letak konsisten: Header informasi -> Banner Edukasi Akuntansi -> Filter Cepat -> Tabel Data Bersih -> Slide-over Drawer / Modal.

2. **Kaidah Akuntansi Baku Sesuai Materi 09_Pengantar_Akuntansi.pdf:**
   - **Saldo Awal di Master Data Selalu Rp 0**: Master Data berfungsi mendefinisikan entitas akun dan barang. Saldo awal dimasukkan terpisah di menu Jurnal Penyesuaian / Input Saldo Awal pada awal periode akuntansi.
   - **Logika Kode Akun 4-Digit & X-YY-ZZ**: Terdiri atas Level 1 (Kelompok), Level 2 (Sub-Kelompok), Level 3 (Jenis Akun), Level 4 (Nomor Urut).
   - **Aturan Saldo Normal & Penempatan Debit/Kredit**: Konsisten dengan persamaan dasar akuntansi $\text{Aset} = \text{Liabilitas} + \text{Ekuitas}$.

3. **Efisiensi Kode & Komponen:**
   - Gunakan satu pola komponen yang teruji untuk form drawer dan konfirmasi.
   - Hindari duplikasi kode server actions dan styling inline yang membingungkan.

