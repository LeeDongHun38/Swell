/**
 * Swell 로고 컴포넌트
 */
import React from 'react';
export function SwellLogo({ className = '' }) {
  return (
    <img
      src="/logo/swell.svg"
      alt="Swell Logo"
      className={className}
    />
  );
}
