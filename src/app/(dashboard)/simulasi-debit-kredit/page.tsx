'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Scale,
  CheckCircle2,
  Sparkles,
  Info,
  BookOpen,
} from 'lucide-react';
import { formatRupiah } from '@/lib/formatters';
import { DriveFolderCard } from '@/components/ui/DriveFolderCard';

interface TransactionExample {
  id: number;
  title: string;
  description: string;
  amount: number;
  debitAccount: string;
  debitGroup: string;
  debitReason: string;
  creditAccount: string;
  creditGroup: string;
  creditReason: string;
  accountingNote: string;
}

const SAMPLE_TRANSACTIONS: TransactionExample[] = [
  {
    id: 1,
    title: 'Setoran Modal Awal',
    description: 'Setoran modal tunai dari pemilik usaha ke kas operasional',
    amount: 10000000,
    debitAccount: '1-01-01 Kas Operasional (Aset)',
    debitGroup: 'Aset Bertambah (+)',
    debitReason: 'Kas bertambah karena ada uang masuk dari pemilik -> DEBIT',
    creditAccount: '3-01-01 Modal Pemilik (Ekuitas)',
    creditGroup: 'Ekuitas Bertambah (+)',
    creditReason: 'Hak modal pemilik atas usaha bertambah -> KREDIT',
    accountingNote:
      'Aset bertambah Rp 10.000.000 diimbangi dengan Ekuitas bertambah Rp 10.000.000. Posisi persamaan akuntansi tetap seimbang (Balance).',
  },
  {
    id: 2,
    title: 'Beli Alat Kredit',
    description: 'Pembelian perlengkapan kantor & gudang secara kredit',
    amount: 2500000,
    debitAccount: '1-01-04 Perlengkapan Gudang (Aset)',
    debitGroup: 'Aset Bertambah (+)',
    debitReason: 'Perlengkapan bertambah di gudang -> DEBIT',
    creditAccount: '2-01-01 Utang Usaha (Liabilitas)',
    creditGroup: 'Liabilitas Bertambah (+)',
    creditReason: 'Kewajiban kepada pemasok bertambah karena belum dibayar -> KREDIT',
    accountingNote:
      'Aset bertambah Rp 2.500.000 diimbangi dengan Liabilitas bertambah Rp 2.500.000.',
  },
  {
    id: 3,
    title: 'Pelunasan Utang',
    description: 'Pembayaran utang usaha kepada pemasok secara tunai',
    amount: 1000000,
    debitAccount: '2-01-01 Utang Usaha (Liabilitas)',
    debitGroup: 'Liabilitas Berkurang (-)',
    debitReason: 'Kewajiban utang lunas berkurang -> DEBIT',
    creditAccount: '1-01-01 Kas Operasional (Aset)',
    creditGroup: 'Aset Berkurang (-)',
    creditReason: 'Uang kas keluar untuk melunasi utang -> KREDIT',
    accountingNote:
      'Liabilitas berkurang Rp 1.000.000 diimbangi dengan Aset berkurang Rp 1.000.000.',
  },
  {
    id: 4,
    title: 'Pendapatan Sewa',
    description: 'Penerimaan pendapatan sewa alat (HT & Audio) tunai',
    amount: 3000000,
    debitAccount: '1-01-01 Kas Operasional (Aset)',
    debitGroup: 'Aset Bertambah (+)',
    debitReason: 'Uang tunai kas masuk dari pelanggan sewa -> DEBIT',
    creditAccount: '4-01-01 Pendapatan Sewa (Pendapatan)',
    creditGroup: 'Pendapatan Bertambah (+)',
    creditReason: 'Manfaat ekonomi bertambah atas jasa yang telah diserahkan -> KREDIT',
    accountingNote:
      'Kas (Aset) bertambah Rp 3.000.000 diimbangi dengan Pendapatan bertambah Rp 3.000.000 (meningkatkan Ekuitas).',
  },
  {
    id: 5,
    title: 'Beban Listrik & Air',
    description: 'Pembayaran beban listrik, air, dan internet markas tunai',
    amount: 500000,
    debitAccount: '5-01-03 Beban Listrik & Internet (Beban)',
    debitGroup: 'Beban Bertambah (+)',
    debitReason: 'Beban operasional diakui bertambah pada periode berjalan -> DEBIT',
    creditAccount: '1-01-01 Kas Operasional (Aset)',
    creditGroup: 'Aset Berkurang (-)',
    creditReason: 'Uang tunai kas keluar untuk membayar tagihan -> KREDIT',
    accountingNote:
      'Beban bertambah Rp 500.000 (mengurangi Ekuitas) diimbangi dengan Aset (Kas) berkurang Rp 500.000.',
  },
];

