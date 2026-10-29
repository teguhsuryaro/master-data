# 02 — Skema Database (Drizzle ORM), Penomoran Otomatis & Validasi (Revisi v3.0)
**Proyek:** Sistem Informasi Master Data Akuntansi — Kanal Tiga Rental Event & Elektronik  
**Database:** PostgreSQL (Neon Serverless) + Drizzle ORM

---

## 1. Skema Lengkap Database (`src/db/schema.ts`)

Skema ini telah disederhanakan menjadi **6 tabel inti** (1 tabel `users` + 5 tabel Master Data: `accounts`, `units`, `products`, `suppliers`, `customers`) yang persis mewakili seluruh tab pada contoh dosen:

```typescript
import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  integer,
  bigint,
  timestamp,
} from 'drizzle-orm/pg-core';

// ==========================================
// 1. TABEL PENGGUNA (5 ANGGOTA TIM)
// ==========================================
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 120 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: varchar('full_name', { length: 120 }).notNull(),
  roleTitle: varchar('role_title', { length: 100 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// 2. MASTER 1: AKUN AKUNTANSI (COA)
// Format Kode: X-YY-ZZ (Contoh: 1-01-01)
// ==========================================
export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  accountCode: varchar('account_code', { length: 15 }).notNull().unique(), // '1-01-01'
  accountName: varchar('account_name', { length: 150 }).notNull(),        // 'Kas Operasional'
  accountType: varchar('account_type', { length: 60 }).notNull(),         // 'Aset Lancar' | 'Aset Tetap' | 'Liabilitas' | 'Ekuitas' | 'Pendapatan' | 'Beban'
  normalBalance: varchar('normal_balance', { length: 10 }).notNull(),     // 'Debit' | 'Kredit'
  initialBalance: bigint('initial_balance', { mode: 'number' }).notNull().default(0), // Saldo Awal (Rp)
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// 3. MASTER 2: SATUAN BARANG (UNITS)
// Format Kode:UNT01, Nama: Unit, Set, Pcs, Paket
// ==========================================
export const units = pgTable('units', {
  id: serial('id').primaryKey(),
  unitCode: varchar('unit_code', { length: 20 }).notNull().unique(), // 'UNIT', 'SET', 'PCS', 'PAKET', 'ROLL'
  unitName: varchar('unit_name', { length: 80 }).notNull(),          // 'Unit', 'Set Lengkap', 'Pieces (Pcs)', 'Paket Acara'
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// 4. MASTER 3: PRODUK / BARANG SEWA
// Format Kode: BRG001, BRG002, dst.
// ==========================================
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  productCode: varchar('product_code', { length: 20 }).notNull().unique(), // 'BRG001'
  productName: varchar('product_name', { length: 150 }).notNull(),         // 'HT Single Band UHF'
  category: varchar('category', { length: 60 }).notNull(),                 // 'Komunikasi' | 'Visual' | 'Audio' | 'Pencahayaan' | 'Aksesori'
  unitCode: varchar('unit_code', { length: 20 })
    .notNull()
    .references(() => units.unitCode),                                     // Relasi ke tabel satuan ('UNIT', 'SET', dll.)
  purchasePrice: bigint('purchase_price', { mode: 'number' }).notNull().default(0), // Harga Beli / Perolehan (Rp)
  rentalPrice: bigint('rental_price', { mode: 'number' }).notNull().default(0),     // Harga Jual / Tarif Sewa per Hari (Rp)
  stockQty: integer('stock_qty').notNull().default(1),                     // Jumlah unit yang dimiliki Kanal Tiga
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// 5. MASTER 4: PEMASOK (SUPPLIERS)
// Format Kode: SUP001, SUP002, dst.
// ==========================================
export const suppliers = pgTable('suppliers', {
  id: serial('id').primaryKey(),
  supplierCode: varchar('supplier_code', { length: 20 }).notNull().unique(), // 'SUP001'
  supplierName: varchar('supplier_name', { length: 150 }).notNull(),
  contactPerson: varchar('contact_person', { length: 120 }),
  phone: varchar('phone', { length: 30 }).notNull(),
  email: varchar('email', { length: 120 }),
  address: text('address'),
  categorySupplied: varchar('category_supplied', { length: 100 }), // Contoh: 'HT & Alat Komunikasi'
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// 6. MASTER 5: PELANGGAN (CUSTOMERS)
// Format Kode: CUS001, CUS002, dst.
// ==========================================
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  customerCode: varchar('customer_code', { length: 20 }).notNull().unique(), // 'CUS001'
  customerName: varchar('customer_name', { length: 150 }).notNull(),
  customerType: varchar('customer_type', { length: 60 }).notNull(), // 'Organisasi Kampus' | 'Event Organizer' | 'Instansi / Perusahaan' | 'Umum / Individu'
  contactPerson: varchar('contact_person', { length: 120 }),
  phone: varchar('phone', { length: 30 }).notNull(),
  email: varchar('email', { length: 120 }),
  address: text('address'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

---

## 2. Logika Penomoran Kode Otomatis (`src/lib/code-generator.ts`)

Sistem secara otomatis membuatkan kode baru untuk Barang (`BRG001`), Pemasok (`SUP001`), dan Pelanggan (`CUS001`), serta memberikan saran kode untuk Akun (`X-YY-ZZ`):

```typescript
import { db } from '@/db';
import { products, suppliers, customers } from '@/db/schema';
import { desc } from 'drizzle-orm';

