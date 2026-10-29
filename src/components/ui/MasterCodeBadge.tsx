'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MasterCodeBadgeProps {
  code: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showCopy?: boolean;
}

export function MasterCodeBadge({
  code,
  size = 'md',
  className = '',
  showCopy = true,
}: MasterCodeBadgeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sizeClasses = {
    sm: 'text-[11px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1.5',
  }[size];

  return (
    <span
      className={`group relative inline-flex items-center gap-1.5 font-mono font-semibold tracking-wide bg-brand-soft border border-brand-border/80 border-l-[3px] border-l-brand text-carbon rounded-r-md transition-all hover:bg-orange-100/70 select-all ${sizeClasses} ${className}`}
    >
      <span>{code}</span>
      {showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Salin kode ${code}`}
          title="Salin ke papan klip"
          className="opacity-0 group-hover:opacity-100 text-txt-secondary hover:text-brand transition-opacity duration-150 p-0.5 focus:opacity-100 focus:outline-none"
        >
          {copied ? (
            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
          ) : (
            <Copy className="w-3 h-3 shrink-0" />
          )}
        </button>
      )}
    </span>
  );
}
