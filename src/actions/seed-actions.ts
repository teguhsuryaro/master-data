'use server';

import { getCurrentUser } from '@/lib/auth';
import { runSeed } from '@/db/seed';
import { revalidatePath } from 'next/cache';

export async function resetDemoDataAction(): Promise<{ success: boolean; message: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return {
      success: false,
      message: 'Hanya peran ADMINISTRATOR yang berhak mereset master data.',
    };
  }

  try {
    await runSeed();
    revalidatePath('/', 'layout');
    return {
      success: true,
      message: 'Seluruh master data awal berhasil direset dan disinkronkan kembali!',
    };
  } catch (error) {
    return {
      success: false,
      message: `Gagal mereset data: ${error instanceof Error ? error.message : 'Kesalahan internal'}`,
    };
  }
}
