import { redirect } from 'next/navigation';

export default function LegacyAssetsPage() {
  // Dalam revisi v3.0, inventaris & nilai aset peralatan telah digabung ke Produk / Barang (/produk)
  redirect('/produk');
}
