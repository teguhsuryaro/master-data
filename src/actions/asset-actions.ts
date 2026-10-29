'use server';

// Legacy stub: Dalam revisi v3.0, inventaris & nilai aset peralatan telah digabung ke Produk / Barang (/produk)
export async function getAssetsWithDepreciationAction() {
  return [];
}

export async function createAssetAction() {
  return { success: false, message: 'Modul aset telah digabung ke master Produk/Barang.' };
}

export async function updateAssetAction() {
  return { success: false, message: 'Modul aset telah digabung ke master Produk/Barang.' };
}

export async function toggleAssetActiveAction() {
  return { success: false, message: 'Modul aset telah digabung ke master Produk/Barang.' };
}
