'use client';

import React from 'react';
import Link from 'next/link';

export interface FolderBadgeItem {
  label: string;
  bgColor: string;
}

export interface DriveFolderCardProps {
  title: string;
  subtitle?: string;
  subLabel?: string;
  metricLabel?: string;
  topLabel?: string;
  badges?: FolderBadgeItem[];
  isActive?: boolean;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}

/**
 * Komponen Kartu Folder "QUICK ACCESS" yang mereplikasi bentuk fisik Folder di image.png
 * Lengkap dengan tab folder di kiri atas, deretan lingkaran warna-warni bertumpuk, dan judul bawah.
 */
export function DriveFolderCard({
  title,
  subtitle,
  subLabel,
  metricLabel,
  topLabel,
  badges = [],
  isActive,
  active,
  href,
  onClick,
}: DriveFolderCardProps) {
  const isCardActive = Boolean(isActive ?? active);
  const resolvedTopLabel = topLabel || metricLabel || 'QUICK ACCESS';
  const resolvedSubLabel = subLabel || subtitle || 'FOLDER MASTER DATA';

  const cardInner = (
    <>
      {/* Bagian Tab Atas Kiri Folder */}
      <div className="flex items-end">
        <div
          className={`w-[44%] h-3.5 rounded-t-2xl transition-colors duration-200 ${
            isCardActive
              ? 'bg-[#F79721]'
              : 'bg-[#F4F5F7] group-hover:bg-[#FFF0DB]'
          }`}
        />
        <div className="w-3 h-3 bg-transparent" />
      </div>

      {/* Badan Utama Folder */}
      <div
        className={`w-full rounded-b-2xl rounded-tr-2xl p-5 transition-all duration-200 ${
          isCardActive
            ? 'bg-gradient-to-br from-[#F79721] to-[#E07F0B] text-white shadow-lg shadow-[#F79721]/25'
            : 'bg-[#F4F5F7] group-hover:bg-[#FFF0DB]/80 text-[#111827]'
        }`}
      >
        {/* Label Kecil Atas (setara "SHARED WITH" di image.png) */}
        <p
          className={`text-[9px] font-extrabold uppercase tracking-[0.12em] ${
            isCardActive ? 'text-white/85' : 'text-[#9CA3AF]'
          }`}
        >
          {resolvedTopLabel}
        </p>

        {/* Deretan Bulatan / Avatar Bertumpuk (setara avatar bulat di image.png) */}
        <div className="flex items-center -space-x-1.5 my-3.5">
          {badges.map((b, idx) => (
            <span
              key={idx}
              className={`w-7 h-7 rounded-full ${b.bgColor} text-white font-mono font-extrabold text-[9px] flex items-center justify-center shadow-2xs ring-2 ${
                isCardActive
                  ? 'ring-[#F79721]'
                  : 'ring-[#F4F5F7] group-hover:ring-[#FFF0DB]'
              }`}
            >
              {b.label}
            </span>
          ))}
        </div>

        {/* Sub-label & Judul Folder Bawah (setara "FOLDER / Design Files" di image.png) */}
        <div className="mt-4 pt-0.5">
          <p
            className={`text-[10px] font-semibold line-clamp-1 ${
              isCardActive ? 'text-white/85' : 'text-[#9CA3AF]'
            }`}
          >
            {resolvedSubLabel}
          </p>
          <p
            className={`text-xs sm:text-[13px] font-extrabold truncate mt-0.5 ${
              isCardActive
                ? 'text-white'
                : 'text-[#C26B0A] group-hover:text-[#9A3412]'
            }`}
          >
            {title}
          </p>
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group block text-left w-full focus:outline-none transition-transform duration-200 hover:-translate-y-0.5"
      >
        {cardInner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left w-full focus:outline-none transition-transform duration-200 hover:-translate-y-0.5"
    >
      {cardInner}
    </button>
  );
}

export interface DriveSummaryCardProps {
  icon: React.ReactNode;
  avatarBadge?: string;
  category?: string;
  title: string;
  subtitle?: string;
  metricLabel?: string;
  subtitleLabel?: string;
  subtitleValue?: string;
  active?: boolean;
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
}

/**
 * Komponen Kartu ke-4 pada baris QUICK ACCESS di image.png
 * ("Project Summary for English Class" Document Card Style)
 */
export function DriveSummaryCard({
  icon,
  avatarBadge = 'KT',
  category,
  title,
  subtitle,
  metricLabel,
  subtitleLabel,
  subtitleValue,
  active,
  isActive,
  href,
  onClick,
}: DriveSummaryCardProps) {
  const isCardActive = Boolean(isActive ?? active);
  const resolvedLabel = subtitleLabel || category || 'RINGKASAN';
  const resolvedValue = subtitleValue || metricLabel || subtitle || '';

  const cardInner = (
    <div
      className={`w-full h-full rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 ${
        isCardActive
          ? 'bg-gradient-to-br from-[#F79721] to-[#E07F0B] text-white shadow-lg shadow-[#F79721]/25'
          : 'bg-[#F4F5F7] group-hover:bg-[#FFF0DB]/80 text-[#111827]'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isCardActive
                ? 'bg-white/20 text-white'
                : 'bg-[#F79721] text-white'
            }`}
          >
            {icon}
          </div>
          <span
            className={`w-7 h-7 rounded-full font-mono font-extrabold text-[10px] flex items-center justify-center shadow-2xs ${
              isCardActive
                ? 'bg-white text-[#C26B0A]'
                : 'bg-[#059669] text-white'
            }`}
          >
            {avatarBadge}
          </span>
        </div>
        <p
          className={`text-xs sm:text-[13px] font-extrabold leading-snug line-clamp-2 ${
            isCardActive ? 'text-white' : 'text-[#C26B0A]'
          }`}
        >
          {title}
        </p>
        {subtitle && (
          <p
            className={`text-[10px] line-clamp-2 mt-1 ${
              isCardActive ? 'text-white/85' : 'text-[#6B7280]'
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-3 pt-1">
        <p
          className={`text-[9px] font-extrabold uppercase tracking-[0.1em] ${
            isCardActive ? 'text-white/75' : 'text-[#9CA3AF]'
          }`}
        >
          {resolvedLabel}
        </p>
        <p
          className={`text-[11px] font-bold truncate mt-0.5 ${
            isCardActive ? 'text-white/95' : 'text-[#111827]'
          }`}
        >
          {resolvedValue}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group block text-left w-full focus:outline-none transition-transform duration-200 hover:-translate-y-0.5 pt-3.5"
      >
        {cardInner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left w-full focus:outline-none transition-transform duration-200 hover:-translate-y-0.5 pt-3.5"
    >
      {cardInner}
    </button>
  );
}
