'use client';

import React from 'react';
import { UserProfile } from '../../types';
import { ThemeToggleCapsule } from '../ThemeToggleCapsule';

interface UserProfileTabProps {
  currentProfile: UserProfile;
  onOpenMyCards: () => void;
}

export const UserProfileTab: React.FC<UserProfileTabProps> = ({
  currentProfile,
  onOpenMyCards,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn max-w-xl mx-auto">
      <h2 className="text-2xl font-extrabold tracking-tight">Account &amp; Settings</h2>

      {/* Profile Card */}
      <div className="rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 p-6 shadow-soft flex items-center gap-4">
        <img
          src={currentProfile.avatar}
          alt={currentProfile.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-[#2864FF]"
        />
        <div className="space-y-1">
          <h3 className="text-lg font-bold">{currentProfile.name}</h3>
          <p className="text-xs text-slate-500">{currentProfile.email}</p>
          <span className="inline-block text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
            {currentProfile.role}
          </span>
        </div>
      </div>

      {/* Theme & Preferences */}
      <div className="rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold">Theme Preference</h4>
            <p className="text-xs text-slate-500">Switch between Light &amp; Dark interface</p>
          </div>
          <ThemeToggleCapsule />
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold">My Linked Cards</h4>
            <p className="text-xs text-slate-500">Manage card liquidity and 10% platform rewards</p>
          </div>
          <button
            type="button"
            onClick={onOpenMyCards}
            className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-white/20 transition"
          >
            Manage
          </button>
        </div>
      </div>
    </div>
  );
};
