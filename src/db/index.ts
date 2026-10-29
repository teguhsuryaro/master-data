import * as dotenv from 'dotenv';
dotenv.config();

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || '';

if (!connectionString) {
  console.warn('⚠️ Peringatan: DATABASE_URL belum terdefinisi di environment variables!');
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