/**
 * Mengekstrak angka tertinggi dari kode terakhir (misal 'BRG012' -> 12) lalu menambah 1 ('BRG013')
 */
function formatNextSequentialCode(lastCode: string | undefined, prefix: string, digits = 3): string {
  if (!lastCode) {
    return `${prefix}${String(1).padStart(digits, '0')}`;
  }
  const numericPart = parseInt(lastCode.replace(prefix, ''), 10);
  const nextNumber = isNaN(numericPart) ? 1 : numericPart + 1;
  return `${prefix}${String(nextNumber).padStart(digits, '0')}`;
}

export async function getNextProductCode(): Promise<string> {
  const [last] = await db.select({ code: products.productCode })
    .from(products)
    .orderBy(desc(products.productCode))
    .limit(1);
  return formatNextSequentialCode(last?.code, 'BRG', 3);
}

export async function getNextSupplierCode(): Promise<string> {
  const [last] = await db.select({ code: suppliers.supplierCode })
    .from(suppliers)
    .orderBy(desc(suppliers.supplierCode))
    .limit(1);
  return formatNextSequentialCode(last?.code, 'SUP', 3);
}

export async function getNextCustomerCode(): Promise<string> {
  const [last] = await db.select({ code: customers.customerCode })
    .from(customers)
    .orderBy(desc(customers.customerCode))
    .limit(1);
  return formatNextSequentialCode(last?.code, 'CUS', 3);
}
```

### Logika Otomatis Penentuan Kode Akun (`X-YY-ZZ`) & Saldo Normal
Saat pengguna menambah **Akun Akuntansi** baru dan memilih `Tipe Akun`:
1. **`Aset Lancar`**: Prefix otomatis diarahkan ke `1-01-xx` (Kas/Bank), `1-03-xx` (Piutang), atau `1-15-xx` (Perlengkapan) | Saldo Normal: **Debit**.
2. **`Aset Tetap`**: Prefix otomatis diarahkan ke `1-20-xx` (Peralatan Sewa) | Saldo Normal: **Debit** (kecuali jika nama mengandung kata *"Akumulasi Penyusutan"*, maka Saldo Normal: **Kredit**).
3. **`Liabilitas`**: Prefix otomatis diarahkan ke `2-11-xx` | Saldo Normal: **Kredit**.
4. **`Ekuitas`**: Prefix otomatis diarahkan ke `3-11-xx` | Saldo Normal: **Kredit** (kecuali *Prive*, Saldo Normal: **Debit**).
5. **`Pendapatan`**: Prefix otomatis diarahkan ke `4-11-xx` | Saldo Normal: **Kredit**.
6. **`Beban`**: Prefix otomatis diarahkan ke `5-11-xx` atau `5-12-xx` | Saldo Normal: **Debit**.

---

## 3. Aturan Validasi Bisnis & Proteksi Data (Zod Schema)

1. **Format Kode Akun:** Wajib mengikuti pola `^[1-5]-\d{2}-\d{2}$` (contoh: `1-01-01`).
2. **Harga & Saldo Tidak Boleh Negatif:** `initialBalance >= 0`, `purchasePrice >= 0`, `rentalPrice >= 0`, dan `stockQty >= 0`.
3. **Proteksi Relasi Satuan (`units`):** Sebuah Satuan (misal `UNIT` atau `SET`) **tidak boleh dihapus/dinonaktifkan** jika masih ada Produk aktif yang menggunakan satuan tersebut. Sistem akan memunculkan pesan peringatan yang ramah pengguna.