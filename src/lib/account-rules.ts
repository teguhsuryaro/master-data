/**
 * Helper untuk menentukan saldo normal otomatis berdasarkan Tipe Akun & Nama Akun.
 * Pure logic tanpa database atau server dependencies (100% aman di-import oleh Client Component).
 */
export function getAutoNormalBalance(
  accountType: string,
  accountName: string = ''
): 'Debit' | 'Kredit' {
  const lowerName = accountName.toLowerCase();

  // Akun Kontra khusus
  if (lowerName.includes('akumulasi penyusutan')) {
    return 'Kredit';
  }
  if (lowerName.includes('prive')) {
    return 'Debit';
  }

  switch (accountType) {
    case 'Aset Lancar':
    case 'Aset Tetap':
    case 'Beban':
      return 'Debit';
    case 'Liabilitas':
    case 'Ekuitas':
    case 'Pendapatan':
      return 'Kredit';
    default:
      return 'Debit';
  }
}

export const computeNormalBalance = getAutoNormalBalance;
