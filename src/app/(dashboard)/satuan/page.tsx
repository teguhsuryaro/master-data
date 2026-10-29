import React from 'react';
import { db } from '@/db';
import { units, products } from '@/db/schema';
import { asc, count, eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { UnitsClient } from './UnitsClient';

export const metadata = {
  title: 'Master Satuan Barang — Kanal Tiga',
  description: 'Master data satuan barang sewa (Unit, Set, Paket, Pcs, Roll) Kanal Tiga Purwokerto.',
};

export default async function UnitsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  // Ambil data units beserta hitungan jumlah produk yang menggunakan satuan tersebut
  const allUnits = await db
    .select()
    .from(units)
    .orderBy(asc(units.unitCode));

  // Ambil hitungan relasi produk per unit
  const productCounts = await db
    .select({
      unitCode: products.unitCode,
      count: count(),
    })
    .from(products)
    .groupBy(products.unitCode);

  const productCountMap = new Map<string, number>();
  for (const pc of productCounts) {
    productCountMap.set(pc.unitCode, Number(pc.count));
  }

  const enrichedUnits = allUnits.map((u) => ({
    ...u,
    productCount: productCountMap.get(u.unitCode) || 0,
  }));

  return <UnitsClient user={user} initialUnits={enrichedUnits} />;
}
