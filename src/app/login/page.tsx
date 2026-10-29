'use client';

import React, { useState } from 'react';
import { loginAction } from '@/actions/auth-actions';
import {
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('identifier', identifier);
    formData.append('password', password);

    try {
      const result = await loginAction(null, formData);
      if (result && !result.success) {
        setErrorMessage(result.message || 'Login gagal.');
        setIsLoading(false);
      }
    } catch {
      // Next.js redirect
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      {/* Main Split Card adopting the curved orange sidebar aesthetic from image.png */}
      <div className="w-full max-w-4xl bg-white rounded-[36px] shadow-xl shadow-black/[0.05] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Brand Panel: Curved Top-Right Orange Gradient (Identical to Sidebar in image.png) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#F79721] via-[#EA820E] to-[#D97005] text-white p-8 sm:p-10 flex flex-col justify-between lg:rounded-tr-[54px] relative overflow-hidden">
          <div>
            <div className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-xs font-extrabold mb-6">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>SIAKUN • KANAL TIGA</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Master Data Akuntansi
            </h1>
            <p className="text-xs text-white/90 mt-2.5 leading-relaxed">
              Sistem informasi manajemen bagan akun (COA), katalog peralatan sewa, pemasok, pelanggan, dan satuan berbasis kaidah Pengantar Akuntansi.
            </p>
          </div>

          {/* Storage-style Status Widget on Login Left Panel */}
          <div className="mt-10 pt-6 border-t border-white/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
              <span>Kaidah Saldo Awal Master Data = Rp 0</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
              <span>Bagan Akun 3-Segmen (X-YY-ZZ)</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
              <span>Simulasi T-Account &amp; Review COA</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel: Pure White Clean Drive Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-[#111827] tracking-tight">
                  Masuk ke Workspace
                </h2>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Masukkan kredensial pengelola Master Data Kanal Tiga
                </p>
              </div>
              <img
                src="/logo.png"
                alt="Logo Kanal Tiga"
                className="h-10 w-auto object-contain"
              />
            </div>

            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-[#FFF1F2] flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
                <div className="text-xs text-[#E11D48] font-semibold">
                  {errorMessage}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-xs font-bold text-[#111827] mb-1.5"
                >
                  Username atau Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9CA3AF]">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    required
                    autoFocus
                    autoComplete="username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Ketik username (contoh: teguh)"
                    className="block w-full pl-10 pr-4 py-3 text-xs font-semibold rounded-full bg-[#F4F5F7] text-[#111827] placeholder-[#9CA3AF] focus:bg-white border border-transparent focus:border-[#F79721] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-[#111827] mb-1.5"
                >
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9CA3AF]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="block w-full pl-10 pr-11 py-3 text-xs font-semibold rounded-full bg-[#F4F5F7] text-[#111827] placeholder-[#9CA3AF] focus:bg-white border border-transparent focus:border-[#F79721] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9CA3AF] hover:text-[#111827]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-[#F79721]" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !identifier || !password}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-5 rounded-full shadow-md shadow-[#F79721]/25 text-xs font-extrabold text-white bg-[#F79721] hover:bg-[#E07F0B] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Sistem</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Fill Demo Pills */}
          <div className="mt-6 pt-5 border-t border-[#F4F5F7] space-y-2.5">
            <span className="text-[11px] font-bold text-[#9CA3AF] block">
              Klik Cepat Akun Demo (Sandi: 123456):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { u: 'teguh', n: 'Teguh (Koordinator)' },
                { u: 'fawwaz', n: 'Fawwaz (COA)' },
                { u: 'daffa', n: 'Daffa (Produk)' },
                { u: 'awal', n: 'Awal (Pemasok)' },
                { u: 'devin', n: 'Devin (Pelanggan)' },
              ].map((item) => (
                <button
                  key={item.u}
                  type="button"
                  onClick={() => {
                    setIdentifier(item.u);
                    setPassword('123456');
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#F4F5F7] hover:bg-[#FFF7ED] text-[11px] font-bold text-[#6B7280] hover:text-[#F79721] transition-all"
                >
                  {item.n}
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-[#9CA3AF]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
              <span>SIAKUN Kanal Tiga • Purwokerto, Jawa Tengah</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
