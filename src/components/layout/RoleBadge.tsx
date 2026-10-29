import React from 'react';
import { UserRole } from '@/lib/permissions';
import { ShieldCheck, Calculator, Boxes, Users, Eye } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  showIcon?: boolean;
  className?: string;
}

export function RoleBadge({ role, showIcon = true, className = '' }: RoleBadgeProps) {
  const roleConfig = {
    ADMIN: {
      label: 'ADMINISTRATOR',
      bg: 'bg-orange-950/60 text-brand border-brand/50',
      icon: ShieldCheck,
      color: '#F79721',
    },
    ACCOUNTANT: {
      label: 'AKUNTAN',
      bg: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40',
      icon: Calculator,
      color: '#34D399',
    },
    INVENTORY: {
      label: 'LOGISTIK',
      bg: 'bg-amber-950/60 text-amber-400 border-amber-500/40',
      icon: Boxes,
      color: '#FBBF24',
    },
    FRONT_DESK: {
      label: 'FRONT DESK',
      bg: 'bg-sky-950/60 text-sky-400 border-sky-500/40',
      icon: Users,
      color: '#38BDF8',
    },
    AUDITOR: {
      label: 'AUDITOR',
      bg: 'bg-purple-950/60 text-purple-400 border-purple-500/40',
      icon: Eye,
      color: '#C084FC',
    },
  }[role] || {
    label: role,
    bg: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    icon: ShieldCheck,
    color: '#A1A1AA',
  };

  const IconComponent = roleConfig.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-medium border ${roleConfig.bg} ${className}`}
    >
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span>{roleConfig.label}</span>
    </span>
  );
}
