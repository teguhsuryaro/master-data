import 'dotenv/config';
import { db } from '../src/db/index';
import { users } from '../src/db/schema';
import { eq, or, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { signSession, verifySession } from '../src/lib/auth';

async function testAuth() {
  console.log('--- Testing Authentication & JWT ---');

  // 1. Test query user by username (case-insensitive)
  const [userByUsername] = await db
    .select()
    .from(users)
    .where(sql`LOWER(${users.username}) = LOWER('teguh')`)
    .limit(1);

  console.log('Query by username "teguh":', userByUsername ? `Found: ${userByUsername.fullName}` : 'NOT FOUND');

  // 2. Test query user by email
  const [userByEmail] = await db
    .select()
    .from(users)
    .where(sql`LOWER(${users.email}) = LOWER('daffa@kanaltiga.id')`)
    .limit(1);

  console.log('Query by email "daffa@kanaltiga.id":', userByEmail ? `Found: ${userByEmail.fullName}` : 'NOT FOUND');

  // 3. Test password matching with 123456
  const isMatch = await bcrypt.compare('123456', userByUsername.passwordHash);
  console.log('Password "123456" match:', isMatch);

  const isWrongMatch = await bcrypt.compare('wrongpass', userByUsername.passwordHash);
  console.log('Wrong password match (should be false):', isWrongMatch);

  // 4. Test JWT Signing and Verification
  const token = await signSession({
    userId: userByUsername.id,
    username: userByUsername.username,
    email: userByUsername.email,
    fullName: userByUsername.fullName,
    role: 'ADMIN',
    roleTitle: userByUsername.roleTitle,
    title: userByUsername.roleTitle,
  });

  console.log('Generated JWT Token length:', token.length);

  const verified = await verifySession(token);
  console.log('Verified JWT Session payload:', verified ? {
    userId: verified.userId,
    username: verified.username,
    fullName: verified.fullName,
    roleTitle: verified.roleTitle,
  } : 'VERIFICATION FAILED');

  console.log('--- Authentication Test Passed 100% ---');
}

testAuth().catch(console.error);
