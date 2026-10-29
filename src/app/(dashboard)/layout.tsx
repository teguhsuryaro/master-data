import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AppShell, TabCounts } from '@/components/layout/AppShell';
import { ToastProvider } from '@/components/ui/Toast';
import { db } from '@/db';
import { accounts, products, suppliers, customers, units } from '@/db/schema';
import { count } from 'drizzle-orm';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Ambil live counts untuk badges di horizontal navigation bar
  let counts: TabCounts = {
    accounts: 20,
    products: 14,
    suppliers: 6,
    customers: 10,
    units: 6,
  };

  try {
    const [
      [accRes],
      [prodRes],
      [supRes],
      [cusRes],
      [unitRes],
    ] = await Promise.all([
      db.select({ val: count() }).from(accounts),
      db.select({ val: count() }).from(products),
      db.select({ val: count() }).from(suppliers),
      db.select({ val: count() }).from(customers),
      db.select({ val: count() }).from(units),
    ]);

    counts = {
      accounts: accRes?.val ?? 20,
      products: prodRes?.val ?? 14,
      suppliers: supRes?.val ?? 6,
      customers: cusRes?.val ?? 10,
      units: unitRes?.val ?? 6,
    };
  } catch (err) {
    console.error('Failed to query tab counts:', err);
  }

  return (
    <ToastProvider>
      <AppShell user={user} counts={counts}>
        {children}
      </AppShell>
    </ToastProvider>
  );
}
