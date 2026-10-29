import 'dotenv/config';
import { db } from '../src/db/index';
import { users, accounts, units, products, suppliers, customers, codeSequences } from '../src/db/schema';
import { count } from 'drizzle-orm';

async function main() {
  const [usersCount] = await db.select({ value: count() }).from(users);
  const [unitsCount] = await db.select({ value: count() }).from(units);
  const [accountsCount] = await db.select({ value: count() }).from(accounts);
  const [productsCount] = await db.select({ value: count() }).from(products);
  const [suppliersCount] = await db.select({ value: count() }).from(suppliers);
  const [customersCount] = await db.select({ value: count() }).from(customers);
  const [seqCount] = await db.select({ value: count() }).from(codeSequences);

  console.log('--- DB Verification ---');
  console.log('Users count:', usersCount.value);
  console.log('Units count:', unitsCount.value);
  console.log('Accounts count:', accountsCount.value);
  console.log('Products count:', productsCount.value);
  console.log('Suppliers count:', suppliersCount.value);
  console.log('Customers count:', customersCount.value);
  console.log('Sequences count:', seqCount.value);

  // Check code generator test
  const testSeq = await db.select().from(codeSequences);
  console.log('Sequences:', testSeq);
}

main().catch(console.error);
