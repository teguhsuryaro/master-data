import React from 'react';
import { getCustomersAction } from '@/actions/customer-actions';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CustomersClient } from './CustomersClient';

export const metadata = {
  title: 'Mitra Pelanggan (Customers) — Kanal Tiga',
  description: 'Daftar organisasi kampus dan pelanggan penyewa peralatan Kanal Tiga Purwokerto.',
};

export default async function CustomersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const customers = await getCustomersAction();

  return <CustomersClient initialCustomers={customers as any} currentUser={user} />;
}
