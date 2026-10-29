---
name: anti-slop-accounting-ui
description: >-
  Panduan dan standar ketat UI/UX Sistem Informasi Akuntansi (SIAKUN) berbasis referensi Clean Drive UI (image.png)
  dengan warna identitas Kanal Tiga (#F79721) dan kaidah materi 09_Pengantar_Akuntansi.pdf.
---

# Clean Drive Workspace UI & Accounting Domain Skill Guide

**Referensi Visual UI:** `image.png` (*Clean Cloud Drive Dashboard dengan Curved Brand Sidebar*)  
**Warna Utama Brand:** `#F79721` (Kanal Tiga Signal Orange)  
**Referensi Materi Akuntansi:** `09_Pengantar_Akuntansi.pdf`

---

## 1. Blueprint Spesifikasi UI yang Wajib Diikuti
Seluruh perubahan UI merujuk pada 4 dokumen blueprint utama di folder `specs/`:
1. [`specs/07_blueprint_sistem_desain_ui_drive_kanaltiga.md`](../../specs/07_blueprint_sistem_desain_ui_drive_kanaltiga.md) — Sistem token warna, tipografi, folder cards, dan ikon baris berwarna.
2. [`specs/08_spesifikasi_layout_appshell_sidebar_header.md`](../../specs/08_spesifikasi_layout_appshell_sidebar_header.md) — Arsitektur Top Bar Putih + Left Sidebar Oranye Melengkung (`rounded-tr-[42px]`) + Widget Progress Bar bawah.
3. [`specs/09_spesifikasi_ui_halaman_master_data.md`](../../specs/09_spesifikasi_ui_halaman_master_data.md) — Tata letak 3-tingkat (`Page Title Row` &rarr; `QUICK ACCESS Folder Cards` &rarr; `ALL FILES Clean Borderless List`) untuk Dashboard & 5 Modul Master Data.
4. [`specs/10_spesifikasi_ui_modul_edukasi_dan_panduan_eksekusi.md`](../../specs/10_spesifikasi_ui_modul_edukasi_dan_panduan_eksekusi.md) — Tata letak halaman Simulasi Debit-Kredit, Komparasi COA, dan Runbook Eksekusi.

---

## 2. Lima Ciri Khas UI (`image.png` + `#F79721`)
1. **Kanvas Utama Putih Menyatu (`bg-white`):** Bebas dari tumpukan kotak ber-border kaku.
2. **Left Sidebar Melengkung (`rounded-tr-[42px]`):** Berwarna gradien hangat `#F79721` &rarr; `#D97206`, memiliki tombol pill putih utama di atas, menu vertikal dengan indikator lingkaran aktif, dan widget *progress bar* `"STATUS MASTER DATA"` di bawah.
3. **Top Header Putih (`h-20`):** Menampilkan logo di atas sidebar, input pencarian berbentuk pill (`rounded-full bg-[#F4F5F7]`), ikon utilitas, nama user, dan avatar bulat `#F79721`.
4. **Baris Kartu `"QUICK ACCESS"` Berbentuk Folder:** Kartu yang sedang aktif berwarna solid `#F79721` (teks putih), sedangkan kartu lainnya `#F4F5F7` dengan deretan badge bulat bertumpuk.
5. **Tabel Gaya `"ALL FILES"`:** Tanpa garis vertikal, setiap baris diawali ikon kotak kecil berwarna (Biru, Hijau, Merah, Oranye, Ungu) sesuai jenis akun/kategori barang, dan memiliki efek sorot lembut `hover:bg-[#FFF7ED]`.

---

## 3. Kaidah Domain Akuntansi yang Tidak Boleh Diubah (`09_Pengantar_Akuntansi.pdf`)
* **Saldo Awal pada Master Data SELALU Rp 0:** Master Data hanya mendefinisikan entitas akun dan barang. Saldo awal dimasukkan terpisah pada awal periode melalui Jurnal Penyesuaian / Input Saldo Awal.
* **Alur Logika 4-Digit & X-YY-ZZ (Slide 3):** 6 tahap klasifikasi (Laporan Keuangan &rarr; Kelompok L1 &rarr; Sub-Kelompok L2 &rarr; Jenis Akun L3 &rarr; Nomor Urut L4 &rarr; Master Data).
* **Penempatan Debit & Kredit (Slide 4):** $\text{Aset (Debit +)} = \text{Liabilitas (Kredit +)} + \text{Ekuitas (Kredit +)}$.
* **Komparasi COA Lintas Bidang (Slide 5–8):** Jasa, Perdagangan (HPP), dan Manufaktur (BDP & Biaya Produksi).
