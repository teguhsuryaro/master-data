'use server';

import { db } from '@/db';
import { suppliers, codeSequences } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { supplierSchema } from '@/lib/validations';
import { getNextSupplierCode } from '@/lib/code-generator';
import { revalidatePath } from 'next/cache';

export async function getSuppliersWithStatsAction() {
  const allSuppliers = await db
    .select()
    .from(suppliers)
    .orderBy(asc(suppliers.supplierCode));

  return allSuppliers;
}

export async function createSupplierAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Silakan login terlebih dahulu.' };
  }

  let supplierCode = formData.get('supplierCode')?.toString().trim();
  if (!supplierCode) {
    supplierCode = await getNextSupplierCode();
  }

  const rawData = {
    supplierCode,
    supplierName: formData.get('supplierName')?.toString().trim() || '',
    contactPerson: formData.get('contactPerson')?.toString().trim() || null,
    phone: formData.get('phone')?.toString().trim() || '',
    email: formData.get('email')?.toString().trim() || null,
    address: formData.get('address')?.toString().trim() || null,
    categorySupplied: formData.get('categorySupplied')?.toString().trim() || null,
    isActive: true,
  };

  const parseResult = supplierSchema.safeParse(rawData);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.errors.map((e) => e.message).join(', ');
    return { success: false, message: errorMsg };
  }

  // Cek duplikasi kode pemasok
  const existing = await db
    .select({ code: suppliers.supplierCode })
    .from(suppliers)
    .where(eq(suppliers.supplierCode, parseResult.data.supplierCode!))
    .limit(1);

  if (existing.length > 0) {
    return {
      success: false,
      message: `Kode pemasok ${parseResult.data.supplierCode} sudah terdaftar di sistem.`,
    };
  }

  try {
    await db.insert(suppliers).values({
      supplierCode: parseResult.data.supplierCode!,
      supplierName: parseResult.data.supplierName,
      contactPerson: parseResult.data.contactPerson,
      phone: parseResult.data.phone,
      email: parseResult.data.email,
      address: parseResult.data.address,
      categorySupplied: parseResult.data.categorySupplied,
      isActive: true,
    });

    // Update sequence
    const numPart = parseInt(parseResult.data.supplierCode!.replace('SUP', ''), 10);
    if (!isNaN(numPart)) {
      await db
        .insert(codeSequences)
        .values({ prefixKey: 'SUP', currentValue: numPart })
        .onConflictDoUpdate({
          target: codeSequences.prefixKey,
          set: {
            currentValue: numPart,
            updatedAt: new Date(),
          },
        });
    }

    revalidatePath('/pemasok');
    revalidatePath('/suppliers');
    revalidatePath('/');

    return {
      success: true,
      message: `Pemasok ${parseResult.data.supplierCode} (${parseResult.data.supplierName}) berhasil disimpan.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Gagal menyimpan pemasok.',
    };
  }
}

export async function updateSupplierAction(idOrCode: number | string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Silakan login terlebih dahulu.' };
  }

  const rawData = {
    supplierName: formData.get('supplierName')?.toString().trim() || '',
    contactPerson: formData.get('contactPerson')?.toString().trim() || null,
    phone: formData.get('phone')?.toString().trim() || '',
    email: formData.get('email')?.toString().trim() || null,
    address: formData.get('address')?.toString().trim() || null,
    categorySupplied: formData.get('categorySupplied')?.toString().trim() || null,
    isActive: true,
  };

  const parseResult = supplierSchema.safeParse(rawData);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.errors.map((e) => e.message).join(', ');
    return { success: false, message: errorMsg };
  }

  try {
    const condition = typeof idOrCode === 'number'
      ? eq(suppliers.id, idOrCode)
      : eq(suppliers.supplierCode, idOrCode);

    await db
      .update(suppliers)
      .set({
        supplierName: parseResult.data.supplierName,
        contactPerson: parseResult.data.contactPerson,
        phone: parseResult.data.phone,
        email: parseResult.data.email,
        address: parseResult.data.address,
        categorySupplied: parseResult.data.categorySupplied,
        updatedAt: new Date(),
      })
      .where(condition);

    revalidatePath('/pemasok');
    revalidatePath('/suppliers');
    revalidatePath('/');

    return {
      success: true,
      message: 'Data pemasok berhasil diperbarui.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Gagal memperbarui data pemasok.',
    };
  }
}

export async function toggleSupplierStatusAction(idOrCode: number | string) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Silakan login terlebih dahulu.' };
  }

  const condition = typeof idOrCode === 'number'
    ? eq(suppliers.id, idOrCode)
    : eq(suppliers.supplierCode, idOrCode);

  const [existing] = await db
    .select()
    .from(suppliers)
    .where(condition)
    .limit(1);

  if (!existing) {
    return { success: false, message: 'Data pemasok tidak ditemukan.' };
  }

  try {
    const newStatus = !existing.isActive;
    await db
      .update(suppliers)
      .set({
        isActive: newStatus,
        updatedAt: new Date(),
      })
      .where(condition);

    revalidatePath('/pemasok');
    revalidatePath('/suppliers');
    revalidatePath('/');

    return {
      success: true,
      message: `Pemasok ${existing.supplierCode} (${existing.supplierName}) berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Gagal mengubah status pemasok.',
    };
  }
}

// Aliases for compatibility
export const toggleSupplierActiveAction = toggleSupplierStatusAction;
export const previewSupplierCodeAction = getNextSupplierCode;

