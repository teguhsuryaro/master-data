'use client';

import React, { useState, useMemo } from 'react';
import { SessionPayload } from '@/lib/permissions';
import {
  Users2,
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
import { DriveFolderCard } from '@/components/ui/DriveFolderCard';
import { useToast } from '@/components/ui/Toast';
import {
  createCustomerAction,
  updateCustomerAction,
  toggleCustomerStatusAction,
} from '@/actions/customer-actions';
import { getNextCustomerCodeAction } from '@/actions/code-actions';

export interface CustomerItem {
  id: number;
  customerCode: string;
  customerName: string;
  customerType: string;
  contactPerson: string | null;
  phone: string;
  email: string | null;
  address: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CustomersClientProps {
  currentUser: SessionPayload;
  initialCustomers: CustomerItem[];
}

export function CustomersClient({
  currentUser,
  initialCustomers,
}: CustomersClientProps) {
  const [items, setItems] = useState<CustomerItem[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const pageSize = 10;
  const { success, error } = useToast();

  // Drawer Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CustomerItem | null>(null);
  const [formCustomerCode, setFormCustomerCode] = useState('');
  const [formCustomerName, setFormCustomerName] = useState('');
  const [formCustomerType, setFormCustomerType] = useState('Organisasi Kampus');
  const [formContactPerson, setFormContactPerson] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoCodeLoading, setIsAutoCodeLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Status confirm modal state
  const [targetItem, setTargetItem] = useState<CustomerItem | null>(null);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(false);

  const customerTypes = [
    'Organisasi Kampus',
    'Event Organizer',
    'Instansi / Perusahaan',
    'Komunitas',
    'Umum / Individu',
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  // Open Drawer for Create
  const handleOpenCreate = async () => {
    setEditingItem(null);
    setFormCustomerName('');
    setFormCustomerType('Organisasi Kampus');
    setFormContactPerson('');
    setFormPhone('');
    setFormEmail('');
    setFormAddress('');
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);

    setIsAutoCodeLoading(true);
    try {
      const nextCode = await getNextCustomerCodeAction();
      setFormCustomerCode(nextCode);
    } catch {
      setFormCustomerCode('CUS011');
    } finally {
      setIsAutoCodeLoading(false);
    }
  };

  // Open Drawer for Edit
  const handleOpenEdit = (item: CustomerItem) => {
    setEditingItem(item);
    setFormCustomerCode(item.customerCode);
    setFormCustomerName(item.customerName);
    setFormCustomerType(item.customerType);
    setFormContactPerson(item.contactPerson || '');
    setFormPhone(item.phone || '');
    setFormEmail(item.email || '');
    setFormAddress(item.address || '');
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
  };

  // Counts for QUICK ACCESS Folder Cards
  const folderCounts = useMemo(() => {
    return {
      all: items.length,
      kampus: items.filter((i) => i.customerType === 'Organisasi Kampus').length,
      eo: items.filter((i) => i.customerType === 'Event Organizer').length,
      instansi: items.filter(
        (i) => i.customerType !== 'Organisasi Kampus' && i.customerType !== 'Event Organizer'
      ).length,
    };
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.contactPerson && item.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.address && item.address.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchType =
        typeFilter === 'ALL' ||
        (typeFilter === 'INSTANSI_OTHER'
          ? item.customerType !== 'Organisasi Kampus' && item.customerType !== 'Event Organizer'
          : item.customerType === typeFilter);

      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && item.isActive) ||
        (statusFilter === 'INACTIVE' && !item.isActive);

      return matchSearch && matchType && matchStatus;
    });
  }, [items, searchTerm, typeFilter, statusFilter]);

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

    if (!formCustomerName.trim() || formCustomerName.trim().length < 3) {
      setFormErrors({ customerName: 'Nama pelanggan minimal 3 karakter' });
      return;
    }

    if (!formPhone.trim() || formPhone.trim().length < 5) {
      setFormErrors({ phone: 'Nomor telepon minimal 5 digit' });
      return;
    }

    setIsSaving(true);
    const formData = new FormData();
    formData.append('customerCode', formCustomerCode);
    formData.append('customerName', formCustomerName);
    formData.append('customerType', formCustomerType);
    formData.append('contactPerson', formContactPerson);
    formData.append('phone', formPhone);
    formData.append('email', formEmail);
    formData.append('address', formAddress);

    try {
      if (editingItem) {
        const res = await updateCustomerAction(editingItem.id, formData);
        if (res.success) {
          setItems((prev) =>
            prev.map((c) =>
              c.id === editingItem.id
                ? {
                    ...c,
                    customerName: formCustomerName,
                    customerType: formCustomerType,
                    contactPerson: formContactPerson || null,
                    phone: formPhone,
                    email: formEmail || null,
                    address: formAddress || null,
                  }
                : c
            )
          );
          success(res.message, 'Berhasil Disimpan');
          setIsDrawerOpen(false);
          setIsDirty(false);
        } else {
          error(res.message, 'Gagal Menyimpan');
        }
      } else {
        const res = await createCustomerAction(formData);
        if (res.success) {
          const newItem: CustomerItem = {
            id: Date.now(),
            customerCode: formCustomerCode,
            customerName: formCustomerName,
            customerType: formCustomerType,
            contactPerson: formContactPerson || null,
            phone: formPhone,
            email: formEmail || null,
            address: formAddress || null,
            isActive: true,
          };
          setItems((prev) =>
            [...prev, newItem].sort((a, b) => a.customerCode.localeCompare(b.customerCode))
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

  const handleToggleStatusClick = (item: CustomerItem) => {
    setTargetItem(item);
    setShowStatusConfirm(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (!targetItem) return;
    setIsStatusLoading(true);
    try {
      const res = await toggleCustomerStatusAction(targetItem.id);
      if (res.success) {
        setItems((prev) =>
          prev.map((c) =>
            c.id === targetItem.id ? { ...c, isActive: !c.isActive } : c
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

  const getCustomerBoxStyle = (type: string) => {
    switch (type) {
      case 'Organisasi Kampus':
        return 'bg-[#2563EB] text-white';
      case 'Event Organizer':
        return 'bg-[#7C3AED] text-white';
      case 'Instansi / Perusahaan':
        return 'bg-[#059669] text-white';
      default:
        return 'bg-[#F79721] text-white';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* TIER 1: Page Title Row (Persis "Design" + Orange Square Icon di image.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#111827] tracking-tight">
            Pelanggan (Customer)
          </h1>
          <div className="w-9 h-9 rounded-xl bg-[#F79721] text-white flex items-center justify-center shadow-sm shadow-[#F79721]/25">
            <Users2 className="w-4 h-4" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F79721] hover:bg-[#E07F0B] text-white font-bold text-xs shadow-sm shadow-[#F79721]/25 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Pelanggan</span>
        </button>
      </div>

      {/* TIER 2: QUICK ACCESS — SEGMEN PENYEWA (4 Kartu Folder Interaktif) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] font-extrabold text-[#9CA3AF] uppercase tracking-[0.12em]">
            QUICK ACCESS — SEGMEN PENYEWA ALAT
          </h2>
          {typeFilter !== 'ALL' && (
            <button
              type="button"
              onClick={() => {
                setTypeFilter('ALL');
                setCurrentPage(1);
              }}
              className="text-xs font-bold text-[#F79721] hover:underline"
            >
              Tampilkan Semua Segmen
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <DriveFolderCard
            title="Semua Penyewa"
            subtitle="Rekanan organisasi kampus, EO & instansi"
            metricLabel={`${folderCounts.all} Penyewa`}
            isActive={typeFilter === 'ALL'}
            onClick={() => {
              setTypeFilter('ALL');
              setCurrentPage(1);
            }}
            badges={[
              { label: 'KM', bgColor: 'bg-[#2563EB]' },
              { label: 'EO', bgColor: 'bg-[#7C3AED]' },
              { label: 'IN', bgColor: 'bg-[#059669]' },
            ]}
          />

          <DriveFolderCard
            title="Organisasi Kampus"
            subtitle="BEM, UKM & Kepanitiaan Mahasiswa Purwokerto"
            metricLabel={`${folderCounts.kampus} Penyewa`}
            isActive={typeFilter === 'Organisasi Kampus'}
            onClick={() => {
              setTypeFilter('Organisasi Kampus');
              setCurrentPage(1);
            }}
            badges={[
              { label: 'BEM', bgColor: 'bg-[#2563EB]' },
              { label: 'UKM', bgColor: 'bg-[#059669]' },
            ]}
          />

          <DriveFolderCard
            title="Event Organizer"
            subtitle="Vendor pernikahan, konser & pameran"
            metricLabel={`${folderCounts.eo} Penyewa`}
            isActive={typeFilter === 'Event Organizer'}
            onClick={() => {
              setTypeFilter('Event Organizer');
              setCurrentPage(1);
            }}
            badges={[
              { label: 'EO', bgColor: 'bg-[#7C3AED]' },
              { label: 'PRO', bgColor: 'bg-[#111827]' },
            ]}
          />

          <DriveFolderCard
            title="Instansi & Komunitas"
            subtitle="Dinas daerah, perusahaan & masyarakat umum"
            metricLabel={`${folderCounts.instansi} Penyewa`}
            isActive={typeFilter === 'INSTANSI_OTHER'}
            onClick={() => {
              setTypeFilter('INSTANSI_OTHER');
              setCurrentPage(1);
            }}
            badges={[
              { label: 'INS', bgColor: 'bg-[#059669]' },
              { label: 'UM', bgColor: 'bg-[#F79721]' },
            ]}
          />
        </div>
      </section>

      {/* TIER 3: ALL FILES Style Header + Pill Search + Borderless Table */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-[11px] font-extrabold text-[#9CA3AF] uppercase tracking-[0.12em]">
            SEMUA PELANGGAN TERDAFTAR ({totalFiltered} PENYEWA)
          </h2>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari kode pelanggan, nama, atau PIC..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
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
              <option value="ALL">Semua Jenis</option>
              {customerTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
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
                <th className="py-3 px-4">Nama &amp; Kode Pelanggan</th>
                <th className="py-3 px-4">Segmen Penyewa</th>
                <th className="py-3 px-4">Penanggung Jawab (PIC)</th>
                <th className="py-3 px-4">Telepon</th>
                <th className="py-3 px-4">Alamat / Instansi</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F5F7] text-xs">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#6B7280]">
                    Tidak ada data pelanggan yang sesuai dengan filter pencarian.
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
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-extrabold text-[11px] shrink-0 shadow-2xs ${getCustomerBoxStyle(
                            item.customerType
                          )}`}
                        >
                          CUS
                        </div>
                        <div>
                          <p className="font-bold text-[#111827] text-[13px] leading-snug">
                            {item.customerName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-semibold text-[11px] text-[#9CA3AF]">
                              {item.customerCode}
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
                        {item.customerType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#FFF7ED] text-[#F79721] font-extrabold text-[10px] flex items-center justify-center shrink-0">
                          {(item.contactPerson || 'C').slice(0, 1).toUpperCase()}
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
                          onClick={() => handleCopyCode(item.customerCode)}
                          className="p-2 rounded-full text-[#9CA3AF] hover:text-[#111827] hover:bg-white transition-colors"
                          title="Salin kode pelanggan"
                        >
                          {copiedCode === item.customerCode ? (
                            <Check className="w-3.5 h-3.5 text-[#059669]" />
                          ) : (
                            <Link2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-full text-[#9CA3AF] hover:text-[#111827] hover:bg-white transition-colors"
                          title="Edit Pelanggan"
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
                          title={item.isActive ? 'Nonaktifkan Pelanggan' : 'Aktifkan Pelanggan'}
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
            <strong className="text-[#111827]">{totalFiltered}</strong> data pelanggan
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
        title={editingItem ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
        subtitle={
          editingItem
            ? `Perbarui informasi pelanggan ${editingItem.customerCode}`
            : 'Daftarkan penyewa atau organisasi kampus baru ke dalam master data'
        }
        isDirty={isDirty}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Kode Pelanggan (Otomatis) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                disabled={!!editingItem || isAutoCodeLoading}
                placeholder="Contoh: CUS011"
                value={formCustomerCode}
                onChange={(e) => {
                  setFormCustomerCode(e.target.value);
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
              Nama Organisasi / Pelanggan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: BEM Fakultas Ilmu Komputer Unsoed"
              value={formCustomerName}
              onChange={(e) => {
                setFormCustomerName(e.target.value);
                setIsDirty(true);
              }}
              className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] text-[#111827] outline-none"
            />
            {formErrors.customerName && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">
                {formErrors.customerName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Jenis / Kategori Pelanggan <span className="text-rose-500">*</span>
            </label>
            <select
              value={formCustomerType}
              onChange={(e) => {
                setFormCustomerType(e.target.value);
                setIsDirty(true);
              }}
              className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl bg-[#F4F5F7] focus:bg-white border border-transparent focus:border-[#F79721] text-[#111827] outline-none"
            >
              {customerTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Kontak Person (PIC Acara)
              </label>
              <input
                type="text"
                placeholder="Contoh: Farhan Ramadhan"
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
              Email Pelanggan
            </label>
            <input
              type="email"
              placeholder="bem.fikom@kampus.example.id"
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
              Alamat Sekretariat / Lokasi
            </label>
            <textarea
              rows={3}
              placeholder="Contoh: Gedung PKM Kampus Grendeng, Purwokerto Utara..."
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
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Pelanggan'}</span>
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
        title={targetItem?.isActive ? 'Konfirmasi Nonaktifkan Pelanggan' : 'Konfirmasi Aktifkan Pelanggan'}
        iconType={targetItem?.isActive ? 'deactivate' : 'activate'}
        variant={targetItem?.isActive ? 'danger' : 'success'}
        confirmText={targetItem?.isActive ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'}
        cancelText="Batal"
        itemCode={targetItem?.customerCode}
        itemName={targetItem?.customerName}
        message={
          <div>
            <p>
              Apakah Anda yakin ingin {targetItem?.isActive ? 'menonaktifkan' : 'mengaktifkan kembali'}{' '}
              pelanggan <strong className="text-[#111827]">{targetItem?.customerCode} — {targetItem?.customerName}</strong>?
            </p>
          </div>
        }
      />
    </div>
  );
}
