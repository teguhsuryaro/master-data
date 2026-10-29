'use server';

import { db } from '@/db';
import { accounts } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { accountSchema } from '@/lib/validations';
import { getAutoNormalBalance } from '@/lib/code-generator';
import { revalidatePath } from 'next/cache';

export async function getAccountsAction() {
  const allAccounts = await db
    .select()
    .from(accounts)
    .orderBy(asc(accounts.accountCode));

  return allAccounts;
}

export async function createAccountAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Silakan login terlebih dahulu.' };
  }

  const accountType = formData.get('accountType')?.toString().trim() || 'Aset Lancar';
  const accountName = formData.get('accountName')?.toString().trim() || '';
  const userNormalBalance = formData.get('normalBalance')?.toString().trim();
  const normalBalance = userNormalBalance === 'Debit' || userNormalBalance === 'Kredit'
    ? userNormalBalance
    : getAutoNormalBalance(accountType, accountName);

  const rawData = {
    accountCode: formData.get('accountCode')?.toString().trim() || '',
    accountName,
    accountType,
    normalBalance,
    // Sesuai kaidah baku materi Pengantar Akuntansi Slide 1-3, Saldo Awal di Master Data selalu bernilai 0
    initialBalance: 0,
    description: formData.get('description')?.toString().trim() || null,
    isActive: true,
  };

  const parseResult = accountSchema.safeParse(rawData);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.errors.map((e) => e.message).join(', ');
    return { success: false, message: errorMsg };
  }

  // Cek duplikasi kode akun
  const existing = await db
    .select({ code: accounts.accountCode })
    .from(accounts)
    .where(eq(accounts.accountCode, parseResult.data.accountCode))
    .limit(1);

  if (existing.length > 0) {
    return {
      success: false,
      message: `Kode akun ${parseResult.data.accountCode} sudah terdaftar di sistem.`,
    };
  }

  try {
    await db.insert(accounts).values({
      accountCode: parseResult.data.accountCode,
      accountName: parseResult.data.accountName,
      accountType: parseResult.data.accountType,
      normalBalance: parseResult.data.normalBalance,
      initialBalance: parseResult.data.initialBalance,
      description: parseResult.data.description,
      isActive: true,
    });

    revalidatePath('/akun');
    revalidatePath('/accounts');
    revalidatePath('/');

    return {
      success: true,
      message: `Akun ${parseResult.data.accountCode} (${parseResult.data.accountName}) berhasil disimpan.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Gagal menyimpan akun akuntansi.',
    };
  }
}

export async function updateAccountAction(id: number, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Silakan login terlebih dahulu.' };
  }

  const accountName = formData.get('accountName')?.toString().trim() || '';
  const accountType = formData.get('accountType')?.toString().trim() || 'Aset Lancar';
  const userNormalBalance = formData.get('normalBalance')?.toString().trim();
  const normalBalance = userNormalBalance === 'Debit' || userNormalBalance === 'Kredit'
    ? userNormalBalance
    : getAutoNormalBalance(accountType, accountName);

  const rawData = {
    accountCode: formData.get('accountCode')?.toString().trim() || '1-01-01',
    accountName,
    accountType,
    normalBalance,
    // Sesuai kaidah baku materi Pengantar Akuntansi Slide 1-3, Saldo Awal di Master Data selalu bernilai 0
    initialBalance: 0,
    description: formData.get('description')?.toString().trim() || null,
    isActive: true,
  };

  const parseResult = accountSchema.safeParse(rawData);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.errors.map((e) => e.message).join(', ');
    return { success: false, message: errorMsg };
  }

  try {
    await db
      .update(accounts)
      .set({
        accountName: parseResult.data.accountName,
        accountType: parseResult.data.accountType,
        normalBalance: parseResult.data.normalBalance,
        initialBalance: parseResult.data.initialBalance,
        description: parseResult.data.description,
        updatedAt: new Date(),
      })
      .where(eq(accounts.id, id));

    revalidatePath('/akun');
    revalidatePath('/accounts');
    revalidatePath('/');

    return {
      success: true,
      message: 'Data akun akuntansi berhasil diperbarui.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Gagal memperbarui akun akuntansi.',
    };
  }
}

export async function toggleAccountStatusAction(id: number) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Silakan login terlebih dahulu.' };
  }

  const [existing] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.id, id))
    .limit(1);

  if (!existing) {
    return { success: false, message: 'Data akun tidak ditemukan.' };
  }

  try {
    const newStatus = !existing.isActive;
    await db
      .update(accounts)
      .set({
        isActive: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(accounts.id, id));

    revalidatePath('/akun');
    revalidatePath('/accounts');
    revalidatePath('/');

    return {
      success: true,
      message: `Akun ${existing.accountCode} (${existing.accountName}) berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Gagal mengubah status akun.',
    };
  }
}
