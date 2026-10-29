import React from 'react';
import { getSuppliersWithStatsAction } from '@/actions/supplier-actions';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SuppliersClient } from './SuppliersClient';

export const metadata = {
  title: 'Mitra Pemasok (Suppliers) — Kanal Tiga',
  description: 'Daftar vendor penyedia peralatan dan jasa servis rekanan Kanal Tiga Purwokerto.',
};

export default async function SuppliersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const suppliers = await getSuppliersWithStatsAction();

  return <SuppliersClient initialSuppliers={suppliers as any} currentUser={user} />;
}
