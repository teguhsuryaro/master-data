'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { SessionPayload } from '@/lib/permissions';
import {
  BookOpen,
  Search,
  Plus,
  Power,
  PowerOff,
  Edit2,
  Info,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
  Lock,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Link2,
} from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { SlideOverDrawer } from '@/components/ui/SlideOverDrawer';
import { DriveFolderCard } from '@/components/ui/DriveFolderCard';
import { useToast } from '@/components/ui/Toast';
import {
  createAccountAction,
  updateAccountAction,
  toggleAccountStatusAction,
} from '@/actions/account-actions';
import { getAutoNormalBalance } from '@/lib/account-rules';

export interface AccountItem {
  id: number;
  accountCode: string;
  accountName: string;
  accountType: string;
  normalBalance: string;
  initialBalance: number;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AccountsClientProps {
  currentUser: SessionPayload;
  initialAccounts: AccountItem[];
}

export function AccountsClient({
  currentUser,
  initialAccounts,
}: AccountsClientProps) {
  const [items, setItems] = useState<AccountItem[]>(initialAccounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [folderGroup, setFolderGroup] = useState<'ALL' | 'ASET' | 'LIAB_EKUITAS' | 'PEND_BEBAN'>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { success, error } = useToast();

  // Edu Drawer / Accordion state for Slide 3 (Alur Logika Kode Akun) & Slide 1-2 (Saldo Awal)
  const [showLogicGuide, setShowLogicGuide] = useState(false);
  const [showOpeningRule, setShowOpeningRule] = useState(false);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  // Copied code feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Drawer Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AccountItem | null>(null);
  const [formAccountCode, setFormAccountCode] = useState('');
  const [formAccountName, setFormAccountName] = useState('');
  const [formAccountType, setFormAccountType] = useState('Aset Lancar');
  const [formNormalBalance, setFormNormalBalance] = useState<'Debit' | 'Kredit'>('Debit');
  const [formDescription, setFormDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Status confirm modal state
  const [targetItem, setTargetItem] = useState<AccountItem | null>(null);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(false);

  // 6 Tahap Klasifikasi Preset Data (Slide 3)
  const codePresets = [
    {
      code: '1101',
      name: 'Kas',
      level1: '1 = Aset (Harta)',
      level2: '1 = Aset Lancar',
      level3: '0 = Kas dan Bank',
      level4: '1 = Kas Operasional',
      normal: 'Debit',
      rule: 'Aset Lancar bersaldo normal Debit. Saldo awal = Rp 0 di Master Data.',
    },
    {
      code: '1102',
      name: 'Bank BCA',
      level1: '1 = Aset (Harta)',
      level2: '1 = Aset Lancar',
      level3: '0 = Kas dan Bank',
      level4: '2 = Rekening Bank',
      normal: 'Debit',
      rule: 'Rekening bank operasional penampung sewa.',
    },
    {
      code: '1201',
      name: 'Piutang Usaha',
      level1: '1 = Aset (Harta)',
      level2: '1 = Aset Lancar',
      level3: '2 = Piutang',
      level4: '1 = Piutang Sewa Pelanggan',
      normal: 'Debit',
      rule: 'Tagihan sewa alat yang belum dilunasi oleh pelanggan.',
    },
    {
      code: '1501',
      name: 'Peralatan Elektronik Sewa',
      level1: '1 = Aset (Harta)',
      level2: '5 = Aset Tetap',
      level3: '0 = Peralatan',
      level4: '1 = Perangkat Utama HT, Audio & Visual',
      normal: 'Debit',
      rule: 'Aset berwujud bernilai ekonomis lebih dari 1 tahun.',
    },
    {
      code: '1502',
      name: 'Akumulasi Penyusutan Peralatan',
      level1: '1 = Aset (Harta)',
      level2: '5 = Aset Tetap',
      level3: '0 = Akumulasi Penyusutan',
      level4: '2 = Pengurang Nilai Buku Peralatan',
      normal: 'Kredit',
      rule: 'AKUN KONTRA ASET: Meskipun kelompok Aset, bersaldo normal KREDIT.',
    },
    {
      code: '2101',
      name: 'Utang Usaha',
      level1: '2 = Liabilitas (Kewajiban)',
      level2: '1 = Utang Lancar (Jangka Pendek)',
      level3: '0 = Utang Pemasok',
      level4: '1 = Utang Pembelian Alat Sewa',
      normal: 'Kredit',
      rule: 'Kewajiban kepada toko/distributor alat yang jatuh tempo < 1 tahun.',
    },
    {
      code: '3101',
      name: 'Modal Pemilik (Kanal Tiga)',
      level1: '3 = Ekuitas (Modal)',
      level2: '1 = Modal Disetor',
      level3: '0 = Modal Usaha',
      level4: '1 = Setoran Modal Awal',
      normal: 'Kredit',
      rule: 'Hak kepemilikan atas kekayaan bersih usaha rental.',
    },
    {
      code: '4101',
      name: 'Pendapatan Sewa Peralatan',
      level1: '4 = Pendapatan (Revenue)',
      level2: '1 = Pendapatan Operasional Utama',
      level3: '0 = Pendapatan Sewa',
      level4: '1 = Jasa Sewa Alat Komunikasi & Visual',
      normal: 'Kredit',
      rule: 'Penambahan manfaat ekonomi dari kegiatan usaha penyewaan.',
    },
    {
      code: '5101',
      name: 'Beban Gaji & Kru Lapangan',
      level1: '5 = Beban (Expense)',
      level2: '1 = Beban Operasional',
      level3: '0 = Beban SDM',
      level4: '1 = Honor Teknisi & Kru Event',
      normal: 'Debit',
      rule: 'Pengorbanan manfaat ekonomi untuk menunjang jasa penyewaan.',
    },
  ];

  // Auto-update normal balance when type or name changes in form
  useEffect(() => {
    if (isDrawerOpen) {
      const autoBal = getAutoNormalBalance(formAccountType, formAccountName);
      setFormNormalBalance(autoBal);
    }
  }, [formAccountType, formAccountName, isDrawerOpen]);

  // Copy code utility
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  // Open Drawer for Create
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormAccountCode('');
    setFormAccountName('');
    setFormAccountType('Aset Lancar');
    setFormNormalBalance('Debit');
    setFormDescription('');
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
  };

  // Open Drawer for Edit
  const handleOpenEdit = (item: AccountItem) => {
    setEditingItem(item);
    setFormAccountCode(item.accountCode);
    setFormAccountName(item.accountName);
    setFormAccountType(item.accountType);
    setFormNormalBalance(item.normalBalance as any);
    setFormDescription(item.description || '');
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
  };

  // Counts for QUICK ACCESS Drive Folder Cards
  const folderCounts = useMemo(() => {
    const aset = items.filter((i) => i.accountType.includes('Aset')).length;
    const liabEkuitas = items.filter(
      (i) => i.accountType === 'Liabilitas' || i.accountType === 'Ekuitas'
    ).length;
    const pendBeban = items.filter(
      (i) => i.accountType === 'Pendapatan' || i.accountType === 'Beban'
    ).length;
    return {
      all: items.length,
      aset,
      liabEkuitas,
      pendBeban,
    };
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.accountCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchFolder =
        folderGroup === 'ALL' ||
        (folderGroup === 'ASET' && item.accountType.includes('Aset')) ||
        (folderGroup === 'LIAB_EKUITAS' &&
          (item.accountType === 'Liabilitas' || item.accountType === 'Ekuitas')) ||
        (folderGroup === 'PEND_BEBAN' &&
          (item.accountType === 'Pendapatan' || item.accountType === 'Beban'));

      const matchType = typeFilter === 'ALL' || item.accountType === typeFilter;

      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && item.isActive) ||
        (statusFilter === 'INACTIVE' && !item.isActive);

      return matchSearch && matchFolder && matchType && matchStatus;
    });
  }, [items, searchTerm, folderGroup, typeFilter, statusFilter]);

  // Pagination calculations
  const totalFiltered = filteredItems.length;
  const totalPages = Math.ceil(totalFiltered / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Handle Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const codeRegex = /^[1-5]-\d{2}-\d{2}$/;
    if (!codeRegex.test(formAccountCode)) {
      setFormErrors({ accountCode: 'Format kode wajib X-YY-ZZ (contoh: 1-01-01)' });
      return;
    }

    if (formAccountName.trim().length < 3) {
      setFormErrors({ accountName: 'Nama akun minimal 3 karakter' });
      return;
    }

    setIsSaving(true);
    const formData = new FormData();
    formData.append('accountCode', formAccountCode.trim());
    formData.append('accountName', formAccountName.trim());
    formData.append('accountType', formAccountType);
    formData.append('normalBalance', formNormalBalance);
    formData.append('initialBalance', '0');
    formData.append('description', formDescription.trim());

    try {
      if (editingItem) {
        const res = await updateAccountAction(editingItem.id, formData);
        if (res.success) {
          success(res.message);
          setItems((prev) =>
            prev.map((acc) =>
              acc.id === editingItem.id
                ? {
                    ...acc,
                    accountName: formAccountName.trim(),
                    accountType: formAccountType,
                    normalBalance: formNormalBalance,
                    initialBalance: 0,
                    description: formDescription.trim() || null,
                  }
                : acc
            )
          );
          setIsDrawerOpen(false);
        } else {
          error(res.message);
        }
      } else {
        const res = await createAccountAction(formData);
        if (res.success) {
          success(res.message);
          const newAccount: AccountItem = {
            id: Date.now(),
            accountCode: formAccountCode.trim(),
            accountName: formAccountName.trim(),
            accountType: formAccountType,
            normalBalance: formNormalBalance,
            initialBalance: 0,
            description: formDescription.trim() || null,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setItems((prev) => [newAccount, ...prev]);
          setIsDrawerOpen(false);
        } else {
          error(res.message);
        }
      }
    } catch {
      error('Terjadi kesalahan koneksi saat menyimpan akun.');
    } finally {
      setIsSaving(false);
    }
  };

  // Status toggle handler
  const handleOpenStatusConfirm = (item: AccountItem) => {
    setTargetItem(item);
    setShowStatusConfirm(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (!targetItem) return;
    setIsStatusLoading(true);

    try {
      const res = await toggleAccountStatusAction(targetItem.id);
      if (res.success) {
        success(res.message);
        setItems((prev) =>
          prev.map((acc) =>
            acc.id === targetItem.id ? { ...acc, isActive: !acc.isActive } : acc
          )
        );
        setShowStatusConfirm(false);
      } else {
        error(res.message);
      }
    } catch {
      error('Gagal memperbarui status akun.');
    } finally {
      setIsStatusLoading(false);
    }
  };

  // Kotak ikon warna di kolom pertama tabel ala ALL FILES image.png
  const getAccountBoxStyle = (type: string) => {
    if (type.includes('Aset')) return 'bg-[#2563EB] text-white';
    if (type === 'Liabilitas') return 'bg-[#E11D48] text-white';
    if (type === 'Ekuitas') return 'bg-[#7C3AED] text-white';
    if (type === 'Pendapatan') return 'bg-[#059669] text-white';
    return 'bg-[#F79721] text-white';
  };

  const activePreset = codePresets[selectedPresetIndex];

  return (
    <div className="space-y-8 pb-12">
      {/* TIER 1: Page Title Row (Persis "Design" + Orange Square Icon di image.png) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#111827] tracking-tight">
            Akun Akuntansi
          </h1>
          <div className="w-9 h-9 rounded-xl bg-[#F79721] text-white flex items-center justify-center shadow-sm shadow-[#F79721]/25">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>

        {/* Tombol Utilitas Kanan */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowOpeningRule(!showOpeningRule)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              showOpeningRule
                ? 'bg-[#2563EB] text-white'
                : 'bg-[#F4F5F7] hover:bg-[#E5E7EB] text-[#111827]'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Kaidah Saldo Awal Rp 0</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLogicGuide(!showLogicGuide)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              showLogicGuide
                ? 'bg-[#111827] text-white'
                : 'bg-[#F4F5F7] hover:bg-[#E5E7EB] text-[#111827]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F79721]" />
            <span>Alur Kode 4-Digit (Slide 3)</span>
            {showLogicGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F79721] hover:bg-[#E07F0B] text-white font-bold text-xs shadow-sm shadow-[#F79721]/25 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah Akun</span>
          </button>
        </div>
      </div>

      {/* Collapsible Banner 1: Kaidah Baku Saldo Awal Rp 0 (Slide 1 & 2) */}
      {showOpeningRule && (
        <div className="p-5 rounded-2xl bg-[#F4F5F7] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-150">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <div className="text-xs text-[#6B7280] leading-relaxed">
              <strong className="block font-extrabold text-[#111827] text-sm mb-0.5">
                Kaidah Baku Master Data Akuntansi (Slide 1 &amp; 2): Saldo Awal Otomatis Rp 0
              </strong>
              <span>
                Pada menu Master Data, saldo awal diatur otomatis bernilai 0 untuk semua akun karena Master Data hanya mendefinisikan struktur akun. Input saldo awal dilakukan secara terpisah melalui menu <strong>Jurnal Penyesuaian &rarr; Input Saldo Awal (Opening Balance)</strong> pada awal periode akuntansi.
              </span>
            </div>
          </div>
          <Link
            href="/simulasi-debit-kredit"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-xs font-bold text-[#111827] hover:text-[#F79721] shrink-0 shadow-2xs"
          >
            <span>Buka Simulasi Debit-Kredit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Collapsible Panel 2: Alur Logika Pengklasifikasian Akun (Slide 3) */}
      {showLogicGuide && (
        <div className="bg-[#F4F5F7] rounded-2xl p-6 space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E7EB]">
            <div>
              <h2 className="text-sm font-extrabold text-[#111827] uppercase tracking-wider">
                Alur Logika Pengklasifikasian Akun ke dalam Kode Akun (Slide 3)
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Struktur hierarkis 4 Level menentukan setiap digit kode akun secara sistematis dan seragam.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-white text-[#F79721]">
              4 Level Hierarki Akuntansi
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 text-xs">
            <div className="p-3.5 rounded-xl bg-white">
              <span className="font-mono font-bold text-xs text-[#F79721] block mb-1">Tahap 1</span>
              <p className="font-bold text-[#111827]">Laporan Keuangan</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">Kenali 5 kelompok utama akun.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white">
              <span className="font-mono font-bold text-xs text-[#F79721] block mb-1">Tahap 2</span>
              <p className="font-bold text-[#111827]">Kelompok (L1)</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">1=Aset, 2=Liab, 3=Ekuitas, 4=Pend, 5=Beban.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white">
              <span className="font-mono font-bold text-xs text-[#F79721] block mb-1">Tahap 3</span>
              <p className="font-bold text-[#111827]">Sub-Kelompok (L2)</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">Aset Lancar, Aset Tetap, Utang Lancar.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white">
              <span className="font-mono font-bold text-xs text-[#F79721] block mb-1">Tahap 4</span>
              <p className="font-bold text-[#111827]">Jenis Akun (L3)</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">Kas &amp; Bank, Piutang, Peralatan.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white">
              <span className="font-mono font-bold text-xs text-[#F79721] block mb-1">Tahap 5</span>
              <p className="font-bold text-[#111827]">Nomor Urut (L4)</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">1101 = Kas, 1102 = Bank BCA.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#ECFDF5]">
              <span className="font-mono font-bold text-xs text-[#059669] block mb-1">Tahap 6</span>
              <p className="font-bold text-[#065F46]">Master Data</p>
              <p className="text-[11px] text-[#047857] mt-0.5">Saldo awal Rp 0 &amp; status aktif.</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[#6B7280] block">
              Pilih Contoh Akun untuk Melihat Anatomi Logika Kodenya:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {codePresets.map((item, index) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setSelectedPresetIndex(index)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                    selectedPresetIndex === index
                      ? 'bg-[#F79721] text-white shadow-xs'
                      : 'bg-white hover:bg-[#FFF7ED] text-[#6B7280]'
                  }`}
                >
                  {item.code} - {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#111827]">Dekonstruksi Kode:</span>
                <span className="font-mono font-extrabold text-sm px-3 py-0.5 rounded-full bg-[#FFF7ED] text-[#F79721]">
                  {activePreset.code} = {activePreset.name}
                </span>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB]">
                Saldo Normal: {activePreset.normal}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-[#F4F5F7] p-3 rounded-xl text-center">
                <span className="text-[10px] font-bold text-[#9CA3AF] uppercase block">Level 1 (Kelompok)</span>
                <span className="text-base font-extrabold font-mono text-[#F79721] my-1 block">
                  {activePreset.code[0]}
                </span>
                <span className="text-[11px] font-semibold text-[#111827]">{activePreset.level1}</span>
              </div>
              <div className="bg-[#F4F5F7] p-3 rounded-xl text-center">
                <span className="text-[10px] font-bold text-[#9CA3AF] uppercase block">Level 2 (Sub-Kelompok)</span>
                <span className="text-base font-extrabold font-mono text-[#F79721] my-1 block">
                  {activePreset.code[1]}
                </span>
                <span className="text-[11px] font-semibold text-[#111827]">{activePreset.level2}</span>
              </div>
              <div className="bg-[#F4F5F7] p-3 rounded-xl text-center">
                <span className="text-[10px] font-bold text-[#9CA3AF] uppercase block">Level 3 (Jenis Akun)</span>
                <span className="text-base font-extrabold font-mono text-[#F79721] my-1 block">
                  {activePreset.code[2]}
                </span>
                <span className="text-[11px] font-semibold text-[#111827]">{activePreset.level3}</span>
              </div>
              <div className="bg-[#F4F5F7] p-3 rounded-xl text-center">
                <span className="text-[10px] font-bold text-[#9CA3AF] uppercase block">Level 4 (Nomor Urut)</span>
                <span className="text-base font-extrabold font-mono text-[#F79721] my-1 block">
                  {activePreset.code[3]}
                </span>
                <span className="text-[11px] font-semibold text-[#111827]">{activePreset.level4}</span>
              </div>
            </div>
            <p className="text-[11px] text-[#6B7280] italic">{activePreset.rule}</p>
          </div>
        </div>
      )}

      {/* TIER 2: QUICK ACCESS — KELOMPOK AKUN (4 Kartu Folder Interaktif seperti image.png) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] font-extrabold text-[#9CA3AF] uppercase tracking-[0.12em]">
            QUICK ACCESS — KELOMPOK AKUN (KLIK UNTUK MENYARING)
          </h2>
          {folderGroup !== 'ALL' && (
            <button
              type="button"
              onClick={() => {
                setFolderGroup('ALL');
                setTypeFilter('ALL');
                setCurrentPage(1);
              }}
              className="text-xs font-bold text-[#F79721] hover:underline"
            >
              Reset Filter Kelompok
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <DriveFolderCard
            title="Semua Bagan Akun"
            subtitle="Seluruh kode 1-xxxx s/d 5-xxxx • Saldo Awal Rp 0"
            metricLabel={`${folderCounts.all} Akun`}
            isActive={folderGroup === 'ALL'}
            onClick={() => {
              setFolderGroup('ALL');
              setTypeFilter('ALL');
              setCurrentPage(1);
            }}
            badges={[
              { label: '1', bgColor: 'bg-[#2563EB]' },
              { label: '2', bgColor: 'bg-[#E11D48]' },
              { label: '3', bgColor: 'bg-[#7C3AED]' },
            ]}
          />

          <DriveFolderCard
            title="Kelompok Aset"
            subtitle="Aset Lancar & Aset Tetap • Saldo Normal Debit"
            metricLabel={`${folderCounts.aset} Akun`}
            isActive={folderGroup === 'ASET'}
            onClick={() => {
              setFolderGroup('ASET');
              setTypeFilter('ALL');
              setCurrentPage(1);
            }}
            badges={[
              { label: '11', bgColor: 'bg-[#2563EB]' },
              { label: '15', bgColor: 'bg-[#059669]' },
              { label: 'D+', bgColor: 'bg-[#111827]' },
            ]}
          />

          <DriveFolderCard
            title="Liabilitas & Ekuitas"
            subtitle="Utang Usaha & Modal • Saldo Normal Kredit"
            metricLabel={`${folderCounts.liabEkuitas} Akun`}
            isActive={folderGroup === 'LIAB_EKUITAS'}
            onClick={() => {
              setFolderGroup('LIAB_EKUITAS');
              setTypeFilter('ALL');
              setCurrentPage(1);
            }}
            badges={[
              { label: '21', bgColor: 'bg-[#E11D48]' },
              { label: '31', bgColor: 'bg-[#7C3AED]' },
              { label: 'K+', bgColor: 'bg-[#111827]' },
            ]}
          />

          <DriveFolderCard
            title="Pendapatan & Beban"
            subtitle="Laba Rugi Operasional • Kode 4-xxxx & 5-xxxx"
            metricLabel={`${folderCounts.pendBeban} Akun`}
            isActive={folderGroup === 'PEND_BEBAN'}
            onClick={() => {
              setFolderGroup('PEND_BEBAN');
              setTypeFilter('ALL');
              setCurrentPage(1);
            }}
            badges={[
              { label: '41', bgColor: 'bg-[#059669]' },
              { label: '51', bgColor: 'bg-[#F79721]' },
              { label: 'LR', bgColor: 'bg-[#111827]' },
            ]}
          />
        </div>
      </section>

      {/* TIER 3: ALL FILES Style Header + Pill Search/Filter + Clean Borderless Table */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-[11px] font-extrabold text-[#9CA3AF] uppercase tracking-[0.12em]">
            DAFTAR AKUN AKUNTANSI ({totalFiltered} AKUN)
          </h2>

          {/* Pill Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari kode atau nama akun..."
                className="w-full pl-9 pr-4 py-2 bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] rounded-full text-xs font-medium text-[#111827] placeholder-[#9CA3AF] outline-none transition-all"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3.5 py-2 bg-[#F4F5F7] hover:bg-[#E5E7EB]/60 rounded-full text-xs font-bold text-[#111827] outline-none cursor-pointer"
            >
              <option value="ALL">Semua Sub-Tipe</option>
              <option value="Aset Lancar">Aset Lancar</option>
              <option value="Aset Tetap">Aset Tetap</option>
              <option value="Liabilitas">Liabilitas</option>
              <option value="Ekuitas">Ekuitas</option>
              <option value="Pendapatan">Pendapatan</option>
              <option value="Beban">Beban</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-3.5 py-2 bg-[#F4F5F7] hover:bg-[#E5E7EB]/60 rounded-full text-xs font-bold text-[#111827] outline-none cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="ACTIVE">Aktif Saja</option>
              <option value="INACTIVE">Nonaktif Saja</option>
            </select>
          </div>
        </div>

        {/* Clean Borderless-Column Table (ALL FILES Style from image.png) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F4F5F7] text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-wider">
                <th className="py-3 px-4">Nama &amp; Kode Akun</th>
                <th className="py-3 px-4">Kelompok Akun</th>
                <th className="py-3 px-4">Saldo Normal</th>
                <th className="py-3 px-4">
                  <span className="inline-flex items-center gap-1">
                    <span>Saldo Awal</span>
                    <Lock className="w-3 h-3 text-[#9CA3AF]" />
                  </span>
                </th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F5F7] text-xs">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#6B7280]">
                    <BookOpen className="w-8 h-8 text-[#D1D5DB] mx-auto mb-2" />
                    <p className="font-bold text-xs text-[#111827]">
                      Tidak ada data akun yang sesuai filter.
                    </p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                      Coba ubah kata kunci pencarian atau pilih kartu folder Semua Bagan Akun.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#FFF7ED]/80 transition-colors group ${
                      !item.isActive ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Kolom 1: Kotak Ikon Warna + Nama Akun + Kode Monospace */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-extrabold text-xs shrink-0 shadow-2xs ${getAccountBoxStyle(
                            item.accountType
                          )}`}
                        >
                          {item.accountCode.slice(0, 1)}
                        </div>
                        <div>
                          <p className="font-bold text-[#111827] text-[13px] leading-snug">
                            {item.accountName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-semibold text-[11px] text-[#9CA3AF]">
                              {item.accountCode}
                            </span>
                            {item.description && (
                              <span className="text-[11px] text-[#9CA3AF] truncate max-w-[220px] hidden sm:inline">
                                • {item.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Kolom 2: Kelompok Akun */}
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold text-[#6B7280]">
                        {item.accountType}
                      </span>
                    </td>

                    {/* Kolom 3: Saldo Normal */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.normalBalance === 'Debit'
                            ? 'bg-[#EFF6FF] text-[#2563EB]'
                            : 'bg-[#FFF7ED] text-[#D97005]'
                        }`}
                      >
                        {item.normalBalance}
                      </span>
                    </td>

                    {/* Kolom 4: Saldo Awal (Selalu Rp 0) */}
                    <td className="py-3.5 px-4">
                      <span
                        className="font-mono font-bold text-xs text-[#6B7280]"
                        title="Saldo awal pada master data selalu bernilai 0"
                      >
                        Rp 0
                      </span>
                    </td>

                    {/* Kolom 5: Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold ${
                          item.isActive ? 'text-[#059669]' : 'text-[#E11D48]'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.isActive ? 'bg-[#10B981]' : 'bg-[#F43F5E]'
                          }`}
                        />
                        <span>{item.isActive ? 'Aktif' : 'Nonaktif'}</span>
                      </span>
                    </td>

                    {/* Kolom 6: Tombol Aksi Kanan (Link/Salin Kode + Edit + Power) */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleCopyCode(item.accountCode)}
                          className="p-2 rounded-full text-[#9CA3AF] hover:text-[#111827] hover:bg-white transition-colors"
                          title="Salin kode akun"
                        >
                          {copiedCode === item.accountCode ? (
                            <Check className="w-3.5 h-3.5 text-[#059669]" />
                          ) : (
                            <Link2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-full text-[#9CA3AF] hover:text-[#111827] hover:bg-white transition-colors"
                          title="Ubah data akun"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenStatusConfirm(item)}
                          className={`p-2 rounded-full transition-colors ${
                            item.isActive
                              ? 'text-[#9CA3AF] hover:text-[#E11D48] hover:bg-white'
                              : 'text-[#9CA3AF] hover:text-[#059669] hover:bg-white'
                          }`}
                          title={item.isActive ? 'Nonaktifkan akun' : 'Aktifkan akun'}
                        >
                          {item.isActive ? (
                            <PowerOff className="w-3.5 h-3.5" />
                          ) : (
                            <Power className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Clean Pagination Footer */}
        <div className="pt-3 border-t border-[#F4F5F7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7280]">
          <div>
            Menampilkan <strong className="text-[#111827]">{paginatedItems.length}</strong> dari{' '}
            <strong className="text-[#111827]">{totalFiltered}</strong> akun
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-full bg-[#F4F5F7] hover:bg-[#E5E7EB] disabled:opacity-40 disabled:cursor-not-allowed text-[#111827] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3.5 py-1.5 rounded-full bg-[#F4F5F7] font-mono font-bold text-xs text-[#111827]">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-full bg-[#F4F5F7] hover:bg-[#E5E7EB] disabled:opacity-40 disabled:cursor-not-allowed text-[#111827] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Slide-Over Drawer Form (Tambah / Edit Akun) */}
      <SlideOverDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingItem ? 'Ubah Data Akun Akuntansi' : 'Tambah Akun Akuntansi Baru'}
        subtitle="Master Data hanya mendefinisikan akun. Saldo awal diatur otomatis bernilai Rp 0."
        isDirty={isDirty}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#111827] mb-1">
              Kode Akun (Format X-YY-ZZ) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formAccountCode}
              disabled={!!editingItem}
              onChange={(e) => {
                setFormAccountCode(e.target.value.toUpperCase());
                setIsDirty(true);
              }}
              placeholder="Contoh: 1-01-01"
              className="w-full px-3.5 py-2.5 bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] rounded-xl font-mono text-xs font-bold text-[#111827] outline-none transition-colors disabled:opacity-60"
            />
            {formErrors.accountCode && (
              <p className="text-[11px] text-rose-600 mt-1">{formErrors.accountCode}</p>
            )}
            <p className="text-[10px] text-[#6B7280] mt-1">
              Digit 1: Kelompok Akun (1=Aset, 2=Liab, 3=Ekuitas, 4=Pend, 5=Beban).
            </p>
          </div>

          <div>
            <label className="block font-bold text-[#111827] mb-1">
              Nama Akun <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formAccountName}
              onChange={(e) => {
                setFormAccountName(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Contoh: Kas Operasional, Piutang Sewa"
              className="w-full px-3.5 py-2.5 bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] rounded-xl text-xs text-[#111827] outline-none transition-colors"
            />
            {formErrors.accountName && (
              <p className="text-[11px] text-rose-600 mt-1">{formErrors.accountName}</p>
            )}
          </div>

          <div>
            <label className="block font-bold text-[#111827] mb-1">
              Tipe / Kelompok Akun <span className="text-rose-500">*</span>
            </label>
            <select
              value={formAccountType}
              onChange={(e) => {
                setFormAccountType(e.target.value);
                setIsDirty(true);
              }}
              className="w-full px-3.5 py-2.5 bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] rounded-xl text-xs font-semibold text-[#111827] outline-none transition-colors"
            >
              <option value="Aset Lancar">Aset Lancar</option>
              <option value="Aset Tetap">Aset Tetap</option>
              <option value="Liabilitas">Liabilitas (Kewajiban)</option>
              <option value="Ekuitas">Ekuitas (Modal)</option>
              <option value="Pendapatan">Pendapatan (Revenue)</option>
              <option value="Beban">Beban (Expense)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#111827] mb-1">
              Saldo Normal
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setFormNormalBalance('Debit');
                  setIsDirty(true);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold font-mono transition-all ${
                  formNormalBalance === 'Debit'
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-[#F4F5F7] text-[#6B7280]'
                }`}
              >
                DEBIT
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormNormalBalance('Kredit');
                  setIsDirty(true);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold font-mono transition-all ${
                  formNormalBalance === 'Kredit'
                    ? 'bg-[#F79721] text-white'
                    : 'bg-[#F4F5F7] text-[#6B7280]'
                }`}
              >
                KREDIT
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F4F5F7] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#111827] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Saldo Awal (Rp): 0</span>
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white text-[#2563EB]">
                Terkunci Otomatis
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280] leading-relaxed">
              Sesuai kaidah Slide 1-3, Master Data tidak menyimpan saldo awal periode.
            </p>
          </div>

          <div>
            <label className="block font-bold text-[#111827] mb-1">
              Keterangan Operasional (Opsional)
            </label>
            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => {
                setFormDescription(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Contoh: Rekening utama transfer pelanggan sewa alat"
              className="w-full px-3.5 py-2 bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] rounded-xl text-xs text-[#111827] outline-none transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#F4F5F7]">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="px-4 py-2 rounded-full bg-[#F4F5F7] hover:bg-[#E5E7EB] text-xs font-bold text-[#6B7280] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#F79721] hover:bg-[#E07F0B] text-white font-bold text-xs shadow-xs transition-all active:scale-95 disabled:opacity-60"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{editingItem ? 'Simpan Perubahan' : 'Buat Akun'}</span>
            </button>
          </div>
        </form>
      </SlideOverDrawer>

      {/* Confirmation Modal Status Toggle */}
      <ConfirmModal
        isOpen={showStatusConfirm}
        onClose={() => setShowStatusConfirm(false)}
        onConfirm={handleConfirmToggleStatus}
        title={targetItem?.isActive ? 'Nonaktifkan Akun Akuntansi' : 'Aktifkan Kembali Akun'}
        message={
          targetItem?.isActive
            ? `Apakah Anda yakin ingin menonaktifkan akun "${targetItem?.accountCode} - ${targetItem?.accountName}"? Akun nonaktif tidak akan muncul di opsi transaksi baru.`
            : `Apakah Anda ingin mengaktifkan kembali akun "${targetItem?.accountCode} - ${targetItem?.accountName}" agar dapat digunakan dalam transaksi?`
        }
        confirmText={targetItem?.isActive ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'}
        cancelText="Batal"
        isLoading={isStatusLoading}
      />
    </div>
  );
}
