'use client';

import React, { useEffect } from 'react';
import {
  AlertTriangle,
  LogOut,
  PowerOff,
  Power,
  X,
  Loader2,
  FileWarning,
} from 'lucide-react';

export type ConfirmVariant = 'danger' | 'warning' | 'primary' | 'success';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
  iconType?: 'logout' | 'deactivate' | 'activate' | 'dirty' | 'warning';
  itemCode?: string;
  itemName?: string;
  closeOnBackdrop?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  variant = 'warning',
  isLoading = false,
  iconType = 'warning',
  itemCode,
  itemName,
  closeOnBackdrop = false,
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (iconType) {
      case 'logout':
        return <LogOut className="w-5 h-5 text-[#E11D48]" />;
      case 'deactivate':
        return <PowerOff className="w-5 h-5 text-[#E11D48]" />;
      case 'activate':
        return <Power className="w-5 h-5 text-[#059669]" />;
      case 'dirty':
        return <FileWarning className="w-5 h-5 text-[#F79721]" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-[#F79721]" />;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: 'bg-[#FFF1F2]',
          confirmBtn: 'bg-[#E11D48] hover:bg-[#BE123C] text-white',
        };
      case 'success':
        return {
          iconBg: 'bg-[#ECFDF5]',
          confirmBtn: 'bg-[#059669] hover:bg-[#047857] text-white',
        };
      default:
        return {
          iconBg: 'bg-[#FFF7ED]',
          confirmBtn: 'bg-[#F79721] hover:bg-[#E07F0B] text-white',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (closeOnBackdrop && !isLoading) {
            onClose();
          }
        }}
      />

      <div className="relative w-full max-w-md bg-white rounded-[28px] shadow-2xl p-6 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${styles.iconBg}`}
          >
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-extrabold text-[#111827] leading-tight">
              {title}
            </h3>

            {(itemCode || itemName) && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-[#F4F5F7] flex items-center gap-2">
                {itemCode && (
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-white text-[#111827]">
                    {itemCode}
                  </span>
                )}
                {itemName && (
                  <span className="text-xs font-bold text-[#111827] truncate">
                    {itemName}
                  </span>
                )}
              </div>
            )}

            <div className="text-xs text-[#6B7280] mt-2.5 leading-relaxed">
              {message}
            </div>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#111827] p-1.5 rounded-full hover:bg-[#F4F5F7] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[#F4F5F7]">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-[#F4F5F7] text-xs font-bold text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB] transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={async () => {
              await onConfirm();
            }}
            className={`px-5 py-2 rounded-full text-xs font-bold shadow-xs transition-all flex items-center gap-2 active:scale-[0.98] disabled:opacity-50 ${styles.confirmBtn}`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
