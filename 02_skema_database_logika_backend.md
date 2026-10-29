# 02 — Skema Database (Drizzle ORM), Relasi, dan Logika Pembuatan Kode Otomatis
**Proyek:** Sistem Informasi Master Data Akuntansi — Kanal Tiga Rental Elektronik  
**Database Engine:** PostgreSQL (Neon Serverless) + Drizzle ORM

---

## 1. Struktur Tabel & Skema Drizzle ORM (`src/db/schema.ts`)

Berikut adalah skema lengkap yang siap diimplementasikan langsung ke dalam file `src/db/schema.ts`. Seluruh tipe uang menggunakan `numeric(15, 2)` atau integer Rupiah murni (disarankan `bigint / integer` untuk Rupiah tanpa sen agar bebas dari masalah pembulatan desimal *floating-point*, serta diformat saat ditampilkan di UI).

```typescript
import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  integer,
  bigint,
  date,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==========================================
// 1. ENUMS (Klasifikasi Baku Sistem)
// ==========================================

export const userRoleEnum = pgEnum('user_role', [
  'ADMIN',
  'ACCOUNTANT',
  'INVENTORY',
  'FRONT_DESK',
  'AUDITOR',
]);

export const accountGroupEnum = pgEnum('account_group', [
  'ASSET',      // Kode 1xxx - Aset
  'LIABILITY',  // Kode 2xxx - Liabilitas
  'EQUITY',     // Kode 3xxx - Ekuitas
  'REVENUE',    // Kode 4xxx - Pendapatan
  'EXPENSE',    // Kode 5xxx - Beban
]);

export const normalBalanceEnum = pgEnum('normal_balance', [
  'DEBIT',
  'CREDIT',
]);

export const rentalUnitEnum = pgEnum('rental_unit', [
  'UNIT',
  'SET',
  'PAKET',
]);

export const supplierTypeEnum = pgEnum('supplier_type', [
  'EQUIPMENT',   // Peralatan Utama
  'SPAREPART',   // Suku Cadang & Komponen
  'SERVICE',     // Jasa Servis & Perawatan
  'OTHER',       // Lainnya
]);

export const customerTypeEnum = pgEnum('customer_type', [
  'INDIVIDUAL',   // Perorangan
  'ORGANIZATION', // Organisasi Kampus / Himpunan / UKM / Komunitas
  'EO',           // Event Organizer
  'COMPANY',      // Perusahaan / Instansi
]);

export const assetConditionEnum = pgEnum('asset_condition', [
  'GOOD',               // Baik
  'MAINTENANCE_NEEDED', // Perlu Perawatan
  'DAMAGED',            // Rusak
]);

export const assetStatusEnum = pgEnum('asset_status', [
  'AVAILABLE',   // Tersedia di Gudang
  'RENTED',      // Sedang Disewa
  'MAINTENANCE', // Sedang Diservis / Perawatan
  'INACTIVE',    // Tidak Aktif / Dihapusbukukan
]);

// ==========================================
// 2. TABEL SISTEM & AUTENTIKASI
// ==========================================

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 120 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: varchar('full_name', { length: 120 }).notNull(),
  role: userRoleEnum('role').notNull().default('AUDITOR'),
  title: varchar('title', { length: 100 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tabel Atomic Counter untuk menjamin kode otomatis tidak pernah bentrok/duplikat
export const codeSequences = pgTable('code_sequences', {
  prefixKey: varchar('prefix_key', { length: 30 }).primaryKey(), // Contoh: 'KT-HT', 'AST-HT', 'SUP', 'CUS'
  currentValue: integer('current_value').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// 3. TABEL MASTER 1: BAGAN AKUN (COA)
// ==========================================

export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  accountCode: varchar('account_code', { length: 10 }).notNull().unique(), // 4 digit string: '1010'
  accountName: varchar('account_name', { length: 150 }).notNull(),
  accountGroup: accountGroupEnum('account_group').notNull(),
  subgroup: varchar('subgroup', { length: 100 }).notNull(),
  normalBalance: normalBalanceEnum('normal_balance').notNull(),
  isContra: boolean('is_contra').notNull().default(false), // True untuk Akum. Penyusutan (1410) & Prive (3120)
  isPostable: boolean('is_postable').notNull().default(true), // False untuk akun Header/Induk
  parentAccountCode: varchar('parent_account_code', { length: 10 }), // Self-reference ke account_code induk
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// 4. TABEL REFERENSI KATEGORI & MASTER 2: PRODUK
// ==========================================

export const productCategories = pgTable('product_categories', {
  categoryCode: varchar('category_code', { length: 10 }).primaryKey(), // 'HT', 'AUD', 'VIS', 'LGT', 'AKS'
  categoryName: varchar('category_name', { length: 100 }).notNull(),
  defaultRevenueAccountCode: varchar('default_revenue_account_code', { length: 10 })
    .notNull()
    .references(() => accounts.accountCode),
  description: text('description'),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  productCode: varchar('product_code', { length: 25 }).notNull().unique(), // Pola: KT-KAT-NNN (KT-HT-001)
  productName: varchar('product_name', { length: 150 }).notNull(),
  categoryCode: varchar('category_code', { length: 10 })
    .notNull()
    .references(() => productCategories.categoryCode),
  brand: varchar('brand', { length: 100 }),
  specification: text('specification'),
  rentalRate: bigint('rental_rate', { mode: 'number' }).notNull(), // Tarif sewa / hari dalam IDR
  rentalUnit: rentalUnitEnum('rental_unit').notNull().default('UNIT'),
  accountCode: varchar('account_code', { length: 10 })
    .notNull()
    .references(() => accounts.accountCode), // Akun pendapatan terkait (4010 - 4040)
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// 5. TABEL MASTER 3: PEMASOK (SUPPLIERS)
// ==========================================

export const suppliers = pgTable('suppliers', {
  id: serial('id').primaryKey(),
  supplierCode: varchar('supplier_code', { length: 20 }).notNull().unique(), // Pola: SUP-NNNN
  supplierName: varchar('supplier_name', { length: 150 }).notNull(),
  supplierType: supplierTypeEnum('supplier_type').notNull(),
  contactPerson: varchar('contact_person', { length: 120 }),
  phone: varchar('phone', { length: 30 }),
  email: varchar('email', { length: 120 }),
  address: text('address'),
  city: varchar('city', { length: 80 }).default('Purwokerto'),
  notes: text('notes'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// 6. TABEL MASTER 4: PELANGGAN (CUSTOMERS)
// ==========================================

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  customerCode: varchar('customer_code', { length: 20 }).notNull().unique(), // Pola: CUS-NNNN
  customerName: varchar('customer_name', { length: 150 }).notNull(),
  customerType: customerTypeEnum('customer_type').notNull(),
  contactPerson: varchar('contact_person', { length: 120 }),
  phone: varchar('phone', { length: 30 }),
  email: varchar('email', { length: 120 }),
  address: text('address'),
  city: varchar('city', { length: 80 }).default('Purwokerto'),
  notes: text('notes'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// 7. TABEL MASTER 5: ASET FISIK (ASSETS)
// ==========================================

export const assets = pgTable('assets', {
  id: serial('id').primaryKey(),
  assetCode: varchar('asset_code', { length: 25 }).notNull().unique(), // Pola: AST-KAT-NNNN (AST-HT-0001)
  assetName: varchar('asset_name', { length: 150 }).notNull(),
  productCode: varchar('product_code', { length: 25 })
    .notNull()
    .references(() => products.productCode),
  serialNumber: varchar('serial_number', { length: 100 }).unique(),
  acquisitionDate: date('acquisition_date').notNull(),
  acquisitionCost: bigint('acquisition_cost', { mode: 'number' }).notNull(), // Harga perolehan (IDR)
  usefulLifeMonths: integer('useful_life_months').notNull().default(48), // Umur ekonomis (bulan) untuk simulasi akuntansi
  salvageValue: bigint('salvage_value', { mode: 'number' }).notNull().default(0), // Nilai residu (IDR)
  assetCondition: assetConditionEnum('asset_condition').notNull().default('GOOD'),
  assetStatus: assetStatusEnum('asset_status').notNull().default('AVAILABLE'),
  supplierCode: varchar('supplier_code', { length: 20 }).references(() => suppliers.supplierCode),
  accountCode: varchar('account_code', { length: 10 })
    .notNull()
    .default('1310')
    .references(() => accounts.accountCode), // Akun Aset Tetap (1310)
  accumulatedDeprAccountCode: varchar('accumulated_depr_account_code', { length: 10 })
    .notNull()
    .default('1410')
    .references(() => accounts.accountCode), // Akun Kontra Aset (1410)
  expenseDeprAccountCode: varchar('expense_depr_account_code', { length: 10 })
    .notNull()
    .default('5310')
    .references(() => accounts.accountCode), // Akun Beban Penyusutan (5310)
  location: varchar('location', { length: 120 }).default('Rak Utama Gudang Purwokerto'),
  notes: text('notes'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

---

## 2. Algoritma Pembuatan Kode Otomatis (`src/lib/code-generator.ts`)

Sistem menerapkan pembangkitan kode otomatis di sisi server (Server Action) sehingga pengguna tidak perlu mengarang nomor urut sendiri, namun sistem tetap menampilkan *Preview Kode* di layar form.

### 2.1 Fungsi Atomic Sequence Generator
```typescript
import { db } from '@/db';
import { codeSequences } from '@/db/schema';
import { sql } from 'drizzle-orm';

