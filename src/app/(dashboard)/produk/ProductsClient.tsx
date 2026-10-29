'use client';

import React, { useState, useMemo } from 'react';
import { SessionPayload } from '@/lib/permissions';
import {
  Package,
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
import { formatRupiah } from '@/lib/formatters';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { SlideOverDrawer } from '@/components/ui/SlideOverDrawer';
import { DriveFolderCard } from '@/components/ui/DriveFolderCard';
import { useToast } from '@/components/ui/Toast';
import {
  createProductAction,
  updateProductAction,
  toggleProductStatusAction,
} from '@/actions/product-actions';
import { getNextProductCodeAction } from '@/actions/code-actions';

export interface ProductItem {
  id: number;
  productCode: string;
  productName: string;
  category: string;
  unitCode: string;
  unitName?: string | null;
  purchasePrice: number;
  rentalPrice: number;
  stockQty: number;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UnitOption {
  unitCode: string;
  unitName: string;
}

interface ProductsClientProps {
  currentUser: SessionPayload;
  initialProducts: ProductItem[];
  availableUnits: UnitOption[];
}

export function ProductsClient({
  currentUser,
  initialProducts,
  availableUnits,
}: ProductsClientProps) {
  const [items, setItems] = useState<ProductItem[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const pageSize = 10;
  const { success, error } = useToast();

  // Drawer Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductItem | null>(null);
  const [formProductCode, setFormProductCode] = useState('');
  const [formProductName, setFormProductName] = useState('');
  const [formCategory, setFormCategory] = useState('Komunikasi');
  const [formUnitCode, setFormUnitCode] = useState(availableUnits[0]?.unitCode || 'UNIT');
  const [formPurchasePrice, setFormPurchasePrice] = useState<number>(0);
  const [formRentalPrice, setFormRentalPrice] = useState<number>(0);
  const [formStockQty, setFormStockQty] = useState<number>(1);
  const [formDescription, setFormDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoCodeLoading, setIsAutoCodeLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Status confirm modal state
  const [targetItem, setTargetItem] = useState<ProductItem | null>(null);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(false);

  const categories = ['Komunikasi', 'Visual', 'Audio', 'Pencahayaan', 'Aksesori'];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  // Open Drawer for Create
  const handleOpenCreate = async () => {
    setEditingItem(null);
    setFormProductName('');
    setFormCategory('Komunikasi');
    setFormUnitCode(availableUnits[0]?.unitCode || 'UNIT');
    setFormPurchasePrice(0);
    setFormRentalPrice(0);
    setFormStockQty(1);
    setFormDescription('');
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);

    setIsAutoCodeLoading(true);
    try {
      const nextCode = await getNextProductCodeAction();
      setFormProductCode(nextCode);
    } catch {
      setFormProductCode('BRG015');
    } finally {
      setIsAutoCodeLoading(false);
    }
  };

  // Open Drawer for Edit
  const handleOpenEdit = (item: ProductItem) => {
    setEditingItem(item);
    setFormProductCode(item.productCode);
    setFormProductName(item.productName);
    setFormCategory(item.category);
    setFormUnitCode(item.unitCode);
    setFormPurchasePrice(item.purchasePrice);
    setFormRentalPrice(item.rentalPrice);
    setFormStockQty(item.stockQty);
    setFormDescription(item.description || '');
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
  };

  // Counts for QUICK ACCESS Folder Cards
  const folderStats = useMemo(() => {
    const totalUnits = items.reduce((s, i) => s + (i.stockQty || 0), 0);
    const kom = items.filter((i) => i.category === 'Komunikasi');
    const vis = items.filter((i) => i.category === 'Visual');
    const audOther = items.filter(
      (i) => i.category !== 'Komunikasi' && i.category !== 'Visual'
    );
    return {
      allCount: items.length,
      totalUnits,
      komCount: kom.length,
      komUnits: kom.reduce((s, i) => s + (i.stockQty || 0), 0),
      visCount: vis.length,
      visUnits: vis.reduce((s, i) => s + (i.stockQty || 0), 0),
      audCount: audOther.length,
      audUnits: audOther.reduce((s, i) => s + (i.stockQty || 0), 0),
    };
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory =
        categoryFilter === 'ALL' ||
        (categoryFilter === 'AUDIO_OTHER'
          ? item.category !== 'Komunikasi' && item.category !== 'Visual'
          : item.category === categoryFilter);

      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && item.isActive) ||
        (statusFilter === 'INACTIVE' && !item.isActive);

      return matchSearch && matchCategory && matchStatus;
    });
  }, [items, searchTerm, categoryFilter, statusFilter]);

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

    if (!formProductName.trim() || formProductName.trim().length < 3) {
      setFormErrors({ productName: 'Nama barang minimal 3 karakter' });
      return;
    }

    setIsSaving(true);
    const formData = new FormData();
    formData.append('productCode', formProductCode);
    formData.append('productName', formProductName);
    formData.append('category', formCategory);
    formData.append('unitCode', formUnitCode);
    formData.append('purchasePrice', String(formPurchasePrice));
    formData.append('rentalPrice', String(formRentalPrice));
    formData.append('stockQty', String(formStockQty));
    formData.append('description', formDescription);

    try {
      if (editingItem) {
        const res = await updateProductAction(editingItem.id, formData);
        if (res.success) {
          const matchedUnit = availableUnits.find((u) => u.unitCode === formUnitCode);
          setItems((prev) =>
            prev.map((p) =>
              p.id === editingItem.id
                ? {
                    ...p,
                    productName: formProductName,
                    category: formCategory,
                    unitCode: formUnitCode,
                    unitName: matchedUnit?.unitName || formUnitCode,
                    purchasePrice: formPurchasePrice,
                    rentalPrice: formRentalPrice,
                    stockQty: formStockQty,
                    description: formDescription,
                  }
                : p
            )
          );
          success(res.message, 'Berhasil Disimpan');
          setIsDrawerOpen(false);
          setIsDirty(false);
        } else {
          error(res.message, 'Gagal Menyimpan');
        }
      } else {
        const res = await createProductAction(formData);
        if (res.success) {
          const matchedUnit = availableUnits.find((u) => u.unitCode === formUnitCode);
          const newItem: ProductItem = {
            id: Date.now(),
            productCode: formProductCode,
            productName: formProductName,
            category: formCategory,
            unitCode: formUnitCode,
            unitName: matchedUnit?.unitName || formUnitCode,
            purchasePrice: formPurchasePrice,
            rentalPrice: formRentalPrice,
            stockQty: formStockQty,
            description: formDescription,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setItems((prev) =>
            [...prev, newItem].sort((a, b) => a.productCode.localeCompare(b.productCode))
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

  const handleToggleStatusClick = (item: ProductItem) => {
    setTargetItem(item);
    setShowStatusConfirm(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (!targetItem) return;
    setIsStatusLoading(true);
    try {
      const res = await toggleProductStatusAction(targetItem.id);
      if (res.success) {
        setItems((prev) =>
          prev.map((p) =>
            p.id === targetItem.id ? { ...p, isActive: !p.isActive } : p
          )
        );
        success(res.message, 'Status Diperbarui');
        setShowStatusConfirm(false);
        setTargetItem(null);
      } else {
        error(res.message, 'Gagal Mengubah Status');
      }
    } catch (err: any) {
      error(err?.message || 'Terjadi kesalahan saat mengubah status.');
    } finally {
      setIsStatusLoading(false);
    }
  };

  // Warna kotak ikon kategori ala ALL FILES image.png
  const getCategoryBoxStyle = (cat: string) => {
    switch (cat) {
      case 'Komunikasi':
        return 'bg-[#2563EB] text-white';
      case 'Visual':
        return 'bg-[#7C3AED] text-white';
      case 'Audio':
        return 'bg-[#F79721] text-white';
      case 'Pencahayaan':
        return 'bg-[#E11D48] text-white';
      default:
        return 'bg-[#059669] text-white';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* TIER 1: Page Title Row (Persis "Design" + Orange Square Icon di image.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#111827] tracking-tight">
            Produk / Barang
          </h1>
          <div className="w-9 h-9 rounded-xl bg-[#F79721] text-white flex items-center justify-center shadow-sm shadow-[#F79721]/25">
            <Package className="w-4 h-4" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F79721] hover:bg-[#E07F0B] text-white font-bold text-xs shadow-sm shadow-[#F79721]/25 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Produk</span>
        </button>
      </div>

      {/* TIER 2: QUICK ACCESS — KATEGORI PERALATAN (4 Kartu Folder Interaktif) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] font-extrabold text-[#9CA3AF] uppercase tracking-[0.12em]">
            QUICK ACCESS — KATEGORI PERALATAN SEWA
          </h2>
          {categoryFilter !== 'ALL' && (
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('ALL');
                setCurrentPage(1);
              }}
              className="text-xs font-bold text-[#F79721] hover:underline"
            >
              Tampilkan Semua Kategori
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <DriveFolderCard
            title="Semua Peralatan"
            subtitle="Seluruh katalog unit alat siap disewakan"
            metricLabel={`${folderStats.allCount} Jenis • ${folderStats.totalUnits} Unit`}
            isActive={categoryFilter === 'ALL'}
            onClick={() => {
              setCategoryFilter('ALL');
              setCurrentPage(1);
            }}
            badges={[
              { label: 'HT', bgColor: 'bg-[#2563EB]' },
              { label: 'VS', bgColor: 'bg-[#7C3AED]' },
              { label: 'AU', bgColor: 'bg-[#F79721]' },
            ]}
          />

          <DriveFolderCard
            title="Komunikasi (HT)"
            subtitle="Handy Talky, Clearcom & Headset PTT"
            metricLabel={`${folderStats.komCount} Jenis • ${folderStats.komUnits} Unit`}
            isActive={categoryFilter === 'Komunikasi'}
            onClick={() => {
              setCategoryFilter('Komunikasi');
              setCurrentPage(1);
            }}
            badges={[
              { label: 'WL', bgColor: 'bg-[#2563EB]' },
              { label: 'IC', bgColor: 'bg-[#059669]' },
            ]}
          />

          <DriveFolderCard
            title="Visual & Proyektor"
            subtitle="Proyektor HDMI, Layar Tripod & Switcher"
            metricLabel={`${folderStats.visCount} Jenis • ${folderStats.visUnits} Unit`}
            isActive={categoryFilter === 'Visual'}
            onClick={() => {
              setCategoryFilter('Visual');
              setCurrentPage(1);
            }}
            badges={[
              { label: 'PJ', bgColor: 'bg-[#7C3AED]' },
              { label: 'TV', bgColor: 'bg-[#111827]' },
            ]}
          />

          <DriveFolderCard
            title="Audio & Pendukung"
            subtitle="Speaker Portable, Megaphone & Kabel Roll"
            metricLabel={`${folderStats.audCount} Jenis • ${folderStats.audUnits} Unit`}
            isActive={categoryFilter === 'AUDIO_OTHER'}
            onClick={() => {
              setCategoryFilter('AUDIO_OTHER');
              setCurrentPage(1);
            }}
            badges={[
              { label: 'SP', bgColor: 'bg-[#F79721]' },
              { label: 'AK', bgColor: 'bg-[#059669]' },
            ]}
          />
        </div>
      </section>

      {/* TIER 3: ALL FILES Style Header + Pill Search + Borderless Table */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-[11px] font-extrabold text-[#9CA3AF] uppercase tracking-[0.12em]">
            SEMUA PRODUK &amp; BARANG SEWA ({totalFiltered} ITEM)
          </h2>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari kode atau nama barang..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] rounded-full text-xs font-medium text-[#111827] placeholder-[#9CA3AF] outline-none transition-all"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3.5 py-2 bg-[#F4F5F7] hover:bg-[#E5E7EB]/60 rounded-full text-xs font-bold text-[#111827] outline-none cursor-pointer"
            >
              <option value="ALL">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
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

        {/* Clean Borderless Table (ALL FILES Style) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F4F5F7] text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-wider">
                <th className="py-3 px-4">Nama &amp; Kode Barang</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Satuan</th>
                <th className="py-3 px-4 text-right">Harga Perolehan</th>
                <th className="py-3 px-4 text-right">Tarif Sewa / Hari</th>
                <th className="py-3 px-4 text-center">Stok Fisik</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F5F7] text-xs">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#6B7280]">
                    Tidak ada barang yang sesuai dengan filter pencarian.
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
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-extrabold text-[11px] shrink-0 shadow-2xs ${getCategoryBoxStyle(
                            item.category
                          )}`}
                        >
                          {item.category.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#111827] text-[13px] leading-snug">
                            {item.productName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-semibold text-[11px] text-[#9CA3AF]">
                              {item.productCode}
                            </span>
                            {item.description && (
                              <span className="text-[11px] text-[#9CA3AF] truncate max-w-[200px] hidden sm:inline">
                                • {item.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#6B7280]">
                      {item.category}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F4F5F7] text-[#111827]">
                        {item.unitName || item.unitCode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-[#6B7280]">
                      {formatRupiah(item.purchasePrice)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-[#F79721]">
                      {formatRupiah(item.rentalPrice)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF7ED] text-[#D97005]">
                        {item.stockQty} unit
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
                          onClick={() => handleCopyCode(item.productCode)}
                          className="p-2 rounded-full text-[#9CA3AF] hover:text-[#111827] hover:bg-white transition-colors"
                          title="Salin kode barang"
                        >
                          {copiedCode === item.productCode ? (
                            <Check className="w-3.5 h-3.5 text-[#059669]" />
                          ) : (
                            <Link2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-full text-[#9CA3AF] hover:text-[#111827] hover:bg-white transition-colors"
                          title="Edit Barang"
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
                          title={item.isActive ? 'Nonaktifkan Barang' : 'Aktifkan Barang'}
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
            <strong className="text-[#111827]">{totalFiltered}</strong> data barang
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

      {/* SlideOverDrawer Form Tambah & Edit Produk */}
      <SlideOverDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingItem ? 'Edit Produk / Barang' : 'Tambah Produk / Barang'}
        subtitle={
          editingItem
            ? `Perbarui informasi tarif dan stok ${editingItem.productCode}`
            : 'Daftarkan inventaris atau perlengkapan sewa baru ke dalam sistem'
        }
        isDirty={isDirty}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Kode Barang (Otomatis) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                disabled={!!editingItem || isAutoCodeLoading}
                placeholder="Contoh: BRG015"
                value={formProductCode}
                onChange={(e) => {
                  setFormProductCode(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl bg-[#F4F5F7] text-[#111827] focus:bg-white border border-transparent focus:border-[#F79721] outline-none disabled:opacity-60"
              />
              {isAutoCodeLoading && (
                <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-3 text-[#F79721]" />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Nama Barang Rental <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: HT Dual Band VHF/UHF Baofeng UV-5R"
              value={formProductName}
              onChange={(e) => {
                setFormProductName(e.target.value);
                setIsDirty(true);
              }}
              className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] text-[#111827] outline-none"
            />
            {formErrors.productName && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">
                {formErrors.productName}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Kategori <span className="text-rose-500">*</span>
              </label>
              <select
                value={formCategory}
                onChange={(e) => {
                  setFormCategory(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] text-[#111827] outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Satuan <span className="text-rose-500">*</span>
              </label>
              <select
                value={formUnitCode}
                onChange={(e) => {
                  setFormUnitCode(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] text-[#111827] outline-none"
              >
                {availableUnits.map((u) => (
                  <option key={u.unitCode} value={u.unitCode}>
                    {u.unitCode} — {u.unitName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Harga Beli Modal (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="5000"
                required
                value={formPurchasePrice}
                onChange={(e) => {
                  setFormPurchasePrice(Number(e.target.value));
                  setIsDirty(true);
                }}
                className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] text-[#111827] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Tarif Sewa/Hari (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                required
                value={formRentalPrice}
                onChange={(e) => {
                  setFormRentalPrice(Number(e.target.value));
                  setIsDirty(true);
                }}
                className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] text-[#F79721] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Jumlah Stok Unit Fisik <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              required
              value={formStockQty}
              onChange={(e) => {
                setFormStockQty(Number(e.target.value));
                setIsDirty(true);
              }}
              className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] text-[#111827] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Deskripsi &amp; Kelengkapan
            </label>
            <textarea
              rows={3}
              placeholder="Kelengkapan unit..."
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
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Barang'}</span>
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
        title={targetItem?.isActive ? 'Konfirmasi Nonaktifkan Barang' : 'Konfirmasi Aktifkan Barang'}
        iconType={targetItem?.isActive ? 'deactivate' : 'activate'}
        variant={targetItem?.isActive ? 'danger' : 'success'}
        confirmText={targetItem?.isActive ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'}
        cancelText="Batal"
        itemCode={targetItem?.productCode}
        itemName={targetItem?.productName}
        message={
          <div>
            <p>
              Apakah Anda yakin ingin {targetItem?.isActive ? 'menonaktifkan' : 'mengaktifkan kembali'}{' '}
              barang <strong className="text-[#111827]">{targetItem?.productCode} — {targetItem?.productName}</strong>?
            </p>
          </div>
        }
      />
    </div>
  );
}
