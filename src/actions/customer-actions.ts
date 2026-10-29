'use server';

import { db } from '@/db';
import { customers, codeSequences } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { customerSchema } from '@/lib/validations';
import { getNextCustomerCode } from '@/lib/code-generator';
import { revalidatePath } from 'next/cache';

export async function getCustomersAction() {
  return db.select().from(customers).orderBy(asc(customers.customerCode));
}

export async function createCustomerAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Silakan login terlebih dahulu.' };
  }

  let customerCode = formData.get('customerCode')?.toString().trim();
  if (!customerCode) {
    customerCode = await getNextCustomerCode();
  }

  const rawData = {
    customerCode,
    customerName: formData.get('customerName')?.toString().trim() || '',
    customerType: formData.get('customerType')?.toString().trim() || 'Organisasi Kampus',
    contactPerson: formData.get('contactPerson')?.toString().trim() || null,
    phone: formData.get('phone')?.toString().trim() || '',
    email: formData.get('email')?.toString().trim() || null,
    address: formData.get('address')?.toString().trim() || null,
    isActive: true,
  };

  const parseResult = customerSchema.safeParse(rawData);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.errors.map((e) => e.message).join(', ');
    return { success: false, message: errorMsg };
  }

  // Cek duplikasi kode pelanggan
  const existing = await db
    .select({ code: customers.customerCode })
    .from(customers)
    .where(eq(customers.customerCode, parseResult.data.customerCode!))
    .limit(1);

  if (existing.length > 0) {
    return {
      success: false,
      message: `Kode pelanggan ${parseResult.data.customerCode} sudah terdaftar di sistem.`,
    };
  }

  try {
    await db.insert(customers).values({
      customerCode: parseResult.data.customerCode!,
      customerName: parseResult.data.customerName,
      customerType: parseResult.data.customerType,
      contactPerson: parseResult.data.contactPerson,
      phone: parseResult.data.phone,
      email: parseResult.data.email,
      address: parseResult.data.address,
      isActive: true,
    });

    // Update sequence
    const numPart = parseInt(parseResult.data.customerCode!.replace('CUS', ''), 10);
    if (!isNaN(numPart)) {
      await db
        .insert(codeSequences)
        .values({ prefixKey: 'CUS', currentValue: numPart })
        .onConflictDoUpdate({
          target: codeSequences.prefixKey,
          set: {
            currentValue: numPart,
            updatedAt: new Date(),
          },
        });
    }

    revalidatePath('/pelanggan');
    revalidatePath('/customers');
    revalidatePath('/');

    return {
      success: true,
      message: `Pelanggan ${parseResult.data.customerCode} (${parseResult.data.customerName}) berhasil disimpan.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Gagal menyimpan pelanggan.',
    };
  }
}

export async function updateCustomerAction(idOrCode: number | string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Silakan login terlebih dahulu.' };
  }

  const rawData = {
    customerName: formData.get('customerName')?.toString().trim() || '',
    customerType: formData.get('customerType')?.toString().trim() || 'Organisasi Kampus',
    contactPerson: formData.get('contactPerson')?.toString().trim() || null,
    phone: formData.get('phone')?.toString().trim() || '',
    email: formData.get('email')?.toString().trim() || null,
    address: formData.get('address')?.toString().trim() || null,
    isActive: true,
  };

  const parseResult = customerSchema.safeParse(rawData);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.errors.map((e) => e.message).join(', ');
    return { success: false, message: errorMsg };
  }

  try {
    const condition = typeof idOrCode === 'number'
      ? eq(customers.id, idOrCode)
      : eq(customers.customerCode, idOrCode);

    await db
      .update(customers)
      .set({
        customerName: parseResult.data.customerName,
        customerType: parseResult.data.customerType,
        contactPerson: parseResult.data.contactPerson,
        phone: parseResult.data.phone,
        email: parseResult.data.email,
        address: parseResult.data.address,
        updatedAt: new Date(),
      })
      .where(condition);

    revalidatePath('/pelanggan');
    revalidatePath('/customers');
    revalidatePath('/');

    return {
      success: true,
      message: 'Data pelanggan berhasil diperbarui.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Gagal memperbarui pelanggan.',
    };
  }
}

export async function toggleCustomerStatusAction(idOrCode: number | string) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Silakan login terlebih dahulu.' };
  }

  const condition = typeof idOrCode === 'number'
    ? eq(customers.id, idOrCode)
    : eq(customers.customerCode, idOrCode);

  const [existing] = await db
    .select()
    .from(customers)
    .where(condition)
    .limit(1);

  if (!existing) {
    return { success: false, message: 'Data pelanggan tidak ditemukan.' };
  }

  try {
    const newStatus = !existing.isActive;
    await db
      .update(customers)
      .set({
        isActive: newStatus,
        updatedAt: new Date(),
      })
      .where(condition);

    revalidatePath('/pelanggan');
    revalidatePath('/customers');
    revalidatePath('/');

    return {
      success: true,
      message: `Pelanggan ${existing.customerCode} (${existing.customerName}) berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Gagal mengubah status pelanggan.',
    };
  }
}

// Aliases for compatibility
export const toggleCustomerActiveAction = toggleCustomerStatusAction;
export const previewCustomerCodeAction = getNextCustomerCode;

