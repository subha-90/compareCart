'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  href?: string;
  useImage?: boolean;
}

export const CompareCartIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 32,
}) => {
  return (
    <svg
      width={size}
      height={(size * 78) / 100}
      viewBox="0 0 115 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        {/* Top Capsule Gradient: Vibrant Electric Blue to Royal Violet */}
        <linearGradient id="cc-top-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0066FF" />
          <stop offset="50%" stopColor="#0070F3" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>

        {/* Bottom Capsule Gradient: Deep Royal Violet to Electric Blue */}
        <linearGradient id="cc-bottom-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0052D4" />
          <stop offset="65%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#0070F3" />
        </linearGradient>

        {/* Dynamic ambient glow filter */}
        <filter id="cc-glow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="#0066FF" floodOpacity="0.3" />
        </filter>
      </defs>

      <g filter="url(#cc-glow)">
        {/* Top-Left Angled Rounded Capsule */}
        <rect
          x="34"
          y="6"
          width="58"
          height="32"
          rx="15"
          fill="url(#cc-top-grad)"
          transform="skewX(-30)"
        />

        {/* Bottom-Right Angled Rounded Capsule */}
        <rect
          x="60"
          y="44"
          width="58"
          height="32"
          rx="15"
          fill="url(#cc-bottom-grad)"
          transform="skewX(-30)"
        />
      </g>
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = '',
  href,
  useImage = false,
}) => {
  const iconSizes = {
    sm: 26,
    md: 32,
    lg: 42,
    xl: 52,
  };

  const imageDimensions = {
    sm: { width: 110, height: 28 },
    md: { width: 140, height: 36 },
    lg: { width: 180, height: 46 },
    xl: { width: 220, height: 56 },
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none group ${className}`}>
      {useImage ? (
        <div className="relative overflow-hidden rounded-lg">
          <Image
            src="/logo.jpg"
            alt="CompareCart"
            width={imageDimensions[size].width}
            height={imageDimensions[size].height}
            className="object-contain"
            priority
          />
        </div>
      ) : (
        <>
          {/* Official CompareCart Icon Mark */}
          <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <CompareCartIcon size={iconSizes[size]} />
          </div>

          {/* Official CompareCart Two-Tone Wordmark */}
          {showWordmark && (
            <span className={`font-bold tracking-tight font-sans ${textSizes[size]}`}>
              <span className="text-white group-hover:text-white transition-colors duration-200">
                Compare
              </span>
              <span className="text-[#0070F3] group-hover:text-[#2563EB] transition-colors duration-200">
                Cart
              </span>
            </span>
          )}
        </>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none focus:ring-2 focus:ring-blue-500/40 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
};
