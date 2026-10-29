'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Factory,
  ShoppingBag,
  Wrench,
  CheckCircle2,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { DriveFolderCard, DriveSummaryCard } from '@/components/ui/DriveFolderCard';

export default function CoaComparisonPage() {
  const [activeTab, setActiveTab] = useState<'jasa' | 'dagang' | 'manufaktur'>('jasa');

  return (
    <div className="space-y-8 pb-12">
      {/* TIER 1: Page Title Row (Persis "Design" + Orange Square Icon di image.png) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#111827] tracking-tight">
            Review COA Lintas Bidang
          </h1>
          <div className="w-9 h-9 rounded-xl bg-[#F79721] text-white flex items-center justify-center shadow-sm shadow-[#F79721]/25">
            <Layers className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-[#F4F5F7] text-[11px] font-bold text-[#6B7280]">
            Materi Slide 5 - 8 • Pengantar Akuntansi
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

      {/* TIER 2: QUICK ACCESS — PILIH BIDANG USAHA (4 Kartu Folder seperti image.png) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] font-extrabold text-[#9CA3AF] uppercase tracking-[0.12em]">
            QUICK ACCESS — KOMPARASI BAGAN AKUN LINTAS SEKTOR INDUSTRI
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <DriveFolderCard
            title="Perusahaan Jasa"
            subtitle="Fokus pada pendapatan sewa & beban operasional (Basis Kanal Tiga)"
            metricLabel="Slide 8 • Jasa"
            isActive={activeTab === 'jasa'}
            onClick={() => setActiveTab('jasa')}
            badges={[
              { label: '41', bgColor: 'bg-[#059669]' },
              { label: '51', bgColor: 'bg-[#F79721]' },
            ]}
          />

          <DriveFolderCard
            title="Perusahaan Dagang"
            subtitle="Memiliki persediaan barang dagang, pembelian & perhitungan HPP"
            metricLabel="Slide 7 • Dagang"
            isActive={activeTab === 'dagang'}
            onClick={() => setActiveTab('dagang')}
            badges={[
              { label: '13', bgColor: 'bg-[#2563EB]' },
              { label: 'HPP', bgColor: 'bg-[#7C3AED]' },
            ]}
          />

          <DriveFolderCard
            title="Manufaktur / Pabrik"
            subtitle="Akumulasi biaya bahan baku, TKL, BOP, BDP hingga barang jadi"
            metricLabel="Slide 5-6 • Pabrik"
            isActive={activeTab === 'manufaktur'}
            onClick={() => setActiveTab('manufaktur')}
            badges={[
              { label: 'BB', bgColor: 'bg-[#2563EB]' },
              { label: 'BDP', bgColor: 'bg-[#E11D48]' },
              { label: 'BJ', bgColor: 'bg-[#059669]' },
            ]}
          />

          <DriveSummaryCard
            category="PRINSIP SERAGAM"
            title="Persamaan Dasar Tetap"
            subtitle="Semua bidang tetap menggunakan 5 kelompok utama & saldo awal Rp 0 di Master Data"
            metricLabel="1-xxxx s/d 5-xxxx"
            icon={<CheckCircle2 className="w-5 h-5" />}
            href="/simulasi-debit-kredit"
          />
        </div>
      </section>

      {/* KONTEN INTERAKTIF BERDASARKAN FOLDER AKTIF */}
      {activeTab === 'jasa' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-[#F4F5F7] rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#F79721]" />
              <span>Alur Siklus Pencatatan Pendapatan &amp; Beban Jasa (Slide 8)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-white">
                <span className="font-mono font-bold text-[#F79721] block mb-1">Tahap 1</span>
                <p className="font-bold text-[#111827]">Penyerahan Jasa Sewa</p>
                <p className="text-[11px] text-[#6B7280] mt-1">
                  Penyerahan unit HT, proyektor, atau sound system kepada penyewa event.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white">
                <span className="font-mono font-bold text-[#F79721] block mb-1">Tahap 2</span>
                <p className="font-bold text-[#111827]">Pengakuan Pendapatan</p>
                <p className="text-[11px] text-[#6B7280] mt-1">
                  Kas/Piutang Usaha bertambah di Debit, Pendapatan Sewa bertambah di Kredit.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white">
                <span className="font-mono font-bold text-[#F79721] block mb-1">Tahap 3</span>
                <p className="font-bold text-[#111827]">Beban Operasional</p>
                <p className="text-[11px] text-[#6B7280] mt-1">
                  Pencatatan honor kru lapangan, perawatan alat, dan listrik markas.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#ECFDF5]">
                <span className="font-mono font-bold text-[#059669] block mb-1">Tahap 4</span>
                <p className="font-bold text-[#065F46]">Laba Rugi Bersih</p>
                <p className="text-[11px] text-[#047857] mt-1">
                  Pendapatan Jasa dikurangi total beban operasional tanpa perhitungan HPP barang.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-[#F4F5F7] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-[#111827]">
                  COA PERUSAHAAN JASA KORPORASI
                </h4>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white text-[#6B7280]">
                  Skala Besar
                </span>
              </div>
              <ul className="text-xs space-y-1.5 text-[#6B7280] list-disc pl-4 font-mono">
                <li>1-1100 Kas Besar, Kas Kecil &amp; Rekening Bank Multi-Cabang</li>
                <li>1-1200 Piutang Usaha &amp; Cadangan Kerugian Piutang</li>
                <li>1-1600 Aset Tetap &amp; Akumulasi Penyusutan per Departemen</li>
                <li>5-1100 Beban Tenaga Kerja Langsung per Proyek</li>
                <li>6-1100 Beban Gaji &amp; Administrasi Kantor Pusat</li>
              </ul>
            </div>

            <div className="bg-[#FFF7ED] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-[#D97005]">
                  COA UMKM JASA (KANAL TIGA)
                </h4>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F79721] text-white">
                  Efisien &amp; Ramping
                </span>
              </div>
              <ul className="text-xs space-y-1.5 text-[#111827] list-disc pl-4 font-mono">
                <li>1-01-01 Kas Operasional &amp; 1-01-02 Bank BCA</li>
                <li>1-01-03 Piutang Usaha Sewa</li>
                <li>1-02-01 Peralatan Elektronik Sewa (HT, Proyektor, Audio)</li>
                <li>1-02-02 Akumulasi Penyusutan Peralatan (Kontra Aset)</li>
                <li>4-01-01 Pendapatan Sewa Peralatan</li>
                <li>5-01-01 Beban Gaji &amp; Kru Lapangan</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dagang' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-[#F4F5F7] rounded-2xl p-6 space-y-3">
            <h3 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#F79721]" />
              <span>Rumus Harga Pokok Penjualan (HPP) Perusahaan Dagang (Slide 7)</span>
            </h3>
            <div className="p-4 rounded-xl bg-white flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm font-mono font-bold text-[#111827]">
              <span className="px-3 py-1.5 rounded-full bg-[#EFF6FF] text-[#2563EB]">
                Persediaan Awal
              </span>
              <span>+</span>
              <span className="px-3 py-1.5 rounded-full bg-[#FFF7ED] text-[#D97005]">
                Pembelian Bersih
              </span>
              <span>-</span>
              <span className="px-3 py-1.5 rounded-full bg-[#F4F5F7] text-[#111827]">
                Persediaan Akhir
              </span>
              <span>=</span>
              <span className="px-3 py-1.5 rounded-full bg-[#ECFDF5] text-[#059669]">
                HPP (Harga Pokok Penjualan)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-[#F4F5F7] rounded-2xl p-5 space-y-2.5">
              <h4 className="font-extrabold text-sm text-[#111827]">
                COA PERUSAHAAN DAGANG LENGKAP
              </h4>
              <ul className="text-xs space-y-1.5 text-[#6B7280] list-disc pl-4 font-mono">
                <li>1-1300 Persediaan Barang Dagang (per SKU)</li>
                <li>4-1100 Penjualan &amp; 4-1200 Retur/Potongan Penjualan</li>
                <li>5-1200 Pembelian, Retur Pembelian &amp; Beban Angkut Masuk</li>
                <li>5-1600 Harga Pokok Penjualan (HPP)</li>
              </ul>
            </div>
            <div className="bg-[#FFF7ED] rounded-2xl p-5 space-y-2.5">
              <h4 className="font-extrabold text-sm text-[#D97005]">
                COA UMKM DAGANG SEDERHANA
              </h4>
              <ul className="text-xs space-y-1.5 text-[#111827] list-disc pl-4 font-mono">
                <li>1-1300 Persediaan Barang Dagang</li>
                <li>4-1100 Penjualan Barang</li>
                <li>5-1100 Harga Pokok Penjualan (HPP)</li>
                <li>6-1100 Beban Operasional Toko</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'manufaktur' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-[#F4F5F7] rounded-2xl p-6 space-y-3">
            <h3 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider flex items-center gap-2">
              <Factory className="w-4 h-4 text-[#F79721]" />
              <span>Alur Akumulasi Biaya Pabrikasi Manufaktur (Slide 5 &amp; 6)</span>
            </h3>
            <div className="p-4 rounded-xl bg-white flex flex-wrap items-center justify-center gap-3 text-xs font-mono font-bold text-[#111827]">
              <span className="px-3 py-1.5 rounded-full bg-[#EFF6FF] text-[#2563EB]">
                Bahan Baku + TKL + BOP
              </span>
              <ArrowRight className="w-4 h-4 text-[#9CA3AF]" />
              <span className="px-3 py-1.5 rounded-full bg-[#FFF7ED] text-[#D97005]">
                Barang Dalam Proses (BDP)
              </span>
              <ArrowRight className="w-4 h-4 text-[#9CA3AF]" />
              <span className="px-3 py-1.5 rounded-full bg-[#F3E8FF] text-[#7C3AED]">
                Persediaan Barang Jadi
              </span>
              <ArrowRight className="w-4 h-4 text-[#9CA3AF]" />
              <span className="px-3 py-1.5 rounded-full bg-[#ECFDF5] text-[#059669]">
                HPP Manufaktur
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TIER 3: ALL FILES Style Clean Borderless Comparison Table */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-extrabold text-[#9CA3AF] uppercase tracking-[0.12em]">
          TABEL KOMPARASI UTAMA: PERUSAHAAN KORPORASI VS UMKM (SLIDE 6)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F4F5F7] text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-wider">
                <th className="py-3 px-4">Aspek Perbandingan</th>
                <th className="py-3 px-4">Perusahaan Besar / Korporasi</th>
                <th className="py-3 px-4">Usaha Mikro, Kecil &amp; Menengah (UMKM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F5F7] text-xs">
              {[
                {
                  no: '01',
                  aspect: 'Jumlah & Cakupan Akun',
                  corp: 'Sangat banyak dan terperinci per jenis persediaan, biaya, serta departemen',
                  umkm: 'Lebih sedikit, ramping, dan langsung ke inti operasional harian',
                },
                {
                  no: '02',
                  aspect: 'Tingkat Detail Hierarki',
                  corp: 'Detail per fungsi, pusat biaya (cost center), dan divisi bisnis',
                  umkm: 'Tingkat kelompok utama tanpa sub-akun berlapis yang rumit',
                },
                {
                  no: '03',
                  aspect: 'Akun Persediaan & Produksi',
                  corp: 'Memisahkan bahan baku, bahan penolong, BDP, dan barang jadi secara ketat',
                  umkm: 'Cukup 1-2 akun persediaan ringkas sesuai kebutuhan riil usaha',
                },
                {
                  no: '04',
                  aspect: 'Fokus Pelaporan Keuangan',
                  corp: 'Laporan manajemen internal, audit eksternal, dan konsolidasi',
                  umkm: 'Fokus pada arus kas operasional, laba rugi, dan kepatuhan pajak UMKM',
                },
                {
                  no: '05',
                  aspect: 'Kaidah Dasar Akuntansi',
                  corp: '5 kelompok akun, saldo normal Debit/Kredit, dan saldo awal Master Data Rp 0',
                  umkm: 'Tetap sama persis: 5 kelompok akun, aturan Debit/Kredit, dan saldo awal Rp 0',
                },
              ].map((row) => (
                <tr key={row.no} className="hover:bg-[#FFF7ED]/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-[#F79721] text-white flex items-center justify-center font-mono font-extrabold text-xs shrink-0">
                        {row.no}
                      </div>
                      <span className="font-bold text-[#111827] text-[13px]">{row.aspect}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#6B7280]">{row.corp}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#111827]">{row.umkm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
