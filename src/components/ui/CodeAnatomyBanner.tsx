'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export interface CodeSegment {
  code: string;
  label: string;
  description: string;
  color?: string;
}

interface CodeAnatomyBannerProps {
  title: string;
  subtitle: string;
  segments: CodeSegment[];
  resultCode: string;
  accountingNote?: string;
  defaultExpanded?: boolean;
}

export function CodeAnatomyBanner({
  title,
  subtitle,
  segments,
  resultCode,
  accountingNote,
  defaultExpanded = false,
}: CodeAnatomyBannerProps) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  return (
    <div className="mb-6 bg-surface-card border border-border-structural rounded-lg overflow-hidden transition-all shadow-tactile-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-surface-canvas/60 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-brand-soft border border-brand-border flex items-center justify-center text-brand">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-heading font-bold text-txt-primary flex items-center gap-2">
              <span>{title}</span>
              <span className="font-mono text-[11px] px-1.5 py-0.2 bg-brand text-carbon font-bold rounded">
                {resultCode}
              </span>
            </h3>
            <p className="text-[11px] text-txt-secondary">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-txt-secondary hover:text-brand">
          <span>{isOpen ? 'Tutup Penjelasan' : 'Pelajari Struktur Kode'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-1 border-t border-border-structural bg-surface-canvas/30 space-y-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-2">
            {segments.map((seg, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center bg-surface-card border border-border-structural rounded p-2.5 shadow-sm min-w-[100px]">
                  <span className="font-mono font-bold text-base text-brand">
                    {seg.code}
                  </span>
                  <span className="text-[11px] font-semibold text-txt-primary mt-0.5">
                    {seg.label}
                  </span>
                  <span className="text-[10px] text-txt-muted text-center max-w-[130px] leading-tight mt-1">
                    {seg.description}
                  </span>
                </div>
                {idx < segments.length - 1 && (
                  <span className="font-mono font-bold text-txt-muted text-lg">
                    +
                  </span>
                )}
              </React.Fragment>
            ))}
            <span className="font-mono font-bold text-txt-muted text-lg hidden sm:inline">
              =
            </span>
            <div className="flex flex-col items-center bg-brand-soft border-2 border-brand rounded p-2.5 shadow-sm min-w-[110px]">
              <span className="font-mono font-bold text-base text-carbon">
                {resultCode}
              </span>
              <span className="text-[11px] font-bold text-brand-hover mt-0.5">
                Kode Final
              </span>
              <span className="text-[10px] text-txt-secondary text-center leading-tight mt-1">
                Unik & Standar Baku
              </span>
            </div>
          </div>

          {accountingNote && (
            <div className="p-3 bg-brand-soft/60 border border-brand-border rounded flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-brand shrink-0 mt-0.5" />
              <div className="text-xs text-txt-primary leading-relaxed">
                <span className="font-semibold text-carbon">Landasan Teori Akuntansi: </span>
                {accountingNote}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
