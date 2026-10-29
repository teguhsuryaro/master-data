'use client';

import React, { useState, useMemo } from 'react';
import { SessionPayload } from '@/lib/permissions';
import {
  Ruler,
  Search,
  Plus,
  Power,
  PowerOff,
  Edit2,
  Package,
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
  createUnitAction,
  updateUnitAction,
  toggleUnitStatusAction,
} from '@/actions/unit-actions';

export interface UnitItem {
  id: number;
  unitCode: string;
  unitName: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  productCount: number;
}

interface UnitsClientProps {
  user: SessionPayload;
  initialUnits: UnitItem[];
}

export function UnitsClient({ user, initialUnits }: UnitsClientProps) {
  const [items, setItems] = useState<UnitItem[]>(initialUnits);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const pageSize = 10;
  const { success, error, warning } = useToast();

  // Drawer Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UnitItem | null>(null);
  const [formUnitCode, setFormUnitCode] = useState('');
  const [formUnitName, setFormUnitName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Status confirm modal state
  const [targetItem, setTargetItem] = useState<UnitItem | null>(null);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  // Open Drawer for Create
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormUnitCode('');
    setFormUnitName('');
    setFormDescription('');
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
  };

  // Open Drawer for Edit
  const handleOpenEdit = (item: UnitItem) => {
    setEditingItem(item);
    setFormUnitCode(item.unitCode);
    setFormUnitName(item.unitName);
    setFormDescription(item.description || '');
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.unitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && item.isActive) ||
        (statusFilter === 'INACTIVE' && !item.isActive);

      return matchSearch && matchStatus;
    });
  }, [items, searchTerm, statusFilter]);

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

    const upperCode = formUnitCode.trim().toUpperCase();
    if (!upperCode || upperCode.length < 2) {
      setFormErrors({ unitCode: 'Kode satuan minimal 2 karakter kapital (contoh: UNIT)' });
      return;
    }

    if (!formUnitName.trim() || formUnitName.trim().length < 2) {
      setFormErrors({ unitName: 'Nama satuan minimal 2 karakter' });
      return;
    }

    setIsSaving(true);
    const formData = new FormData();
    formData.append('unitCode', upperCode);
    formData.append('unitName', formUnitName);
    formData.append('description', formDescription);

    try {
      if (editingItem) {
        const res = await updateUnitAction(editingItem.id, formData);
        if (res.success) {
          setItems((prev) =>
            prev.map((u) =>
              u.id === editingItem.id
                ? { ...u, unitName: formUnitName, description: formDescription }
                : u
            )
          );
          success(res.message, 'Berhasil Disimpan');
          setIsDrawerOpen(false);
          setIsDirty(false);
        } else {
          error(res.message, 'Gagal Menyimpan');
        }
      } else {
        const res = await createUnitAction(formData);
        if (res.success) {
          const newItem: UnitItem = {
            id: Date.now(),
            unitCode: upperCode,
            unitName: formUnitName,
            description: formDescription,
            isActive: true,
            createdAt: new Date(),
            productCount: 0,
          };
          setItems((prev) =>
            [...prev, newItem].sort((a, b) => a.unitCode.localeCompare(b.unitCode))
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

  const handleToggleStatusClick = (item: UnitItem) => {
    if (item.isActive && item.productCount > 0) {
      warning(
        `Satuan ${item.unitCode} sedang digunakan oleh ${item.productCount} barang sewa. Ganti satuan barang terlebih dahulu sebelum menonaktifkan.`,
        'Proteksi Integritas Relasi'
      );
      return;
    }
    setTargetItem(item);
    setShowStatusConfirm(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (!targetItem) return;
    setIsStatusLoading(true);
    try {
      const res = await toggleUnitStatusAction(targetItem.id);
      if (res.success) {
        setItems((prev) =>
          prev.map((u) => (u.id === targetItem.id ? { ...u, isActive: !u.isActive } : u))
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

  const totalLinkedProducts = items.reduce((s, u) => s + (u.productCount || 0), 0);

  return (
    <div className="space-y-8 pb-12">
      {/* TIER 1: Page Title Row (Persis "Design" + Orange Square Icon di image.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#111827] tracking-tight">
            Satuan (Unit)
          </h1>
          <div className="w-9 h-9 rounded-xl bg-[#F79721] text-white flex items-center justify-center shadow-sm shadow-[#F79721]/25">
            <Ruler className="w-4 h-4" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F79721] hover:bg-[#E07F0B] text-white font-bold text-xs shadow-sm shadow-[#F79721]/25 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Satuan</span>
        </button>
      </div>

      {/* TIER 2: QUICK ACCESS — STANDAR SATUAN BARANG */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] font-extrabold text-[#9CA3AF] uppercase tracking-[0.12em]">
            QUICK ACCESS — STANDARISASI SATUAN INVENTARIS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <DriveFolderCard
            title="Semua Satuan"
            subtitle="Standar satuan kuantitas barang sewa"
            metricLabel={`${items.length} Satuan`}
            isActive={statusFilter === 'ALL'}
            onClick={() => {
              setStatusFilter('ALL');
              setCurrentPage(1);
            }}
            badges={[
              { label: 'UN', bgColor: 'bg-[#2563EB]' },
              { label: 'ST', bgColor: 'bg-[#7C3AED]' },
              { label: 'PK', bgColor: 'bg-[#059669]' },
            ]}
          />

          <DriveFolderCard
            title="Satuan Unit & Set"
            subtitle="Digunakan untuk HT, Proyektor & Sound System"
            metricLabel="UNIT • SET"
            isActive={false}
            onClick={() => {
              setSearchTerm('UNIT');
              setCurrentPage(1);
            }}
            badges={[
              { label: 'UN', bgColor: 'bg-[#2563EB]' },
              { label: 'ST', bgColor: 'bg-[#7C3AED]' },
            ]}
          />

          <DriveFolderCard
            title="Paket & Aksesori"
            subtitle="Bundling sewa event, Pcs, Roll & Meter"
            metricLabel="PAKET • PCS • ROLL"
            isActive={false}
            onClick={() => {
              setSearchTerm('');
              setCurrentPage(1);
            }}
            badges={[
              { label: 'PK', bgColor: 'bg-[#059669]' },
              { label: 'RL', bgColor: 'bg-[#F79721]' },
            ]}
          />

          <DriveSummaryCard
            category="INTEGRITAS RELASI"
            title="Katalog Barang Terkait"
            subtitle="Satuan yang sedang dipakai produk aktif dilindungi dari penonaktifan"
            metricLabel={`${totalLinkedProducts} Produk Terkait`}
            icon={<Package className="w-5 h-5" />}
            href="/produk"
          />
        </div>
      </section>

      {/* TIER 3: ALL FILES Style Header + Pill Search + Borderless Table */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-[11px] font-extrabold text-[#9CA3AF] uppercase tracking-[0.12em]">
            SEMUA SATUAN BARANG ({totalFiltered} SATUAN)
          </h2>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari kode atau nama satuan..."
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
                <th className="py-3 px-4">Nama &amp; Kode Satuan</th>
                <th className="py-3 px-4">Deskripsi Penggunaan</th>
                <th className="py-3 px-4">Produk Terkait</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F5F7] text-xs">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#6B7280]">
                    Tidak ada data satuan yang sesuai dengan filter pencarian.
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
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-[#059669] text-white flex items-center justify-center font-mono font-extrabold text-[10px] shrink-0 shadow-2xs">
                          {item.unitCode.slice(0, 3)}
                        </div>
                        <div>
                          <p className="font-bold text-[#111827] text-[13px] leading-snug">
                            {item.unitName}
                          </p>
                          <p className="font-mono font-semibold text-[11px] text-[#9CA3AF]">
                            Kode: {item.unitCode}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#6B7280] max-w-md">
                      {item.description || '-'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F4F5F7] text-[#111827]">
                        <Package className="w-3 h-3 text-[#F79721]" />
                        <span>{item.productCount} barang</span>
                      </span>
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
                          onClick={() => handleCopyCode(item.unitCode)}
                          className="p-2 rounded-full text-[#9CA3AF] hover:text-[#111827] hover:bg-white transition-colors"
                          title="Salin kode satuan"
                        >
                          {copiedCode === item.unitCode ? (
                            <Check className="w-3.5 h-3.5 text-[#059669]" />
                          ) : (
                            <Link2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-full text-[#9CA3AF] hover:text-[#111827] hover:bg-white transition-colors"
                          title="Edit Satuan"
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
                          title={item.isActive ? 'Nonaktifkan Satuan' : 'Aktifkan Satuan'}
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
            <strong className="text-[#111827]">{totalFiltered}</strong> data satuan
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
        title={editingItem ? 'Edit Satuan Barang' : 'Tambah Satuan Barang'}
        subtitle={
          editingItem
            ? `Perbarui nama dan keterangan satuan ${editingItem.unitCode}`
            : 'Daftarkan format satuan baru (Unit, Set, Paket, Pcs, Roll)'
        }
        isDirty={isDirty}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Kode Satuan (Huruf Kapital) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              disabled={!!editingItem}
              placeholder="Contoh: DUS, KOTAK"
              value={formUnitCode}
              onChange={(e) => {
                setFormUnitCode(e.target.value.toUpperCase());
                setIsDirty(true);
              }}
              className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl bg-[#F4F5F7] text-[#111827] outline-none disabled:opacity-60"
            />
            {formErrors.unitCode && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">
                {formErrors.unitCode}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Nama Lengkap Satuan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Set Lengkap"
              value={formUnitName}
              onChange={(e) => {
                setFormUnitName(e.target.value);
                setIsDirty(true);
              }}
              className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] text-[#111827] outline-none"
            />
            {formErrors.unitName && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">
                {formErrors.unitName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Deskripsi Penggunaan
            </label>
            <textarea
              rows={3}
              placeholder="Contoh peruntukan barang rental..."
              value={formDescription}
              onChange={(e) => {
                setFormDescription(e.target.value);
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
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Satuan'}</span>
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
        title={targetItem?.isActive ? 'Konfirmasi Nonaktifkan Satuan' : 'Konfirmasi Aktifkan Satuan'}
        iconType={targetItem?.isActive ? 'deactivate' : 'activate'}
        variant={targetItem?.isActive ? 'danger' : 'success'}
        confirmText={targetItem?.isActive ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'}
        cancelText="Batal"
        itemCode={targetItem?.unitCode}
        itemName={targetItem?.unitName}
        message={
          <div>
            <p>
              Apakah Anda yakin ingin {targetItem?.isActive ? 'menonaktifkan' : 'mengaktifkan kembali'}{' '}
              satuan <strong className="text-[#111827]">{targetItem?.unitCode} ({targetItem?.unitName})</strong>?
            </p>
          </div>
        }
      />
    </div>
  );
}
