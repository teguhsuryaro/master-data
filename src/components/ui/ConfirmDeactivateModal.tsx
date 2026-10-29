'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDeactivateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  entityName: string;
  entityCode: string;
  isCurrentlyActive: boolean;
  isLoading?: boolean;
  warningNote?: string;
}

export function ConfirmDeactivateModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  entityName,
  entityCode,
  isCurrentlyActive,
  isLoading = false,
  warningNote,
}: ConfirmDeactivateModalProps) {
  if (!isOpen) return null;

  const actionText = isCurrentlyActive ? 'Nonaktifkan' : 'Aktifkan Kembali';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          className="fixed inset-0 bg-carbon/60 backdrop-blur-[2px] transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-lg bg-surface-card border border-border-structural text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg p-6">
          <div className="flex items-start justify-between pb-3 border-b border-border-structural">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  isCurrentlyActive ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-heading font-bold text-txt-primary">
                {title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-txt-muted hover:text-carbon p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-4 space-y-3">
            <p className="text-sm text-txt-secondary leading-relaxed">
              Anda akan merubah status untuk{' '}
              <span className="font-semibold text-txt-primary">{entityName}</span>{' '}
              dengan kode <span className="font-mono font-semibold bg-surface-canvas px-1.5 py-0.5 rounded border border-border-structural">{entityCode}</span>.
            </p>

            {isCurrentlyActive ? (
              <div className="p-3 bg-brand-soft/60 border border-brand-border rounded text-xs text-txt-primary space-y-1">
                <p className="font-semibold text-brand-hover">
                  Kebijakan Audit Trail Akuntansi:
                </p>
                <p className="text-txt-secondary leading-relaxed">
                  Data master tidak dihapus permanen agar riwayat transaksi dan audit tetap utuh (Soft Deactivate). Data yang dinonaktifkan tidak akan muncul pada pilihan transaksi baru.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 space-y-1">
                <p className="font-semibold">Pengaktifan Kembali:</p>
                <p className="leading-relaxed">
                  Data ini akan kembali aktif dan dapat dipilih untuk transaksi operasional baru.
                </p>
              </div>
            )}

            {warningNote && (
              <p className="text-xs text-rose-600 font-medium italic">
                ⚠️ {warningNote}
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-border-structural flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold rounded-md text-txt-secondary hover:text-txt-primary hover:bg-surface-canvas border border-border-structural transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 text-xs font-semibold rounded-md text-white transition-colors flex items-center gap-2 ${
                isCurrentlyActive
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isLoading ? 'Memproses...' : `Ya, ${actionText}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
