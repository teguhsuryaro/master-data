import React from 'react';
import { getAccountsAction } from '@/actions/account-actions';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AccountsClient } from './AccountsClient';

export const metadata = {
  title: 'Master Bagan Akun (COA) — Kanal Tiga',
  description: 'Pengelolaan Bagan Akun (Chart of Accounts) Kanal Tiga Rental Elektronik Purwokerto.',
};

export default async function AccountsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const accounts = await getAccountsAction();

  return <AccountsClient initialAccounts={accounts as any} currentUser={user} />;
}
