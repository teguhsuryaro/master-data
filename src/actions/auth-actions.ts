'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, or, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import {
  signSession,
  setSessionCookie,
  deleteSessionCookie,
  getCurrentUser,
  SessionPayload,
} from '@/lib/auth';
import { redirect } from 'next/navigation';

export interface AuthActionResult {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Login dengan username atau email dan kata sandi
 * Mendukung username (teguh, daffa, fawwaz, awal, devin) ATAU email (teguh@kanaltiga.id, dll.)
 */
export async function loginAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const identifier = formData.get('identifier')?.toString().trim();
  const password = formData.get('password')?.toString();

  if (!identifier || !password) {
    return {
      success: false,
      message: 'Username / Email dan Kata Sandi wajib diisi.',
    };
  }

  try {
    const lowerIdentifier = identifier.toLowerCase();

    // Cari user berdasarkan username (case-insensitive) atau email (case-insensitive)
    const matchedUsers = await db
      .select()
      .from(users)
      .where(
        or(
          sql`LOWER(${users.username}) = ${lowerIdentifier}`,
          sql`LOWER(${users.email}) = ${lowerIdentifier}`
        )
      )
      .limit(1);

    if (!matchedUsers || matchedUsers.length === 0) {
      return {
        success: false,
        message: 'Username atau Email tidak terdaftar dalam sistem.',
      };
    }

    const foundUser = matchedUsers[0];

    if (!foundUser.isActive) {
      return {
        success: false,
        message: 'Akun Anda sedang dinonaktifkan oleh administrator.',
      };
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      foundUser.passwordHash
    );

    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Kata sandi yang Anda masukkan salah.',
      };
    }

    const sessionPayload: SessionPayload = {
      userId: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      fullName: foundUser.fullName,
      role: 'ADMIN',
      roleTitle: foundUser.roleTitle,
      title: foundUser.roleTitle,
    };

    const token = await signSession(sessionPayload);
    await setSessionCookie(token);
  } catch (err: any) {
    if (err?.message?.includes('NEXT_REDIRECT')) {
      throw err;
    }
    console.error('Login error:', err);
    return {
      success: false,
      message: 'Terjadi kesalahan sistem saat memproses login. Silakan coba lagi.',
    };
  }

  redirect('/');
}

/**
 * Logout pengguna dengan menghapus cookie sesi
 */
export async function logoutAction(): Promise<void> {
  await deleteSessionCookie();
  redirect('/login');
}

/**
 * Dapatkan user sesi aktif saat ini
 */
export async function getActiveSession(): Promise<SessionPayload | null> {
  return getCurrentUser();
}
