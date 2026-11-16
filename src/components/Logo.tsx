'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showTagline?: boolean;
  className?: string;
  href?: string;
  badge?: boolean;
}

export const CompareCartIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 28,
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
      {/* Precision SVG Brandmark matching the reference concept */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(40,100,255,0.35)]"
      >
        <path
          d="M11.5 8L6.5 17C5.8 18.2 6.7 19.8 8.1 19.8H18.5C19.9 19.8 20.8 18.2 20.1 17L15.1 8C14.4 6.8 12.2 6.8 11.5 8Z"
          fill="url(#cc-logo-grad1)"
        />
        <path
          d="M24.5 20.2L19.5 29.2C18.8 30.4 19.7 32 21.1 32H31.5C32.9 32 33.8 30.4 33.1 29.2L28.1 20.2C27.4 19 25.2 19 24.5 20.2Z"
          fill="url(#cc-logo-grad2)"
        />
        <path
          d="M25 8L15 26C14.3 27.2 15.2 28.8 16.6 28.8H23.5C24.9 28.8 25.8 27.2 25.1 26L18 13C17.3 11.8 18.2 10.2 19.6 10.2H23.5C24.9 10.2 25.8 8.6 25 8Z"
          fill="url(#cc-logo-grad3)"
          opacity="0.85"
        />
        <defs>
          <linearGradient id="cc-logo-grad1" x1="6" y1="7" x2="21" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2864FF" />
            <stop offset="1" stopColor="#7047F5" />
          </linearGradient>
          <linearGradient id="cc-logo-grad2" x1="19" y1="19" x2="34" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2864FF" />
            <stop offset="1" stopColor="#7047F5" />
          </linearGradient>
          <linearGradient id="cc-logo-grad3" x1="14" y1="8" x2="26" y2="29" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2864FF" />
            <stop offset="1" stopColor="#7047F5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  className = '',
  href,
  badge = false,
}) => {
  const iconSizes = {
    sm: 22,
    md: 28,
    lg: 34,
    xl: 42,
  };

  const textSizes = {
    sm: 'text-sm font-bold',
    md: 'text-base sm:text-lg font-bold',
    lg: 'text-xl sm:text-2xl font-bold',
    xl: 'text-2xl sm:text-3xl font-extrabold',
  };

  const content = (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <CompareCartIcon size={iconSizes[size]} />
      {showWordmark && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} tracking-tight text-[#101936] dark:text-[#F8FAFC] leading-none`}>
            Compare<span className="text-[#2864FF]">Cart</span>
          </span>
          {showTagline && (
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium tracking-wide mt-0.5">
              Compare • Save • Shop Smarter
            </span>
          )}
        </div>
      )}
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
