/**
 * Formatter utilitas akuntansi untuk format Rupiah, tanggal lokal, dan kalkulasi penyusutan.
 */

export function formatRupiah(amount: number | bigint | null | undefined): string {
  if (amount === null || amount === undefined) return 'Rp 0';
  const numeric = typeof amount === 'bigint' ? Number(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numeric);
}

export function formatIndonesianDate(
  dateInput: string | Date | null | undefined,
  includeTime: boolean = false
): string {
  if (!dateInput) return '-';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '-';

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(includeTime
      ? { hour: '2-digit', minute: '2-digit', hour12: false }
      : {}),
  };

  return new Intl.DateTimeFormat('id-ID', options).format(date);
}

export interface DepreciationCalculation {
  acquisitionCost: number;
  salvageValue: number;
  usefulLifeMonths: number;
  depreciableAmount: number;
  monthlyDepreciation: number;
  monthsPassed: number;
  accumulatedDepreciation: number;
  estimatedBookValue: number;
  isFullyDepreciated: boolean;
}

/**
 * Menghitung estimasi penyusutan garis lurus (Straight-Line Depreciation)
 * Sesuai Bagian 1.3 Dokumen Spesifikasi 01
 */
export function calculateDepreciation(
  acquisitionCost: number,
  salvageValue: number,
  usefulLifeMonths: number,
  acquisitionDate: string | Date
): DepreciationCalculation {
  const safeCost = Math.max(0, acquisitionCost);
  const safeSalvage = Math.max(0, salvageValue);
  const safeLife = Math.max(1, usefulLifeMonths);
  const depreciableAmount = Math.max(0, safeCost - safeSalvage);
  const monthlyDepreciation = Math.round(depreciableAmount / safeLife);

  const acqDate = typeof acquisitionDate === 'string' ? new Date(acquisitionDate) : acquisitionDate;
  const now = new Date();

  // Hitung selisih bulan
  let monthsPassed = 0;
  if (!isNaN(acqDate.getTime())) {
    monthsPassed =
      (now.getFullYear() - acqDate.getFullYear()) * 12 +
      (now.getMonth() - acqDate.getMonth());
    if (monthsPassed < 0) monthsPassed = 0;
  }

  // Akumulasi penyusutan tidak boleh melebihi depreciable amount
  const effectiveMonths = Math.min(monthsPassed, safeLife);
  const accumulatedDepreciation = Math.min(
    depreciableAmount,
    effectiveMonths * monthlyDepreciation
  );
  const estimatedBookValue = Math.max(safeSalvage, safeCost - accumulatedDepreciation);
  const isFullyDepreciated = effectiveMonths >= safeLife;

  return {
    acquisitionCost: safeCost,
    salvageValue: safeSalvage,
    usefulLifeMonths: safeLife,
    depreciableAmount,
    monthlyDepreciation,
    monthsPassed,
    accumulatedDepreciation,
    estimatedBookValue,
    isFullyDepreciated,
  };
}
