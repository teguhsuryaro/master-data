import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }
  const sql = neon(process.env.DATABASE_URL);
  console.log('Resetting database tables to allow clean schema push...');
  
  // Drop all old/legacy tables with CASCADE
  await sql`
    DROP TABLE IF EXISTS 
      products, 
      accounts, 
      suppliers, 
      customers, 
      users, 
      code_sequences, 
      units, 
      assets, 
      product_categories 
    CASCADE;
  `;
  
  // Drop legacy custom types if they exist
  const legacyEnums = [
    'account_group',
    'asset_condition',
    'asset_status',
    'customer_type',
    'normal_balance',
    'rental_unit',
    'supplier_type',
    'user_role'
  ];

  for (const enumName of legacyEnums) {
    try {
      await sql(`DROP TYPE IF EXISTS "${enumName}" CASCADE;`);
    } catch (e) {
      // ignore
    }
  }

  console.log('Database tables and legacy types cleared cleanly.');
}

main().catch(console.error);
