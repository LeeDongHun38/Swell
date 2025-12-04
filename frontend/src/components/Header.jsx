/**
 * 헤더 컴포넌트
 */
import React from 'react';
import { SwellLogo } from './SwellLogo';

export function Header({ step, title, badge }) {
  if (step >= 4) return null;

  return (
    <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-enter">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-2 font-brand">
          Swell
        </h1>
        <p className="text-slate-500 font-medium">{title}</p>
      </div>
      {badge && (
        <div className="hidden md:block px-4 py-2 bg-white/50 rounded-full border border-white/60 text-sm font-semibold text-slate-600 backdrop-blur-md">
          {badge}
        </div>
      )}
    </header>
  );
}

