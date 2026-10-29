import { z } from 'zod';

// ==========================================
// 1. SKEMA VALIDASI MASTER AKUN (COA)
// Pola Kode: X-YY-ZZ (Contoh: 1-01-01)
// ==========================================
export const accountSchema = z.object({
  accountCode: z
    .string()
    .regex(
      /^[1-5]-\d{2}-\d{2}$/,
      'Format kode akun wajib X-YY-ZZ (contoh: 1-01-01)'
    ),
  accountName: z.string().min(3, 'Nama akun minimal 3 karakter').max(150),
  accountType: z.enum([
    'Aset Lancar',
    'Aset Tetap',
    'Liabilitas',
    'Ekuitas',
    'Pendapatan',
    'Beban',
  ]),
  normalBalance: z.enum(['Debit', 'Kredit']),
  initialBalance: z.coerce
    .number()
    .min(0, 'Saldo awal tidak boleh bernilai negatif')
    .default(0),
  description: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type AccountFormValues = z.infer<typeof accountSchema>;
export type AccountType =
  | 'Aset Lancar'
  | 'Aset Tetap'
  | 'Liabilitas'
  | 'Ekuitas'
  | 'Pendapatan'
  | 'Beban';
export type AccountGroup = AccountType;

// ==========================================
// 2. SKEMA VALIDASI MASTER SATUAN (UNITS)
// ==========================================
export const unitSchema = z.object({
  unitCode: z
    .string()
    .min(2, 'Kode satuan minimal 2 karakter')
    .max(20)
    .regex(/^[A-Z0-9_-]+$/, 'Kode satuan harus huruf kapital (contoh: UNIT, SET)'),
  unitName: z.string().min(2, 'Nama satuan minimal 2 karakter').max(80),
  description: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type UnitFormValues = z.infer<typeof unitSchema>;

// ==========================================
// 3. SKEMA VALIDASI MASTER PRODUK / BARANG
// Pola Kode: BRG001
// ==========================================
export const productSchema = z.object({
  productCode: z
    .string()
    .regex(/^BRG\d{3,}$/, 'Format kode barang harus BRG diikuti 3 digit angka (contoh: BRG001)')
    .optional(),
  productName: z.string().min(3, 'Nama barang minimal 3 karakter').max(150),
  category: z.string().min(2, 'Kategori barang wajib dipilih').max(60),
  unitCode: z.string().min(1, 'Satuan barang wajib dipilih'),
  purchasePrice: z.coerce
    .number()
    .min(0, 'Harga beli/perolehan tidak boleh bernilai negatif')
    .default(0),
  rentalPrice: z.coerce
    .number()
    .min(0, 'Tarif sewa per hari tidak boleh bernilai negatif')
    .default(0),
  stockQty: z.coerce
    .number()
    .int('Jumlah unit harus berupa bilangan bulat')
    .min(0, 'Stok unit tidak boleh negatif')
    .default(1),
  description: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productSchema>;

// ==========================================
// 4. SKEMA VALIDASI MASTER PEMASOK (SUPPLIERS)
// Pola Kode: SUP001
// ==========================================
export const supplierSchema = z.object({
  supplierCode: z
    .string()
    .regex(/^SUP\d{3,}$/, 'Format kode pemasok harus SUP diikuti 3 digit angka (contoh: SUP001)')
    .optional(),
  supplierName: z.string().min(3, 'Nama pemasok minimal 3 karakter').max(150),
  contactPerson: z.string().max(120).optional().nullable(),
  phone: z.string().min(5, 'Nomor telepon minimal 5 digit').max(30),
  email: z
    .string()
    .email('Format email tidak valid')
    .optional()
    .nullable()
    .or(z.literal('')),
  address: z.string().optional().nullable(),
  categorySupplied: z.string().max(100).optional().nullable(),
  isActive: z.boolean().default(true),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;

// ==========================================
// 5. SKEMA VALIDASI MASTER PELANGGAN (CUSTOMERS)
// Pola Kode: CUS001
// ==========================================
export const customerSchema = z.object({
  customerCode: z
    .string()
    .regex(/^CUS\d{3,}$/, 'Format kode pelanggan harus CUS diikuti 3 digit angka (contoh: CUS001)')
    .optional(),
  customerName: z.string().min(3, 'Nama pelanggan minimal 3 karakter').max(150),
  customerType: z.string().min(2, 'Kategori pelanggan wajib diisi').max(60),
  contactPerson: z.string().max(120).optional().nullable(),
  phone: z.string().min(5, 'Nomor telepon minimal 5 digit').max(30),
  email: z
    .string()
    .email('Format email tidak valid')
    .optional()
    .nullable()
    .or(z.literal('')),
  address: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
