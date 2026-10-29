import React from 'react';
import { getProductsAction } from '@/actions/product-actions';
import { db } from '@/db';
import { units } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ProductsClient } from './ProductsClient';

export const metadata = {
  title: 'Master Produk / Barang Rental — Kanal Tiga',
  description: 'Daftar produk dan inventaris sewa peralatan elektronik Kanal Tiga Rental Purwokerto.',
};

export default async function ProductsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const [productsData, activeUnits] = await Promise.all([
    getProductsAction(),
    db
      .select({
        unitCode: units.unitCode,
        unitName: units.unitName,
      })
      .from(units)
      .where(eq(units.isActive, true))
      .orderBy(asc(units.unitCode)),
  ]);

  return (
    <ProductsClient
      currentUser={user}
      initialProducts={productsData as any}
      availableUnits={activeUnits}
    />
  );
}
