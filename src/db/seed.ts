import * as dotenv from 'dotenv';
dotenv.config();

import { db } from './index';
import {
  users,
  accounts,
  units,
  products,
  suppliers,
  customers,
  codeSequences,
} from './schema';
import bcrypt from 'bcryptjs';

export async function runSeed() {
  console.log('🚀 Memulai proses seeding idempoten data Master Akuntansi Kanal Tiga (v3.0)...');

  // 1. Seed 5 Akun Anggota Tim (Password: 123456)
  console.log('👤 Seeding 5 Akun Pengguna Anggota Tim...');
  const passwordHash = await bcrypt.hash('123456', 10);

  const demoUsers = [
    {
      username: 'teguh',
      email: 'teguh@kanaltiga.id',
      passwordHash,
      fullName: 'Teguh Surya Romadon',
      roleTitle: 'Koordinator Utama & Akuntansi',
      isActive: true,
    },
    {
      username: 'daffa',
      email: 'daffa@kanaltiga.id',
      passwordHash,
      fullName: 'Daffa Maisan Fathin',
      roleTitle: 'Manajer Inventaris & Peralatan',
      isActive: true,
    },
    {
      username: 'fawwaz',
      email: 'fawwaz@kanaltiga.id',
      passwordHash,
      fullName: 'Muhammad Fattachul Fawwaz',
      roleTitle: 'Manajer Keuangan & COA',
      isActive: true,
    },
    {
      username: 'awal',
      email: 'awal@kanaltiga.id',
      passwordHash,
      fullName: 'Awal Ramadhan Depa',
      roleTitle: 'Manajer Mitra & Pengadaan',
      isActive: true,
    },
    {
      username: 'devin',
      email: 'devin@kanaltiga.id',
      passwordHash,
      fullName: 'Devin Rafa Haryanto',
      roleTitle: 'Manajer Layanan Pelanggan',
      isActive: true,
    },
  ];

  for (const user of demoUsers) {
    await db
      .insert(users)
      .values(user)
      .onConflictDoUpdate({
        target: users.username,
        set: {
          fullName: user.fullName,
          roleTitle: user.roleTitle,
          email: user.email,
          passwordHash: user.passwordHash,
          isActive: true,
        },
      });
  }

  // 2. Seed 6 Master Satuan (units)
  console.log('📏 Seeding 6 Master Satuan Barang...');
  const seedUnits = [
    {
      unitCode: 'UNIT',
      unitName: 'Unit',
      description: 'Satuan per buah perangkat elektronik tunggal (HT, Proyektor, Layar)',
      isActive: true,
    },
    {
      unitCode: 'SET',
      unitName: 'Set Lengkap',
      description: 'Satuan perangkat berpasangan (Contoh: 2 Speaker Aktif + Mixer + Stand)',
      isActive: true,
    },
    {
      unitCode: 'PAKET',
      unitName: 'Paket Bundling',
      description: 'Paket gabungan beberapa alat untuk 1 acara penuh',
      isActive: true,
    },
    {
      unitCode: 'PCS',
      unitName: 'Pcs',
      description: 'Satuan aksesori pendukung per biji (Tripod, Kabel HDMI, Converter)',
      isActive: true,
    },
    {
      unitCode: 'MTR',
      unitName: 'Meter',
      description: 'Satuan kabel panjang instalasi panggung',
      isActive: true,
    },
    {
      unitCode: 'ROLL',
      unitName: 'Roll / Gulung',
      description: 'Satuan khusus kabel listrik gulung (kabel roll)',
      isActive: true,
    },
  ];

  for (const u of seedUnits) {
    await db
      .insert(units)
      .values(u)
      .onConflictDoUpdate({
        target: units.unitCode,
        set: {
          unitName: u.unitName,
          description: u.description,
          isActive: true,
        },
      });
  }

  // 3. Seed 20 Akun Akuntansi (accounts) berformat X-YY-ZZ
  // Saldo awal pada Master Data selalu diatur 0 sesuai kaidah baku materi Pengantar Akuntansi
  console.log('📊 Seeding 20 Akun Akuntansi (Format X-YY-ZZ, Saldo Awal = 0)...');
  const coaAccounts = [
    {
      accountCode: '1-01-01',
      accountName: 'Kas Operasional',
      accountType: 'Aset Lancar',
      normalBalance: 'Debit',
      initialBalance: 0,
      description: 'Uang tunai kas kecil di markas Kanal Tiga',
      isActive: true,
    },
    {
      accountCode: '1-01-02',
      accountName: 'Bank BCA',
      accountType: 'Aset Lancar',
      normalBalance: 'Debit',
      initialBalance: 0,
      description: 'Rekening utama penampungan transfer sewa alat',
      isActive: true,
    },
    {
      accountCode: '1-01-03',
      accountName: 'Bank Mandiri Operasional',
      accountType: 'Aset Lancar',
      normalBalance: 'Debit',
      initialBalance: 0,
      description: 'Rekening kedua cadangan operasional sewa',
      isActive: true,
    },
    {
      accountCode: '1-03-01',
      accountName: 'Piutang Usaha Sewa',
      accountType: 'Aset Lancar',
      normalBalance: 'Debit',
      initialBalance: 0,
      description: 'Tagihan sewa acara kampus yang belum dilunasi',
      isActive: true,
    },
    {
      accountCode: '1-15-01',
      accountName: 'Perlengkapan Acara & Gudang',
      accountType: 'Aset Lancar',
      normalBalance: 'Debit',
      initialBalance: 0,
      description: 'Baterai cadangan, lakban gaffer, kabel ties, nota',
      isActive: true,
    },
    {
      accountCode: '1-20-01',
      accountName: 'Peralatan Elektronik Sewa',
      accountType: 'Aset Tetap',
      normalBalance: 'Debit',
      initialBalance: 0,
      description: 'Nilai perolehan seluruh unit HT, Proyektor, Sound, dll.',
      isActive: true,
    },
    {
      accountCode: '1-20-02',
      accountName: 'Akumulasi Penyusutan Peralatan',
      accountType: 'Aset Tetap',
      normalBalance: 'Kredit',
      initialBalance: 0,
      description: 'Akumulasi penyusutan nilai peralatan sewa (Kontra-Aset)',
      isActive: true,
    },
    {
      accountCode: '2-11-01',
      accountName: 'Utang Usaha',
      accountType: 'Liabilitas',
      normalBalance: 'Kredit',
      initialBalance: 0,
      description: 'Tagihan pembelian peralatan ke supplier yang belum lunas',
      isActive: true,
    },
    {
      accountCode: '2-11-02',
      accountName: 'Uang Jaminan / Deposit Penyewa',
      accountType: 'Liabilitas',
      normalBalance: 'Kredit',
      initialBalance: 0,
      description: 'Uang titipan jaminan sewa yang wajib dikembalikan',
      isActive: true,
    },
    {
      accountCode: '2-11-03',
      accountName: 'Utang Beban Operasional',
      accountType: 'Liabilitas',
      normalBalance: 'Kredit',
      initialBalance: 0,
      description: 'Kewajiban beban listrik atau honor kru yang belum dibayar',
      isActive: true,
    },
    {
      accountCode: '3-11-01',
      accountName: 'Modal Usaha Kanal Tiga',
      accountType: 'Ekuitas',
      normalBalance: 'Kredit',
      initialBalance: 0,
      description: 'Setoran modal awal pendirian usaha rental',
      isActive: true,
    },
    {
      accountCode: '3-11-02',
      accountName: 'Laba Ditahan',
      accountType: 'Ekuitas',
      normalBalance: 'Kredit',
      initialBalance: 0,
      description: 'Akumulasi laba bersih periode sebelumnya',
      isActive: true,
    },
    {
      accountCode: '4-11-01',
      accountName: 'Pendapatan Sewa Alat Komunikasi (HT)',
      accountType: 'Pendapatan',
      normalBalance: 'Kredit',
      initialBalance: 0,
      description: 'Pendapatan dari penyewaan HT Single Band & Dual Band',
      isActive: true,
    },
    {
      accountCode: '4-11-02',
      accountName: 'Pendapatan Sewa Proyektor & Visual',
      accountType: 'Pendapatan',
      normalBalance: 'Kredit',
      initialBalance: 0,
      description: 'Pendapatan dari penyewaan Proyektor, Layar, dan TV',
      isActive: true,
    },
    {
      accountCode: '4-11-03',
      accountName: 'Pendapatan Sewa Sound & Aksesori',
      accountType: 'Pendapatan',
      normalBalance: 'Kredit',
      initialBalance: 0,
      description: 'Pendapatan dari penyewaan Sound System, Mic, Tripod, Kabel',
      isActive: true,
    },
    {
      accountCode: '4-12-01',
      accountName: 'Pendapatan Denda Keterlambatan',
      accountType: 'Pendapatan',
      normalBalance: 'Kredit',
      initialBalance: 0,
      description: 'Pendapatan denda jika pelanggan terlambat mengembalikan alat',
      isActive: true,
    },
    {
      accountCode: '5-11-01',
      accountName: 'Beban Gaji & Kru Lapangan',
      accountType: 'Beban',
      normalBalance: 'Debit',
      initialBalance: 0,
      description: 'Upah operator sound dan teknisi siaga acara',
      isActive: true,
    },
    {
      accountCode: '5-11-02',
      accountName: 'Beban Perawatan & Servis Alat',
      accountType: 'Beban',
      normalBalance: 'Debit',
      initialBalance: 0,
      description: 'Biaya servis speaker, ganti baterai HT, dan perawatan rutin',
      isActive: true,
    },
    {
      accountCode: '5-11-03',
      accountName: 'Beban Transportasi Pengantaran',
      accountType: 'Beban',
      normalBalance: 'Debit',
      initialBalance: 0,
      description: 'Biaya BBM pengantaran dan penjemputan alat ke lokasi acara',
      isActive: true,
    },
    {
      accountCode: '5-12-01',
      accountName: 'Beban Sewa Tempat & Listrik',
      accountType: 'Beban',
      normalBalance: 'Debit',
      initialBalance: 0,
      description: 'Biaya listrik bulanan untuk pengisian daya alat & sewa gudang',
      isActive: true,
    },
  ];

  for (const acc of coaAccounts) {
    await db
      .insert(accounts)
      .values(acc)
      .onConflictDoUpdate({
        target: accounts.accountCode,
        set: {
          accountName: acc.accountName,
          accountType: acc.accountType,
          normalBalance: acc.normalBalance,
          initialBalance: acc.initialBalance,
          description: acc.description,
          isActive: true,
        },
      });
  }

  // 4. Seed 14 Produk/Barang Rental (products)
  console.log('📦 Seeding 14 Produk / Barang Rental (Kode BRG001 - BRG014)...');
  const seedProducts = [
    {
      productCode: 'BRG001',
      productName: 'HT Single Band UHF (WLN KD-C1 + Earset)',
      category: 'Komunikasi',
      unitCode: 'UNIT',
      purchasePrice: 185000,
      rentalPrice: 10000,
      stockQty: 25,
      description: 'HT ringkas 16 channel UHF lengkap dengan earset untuk panitia',
      isActive: true,
    },
    {
      productCode: 'BRG002',
      productName: 'HT Dual Band Layar Digital (Baofeng UV-5R)',
      category: 'Komunikasi',
      unitCode: 'UNIT',
      purchasePrice: 320000,
      rentalPrice: 15000,
      stockQty: 15,
      description: 'HT jarak menengah dual band VHF/UHF dengan layar LCD & keypad',
      isActive: true,
    },
    {
      productCode: 'BRG003',
      productName: 'Megaphone Toa Sirene Genggam',
      category: 'Komunikasi',
      unitCode: 'UNIT',
      purchasePrice: 450000,
      rentalPrice: 35000,
      stockQty: 4,
      description: 'Pengeras suara genggam bertenaga baterai lengkap dengan sirene',
      isActive: true,
    },
    {
      productCode: 'BRG004',
      productName: 'Proyektor Epson EB-X500 (3.600 Lumens)',
      category: 'Visual',
      unitCode: 'UNIT',
      purchasePrice: 5200000,
      rentalPrice: 150000,
      stockQty: 3,
      description: 'Proyektor 3LCD terang untuk presentasi ruang seminar',
      isActive: true,
    },
    {
      productCode: 'BRG005',
      productName: 'Proyektor InFocus HD (4.000 Lumens)',
      category: 'Visual',
      unitCode: 'UNIT',
      purchasePrice: 6500000,
      rentalPrice: 200000,
      stockQty: 2,
      description: 'Proyektor kecerahan tinggi untuk aula besar dan pemutaran film',
      isActive: true,
    },
    {
      productCode: 'BRG006',
      productName: 'Layar Proyektor Tripod Portable 70 Inci',
      category: 'Visual',
      unitCode: 'UNIT',
      purchasePrice: 680000,
      rentalPrice: 50000,
      stockQty: 4,
      description: 'Screen kain matte white ukuran 178x178 cm dengan kaki tripod kokoh',
      isActive: true,
    },
    {
      productCode: 'BRG007',
      productName: 'Layar Proyektor Fastfold Besar 2x3 Meter',
      category: 'Visual',
      unitCode: 'SET',
      purchasePrice: 2800000,
      rentalPrice: 175000,
      stockQty: 2,
      description: 'Layar proyektor panggung besar rangka aluminium lipat',
      isActive: true,
    },
    {
      productCode: 'BRG008',
      productName: 'Sound System Portable 12 Inci + 2 Mic Wireless',
      category: 'Audio',
      unitCode: 'SET',
      purchasePrice: 2400000,
      rentalPrice: 175000,
      stockQty: 3,
      description: 'Speaker aktif portable troli dengan aki dan 2 mikrofon wireless',
      isActive: true,
    },
    {
      productCode: 'BRG009',
      productName: 'Paket Sound System Seminar (2 Speaker Aktif + Mixer)',
      category: 'Audio',
      unitCode: 'PAKET',
      purchasePrice: 7500000,
      rentalPrice: 400000,
      stockQty: 2,
      description: 'Paket lengkap tata suara 2 unit speaker Huper 12" + Mixer 8-ch Yamaha',
      isActive: true,
    },
    {
      productCode: 'BRG010',
      productName: 'Mic Wireless Handheld Dual (2 Pegang)',
      category: 'Audio',
      unitCode: 'SET',
      purchasePrice: 950000,
      rentalPrice: 75000,
      stockQty: 4,
      description: 'Dua mikrofon genggam nirkabel frekuensi UHF stabil minim noise',
      isActive: true,
    },
    {
      productCode: 'BRG011',
      productName: 'Tripod Stand Speaker / Proyektor Besi',
      category: 'Aksesori',
      unitCode: 'PCS',
      purchasePrice: 220000,
      rentalPrice: 25000,
      stockQty: 8,
      description: 'Penyangga besi heavy duty dengan pin pengunci',
      isActive: true,
    },
    {
      productCode: 'BRG012',
      productName: 'Kabel HDMI Fiber Optik 15 Meter',
      category: 'Aksesori',
      unitCode: 'PCS',
      purchasePrice: 275000,
      rentalPrice: 25000,
      stockQty: 6,
      description: 'Kabel HDMI transmisi fiber optik 4K anti-delay untuk proyektor',
      isActive: true,
    },
    {
      productCode: 'BRG013',
      productName: 'Kabel Roll Listrik Tembaga 25 Meter (4 Lubang)',
      category: 'Aksesori',
      unitCode: 'ROLL',
      purchasePrice: 210000,
      rentalPrice: 15000,
      stockQty: 10,
      description: 'Kabel listrik tembaga murni tahan panas dengan stopkontak arde',
      isActive: true,
    },
    {
      productCode: 'BRG014',
      productName: 'Lampu Sorot Panggung LED PAR 54 RGB',
      category: 'Pencahayaan',
      unitCode: 'UNIT',
      purchasePrice: 420000,
      rentalPrice: 40000,
      stockQty: 6,
      description: 'Lampu sorot panggung warna-warni 54 LED untuk backdrop & dekorasi',
      isActive: true,
    },
  ];

  for (const prd of seedProducts) {
    await db
      .insert(products)
      .values(prd)
      .onConflictDoUpdate({
        target: products.productCode,
        set: {
          productName: prd.productName,
          category: prd.category,
          unitCode: prd.unitCode,
          purchasePrice: prd.purchasePrice,
          rentalPrice: prd.rentalPrice,
          stockQty: prd.stockQty,
          description: prd.description,
          isActive: true,
        },
      });
  }

  // 5. Seed 6 Pemasok (suppliers)
  console.log('🏭 Seeding 6 Mitra Pemasok (SUP001 - SUP006)...');
  const seedSuppliers = [
    {
      supplierCode: 'SUP001',
      supplierName: 'PT Sumber Audio Nusantara',
      contactPerson: 'Hendro Wibowo',
      phone: '0281-631011',
      email: 'sales@sumberaudio.example.id',
      address: 'Jl. Jend. Sudirman No. 112, Purwokerto',
      categorySupplied: 'Sound System, Speaker & Mic',
      isActive: true,
    },
    {
      supplierCode: 'SUP002',
      supplierName: 'CV Mitra Visual Proyeksi',
      contactPerson: 'Sinta Maharani',
      phone: '0281-632022',
      email: 'info@mitravisual.example.id',
      address: 'Jl. HR Bunyamin No. 45, Purwokerto',
      categorySupplied: 'Proyektor, Layar Tripod & HDMI',
      isActive: true,
    },
    {
      supplierCode: 'SUP003',
      supplierName: 'Toko Radio Komunikasi Mandiri',
      contactPerson: 'Antonius Eko',
      phone: '0281-633033',
      email: 'order@radiokomunikasi.example.id',
      address: 'Jl. Kombas No. 28, Purwokerto',
      categorySupplied: 'HT Single Band, Dual Band & Earset',
      isActive: true,
    },
    {
      supplierCode: 'SUP004',
      supplierName: 'PD Elektrik & Kabel Sejahtera',
      contactPerson: 'Bambang Sutrisno',
      phone: '0281-634044',
      email: 'part@elektronikteknik.example.id',
      address: 'Ruko Kebondalem Blok B4, Purwokerto',
      categorySupplied: 'Kabel Roll, Baterai & Aksesori Listrik',
      isActive: true,
    },
    {
      supplierCode: 'SUP005',
      supplierName: 'Cahaya Panggung Lighting Jaya',
      contactPerson: 'Dedi Hermawan',
      phone: '0281-635055',
      email: 'kontak@cahayapanggung.example.id',
      address: 'Jl. Gerilya Timur No. 88, Purwokerto',
      categorySupplied: 'Lampu Sorot LED PAR & Stand Tripod',
      isActive: true,
    },
    {
      supplierCode: 'SUP006',
      supplierName: 'Bengkel Servis Elektronik Prima',
      contactPerson: 'Wahyu Kurniawan',
      phone: '0281-636066',
      email: 'teknisi@servisprima.example.id',
      address: 'Jl. Kampus No. 19, Grendeng, Purwokerto',
      categorySupplied: 'Suku Cadang & Jasa Servis Peralatan',
      isActive: true,
    },
  ];

  for (const s of seedSuppliers) {
    await db
      .insert(suppliers)
      .values(s)
      .onConflictDoUpdate({
        target: suppliers.supplierCode,
        set: {
          supplierName: s.supplierName,
          contactPerson: s.contactPerson,
          phone: s.phone,
          email: s.email,
          address: s.address,
          categorySupplied: s.categorySupplied,
          isActive: true,
        },
      });
  }

  // 6. Seed 10 Pelanggan (customers)
  console.log('👥 Seeding 10 Mitra Pelanggan (CUS001 - CUS010)...');
  const seedCustomers = [
    {
      customerCode: 'CUS001',
      customerName: 'BEM Universitas Jenderal Soedirman',
      customerType: 'Organisasi Kampus',
      contactPerson: 'Farhan Ramadhan',
      phone: '0812-2700-1001',
      email: 'bem.unsoed@kampus.example.id',
      address: 'Kompleks PKM Unsoed, Grendeng',
      isActive: true,
    },
    {
      customerCode: 'CUS002',
      customerName: 'Himpunan Mahasiswa Informatika',
      customerType: 'Organisasi Kampus',
      contactPerson: 'Aulia Rahma',
      phone: '0812-2700-1002',
      email: 'hmif@kampus.example.id',
      address: 'Kampus Teknik, Kalimanah',
      isActive: true,
    },
    {
      customerCode: 'CUS003',
      customerName: 'UKM Musik & Kesenian Kampus',
      customerType: 'Organisasi Kampus',
      contactPerson: 'Bagus Setiawan',
      phone: '0812-2700-1003',
      email: 'ukm.musik@kampus.example.id',
      address: 'Gedung UKM Lt. 2, Purwokerto Utara',
      isActive: true,
    },
    {
      customerCode: 'CUS004',
      customerName: 'Kreasi Muda Event Organizer (EO)',
      customerType: 'Event Organizer',
      contactPerson: 'Gilang Prakoso',
      phone: '0812-2700-1004',
      email: 'halo@kreasimuda.example.id',
      address: 'Jl. Dr. Angka No. 54, Purwokerto',
      isActive: true,
    },
    {
      customerCode: 'CUS005',
      customerName: 'Panitia Seminar Nasional Ekonomi',
      customerType: 'Organisasi Kampus',
      contactPerson: 'Nabila Azzahra',
      phone: '0812-2700-1005',
      email: 'semnas.fe@kampus.example.id',
      address: 'Aula Fakultas Ekonomi, Purwokerto',
      isActive: true,
    },
    {
      customerCode: 'CUS006',
      customerName: 'Komunitas Standup & Kreatif Banyumas',
      customerType: 'Komunitas',
      contactPerson: 'Sekar Arum',
      phone: '0812-2700-1006',
      email: 'info@kreatifbanyumas.example.id',
      address: 'Jl. Masjid No. 17, Alun-Alun Purwokerto',
      isActive: true,
    },
    {
      customerCode: 'CUS007',
      customerName: 'PT Satria Mandiri Utama',
      customerType: 'Instansi / Perusahaan',
      contactPerson: 'Yudhistira Putra',
      phone: '0812-2700-1007',
      email: 'procurement@satriamandiri.example.id',
      address: 'Jl. S. Parman No. 90, Purwokerto Selatan',
      isActive: true,
    },
    {
      customerCode: 'CUS008',
      customerName: 'Raka Pratama (Acara Pernikahan/Keluarga)',
      customerType: 'Umum / Individu',
      contactPerson: 'Raka Pratama',
      phone: '0812-2700-1008',
      email: 'raka.pratama@mail.example.id',
      address: 'Perumahan Griya Satria Blok C-14',
      isActive: true,
    },
    {
      customerCode: 'CUS009',
      customerName: 'Dinas Pariwisata & Kebudayaan Banyumas',
      customerType: 'Instansi / Perusahaan',
      contactPerson: 'Tri Hartanto',
      phone: '0812-2700-1009',
      email: 'dinparbud@banyumaskab.go.id',
      address: 'Jl. Prof. Dr. Suharso No. 10',
      isActive: true,
    },
    {
      customerCode: 'CUS010',
      customerName: 'Panitia Dies Natalis Fakultas Teknik',
      customerType: 'Organisasi Kampus',
      contactPerson: 'Dimas Aditya',
      phone: '0812-2700-1010',
      email: 'diesnatalis.ft@kampus.example.id',
      address: 'Gedung Dekanat FT Lt. 1',
      isActive: true,
    },
  ];

  for (const c of seedCustomers) {
    await db
      .insert(customers)
      .values(c)
      .onConflictDoUpdate({
        target: customers.customerCode,
        set: {
          customerName: c.customerName,
          customerType: c.customerType,
          contactPerson: c.contactPerson,
          phone: c.phone,
          email: c.email,
          address: c.address,
          isActive: true,
        },
      });
  }

  // 7. Seed code_sequences awal
  console.log('🔢 Mengatur Sequence Kode Otomatis...');
  const initialSequences = [
    { prefixKey: 'BRG', currentValue: 14 },
    { prefixKey: 'SUP', currentValue: 6 },
    { prefixKey: 'CUS', currentValue: 10 },
  ];

  for (const seq of initialSequences) {
    await db
      .insert(codeSequences)
      .values(seq)
      .onConflictDoUpdate({
        target: codeSequences.prefixKey,
        set: {
          currentValue: seq.currentValue,
          updatedAt: new Date(),
        },
      });
  }

  console.log('✅ Seeding Selesai Sukses 100%! Seluruh data Master Akuntansi v3.0 siap digunakan.');
}

// Eksekusi jika dipanggil via CLI
if (require.main === module || process.argv[1]?.endsWith('seed.ts')) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Terjadi kesalahan saat seeding:', err);
      process.exit(1);
    });
}