/**
 * Menghasilkan kode unik berurutan secara thread-safe di PostgreSQL.
 * @param prefixKey Kunci sequence, contoh: 'KT-HT', 'AST-AUD', 'SUP', 'CUS'
 * @param padLength Panjang digit angka (3 untuk Produk, 4 untuk Supplier/Customer/Aset)
 */
export async function generateNextCode(prefixKey: string, padLength: number): Promise<string> {
  const [result] = await db
    .insert(codeSequences)
    .values({
      prefixKey,
      currentValue: 1,
    })
    .onConflictDoUpdate({
      target: codeSequences.prefixKey,
      set: {
        currentValue: sql`${codeSequences.currentValue} + 1`,
        updatedAt: new Date(),
      },
    })
    .returning({ currentValue: codeSequences.currentValue });

  const paddedNumber = String(result.currentValue).padStart(padLength, '0');
  return `${prefixKey}-${paddedNumber}`;
}
```

### 2.2 Aturan Spesifik untuk Setiap Master Data
1. **Master Akun (`account_code`):**
   * Diinput oleh pengguna/akuntan dengan bantuan *Smart Code Assistant* di form:
     * Saat pengguna memilih `Kelompok Akun` (misal: `ASSET` -> otomatis mengunci digit pertama menjadi `1`) dan memilih/mengetik `Subkelompok`, sistem memberikan rekomendasi kode 4 digit berikutnya yang belum terpakai (misal: `1030`).
   * **Validasi:** Regex `/^[1-5][0-9]{3}$/`. Digit pertama wajib sesuai dengan `account_group`:
     * `1` = `ASSET`
     * `2` = `LIABILITY`
     * `3` = `EQUITY`
     * `4` = `REVENUE`
     * `5` = `EXPENSE`
2. **Master Produk (`product_code`):**
   * Dibuat otomatis saat pengguna memilih `categoryCode` (contoh: `HT`).
   * Memanggil `generateNextCode('KT-' + categoryCode, 3)` $\rightarrow$ menghasilkan `KT-HT-001`.
3. **Master Pemasok (`supplier_code`):**
   * Dibuat otomatis tanpa syarat kategori.
   * Memanggil `generateNextCode('SUP', 4)` $\rightarrow$ menghasilkan `SUP-0001`.
4. **Master Pelanggan (`customer_code`):**
   * Dibuat otomatis tanpa syarat kategori.
   * Memanggil `generateNextCode('CUS', 4)` $\rightarrow$ menghasilkan `CUS-0001`.
5. **Master Aset (`asset_code`):**
   * Pengguna memilih `productCode` terlebih dahulu (misal: `KT-AUD-001`).
   * Sistem mengekstrak `categoryCode` dari produk tersebut (`AUD`).
   * Memanggil `generateNextCode('AST-' + categoryCode, 4)` $\rightarrow$ menghasilkan `AST-AUD-0001`.

---

## 3. Aturan Validasi Bisnis (Zod Schema & Guardrails)

Seluruh aksi simpan dan ubah wajib melewati lapisan validasi berikut:

1. **Aturan Imutabilitas Kode Bisnis:**
   * Saat melakukan *Edit Data*, kolom `account_code`, `product_code`, `supplier_code`, `customer_code`, dan `asset_code` bersifat **Read-Only / Tidak Boleh Diubah**.
2. **Aturan Saldo Normal & Akun Kontra:**
   ```typescript
   export function computeNormalBalance(
     group: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE',
     isContra: boolean
   ): 'DEBIT' | 'CREDIT' {
     const defaultDebit = group === 'ASSET' || group === 'EXPENSE';
     if (isContra) {
       return defaultDebit ? 'CREDIT' : 'DEBIT';
     }
     return defaultDebit ? 'DEBIT' : 'CREDIT';
   }
   ```
3. **Aturan Tanggal & Nilai Perolehan Aset:**
   * `acquisitionCost` $\ge 0$ dan `salvageValue` $\ge 0$.
   * `salvageValue` tidak boleh lebih besar dari `acquisitionCost`.
   * `acquisitionDate` tidak boleh melebihi tanggal hari ini (`new Date()`).
4. **Aturan Konsistensi Kondisi vs Status Aset:**
   * Jika `assetCondition === 'DAMAGED'`, maka `assetStatus` tidak boleh `'AVAILABLE'` maupun `'RENTED'`.
   * Jika `isActive === false`, maka `assetStatus` dipaksa menjadi `'INACTIVE'`.