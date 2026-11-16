'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../lib/theme';

interface ThemeToggleCapsuleProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const ThemeToggleCapsule: React.FC<ThemeToggleCapsuleProps> = ({
  className = '',
  size = 'md',
}) => {
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <div
      className={`inline-flex items-center p-1 rounded-full border transition-all duration-200 select-none ${
        isDark
          ? 'bg-[#181A22] border-white/10 shadow-inner'
          : 'bg-[#EBF0F8] border-[#DCE4F0] shadow-sm'
      } ${className}`}
    >
      {/* Light Option */}
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
          !isDark
            ? 'bg-white text-[#101936] shadow-[0_2px_8px_rgba(16,25,54,0.1)] scale-[1.02]'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
        title="Switch to Light Theme"
      >
        <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500' : 'text-zinc-400'}`} />
        <span>Light</span>
      </button>

      {/* Dark Option */}
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
          isDark
            ? 'bg-[#252837] text-white shadow-[0_2px_8px_rgba(0,0,0,0.5)] border border-white/10 scale-[1.02]'
            : 'text-zinc-500 hover:text-zinc-800'
        }`}
        title="Switch to Dark Theme"
      >
        <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-[#2864FF]' : 'text-zinc-500'}`} />
        <span>Dark</span>
      </button>
    </div>
  );
};
