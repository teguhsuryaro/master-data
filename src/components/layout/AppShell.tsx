'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SessionPayload } from '@/lib/permissions';
import {
  Compass,
  BookOpen,
  Package,
  Truck,
  Users2,
  Ruler,
  LogOut,
  Scale,
  Layers,
  Menu,
  X,
  Search,
  Bell,
  HelpCircle,
  Settings,
  Cloud,
  Sparkles,
  ArrowUpRight,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { logoutAction } from '@/actions/auth-actions';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export interface TabCounts {
  accounts?: number;
  products?: number;
  suppliers?: number;
  customers?: number;
  units?: number;
}

interface AppShellProps {
  user: SessionPayload;
  counts?: TabCounts;
  children: React.ReactNode;
}

export function AppShell({ user, counts, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotifPopover, setShowNotifPopover] = useState(false);

  // Daftar Menu Vertikal di Sidebar (Mengadopsi urutan menu kiri di image.png)
  const navigationItems = [
    {
      name: 'Ringkasan',
      href: '/',
      icon: Compass,
      badge: undefined,
      keywords: 'dashboard ringkasan beranda ikhtisar kpi',
    },
    {
      name: 'Akun Akuntansi',
      href: '/akun',
      icon: BookOpen,
      badge: counts?.accounts ?? 20,
      keywords: 'akun coa bagan akun kas bank piutang utang modal pendapatan beban saldo awal',
    },
    {
      name: 'Produk / Barang',
      href: '/produk',
      icon: Package,
      badge: counts?.products ?? 14,
      keywords: 'produk barang katalog alat ht proyektor sound sewa stok brg',
    },
    {
      name: 'Pemasok',
      href: '/pemasok',
      icon: Truck,
      badge: counts?.suppliers ?? 6,
      keywords: 'pemasok supplier vendor toko distributor sup',
    },
    {
      name: 'Pelanggan',
      href: '/pelanggan',
      icon: Users2,
      badge: counts?.customers ?? 10,
      keywords: 'pelanggan customer penyewa kampus eo instansi cus',
    },
    {
      name: 'Satuan',
      href: '/satuan',
      icon: Ruler,
      badge: counts?.units ?? 6,
      keywords: 'satuan unit set paket pcs roll meter',
    },
    {
      name: 'Simulasi Debit-Kredit',
      href: '/simulasi-debit-kredit',
      icon: Scale,
      badge: undefined,
      keywords: 'simulasi debit kredit t-account persamaan akuntansi slide 4',
    },
    {
      name: 'Komparasi COA',
      href: '/komparasi-coa',
      icon: Layers,
      badge: undefined,
      keywords: 'komparasi review coa jasa dagang manufaktur umkm hpp slide 5 6 7 8',
    },
  ];

  // Filter hasil pencarian cepat di Top Search Bar
  const quickSearchResults = globalSearch.trim()
    ? navigationItems.filter(
        (item) =>
          item.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
          item.keywords.includes(globalSearch.toLowerCase())
      )
    : [];

  // Label tombol pill putih utama di puncak Sidebar (setara "Upload New File" di image.png)
  const getPrimaryActionConfig = () => {
    if (pathname.startsWith('/akun')) {
      return { label: 'Master Akun (COA)', href: '/akun' };
    }
    if (pathname.startsWith('/produk')) {
      return { label: 'Katalog Barang Sewa', href: '/produk' };
    }
    if (pathname.startsWith('/pemasok')) {
      return { label: 'Data Mitra Pemasok', href: '/pemasok' };
    }
    if (pathname.startsWith('/pelanggan')) {
      return { label: 'Data Pelanggan Sewa', href: '/pelanggan' };
    }
    if (pathname.startsWith('/satuan')) {
      return { label: 'Master Satuan Ukur', href: '/satuan' };
    }
    return { label: 'Kelola Master Akun', href: '/akun' };
  };

  const primaryAction = getPrimaryActionConfig();

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAction();
    } catch {
      // Next.js redirect handler
    }
  };

  const firstName = user.fullName ? user.fullName.split(' ')[0] : 'Admin';
  const initialLetter = firstName[0]?.toUpperCase() || 'K';

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#18181B]">
      {/* ===================================================================== */}
      {/* 1. TOP BAR PUTIH BERSIH (Persis Bar Atas di image.png)                */}
      {/* ===================================================================== */}
      <header className="h-20 bg-white sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-0">
        {/* Kiri: Zona Logo (Lebar 255px sejajar dengan Sidebar di bawahnya) */}
        <div className="lg:w-[255px] shrink-0 flex items-center gap-3 lg:px-7">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-[#F4F5F7] text-[#52525B] hover:text-[#18181B]"
            aria-label="Buka navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <img
              src="/logo.png"
              alt="Logo Kanal Tiga"
              className="h-8 w-auto object-contain group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="font-heading text-lg sm:text-xl font-extrabold tracking-tight text-[#18181B] block leading-none">
                Kanal Tiga
              </span>
              <span className="text-[10px] font-bold text-[#C26B0A] tracking-wide block mt-0.5">
                SIAKUN Master Data
              </span>
            </div>
          </Link>
        </div>

        {/* Tengah & Kanan: Search Pill + Utility Icons + User Profile */}
        <div className="flex-1 flex items-center justify-between gap-4 lg:px-10">
          {/* Pill Search Input (Persis "Search Drive..." di image.png) */}
          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={globalSearch}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Cari modul master data, akun, produk, atau simulasi..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#F4F5F7] hover:bg-[#ECEEF2] focus:bg-white border border-transparent focus:border-[#F79721] text-xs font-medium text-[#18181B] placeholder-[#9CA3AF] outline-none transition-all shadow-2xs"
            />

            {/* Dropdown Quick Jump Search */}
            {searchFocused && globalSearch.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl py-2 z-50">
                <p className="px-4 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#9CA3AF]">
                  Navigasi Cepat Modul
                </p>
                {quickSearchResults.length === 0 ? (
                  <p className="px-4 py-2.5 text-xs text-[#71717A]">
                    Modul tidak ditemukan. Gunakan kolom cari di tabel halaman.
                  </p>
                ) : (
                  quickSearchResults.map((res) => {
                    const Icon = res.icon;
                    return (
                      <button
                        key={res.href}
                        type="button"
                        onClick={() => {
                          router.push(res.href);
                          setGlobalSearch('');
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-[#18181B] hover:bg-[#FFF7ED] flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-[#F79721]" />
                          <span>{res.name}</span>
                        </span>
                        {res.badge !== undefined && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F4F5F7] text-[#52525B]">
                            {res.badge} data
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Kanan: Deretan Ikon Utilitas + Nama & Avatar Bulat (Persis "🔔 ❓ ⚙️ Jessica [J] ☰" di image.png) */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* 1. Ikon Notifikasi Kaidah Akuntansi */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifPopover(!showNotifPopover)}
                className="p-2 rounded-full text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F5F7] transition-colors relative"
                title="Status Kaidah Sistem"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-[#F79721] absolute top-1.5 right-1.5 ring-2 ring-white" />
              </button>

              {showNotifPopover && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-4 z-50 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-extrabold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Kaidah Master Data Terverifikasi</span>
                  </div>
                  <p className="text-[11px] text-[#6B7280] leading-relaxed">
                    Seluruh <strong>{counts?.accounts ?? 20} akun COA</strong> memiliki Saldo Awal <strong>Rp 0</strong> sesuai materi <em>09_Pengantar_Akuntansi.pdf</em>.
                  </p>
                </div>
              )}
            </div>

            {/* 2. Ikon Bantuan -> Simulasi Debit Kredit */}
            <Link
              href="/simulasi-debit-kredit"
              className="p-2 rounded-full text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F5F7] transition-colors"
              title="Panduan & Simulasi Debit-Kredit (Slide 4)"
            >
              <HelpCircle className="w-4 h-4" />
            </Link>

            {/* 3. Ikon Pengaturan/Komparasi -> Komparasi COA */}
            <Link
              href="/komparasi-coa"
              className="p-2 rounded-full text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F5F7] transition-colors hidden sm:inline-flex"
              title="Review & Komparasi COA (Slide 5-8)"
            >
              <Settings className="w-4 h-4" />
            </Link>

            {/* 4. Nama User & Avatar Bulat Berwarna Brand (Persis "Jessica [J]" di image.png) */}
            <div className="flex items-center gap-2.5 pl-2">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-[#6B7280] leading-none">
                  {user.fullName}
                </p>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5">
                  {user.roleTitle || 'Admin'}
                </p>
              </div>
              <div
                className="w-9 h-9 rounded-full bg-[#F79721] text-white font-heading font-extrabold text-sm flex items-center justify-center shadow-sm shadow-[#F79721]/30 shrink-0"
                title={user.fullName}
              >
                {initialLetter}
              </div>
            </div>

            {/* 5. Tombol Keluar (Logout) */}
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="p-2 rounded-full text-[#71717A] hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Keluar dari Sesi"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 2. BODY WRAPPER: CURVED LEFT SIDEBAR + WHITE MAIN WORKSPACE           */}
      {/* ===================================================================== */}
      <div className="flex-1 flex">
        {/* LEFT SIDEBAR ORANYE MELENGKUNG (Persis Sidebar Kiri di image.png) */}
        <aside className="w-[255px] shrink-0 hidden lg:flex flex-col bg-gradient-to-b from-[#F79721] via-[#EA820E] to-[#D97005] text-white rounded-tr-[42px] shadow-xl shadow-[#F79721]/15 select-none">
          {/* A. Tombol Pill Putih di Puncak Sidebar ("Upload New File" style) */}
          <div className="pt-8 px-6 pb-6">
            <Link
              href={primaryAction.href}
              className="w-full py-3 px-5 rounded-full bg-white text-[#C26B0A] hover:bg-[#FFF7ED] font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{primaryAction.label}</span>
            </Link>
          </div>

          {/* B. Daftar Navigasi Vertikal */}
          <nav className="px-4 space-y-1 flex-1" aria-label="Menu Utama">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center justify-between py-2.5 px-4 rounded-full text-xs transition-all duration-150 ${
                    isActive
                      ? 'bg-white/20 text-white font-extrabold shadow-2xs'
                      : 'text-white/80 hover:text-white hover:bg-white/10 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isActive
                          ? 'bg-white/25 border border-white/70 text-white'
                          : 'text-white/85 group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">{item.name}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white text-[#C26B0A]'
                          : 'bg-black/15 text-white/90'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* C. Widget Bawah "STATUS MASTER DATA" (Persis "STORAGE DETAILS" di image.png) */}
          <div className="mt-auto px-6 pt-6 pb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/75 whitespace-nowrap">
                STATUS MASTER DATA
              </span>
              <div className="h-px bg-white/25 flex-1" />
            </div>

            <div className="space-y-4">
              {/* Progress Bar 1: Bagan Akun (COA) */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-white mb-1.5">
                  <Cloud className="w-4 h-4 text-white/90 shrink-0" />
                  <span>Bagan Akun (COA)</span>
                </div>
                <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                  <div className="bg-white h-full w-[85%] rounded-full" />
                </div>
                <p className="text-[10px] text-white/80 mt-1.5 font-medium">
                  {counts?.accounts ?? 20} Akun Aktif • Saldo Awal Rp 0
                </p>
              </div>

              {/* Progress Bar 2: Katalog & Mitra */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-white mb-1.5">
                  <Sparkles className="w-4 h-4 text-white/90 shrink-0" />
                  <span>Katalog & Mitra</span>
                </div>
                <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                  <div className="bg-white h-full w-[74%] rounded-full" />
                </div>
                <p className="text-[10px] text-white/80 mt-1.5 font-medium">
                  {counts?.products ?? 14} Barang • {(counts?.suppliers ?? 6) + (counts?.customers ?? 10)} Mitra Usaha
                </p>
              </div>

              {/* Bottom Link ("Upgrade Storage ↗" style) */}
              <div className="pt-2">
                <Link
                  href="/simulasi-debit-kredit"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white hover:underline"
                >
                  <span>Panduan Akuntansi</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* MOBILE DRAWER SIDEBAR (Layar < 1024px) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[85vw] bg-gradient-to-b from-[#F79721] to-[#D97005] text-white rounded-tr-[36px] flex flex-col z-10 p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-6 border-b border-white/20">
                <span className="font-heading font-extrabold text-lg">
                  Kanal Tiga • SIAKUN
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-full bg-white/15 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="py-5 space-y-1.5 flex-1 overflow-y-auto">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-2.5 px-4 rounded-full text-xs ${
                        isActive
                          ? 'bg-white text-[#C26B0A] font-extrabold'
                          : 'text-white/90 hover:bg-white/10 font-medium'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </span>
                      {item.badge !== undefined && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/15 text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* MAIN CONTENT WORKSPACE (Kanvas Putih Bersih seperti image.png) */}
        <main className="flex-1 min-w-0 bg-white px-4 sm:px-8 lg:px-10 pt-2 pb-14 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Modal Konfirmasi Logout */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        title="Konfirmasi Keluar dari Sistem"
        message={`Apakah Anda yakin ingin keluar dari sesi ${user.fullName}?`}
        confirmText="Ya, Keluar"
        cancelText="Batal"
        isLoading={isLoggingOut}
      />
    </div>
  );
}
