'use client';

import React, { useState, useMemo } from 'react';
import { SessionPayload } from '@/lib/permissions';
import {
  Truck,
  Search,
  Plus,
  Power,
  PowerOff,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Link2,
  Check,
} from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { SlideOverDrawer } from '@/components/ui/SlideOverDrawer';
import { DriveFolderCard, DriveSummaryCard } from '@/components/ui/DriveFolderCard';
import { useToast } from '@/components/ui/Toast';
import {
  createSupplierAction,
  updateSupplierAction,
  toggleSupplierStatusAction,
} from '@/actions/supplier-actions';
import { getNextSupplierCodeAction } from '@/actions/code-actions';

export interface SupplierItem {
  id: number;
  supplierCode: string;
  supplierName: string;
  contactPerson: string | null;
  phone: string;
  email: string | null;
  address: string | null;
  categorySupplied: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SuppliersClientProps {
  currentUser: SessionPayload;
  initialSuppliers: SupplierItem[];
}

export function SuppliersClient({
  currentUser,
  initialSuppliers,
}: SuppliersClientProps) {
  const [items, setItems] = useState<SupplierItem[]>(initialSuppliers);
  const [searchTerm, setSearchTerm] = useState('');
  const [catGroup, setCatGroup] = useState<'ALL' | 'HT_KOM' | 'AV_LIGHT'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const pageSize = 10;
  const { success, error } = useToast();

  // Drawer Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SupplierItem | null>(null);
  const [formSupplierCode, setFormSupplierCode] = useState('');
  const [formSupplierName, setFormSupplierName] = useState('');
  const [formCategorySupplied, setFormCategorySupplied] = useState('HT & Alat Komunikasi');
  const [formContactPerson, setFormContactPerson] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoCodeLoading, setIsAutoCodeLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Status confirm modal state
  const [targetItem, setTargetItem] = useState<SupplierItem | null>(null);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(false);

  const supplierCategories = [
    'HT & Alat Komunikasi',
    'Proyektor & Visual',
    'Audio & Sound System',
    'Pencahayaan & Lighting',
    'Kabel, Stopkontak & Aksesori',
    'Komponen & Servis Elektronik',
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  // Open Drawer for Create
  const handleOpenCreate = async () => {
    setEditingItem(null);
    setFormSupplierName('');
    setFormCategorySupplied('HT & Alat Komunikasi');
    setFormContactPerson('');
    setFormPhone('');
    setFormEmail('');
    setFormAddress('');
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);

    setIsAutoCodeLoading(true);
    try {
      const nextCode = await getNextSupplierCodeAction();
      setFormSupplierCode(nextCode);
    } catch {
      setFormSupplierCode('SUP007');
    } finally {
      setIsAutoCodeLoading(false);
    }
  };

  // Open Drawer for Edit
  const handleOpenEdit = (item: SupplierItem) => {
    setEditingItem(item);
    setFormSupplierCode(item.supplierCode);
    setFormSupplierName(item.supplierName);
    setFormCategorySupplied(item.categorySupplied || 'HT & Alat Komunikasi');
    setFormContactPerson(item.contactPerson || '');
    setFormPhone(item.phone || '');
    setFormEmail(item.email || '');
    setFormAddress(item.address || '');
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
  };

  // Folder Counts
  const folderCounts = useMemo(() => {
    const ht = items.filter(
      (i) =>
        (i.categorySupplied || '').toLowerCase().includes('ht') ||
        (i.categorySupplied || '').toLowerCase().includes('komunikasi')
    ).length;
    return {
      all: items.length,
      ht,
      other: items.length - ht,
    };
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.supplierCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.contactPerson && item.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.categorySupplied && item.categorySupplied.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.address && item.address.toLowerCase().includes(searchTerm.toLowerCase()));

      const isHt =
        (item.categorySupplied || '').toLowerCase().includes('ht') ||
        (item.categorySupplied || '').toLowerCase().includes('komunikasi');

      const matchGroup =
        catGroup === 'ALL' ||
        (catGroup === 'HT_KOM' && isHt) ||
        (catGroup === 'AV_LIGHT' && !isHt);

      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && item.isActive) ||
        (statusFilter === 'INACTIVE' && !item.isActive);

      return matchSearch && matchGroup && matchStatus;
    });
  }, [items, searchTerm, catGroup, statusFilter]);

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

    if (!formSupplierName.trim() || formSupplierName.trim().length < 3) {
      setFormErrors({ supplierName: 'Nama pemasok minimal 3 karakter' });
      return;
    }

    if (!formPhone.trim() || formPhone.trim().length < 5) {
      setFormErrors({ phone: 'Nomor telepon minimal 5 digit' });
      return;
    }

    setIsSaving(true);
    const formData = new FormData();
    formData.append('supplierCode', formSupplierCode);
    formData.append('supplierName', formSupplierName);
    formData.append('categorySupplied', formCategorySupplied);
    formData.append('contactPerson', formContactPerson);
    formData.append('phone', formPhone);
    formData.append('email', formEmail);
    formData.append('address', formAddress);

    try {
      if (editingItem) {
        const res = await updateSupplierAction(editingItem.id, formData);
        if (res.success) {
          setItems((prev) =>
            prev.map((s) =>
              s.id === editingItem.id
                ? {
                    ...s,
                    supplierName: formSupplierName,
                    categorySupplied: formCategorySupplied,
                    contactPerson: formContactPerson || null,
                    phone: formPhone,
                    email: formEmail || null,
                    address: formAddress || null,
                  }
                : s
            )
          );
          success(res.message, 'Berhasil Disimpan');
          setIsDrawerOpen(false);
          setIsDirty(false);
        } else {
          error(res.message, 'Gagal Menyimpan');
        }
      } else {
        const res = await createSupplierAction(formData);
        if (res.success) {
          const newItem: SupplierItem = {
            id: Date.now(),
            supplierCode: formSupplierCode,
            supplierName: formSupplierName,
            categorySupplied: formCategorySupplied,
            contactPerson: formContactPerson || null,
            phone: formPhone,
            email: formEmail || null,
            address: formAddress || null,
            isActive: true,
          };
          setItems((prev) =>
            [...prev, newItem].sort((a, b) => a.supplierCode.localeCompare(b.supplierCode))
          );
          success(res.message, 'Berhasil Ditambahkan');
          setIsDrawerOpen(false);
          setIsDirty(false);
        } else {
          error(res.message, 'Gagal Menyimpan');
        }
      }
    } catch (err: any) {
      error(err?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatusClick = (item: SupplierItem) => {
    setTargetItem(item);
    setShowStatusConfirm(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (!targetItem) return;
    setIsStatusLoading(true);
    try {
      const res = await toggleSupplierStatusAction(targetItem.id);
      if (res.success) {
        setItems((prev) =>
          prev.map((s) =>
            s.id === targetItem.id ? { ...s, isActive: !s.isActive } : s
          )
        );
        success(res.message, 'Status Diperbarui');
        setShowStatusConfirm(false);
        setTargetItem(null);
      } else {
        error(res.message, 'Gagal Mengubah Status');
      }
    } catch (err: any) {
      error(err?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsStatusLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* TIER 1: Page Title Row (Persis "Design" + Orange Square Icon di image.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#111827] tracking-tight">
            Pemasok (Supplier)
          </h1>
          <div className="w-9 h-9 rounded-xl bg-[#F79721] text-white flex items-center justify-center shadow-sm shadow-[#F79721]/25">
            <Truck className="w-4 h-4" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F79721] hover:bg-[#E07F0B] text-white font-bold text-xs shadow-sm shadow-[#F79721]/25 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Pemasok</span>
        </button>
      </div>

      {/* TIER 2: QUICK ACCESS — KATEGORI PEMASOK (4 Kartu Folder Interaktif) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] font-extrabold text-[#9CA3AF] uppercase tracking-[0.12em]">
            QUICK ACCESS — KATEGORI VENDOR &amp; PEMASOK
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <DriveFolderCard
            title="Semua Pemasok"
            subtitle="Rekanan toko & distributor resmi alat sewa"
            metricLabel={`${folderCounts.all} Mitra`}
            isActive={catGroup === 'ALL'}
            onClick={() => {
              setCatGroup('ALL');
              setCurrentPage(1);
            }}
            badges={[
              { label: 'S1', bgColor: 'bg-[#7C3AED]' },
              { label: 'S2', bgColor: 'bg-[#2563EB]' },
              { label: 'S3', bgColor: 'bg-[#059669]' },
            ]}
          />

          <DriveFolderCard
            title="Vendor HT & Radio"
            subtitle="Distributor Handy Talky, Baterai & Antena"
            metricLabel={`${folderCounts.ht} Pemasok`}
            isActive={catGroup === 'HT_KOM'}
            onClick={() => {
              setCatGroup('HT_KOM');
              setCurrentPage(1);
            }}
            badges={[
              { label: 'HT', bgColor: 'bg-[#2563EB]' },
              { label: 'RF', bgColor: 'bg-[#111827]' },
            ]}
          />

          <DriveFolderCard
            title="Audio, Visual & Kabel"
            subtitle="Proyektor, Speaker Portable & Kelistrikan"
            metricLabel={`${folderCounts.other} Pemasok`}
            isActive={catGroup === 'AV_LIGHT'}
            onClick={() => {
              setCatGroup('AV_LIGHT');
              setCurrentPage(1);
            }}
            badges={[
              { label: 'AV', bgColor: 'bg-[#7C3AED]' },
              { label: 'EL', bgColor: 'bg-[#F79721]' },
            ]}
          />

          <DriveSummaryCard
            category="RELASI AKUNTANSI"
            title="Akun Utang Usaha"
            subtitle="Pembelian peralatan secara kredit dicatat ke akun 2-01-01 (Utang Usaha)"
            metricLabel="2-01-01 (Kredit +)"
            icon={<Truck className="w-5 h-5" />}
            href="/akun"
          />
        </div>
      </section>

      {/* TIER 3: ALL FILES Style Header + Pill Search + Borderless Table */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-[11px] font-extrabold text-[#9CA3AF] uppercase tracking-[0.12em]">
            DAFTAR MITRA PEMASOK ({totalFiltered} VENDOR)
          </h2>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari kode pemasok, nama, atau PIC..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] rounded-full text-xs font-medium text-[#111827] placeholder-[#9CA3AF] outline-none transition-all"
              />
            </div>

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

        {/* Clean Borderless Table (ALL FILES Style) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F4F5F7] text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-wider">
                <th className="py-3 px-4">Nama &amp; Kode Pemasok</th>
                <th className="py-3 px-4">Kategori Pasokan</th>
                <th className="py-3 px-4">Kontak Person (PIC)</th>
                <th className="py-3 px-4">Telepon</th>
                <th className="py-3 px-4">Alamat / Kota</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F5F7] text-xs">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#6B7280]">
                    Tidak ada data pemasok yang sesuai dengan filter pencarian.
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
                    {/* Kolom 1: Kotak Ikon Warna + Nama + Kode */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center font-mono font-extrabold text-[11px] shrink-0 shadow-2xs">
                          SUP
                        </div>
                        <div>
                          <p className="font-bold text-[#111827] text-[13px] leading-snug">
                            {item.supplierName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-semibold text-[11px] text-[#9CA3AF]">
                              {item.supplierCode}
                            </span>
                            {item.email && (
                              <span className="text-[11px] text-[#9CA3AF] truncate max-w-[180px] hidden sm:inline">
                                • {item.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F4F5F7] text-[#111827]">
                        {item.categorySupplied || 'Peralatan Umum'}
                      </span>
                    </td>

                    {/* Kolom PIC dengan Avatar Lingkaran Kecil ala "Owner" di image.png */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#FFF7ED] text-[#F79721] font-extrabold text-[10px] flex items-center justify-center shrink-0">
                          {(item.contactPerson || 'P').slice(0, 1).toUpperCase()}
                        </div>
                        <span className="font-semibold text-[#111827]">
                          {item.contactPerson || '-'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-[#6B7280]">
                      {item.phone}
                    </td>

                    <td className="py-3.5 px-4 text-[#6B7280] max-w-xs truncate">
                      {item.address || '-'}
                    </td>

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

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleCopyCode(item.supplierCode)}
                          className="p-2 rounded-full text-[#9CA3AF] hover:text-[#111827] hover:bg-white transition-colors"
                          title="Salin kode pemasok"
                        >
                          {copiedCode === item.supplierCode ? (
                            <Check className="w-3.5 h-3.5 text-[#059669]" />
                          ) : (
                            <Link2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-full text-[#9CA3AF] hover:text-[#111827] hover:bg-white transition-colors"
                          title="Edit Pemasok"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatusClick(item)}
                          className={`p-2 rounded-full transition-colors ${
                            item.isActive
                              ? 'text-[#9CA3AF] hover:text-[#E11D48] hover:bg-white'
                              : 'text-[#9CA3AF] hover:text-[#059669] hover:bg-white'
                          }`}
                          title={item.isActive ? 'Nonaktifkan Pemasok' : 'Aktifkan Pemasok'}
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
          <p>
            Menampilkan <strong className="text-[#111827]">{paginatedItems.length}</strong> dari{' '}
            <strong className="text-[#111827]">{totalFiltered}</strong> data pemasok
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 rounded-full bg-[#F4F5F7] hover:bg-[#E5E7EB] disabled:opacity-40 disabled:cursor-not-allowed text-[#111827]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3.5 py-1.5 font-mono font-bold text-xs bg-[#F4F5F7] rounded-full text-[#111827]">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 rounded-full bg-[#F4F5F7] hover:bg-[#E5E7EB] disabled:opacity-40 disabled:cursor-not-allowed text-[#111827]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SlideOverDrawer Form */}
      <SlideOverDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingItem ? 'Edit Mitra Pemasok' : 'Tambah Mitra Pemasok'}
        subtitle={
          editingItem
            ? `Perbarui informasi pemasok ${editingItem.supplierCode}`
            : 'Daftarkan vendor atau toko penyedia peralatan rental baru'
        }
        isDirty={isDirty}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Kode Pemasok (Otomatis) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                disabled={!!editingItem || isAutoCodeLoading}
                placeholder="Contoh: SUP007"
                value={formSupplierCode}
                onChange={(e) => {
                  setFormSupplierCode(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl bg-[#F4F5F7] text-[#111827] outline-none disabled:opacity-60"
              />
              {isAutoCodeLoading && (
                <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-3 text-[#F79721]" />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Nama Toko / Perusahaan Pemasok <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: CV Purwokerto Audio Visual"
              value={formSupplierName}
              onChange={(e) => {
                setFormSupplierName(e.target.value);
                setIsDirty(true);
              }}
              className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] text-[#111827] outline-none"
            />
            {formErrors.supplierName && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">
                {formErrors.supplierName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Kategori Pasokan Utama <span className="text-rose-500">*</span>
            </label>
            <select
              value={formCategorySupplied}
              onChange={(e) => {
                setFormCategorySupplied(e.target.value);
                setIsDirty(true);
              }}
              className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] text-[#111827] outline-none"
            >
              {supplierCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Kontak Person (PIC)
              </label>
              <input
                type="text"
                placeholder="Contoh: Bpk. Gunawan"
                value={formContactPerson}
                onChange={(e) => {
                  setFormContactPerson(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] text-[#111827] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Nomor Telepon / WA <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="0812-xxxx-xxxx"
                value={formPhone}
                onChange={(e) => {
                  setFormPhone(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] text-[#111827] outline-none"
              />
              {formErrors.phone && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">
                  {formErrors.phone}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Email Pemasok
            </label>
            <input
              type="email"
              placeholder="sales@pemasok.example.id"
              value={formEmail}
              onChange={(e) => {
                setFormEmail(e.target.value);
                setIsDirty(true);
              }}
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] text-[#111827] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Alamat Lengkap / Kota
            </label>
            <textarea
              rows={3}
              placeholder="Contoh: Jl. Jend. Soedirman No. 45, Purwokerto..."
              value={formAddress}
              onChange={(e) => {
                setFormAddress(e.target.value);
                setIsDirty(true);
              }}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] text-[#111827] outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#F4F5F7] flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setIsDrawerOpen(false)}
              className="px-4 py-2 rounded-full bg-[#F4F5F7] text-xs font-bold text-[#6B7280] hover:bg-[#E5E7EB]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-full bg-[#F79721] hover:bg-[#E07F0B] text-xs font-bold text-white shadow-xs flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Pemasok'}</span>
            </button>
          </div>
        </form>
      </SlideOverDrawer>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showStatusConfirm}
        onClose={() => setShowStatusConfirm(false)}
        onConfirm={handleConfirmToggleStatus}
        isLoading={isStatusLoading}
        title={targetItem?.isActive ? 'Konfirmasi Nonaktifkan Pemasok' : 'Konfirmasi Aktifkan Pemasok'}
        iconType={targetItem?.isActive ? 'deactivate' : 'activate'}
        variant={targetItem?.isActive ? 'danger' : 'success'}
        confirmText={targetItem?.isActive ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'}
        cancelText="Batal"
        itemCode={targetItem?.supplierCode}
        itemName={targetItem?.supplierName}
        message={
          <div>
            <p>
              Apakah Anda yakin ingin {targetItem?.isActive ? 'menonaktifkan' : 'mengaktifkan kembali'}{' '}
              pemasok <strong className="text-[#111827]">{targetItem?.supplierCode} — {targetItem?.supplierName}</strong>?
            </p>
          </div>
        }
      />
    </div>
  );
}
