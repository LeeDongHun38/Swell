/**
 * 로딩 화면 컴포넌트
 */
import React from 'react';
import { SwellLogo } from '../SwellLogo';

export function LoadingScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center animate-enter relative z-20">
      <div className="bg-white/40 backdrop-blur-xl p-12 rounded-[2rem] shadow-2xl border border-white/50 flex flex-col items-center max-w-md mx-4 transition-all hover:scale-105 duration-700">
        <div className="animate-spin-slow mb-8 drop-shadow-lg">
          <SwellLogo className="w-32 h-32" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 font-sans mb-4 leading-tight">
          Swell이 당신만의<br/>스타일을 찾고 있어요
        </h2>
        <p className="text-slate-600 font-medium">잠시만 기다려주세요...</p>
      </div>
    </div>
  );
}

