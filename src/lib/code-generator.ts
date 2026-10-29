import { db } from '@/db';
import { products, suppliers, customers, codeSequences, accounts } from '@/db/schema';
import { desc, eq, like } from 'drizzle-orm';

/**
 * Mengekstrak angka tertinggi dari kode terakhir (misal 'BRG014' -> 14) lalu menambah 1 ('BRG015')
 */
function formatNextSequentialCode(
  lastCode: string | undefined,
  seqValue: number | undefined,
  prefix: string,
  digits = 3
): string {
  const numericPart = lastCode ? parseInt(lastCode.replace(prefix, ''), 10) : 0;
  const validTableNum = isNaN(numericPart) ? 0 : numericPart;
  const validSeqNum = seqValue || 0;
  const highest = Math.max(validTableNum, validSeqNum);
  const nextNumber = highest + 1;
  return `${prefix}${String(nextNumber).padStart(digits, '0')}`;
}

export async function getNextProductCode(): Promise<string> {
  const [last] = await db
    .select({ code: products.productCode })
    .from(products)
    .orderBy(desc(products.productCode))
    .limit(1);

  const [seq] = await db
    .select({ val: codeSequences.currentValue })
    .from(codeSequences)
    .where(eq(codeSequences.prefixKey, 'BRG'))
    .limit(1);

  return formatNextSequentialCode(last?.code, seq?.val, 'BRG', 3);
}

export async function getNextSupplierCode(): Promise<string> {
  const [last] = await db
    .select({ code: suppliers.supplierCode })
    .from(suppliers)
    .orderBy(desc(suppliers.supplierCode))
    .limit(1);

  const [seq] = await db
    .select({ val: codeSequences.currentValue })
    .from(codeSequences)
    .where(eq(codeSequences.prefixKey, 'SUP'))
    .limit(1);

  return formatNextSequentialCode(last?.code, seq?.val, 'SUP', 3);
}

export async function getNextCustomerCode(): Promise<string> {
  const [last] = await db
    .select({ code: customers.customerCode })
    .from(customers)
    .orderBy(desc(customers.customerCode))
    .limit(1);

  const [seq] = await db
    .select({ val: codeSequences.currentValue })
    .from(codeSequences)
    .where(eq(codeSequences.prefixKey, 'CUS'))
    .limit(1);

  return formatNextSequentialCode(last?.code, seq?.val, 'CUS', 3);
}

/**
 * Helper untuk memberikan saran kode akun berikutnya berdasarkan Tipe Akun (Format X-YY-ZZ)
 */
export async function getNextAccountCodeSuggestion(accountType: string): Promise<string> {
  let prefix = '1-01';
  switch (accountType) {
    case 'Aset Lancar':
      prefix = '1-01';
      break;
    case 'Aset Tetap':
      prefix = '1-20';
      break;
    case 'Liabilitas':
      prefix = '2-11';
      break;
    case 'Ekuitas':
      prefix = '3-11';
      break;
    case 'Pendapatan':
      prefix = '4-11';
      break;
    case 'Beban':
      prefix = '5-11';
      break;
    default:
      prefix = '1-01';
  }

  const existing = await db
    .select({ code: accounts.accountCode })
    .from(accounts)
    .where(like(accounts.accountCode, `${prefix}-%`))
    .orderBy(desc(accounts.accountCode))
    .limit(1);

  if (!existing || existing.length === 0 || !existing[0].code) {
    return `${prefix}-01`;
  }

  const parts = existing[0].code.split('-');
  const lastNumber = parseInt(parts[2], 10);
  const nextNumber = isNaN(lastNumber) ? 1 : lastNumber + 1;
  return `${prefix}-${String(nextNumber).padStart(2, '0')}`;
}

export { getAutoNormalBalance, computeNormalBalance } from '@/lib/account-rules';
export async function generateNextCode(type: 'product' | 'supplier' | 'customer'): Promise<string> {
  if (type === 'product') return getNextProductCode();
  if (type === 'supplier') return getNextSupplierCode();
  return getNextCustomerCode();
}
export const previewNextCode = generateNextCode;


