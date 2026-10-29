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
import { relations } from 'drizzle-orm';

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
// Format Kode: UNIT, SET, PCS, PAKET, MTR, ROLL
// ==========================================
export const units = pgTable('units', {
  id: serial('id').primaryKey(),
  unitCode: varchar('unit_code', { length: 20 }).notNull().unique(), // 'UNIT', 'SET', 'PCS', 'PAKET', 'MTR', 'ROLL'
  unitName: varchar('unit_name', { length: 80 }).notNull(),          // 'Unit', 'Set Lengkap', 'Pcs', 'Paket Acara', 'Meter', 'Roll'
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

// ==========================================
// 7. TABEL SEQUENCE NOMOR OTOMATIS
// ==========================================
export const codeSequences = pgTable('code_sequences', {
  prefixKey: varchar('prefix_key', { length: 30 }).primaryKey(), // 'BRG', 'SUP', 'CUS'
  currentValue: integer('current_value').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// RELASI ANTAR TABEL (DRIZZLE RELATIONS)
// ==========================================
export const unitsRelations = relations(units, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  unit: one(units, {
    fields: [products.unitCode],
    references: [units.unitCode],
  }),
}));
