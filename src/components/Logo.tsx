'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  href?: string;
  badge?: boolean;
}

export const CompareCartIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 30,
}) => {
  return (
    <img
      src="/logo-icon.png"
      alt="CompareCart"
      width={Math.round(size * 1.3)}
      height={size}
      className={`inline-block object-contain shrink-0 ${className}`}
      style={{ height: `${size}px`, width: 'auto' }}
    />
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = '',
  href,
  badge = true,
}) => {
  const heightStyles = {
    sm: 'h-6 sm:h-6.5',
    md: 'h-7 sm:h-8',
    lg: 'h-9 sm:h-10',
    xl: 'h-11 sm:h-12',
  };

  const badgePadding = {
    sm: 'px-2.5 py-1',
    md: 'px-3 py-1.5',
    lg: 'px-4 py-2',
    xl: 'px-5 py-2.5',
  };

  const imageSrc = showWordmark ? '/logo.png' : '/logo-icon.png';

  const logoImg = (
    <img
      src={imageSrc}
      alt="CompareCart"
      className={`${heightStyles[size]} w-auto object-contain shrink-0`}
    />
  );

  const content = badge ? (
    <div
      className={`inline-flex items-center justify-center bg-white rounded-full ${badgePadding[size]} shadow-[0_2px_12px_rgba(0,112,243,0.15)] hover:shadow-[0_4px_20px_rgba(0,112,243,0.25)] transition-all duration-200 hover:scale-[1.02] select-none ${className}`}
    >
      {logoImg}
    </div>
  ) : (
    <div className={`inline-flex items-center select-none ${className}`}>
      {logoImg}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="focus:outline-none focus:ring-2 focus:ring-blue-500/40 rounded-full inline-flex items-center"
      >
        {content}
      </Link>
    );
  }

  return content;
};
