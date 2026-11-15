'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../lib/theme';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  href?: string;
  themePreference?: 'dark' | 'light' | 'auto';
}

export const CompareCartIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 32,
}) => {
  const width = Math.round(size * 1.3);
  return (
    <div className={`relative inline-block shrink-0 ${className}`} style={{ width, height: size }}>
      <Image
        src="/logo-icon.png"
        alt="CompareCart Icon"
        width={width}
        height={size}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = '',
  href,
  themePreference = 'auto',
}) => {
  let currentTheme = 'dark';
  try {
    const themeCtx = useTheme();
    if (themeCtx && themeCtx.theme) {
      currentTheme = themeCtx.theme;
    }
  } catch {
    currentTheme = 'dark';
  }

  const effectiveTheme = themePreference === 'auto' ? currentTheme : themePreference;

  const fullDimensions = {
    sm: { width: 160, height: 25 },
    md: { width: 198, height: 31 },
    lg: { width: 250, height: 39 },
    xl: { width: 320, height: 50 },
  };

  const iconDimensions = {
    sm: { width: 33, height: 25 },
    md: { width: 40, height: 31 },
    lg: { width: 51, height: 39 },
    xl: { width: 65, height: 50 },
  };

  const dims = showWordmark ? fullDimensions[size] : iconDimensions[size];

  // Pick the official asset
  const imageSrc = !showWordmark
    ? '/logo-icon.png'
    : effectiveTheme === 'light'
    ? '/logo-light.png'
    : '/logo-dark.png';

  const content = (
    <div
      className={`inline-flex items-center select-none group transition-transform duration-200 hover:scale-[1.02] ${className}`}
    >
      <div className="relative flex items-center justify-center" style={{ width: dims.width, height: dims.height }}>
        <Image
          src={imageSrc}
          alt="CompareCart"
          width={dims.width}
          height={dims.height}
          className="w-full h-full object-contain"
          priority
        />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded-lg inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
};
