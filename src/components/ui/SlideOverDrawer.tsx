'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface SlideOverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
  isDirty?: boolean;
  closeOnBackdrop?: boolean;
}

export function SlideOverDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  width = 'md',
  isDirty = false,
  closeOnBackdrop = false,
}: SlideOverDrawerProps) {
  const [showDirtyConfirm, setShowDirtyConfirm] = useState(false);
  const [shakeBackdrop, setShakeBackdrop] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleRequestClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDirty]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setShowDirtyConfirm(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestClose = () => {
    if (isDirty) {
      setShowDirtyConfirm(true);
    } else {
      onClose();
    }
  };

  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      handleRequestClose();
    } else {
      setShakeBackdrop(true);
      setTimeout(() => setShakeBackdrop(false), 400);
    }
  };

  const widthClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
  }[width];

  return (
    <>
      <div className="fixed inset-0 z-40 overflow-hidden">
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-all duration-200 ${
            shakeBackdrop ? 'ring-4 ring-[#F79721]/50' : ''
          }`}
          onClick={handleBackdropClick}
          aria-hidden="true"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div
            className={`w-screen ${widthClasses} bg-white rounded-l-[32px] shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200 overflow-hidden`}
            role="dialog"
            aria-modal="true"
          >
            {/* Header Panel */}
            <div className="px-7 py-6 border-b border-[#F4F5F7] flex items-start justify-between bg-white">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F79721]" />
                  <h2 className="text-lg font-extrabold text-[#111827] tracking-tight">
                    {title}
                  </h2>
                  {badge}
                </div>
                {subtitle && (
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleRequestClose}
                className="p-2 rounded-full bg-[#F4F5F7] text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB] transition-all"
                title="Tutup Formulir"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-7 py-6 bg-white">
              {children}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDirtyConfirm}
        onClose={() => setShowDirtyConfirm(false)}
        onConfirm={() => {
          setShowDirtyConfirm(false);
          onClose();
        }}
        title="Perubahan Belum Disimpan"
        iconType="dirty"
        variant="warning"
        confirmText="Ya, Tutup Formulir"
        cancelText="Lanjutkan Mengisi"
        message={
          <div>
            <p>
              Ada data formulir yang sudah Anda ketik namun belum disimpan ke
              database.
            </p>
            <p className="mt-2 font-medium text-[#D97005] bg-[#FFF7ED] p-2.5 rounded-xl">
              Jika Anda menutup sekarang, data yang baru diketik akan hilang.
            </p>
          </div>
        }
      />
    </>
  );
}
