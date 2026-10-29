import React from 'react';
import { db } from '@/db';
import {
  accounts,
  products,
  suppliers,
  customers,
  units,
} from '@/db/schema';
import { eq, asc, count } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import {
  BookOpen,
  Package,
  Truck,
  Users2,
  Ruler,
  Scale,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  LayoutGrid,
  Link2,
} from 'lucide-react';
import Link from 'next/link';
import { DriveFolderCard, DriveSummaryCard } from '@/components/ui/DriveFolderCard';

export const metadata = {
  title: 'Ringkasan Master Data Akuntansi — SIAKUN Kanal Tiga',
  description: 'Ringkasan operasional dan ikhtisar master data akuntansi sesuai modul Pengantar Akuntansi.',
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // 1. Ambil data agregasi dari database secara paralel
  const [
    [accCount],
    [prodCount],
    [supCount],
    [cusCount],
    [unitCount],
    allProducts,
    allAccounts,
  ] = await Promise.all([
    db.select({ count: count() }).from(accounts).where(eq(accounts.isActive, true)),
    db.select({ count: count() }).from(products).where(eq(products.isActive, true)),
    db.select({ count: count() }).from(suppliers).where(eq(suppliers.isActive, true)),
    db.select({ count: count() }).from(customers).where(eq(customers.isActive, true)),
    db.select({ count: count() }).from(units).where(eq(units.isActive, true)),
    db.select().from(products).orderBy(asc(products.productCode)),
    db.select().from(accounts).orderBy(asc(accounts.accountCode)),
  ]);

  // Total unit barang yang siap disewakan
  const totalStockUnits = allProducts.reduce((acc, p) => acc + (p.stockQty || 0), 0);

  // Breakdown Akun berdasarkan 5 Kelompok Utama
  const groupStats = {
    aset: allAccounts.filter((a) => a.accountType.includes('Aset')).length,
    liabilitas: allAccounts.filter((a) => a.accountType === 'Liabilitas').length,
    ekuitas: allAccounts.filter((a) => a.accountType === 'Ekuitas').length,
    pendapatan: allAccounts.filter((a) => a.accountType === 'Pendapatan').length,
    beban: allAccounts.filter((a) => a.accountType === 'Beban').length,
  };

  // Helper warna kotak ikon tipe akun ala ALL FILES image.png
  const getAccountBoxStyle = (type: string) => {
    if (type.includes('Aset')) return 'bg-[#2563EB] text-white';
    if (type === 'Liabilitas') return 'bg-[#E11D48] text-white';
    if (type === 'Ekuitas') return 'bg-[#7C3AED] text-white';
    if (type === 'Pendapatan') return 'bg-[#059669] text-white';
    return 'bg-[#F79721] text-white';
  };

  return (
    <div className="space-y-8 pb-12">
      {/* TIER 1: Page Title Header Row (Adopt image.png "Design" + Orange Square Icon) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#111827] tracking-tight">
            Ringkasan Master Data
          </h1>
          <div className="w-9 h-9 rounded-xl bg-[#F79721] text-white flex items-center justify-center shadow-sm shadow-[#F79721]/25">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F5F7] text-[11px] font-bold text-[#6B7280]">
            <span>Halo, {user?.fullName || 'Admin'}</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#ECFDF5] text-[#059669] text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Kaidah Baku: Saldo Awal Rp 0</span>
          </span>
          <Link
            href="/akun"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F79721] hover:bg-[#E07F0B] text-white font-bold text-xs shadow-sm shadow-[#F79721]/25 transition-all"
          >
            <span>Buka Bagan Akun</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* TIER 2: QUICK ACCESS — Modul Utama (4 Kartu Folder seperti image.png) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] font-extrabold text-[#9CA3AF] uppercase tracking-[0.12em]">
            QUICK ACCESS — MODUL UTAMA MASTER DATA
          </h2>
          <span className="text-[11px] font-semibold text-[#9CA3AF]">
            Klik kartu folder untuk membuka modul
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Active Highlighted Orange Folder Card */}
          <DriveFolderCard
            title="Akun Akuntansi"
            subtitle="Bagan Akun 3-Segmen X-YY-ZZ • Saldo Awal Rp 0"
            metricLabel={`${accCount?.count || 20} Akun`}
            isActive={true}
            href="/akun"
            badges={[
              { label: '1', bgColor: 'bg-[#2563EB]' },
              { label: '2', bgColor: 'bg-[#E11D48]' },
              { label: '3', bgColor: 'bg-[#7C3AED]' },
            ]}
          />

          {/* Card 2: Soft Gray Folder Card — Produk */}
          <DriveFolderCard
            title="Produk & Barang"
            subtitle="Katalog sewa HT, proyektor, audio & aksesori"
            metricLabel={`${prodCount?.count || 14} Jenis • ${totalStockUnits} Unit`}
            isActive={false}
            href="/produk"
            badges={[
              { label: 'HT', bgColor: 'bg-[#2563EB]' },
              { label: 'VS', bgColor: 'bg-[#7C3AED]' },
              { label: 'AU', bgColor: 'bg-[#F79721]' },
            ]}
          />

          {/* Card 3: Soft Gray Folder Card — Mitra Pemasok & Pelanggan */}
          <DriveFolderCard
            title="Pemasok & Penyewa"
            subtitle={`${supCount?.count || 6} Pemasok Alat • ${cusCount?.count || 10} Pelanggan Sewa`}
            metricLabel={`${(supCount?.count || 6) + (cusCount?.count || 10)} Mitra`}
            isActive={false}
            href="/pemasok"
            badges={[
              { label: 'SUP', bgColor: 'bg-[#7C3AED]' },
              { label: 'CUS', bgColor: 'bg-[#059669]' },
              { label: `${unitCount?.count || 6}U`, bgColor: 'bg-[#111827]' },
            ]}
          />

          {/* Card 4: Summary Document Card (4th Card Style from image.png) */}
          <DriveSummaryCard
            category="MODUL PEMBELAJARAN"
            title="Simulasi & Review COA"
            subtitle="Aturan Debit-Kredit (Slide 4) & Komparasi 3 Bidang Usaha (Slide 5-8)"
            metricLabel="Slide 1-8 PDF"
            icon={<Scale className="w-5 h-5" />}
            href="/simulasi-debit-kredit"
          />
        </div>
      </section>

      {/* Banner Ringkas Kaidah Saldo Awal (Slide 1 & 2) + Ringkasan 5 Kelompok Akun (Slide 4) */}
      <div className="bg-[#F4F5F7] rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start gap-3.5 max-w-2xl">
          <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider">
              Kaidah Baku Pengantar Akuntansi (Slide 1 - 4)
            </h3>
            <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
              Pada menu Master Data, <strong className="text-[#111827]">saldo awal diatur otomatis bernilai Rp 0</strong> untuk semua akun. Saldo awal dimasukkan terpisah pada menu <strong>Jurnal Penyesuaian &rarr; Input Saldo Awal</strong> saat awal periode. Persamaan dasar: <strong className="text-[#111827]">Aset (Debit +) = Liabilitas (Kredit +) + Ekuitas (Kredit +)</strong>.
            </p>
          </div>
        </div>

        {/* 5 Kelompok Pills */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="px-3 py-2 rounded-xl bg-white text-xs flex items-center gap-2 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
            <span className="font-bold text-[#111827]">Aset:</span>
            <span className="font-mono font-extrabold text-[#2563EB]">{groupStats.aset}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-white text-xs flex items-center gap-2 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
            <span className="font-bold text-[#111827]">Liabilitas:</span>
            <span className="font-mono font-extrabold text-[#E11D48]">{groupStats.liabilitas}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-white text-xs flex items-center gap-2 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
            <span className="font-bold text-[#111827]">Ekuitas:</span>
            <span className="font-mono font-extrabold text-[#7C3AED]">{groupStats.ekuitas}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-white text-xs flex items-center gap-2 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
            <span className="font-bold text-[#111827]">Pendapatan:</span>
            <span className="font-mono font-extrabold text-[#059669]">{groupStats.pendapatan}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-white text-xs flex items-center gap-2 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F79721]" />
            <span className="font-bold text-[#111827]">Beban:</span>
            <span className="font-mono font-extrabold text-[#D97005]">{groupStats.beban}</span>
          </div>
        </div>
      </div>

      {/* TIER 3: ALL FILES Style Clean Borderless Data List (Pratinjau Bagan Akun) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-extrabold text-[#9CA3AF] uppercase tracking-[0.12em]">
            DAFTAR AKUN AKUNTANSI UTAMA (PRATINJAU MASTER DATA)
          </h2>
          <div className="flex items-center gap-4">
            <Link
              href="/satuan"
              className="text-xs font-bold text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              Master Satuan ({unitCount?.count || 6})
            </Link>
            <Link
              href="/pelanggan"
              className="text-xs font-bold text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              Master Pelanggan ({cusCount?.count || 10})
            </Link>
            <Link
              href="/akun"
              className="inline-flex items-center gap-1 text-xs font-extrabold text-[#F79721] hover:text-[#D97005] transition-colors"
            >
              <span>Lihat Semua ({allAccounts.length} Akun)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F4F5F7] text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-wider">
                <th className="py-3 px-4">Nama &amp; Kode Akun</th>
                <th className="py-3 px-4">Kelompok Akun</th>
                <th className="py-3 px-4">Saldo Normal</th>
                <th className="py-3 px-4">Saldo Awal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Tautan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F5F7] text-xs">
              {allAccounts.slice(0, 8).map((acc) => (
                <tr
                  key={acc.id}
                  className="hover:bg-[#FFF7ED]/80 transition-colors group rounded-xl"
                >
                  {/* Kolom 1: Kotak Ikon Berwarna + Nama Akun + Kode Monospace (Persis image.png) */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-extrabold text-xs shrink-0 shadow-2xs ${getAccountBoxStyle(
                          acc.accountType
                        )}`}
                      >
                        {acc.accountCode.slice(0, 1)}
                      </div>
                      <div>
                        <p className="font-bold text-[#111827] text-[13px] leading-snug">
                          {acc.accountName}
                        </p>
                        <p className="text-[11px] font-mono font-semibold text-[#9CA3AF]">
                          Kode: {acc.accountCode}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Kolom 2: Kelompok Akun */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280]">
                      {acc.accountType}
                    </span>
                  </td>

                  {/* Kolom 3: Saldo Normal */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        acc.normalBalance === 'Debit'
                          ? 'bg-[#EFF6FF] text-[#2563EB]'
                          : 'bg-[#FFF7ED] text-[#D97005]'
                      }`}
                    >
                      {acc.normalBalance}
                    </span>
                  </td>

                  {/* Kolom 4: Saldo Awal (Rp 0) */}
                  <td className="py-3.5 px-4 font-mono font-bold text-[#6B7280]">
                    Rp 0
                  </td>

                  {/* Kolom 5: Status */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#059669]">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <span>Aktif</span>
                    </span>
                  </td>

                  {/* Kolom 6: Tautan Cepat */}
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href="/akun"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[#9CA3AF] hover:text-[#111827] hover:bg-white transition-colors"
                      title="Buka di Master Akun"
                    >
                      <Link2 className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Baris Pintasan Modul Edukasi Akuntansi (Slide 4 & Slide 5-8) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        <Link
          href="/simulasi-debit-kredit"
          className="bg-[#F4F5F7] hover:bg-[#FFF7ED] rounded-2xl p-5 transition-all group flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-[#F79721] uppercase tracking-wider block">
                MATERI SLIDE 4 • SIMULATOR INTERAKTIF
              </span>
              <h3 className="text-sm font-extrabold text-[#111827] mt-0.5">
                Aturan Debit &amp; Kredit (Buku Besar T-Account)
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Uji 5 skenario transaksi nyata usaha penyewaan peralatan Kanal Tiga.
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#F79721] group-hover:translate-x-1 transition-all shrink-0" />
        </Link>

        <Link
          href="/komparasi-coa"
          className="bg-[#F4F5F7] hover:bg-[#FFF7ED] rounded-2xl p-5 transition-all group flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-[#F79721] uppercase tracking-wider block">
                MATERI SLIDE 5 - 8 • KOMPARASI LINTAS BIDANG
              </span>
              <h3 className="text-sm font-extrabold text-[#111827] mt-0.5">
                Review Bagan Akun: Jasa vs Dagang vs Manufaktur
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Pelajari perbedaan struktur persediaan, HPP, dan biaya pabrikasi.
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#F79721] group-hover:translate-x-1 transition-all shrink-0" />
        </Link>
      </div>
    </div>
  );
}