export default function DebitCreditSimulationPage() {
  const [selectedTxId, setSelectedTxId] = useState<number>(1);
  const selectedTx =
    SAMPLE_TRANSACTIONS.find((t) => t.id === selectedTxId) || SAMPLE_TRANSACTIONS[0];

  return (
    <div className="space-y-8 pb-12">
      {/* TIER 1: Page Title Row (Persis "Design" + Orange Square Icon di image.png) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#111827] tracking-tight">
            Simulasi Debit &amp; Kredit
          </h1>
          <div className="w-9 h-9 rounded-xl bg-[#F79721] text-white flex items-center justify-center shadow-sm shadow-[#F79721]/25">
            <Scale className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-[#F4F5F7] text-[11px] font-bold text-[#6B7280]">
            Materi Slide 4 • Pengantar Akuntansi
          </span>
        </div>

        <Link
          href="/akun"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F4F5F7] hover:bg-[#E5E7EB] text-xs font-bold text-[#111827] transition-all"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#F79721]" />
          <span>Kembali ke Master Akun</span>
        </Link>
      </div>

      {/* Persamaan Dasar Akuntansi Strip */}
      <div className="bg-[#F4F5F7] rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F79721] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-wider block">
              PERSAMAAN DASAR AKUNTANSI (SLIDE 4)
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-extrabold font-mono text-[#111827] mt-1">
              <span className="px-3 py-1 rounded-full bg-white text-[#2563EB]">
                ASET (Debit +)
              </span>
              <span>=</span>
              <span className="px-3 py-1 rounded-full bg-white text-[#E11D48]">
                LIABILITAS (Kredit +)
              </span>
              <span>+</span>
              <span className="px-3 py-1 rounded-full bg-white text-[#7C3AED]">
                EKUITAS (Kredit +)
              </span>
            </div>
          </div>
        </div>
        <span className="text-xs font-bold text-[#059669] bg-white px-4 py-2 rounded-full shadow-2xs shrink-0">
          Total Sisi Debit = Total Sisi Kredit
        </span>
      </div>

      {/* TIER 2: QUICK ACCESS — PILIH SKENARIO TRANSAKSI (5 Kartu Folder) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] font-extrabold text-[#9CA3AF] uppercase tracking-[0.12em]">
            QUICK ACCESS — PILIH SKENARIO TRANSAKSI UNTUK SIMULASI BUKU BESAR (T-ACCOUNT)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {SAMPLE_TRANSACTIONS.map((tx) => (
            <DriveFolderCard
              key={tx.id}
              title={tx.title}
              subtitle={tx.description}
              metricLabel={formatRupiah(tx.amount)}
              isActive={selectedTxId === tx.id}
              onClick={() => setSelectedTxId(tx.id)}
              badges={[
                { label: 'D', bgColor: 'bg-[#2563EB]' },
                { label: 'K', bgColor: 'bg-[#F79721]' },
              ]}
            />
          ))}
        </div>
      </section>

      {/* Visualisasi Buku Besar T-Account Interaktif */}
      <section className="bg-[#F4F5F7] rounded-2xl p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 border-b border-[#E5E7EB]">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F79721] block">
              SKENARIO TRANSAKSI #{selectedTx.id} AKTIF
            </span>
            <p className="text-base font-extrabold text-[#111827] mt-0.5">
              {selectedTx.description}
            </p>
          </div>
          <div className="px-4 py-2 rounded-full bg-white text-right shrink-0">
            <span className="text-[10px] font-bold text-[#9CA3AF] uppercase mr-2">
              Nominal:
            </span>
            <span className="text-sm font-extrabold font-mono text-[#F79721]">
              {formatRupiah(selectedTx.amount)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* T-Account Sisi DEBIT */}
          <div className="bg-white rounded-2xl p-5 shadow-2xs">
            <div className="text-center pb-3 border-b-2 border-[#2563EB] mb-3">
              <span className="text-[10px] font-extrabold text-[#2563EB] block uppercase tracking-wider">
                AKUN YANG DIDEBIT
              </span>
              <p className="text-sm font-extrabold text-[#111827] mt-0.5">
                {selectedTx.debitAccount}
              </p>
              <span className="inline-block text-[11px] font-bold px-3 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] mt-1.5">
                {selectedTx.debitGroup}
              </span>
            </div>

            <div className="grid grid-cols-2 text-xs divide-x-2 divide-[#2563EB] min-h-[96px]">
              <div className="p-3 bg-[#EFF6FF]/60 rounded-l-xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-[#2563EB] block uppercase">
                    DEBIT (Kiri)
                  </span>
                  <span className="text-base font-extrabold font-mono text-[#1E3A8A] mt-1 block">
                    {formatRupiah(selectedTx.amount)}
                  </span>
                </div>
                <span className="text-[10px] text-[#2563EB] font-bold">
                  Posisi Terisi (+)
                </span>
              </div>
              <div className="p-3 flex flex-col justify-between text-right text-[#9CA3AF]">
                <div>
                  <span className="text-[10px] font-bold block uppercase">
                    KREDIT (Kanan)
                  </span>
                  <span className="text-sm font-mono mt-1 block">-</span>
                </div>
                <span className="text-[10px] italic">Kosong</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#F4F5F7] text-xs text-[#6B7280]">
              <strong className="text-[#111827]">Alasan:</strong> {selectedTx.debitReason}
            </div>
          </div>

          {/* T-Account Sisi KREDIT */}
          <div className="bg-white rounded-2xl p-5 shadow-2xs">
            <div className="text-center pb-3 border-b-2 border-[#F79721] mb-3">
              <span className="text-[10px] font-extrabold text-[#F79721] block uppercase tracking-wider">
                AKUN YANG DIKREDIT
              </span>
              <p className="text-sm font-extrabold text-[#111827] mt-0.5">
                {selectedTx.creditAccount}
              </p>
              <span className="inline-block text-[11px] font-bold px-3 py-0.5 rounded-full bg-[#FFF7ED] text-[#D97005] mt-1.5">
                {selectedTx.creditGroup}
              </span>
            </div>

            <div className="grid grid-cols-2 text-xs divide-x-2 divide-[#F79721] min-h-[96px]">
              <div className="p-3 flex flex-col justify-between text-[#9CA3AF]">
                <div>
                  <span className="text-[10px] font-bold block uppercase">
                    DEBIT (Kiri)
                  </span>
                  <span className="text-sm font-mono mt-1 block">-</span>
                </div>
                <span className="text-[10px] italic">Kosong</span>
              </div>
              <div className="p-3 bg-[#FFF7ED]/70 rounded-r-xl flex flex-col justify-between text-right">
                <div>
                  <span className="text-[10px] font-extrabold text-[#D97005] block uppercase">
                    KREDIT (Kanan)
                  </span>
                  <span className="text-base font-extrabold font-mono text-[#9A3412] mt-1 block">
                    {formatRupiah(selectedTx.amount)}
                  </span>
                </div>
                <span className="text-[10px] text-[#D97005] font-bold">
                  Posisi Terisi (+)
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#F4F5F7] text-xs text-[#6B7280]">
              <strong className="text-[#111827]">Alasan:</strong> {selectedTx.creditReason}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
          <div className="text-xs text-[#6B7280] leading-relaxed">
            <strong className="text-[#111827] block mb-0.5">
              Keseimbangan Akuntansi Terbukti Sempurna:
            </strong>
            {selectedTx.accountingNote}
          </div>
        </div>
      </section>

      {/* TIER 3: ALL FILES Style Tabel Referensi Saldo Normal 5 Kelompok Akun */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-extrabold text-[#9CA3AF] uppercase tracking-[0.12em]">
          TABEL ACUAN SALDO NORMAL &amp; ATURAN DEBIT-KREDIT (SLIDE 4)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F4F5F7] text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-wider">
                <th className="py-3 px-4">Kelompok &amp; Kode Akun</th>
                <th className="py-3 px-4">Pengertian Singkat</th>
                <th className="py-3 px-4">Saldo Normal</th>
                <th className="py-3 px-4">Saat Bertambah (+)</th>
                <th className="py-3 px-4">Saat Berkurang (-)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F5F7] text-xs">
              {[
                {
                  code: '1',
                  name: 'Aset (Harta)',
                  range: '1-xxxx',
                  color: 'bg-[#2563EB] text-white',
                  desc: 'Sumber daya bernilai ekonomis yang dimiliki usaha (Kas, Piutang, Peralatan)',
                  normal: 'Debit',
                  inc: 'DEBIT',
                  dec: 'KREDIT',
                },
                {
                  code: '2',
                  name: 'Liabilitas (Kewajiban)',
                  range: '2-xxxx',
                  color: 'bg-[#E11D48] text-white',
                  desc: 'Utang atau kewajiban perusahaan kepada pihak ketiga yang harus dilunasi',
                  normal: 'Kredit',
                  inc: 'KREDIT',
                  dec: 'DEBIT',
                },
                {
                  code: '3',
                  name: 'Ekuitas (Modal)',
                  range: '3-xxxx',
                  color: 'bg-[#7C3AED] text-white',
                  desc: 'Hak pemilik atas aset perusahaan setelah dikurangi seluruh liabilitas',
                  normal: 'Kredit',
                  inc: 'KREDIT',
                  dec: 'DEBIT',
                },
                {
                  code: '4',
                  name: 'Pendapatan (Revenue)',
                  range: '4-xxxx',
                  color: 'bg-[#059669] text-white',
                  desc: 'Arus masuk atau kenaikan manfaat ekonomi dari aktivitas penyewaan alat',
                  normal: 'Kredit',
                  inc: 'KREDIT',
                  dec: 'DEBIT',
                },
                {
                  code: '5',
                  name: 'Beban (Expense)',
                  range: '5-xxxx',
                  color: 'bg-[#F79721] text-white',
                  desc: 'Pengorbanan manfaat ekonomi untuk menunjang operasional penyewaan',
                  normal: 'Debit',
                  inc: 'DEBIT',
                  dec: 'KREDIT',
                },
              ].map((row) => (
                <tr key={row.code} className="hover:bg-[#FFF7ED]/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-extrabold text-xs shrink-0 ${row.color}`}
                      >
                        {row.code}
                      </div>
                      <div>
                        <p className="font-bold text-[#111827] text-[13px]">{row.name}</p>
                        <p className="font-mono text-[11px] text-[#9CA3AF]">Kode: {row.range}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#6B7280] max-w-sm">{row.desc}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        row.normal === 'Debit'
                          ? 'bg-[#EFF6FF] text-[#2563EB]'
                          : 'bg-[#FFF7ED] text-[#D97005]'
                      }`}
                    >
                      {row.normal}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-extrabold text-[#059669]">
                    + {row.inc}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-extrabold text-[#E11D48]">
                    - {row.dec}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
