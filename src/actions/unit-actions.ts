'use server';

import { db } from '@/db';
import { units, products } from '@/db/schema';
import { eq, asc, count } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { unitSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function getUnitsAction() {
  const allUnits = await db.select().from(units).orderBy(asc(units.unitCode));

  const productCounts = await db
    .select({
      unitCode: products.unitCode,
      count: count(),
    })
    .from(products)
    .where(eq(products.isActive, true))
    .groupBy(products.unitCode);

  const productCountMap = new Map<string, number>();
  for (const pc of productCounts) {
    productCountMap.set(pc.unitCode, Number(pc.count));
  }

  return allUnits.map((u) => ({
    ...u,
    productCount: productCountMap.get(u.unitCode) || 0,
  }));
}

export async function createUnitAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Silakan login terlebih dahulu.' };
  }

  const rawData = {
    unitCode: formData.get('unitCode')?.toString().trim().toUpperCase() || '',
    unitName: formData.get('unitName')?.toString().trim() || '',
    description: formData.get('description')?.toString().trim() || null,
    isActive: true,
  };

  const parseResult = unitSchema.safeParse(rawData);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.errors.map((e) => e.message).join(', ');
    return { success: false, message: errorMsg };
  }

  // Cek duplikasi kode satuan
  const existing = await db
    .select({ code: units.unitCode })
    .from(units)
    .where(eq(units.unitCode, parseResult.data.unitCode))
    .limit(1);

  if (existing.length > 0) {
    return {
      success: false,
      message: `Kode satuan ${parseResult.data.unitCode} sudah terdaftar di sistem.`,
    };
  }

  try {
    await db.insert(units).values({
      unitCode: parseResult.data.unitCode,
      unitName: parseResult.data.unitName,
      description: parseResult.data.description,
      isActive: true,
    });

    revalidatePath('/satuan');
    revalidatePath('/units');
    revalidatePath('/produk');
    revalidatePath('/products');
    revalidatePath('/');

    return {
      success: true,
      message: `Satuan ${parseResult.data.unitCode} berhasil ditambahkan.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Gagal menyimpan satuan.',
    };
  }
}

export async function updateUnitAction(id: number, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Silakan login terlebih dahulu.' };
  }

  const unitName = formData.get('unitName')?.toString().trim();
  const description = formData.get('description')?.toString().trim() || null;

  if (!unitName || unitName.length < 2) {
    return { success: false, message: 'Nama satuan minimal 2 karakter.' };
  }

  try {
    await db
      .update(units)
      .set({
        unitName,
        description,
      })
      .where(eq(units.id, id));

    revalidatePath('/satuan');
    revalidatePath('/units');
    revalidatePath('/produk');
    revalidatePath('/products');
    revalidatePath('/');

    return { success: true, message: 'Data satuan berhasil diperbarui.' };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Gagal memperbarui satuan.',
    };
  }
}

export async function toggleUnitStatusAction(id: number) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Silakan login terlebih dahulu.' };
  }

  const [existingUnit] = await db
    .select()
    .from(units)
    .where(eq(units.id, id))
    .limit(1);

  if (!existingUnit) {
    return { success: false, message: 'Data satuan tidak ditemukan.' };
  }

  // Proteksi: Jika akan menonaktifkan, pastikan tidak ada produk aktif yang memakai satuan ini
  if (existingUnit.isActive) {
    const [usage] = await db
      .select({ val: count() })
      .from(products)
      .where(eq(products.unitCode, existingUnit.unitCode));

    const usageCount = Number(usage?.val || 0);
    if (usageCount > 0) {
      return {
        success: false,
        message: `Satuan ${existingUnit.unitCode} tidak dapat dinonaktifkan karena sedang digunakan oleh ${usageCount} barang sewa. Ganti satuan barang terlebih dahulu.`,
      };
    }
  }

  try {
    const newStatus = !existingUnit.isActive;
    await db
      .update(units)
      .set({ isActive: newStatus })
      .where(eq(units.id, id));

    revalidatePath('/satuan');
    revalidatePath('/units');
    revalidatePath('/produk');
    revalidatePath('/products');
    revalidatePath('/');

    return {
      success: true,
      message: `Satuan ${existingUnit.unitCode} berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Gagal mengubah status satuan.',
    };
  }
}
