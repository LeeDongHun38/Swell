/**
 * 배경 컴포넌트
 */
import React from 'react';

export function Background() {
  return (
    <div className="absolute inset-0 z-0">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{
          backgroundImage: `url('/logo/background.png')`,
          filter: 'blur(8px) brightness(0.95)'
        }}
      />
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/60 to-transparent" />
    </div>
  );
}

