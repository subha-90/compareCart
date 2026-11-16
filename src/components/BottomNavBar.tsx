'use client';

import React from 'react';
import { Home, Layers, Gift, Heart, User } from 'lucide-react';
import { useCompareCart } from '../lib/store';

export type NavTab = 'home' | 'compare' | 'rewards' | 'saved' | 'profile';

interface BottomNavBarProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  className?: string;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  className = '',
}) => {
  const { lovedProductIds } = useCompareCart();

  const tabs: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'compare', label: 'Compare', icon: Layers },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'saved', label: 'Saved', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      className={`fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#101116]/95 backdrop-blur-2xl border-t border-[#E8ECF4] dark:border-white/[0.08] px-4 py-2 sm:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.5)] ${className}`}
      aria-label="Mobile Navigation"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 select-none ${
                isActive
                  ? 'text-[#2864FF] dark:text-[#2864FF] font-semibold scale-105'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-[#7047F5] dark:text-[#2864FF]' : ''}`} />
                {tab.id === 'saved' && lovedProductIds.length > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#7047F5] text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                    {lovedProductIds.length}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#2864FF] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
