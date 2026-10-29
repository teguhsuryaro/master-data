'use server';

import { db } from '@/db';
import { products, units, codeSequences } from '@/db/schema';
import { eq, asc, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { productSchema } from '@/lib/validations';
import { getNextProductCode } from '@/lib/code-generator';
import { revalidatePath } from 'next/cache';

export async function getProductsAction() {
  const allProducts = await db
    .select({
      id: products.id,
      productCode: products.productCode,
      productName: products.productName,
      category: products.category,
      unitCode: products.unitCode,
      unitName: units.unitName,
      purchasePrice: products.purchasePrice,
      rentalPrice: products.rentalPrice,
      stockQty: products.stockQty,
      description: products.description,
      isActive: products.isActive,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .leftJoin(units, eq(products.unitCode, units.unitCode))
    .orderBy(asc(products.productCode));

  return allProducts;
}

export async function createProductAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Silakan login terlebih dahulu.' };
  }

  let productCode = formData.get('productCode')?.toString().trim();
  if (!productCode) {
    productCode = await getNextProductCode();
  }

  const rawData = {
    productCode,
    productName: formData.get('productName')?.toString().trim() || '',
    category: formData.get('category')?.toString().trim() || '',
    unitCode: formData.get('unitCode')?.toString().trim() || 'UNIT',
    purchasePrice: Number(formData.get('purchasePrice') || 0),
    rentalPrice: Number(formData.get('rentalPrice') || 0),
    stockQty: Number(formData.get('stockQty') || 1),
    description: formData.get('description')?.toString().trim() || null,
    isActive: true,
  };

  const parseResult = productSchema.safeParse(rawData);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.errors.map((e) => e.message).join(', ');
    return { success: false, message: errorMsg };
  }

  // Cek duplikasi kode produk
  const existing = await db
    .select({ code: products.productCode })
    .from(products)
    .where(eq(products.productCode, parseResult.data.productCode!))
    .limit(1);

  if (existing.length > 0) {
    return {
      success: false,
      message: `Kode produk ${parseResult.data.productCode} sudah terdaftar di sistem.`,
    };
  }

  try {
    await db.insert(products).values({
      productCode: parseResult.data.productCode!,
      productName: parseResult.data.productName,
      category: parseResult.data.category,
      unitCode: parseResult.data.unitCode,
      purchasePrice: parseResult.data.purchasePrice,
      rentalPrice: parseResult.data.rentalPrice,
      stockQty: parseResult.data.stockQty,
      description: parseResult.data.description,
      isActive: true,
    });

    // Update sequence
    const numPart = parseInt(parseResult.data.productCode!.replace('BRG', ''), 10);
    if (!isNaN(numPart)) {
      await db
        .insert(codeSequences)
        .values({ prefixKey: 'BRG', currentValue: numPart })
        .onConflictDoUpdate({
          target: codeSequences.prefixKey,
          set: {
            currentValue: numPart,
            updatedAt: new Date(),
          },
        });
    }

    revalidatePath('/produk');
    revalidatePath('/products');
    revalidatePath('/satuan');
    revalidatePath('/units');
    revalidatePath('/');

    return {
      success: true,
      message: `Barang ${parseResult.data.productCode} (${parseResult.data.productName}) berhasil disimpan.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Gagal menyimpan barang.',
    };
  }
}

export async function updateProductAction(id: number, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Silakan login terlebih dahulu.' };
  }

  const rawData = {
    productName: formData.get('productName')?.toString().trim() || '',
    category: formData.get('category')?.toString().trim() || '',
    unitCode: formData.get('unitCode')?.toString().trim() || 'UNIT',
    purchasePrice: Number(formData.get('purchasePrice') || 0),
    rentalPrice: Number(formData.get('rentalPrice') || 0),
    stockQty: Number(formData.get('stockQty') || 1),
    description: formData.get('description')?.toString().trim() || null,
    isActive: true,
  };

  const parseResult = productSchema.safeParse(rawData);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.errors.map((e) => e.message).join(', ');
    return { success: false, message: errorMsg };
  }

  try {
    await db
      .update(products)
      .set({
        productName: parseResult.data.productName,
        category: parseResult.data.category,
        unitCode: parseResult.data.unitCode,
        purchasePrice: parseResult.data.purchasePrice,
        rentalPrice: parseResult.data.rentalPrice,
        stockQty: parseResult.data.stockQty,
        description: parseResult.data.description,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));

    revalidatePath('/produk');
    revalidatePath('/products');
    revalidatePath('/satuan');
    revalidatePath('/units');
    revalidatePath('/');

    return {
      success: true,
      message: 'Data produk / barang berhasil diperbarui.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Gagal memperbarui barang.',
    };
  }
}

export async function toggleProductStatusAction(id: number) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Silakan login terlebih dahulu.' };
  }

  const [existing] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!existing) {
    return { success: false, message: 'Data produk tidak ditemukan.' };
  }

  try {
    const newStatus = !existing.isActive;
    await db
      .update(products)
      .set({
        isActive: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));

    revalidatePath('/produk');
    revalidatePath('/products');
    revalidatePath('/satuan');
    revalidatePath('/units');
    revalidatePath('/');

    return {
      success: true,
      message: `Barang ${existing.productCode} (${existing.productName}) berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Gagal mengubah status barang.',
    };
  }
}
