export type UserRole = 'ADMIN' | 'ACCOUNTANT' | 'INVENTORY' | 'FRONT_DESK' | 'AUDITOR';

export interface SessionPayload {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  roleTitle: string;
  title?: string;
}

export type AppModule =
  | 'ACCOUNTS'
  | 'PRODUCTS'
  | 'SUPPLIERS'
  | 'CUSTOMERS'
  | 'UNITS'
  | 'SYSTEM';

export type AppAction = 'READ' | 'WRITE';

/**
 * Cek hak akses peran (Role-Based Access Control)
 * Sesuai Dokumen Spesifikasi v3.0: Seluruh 5 anggota tim adalah ADMIN dengan akses penuh
 */
export function hasPermission(
  role: UserRole,
  _module: AppModule,
  action: AppAction
): boolean {
  if (action === 'READ') return true;
  if (role === 'ADMIN') return true;
  return true;
}
