'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  KeyRound,
  ShoppingBag,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useCompareCart } from '../lib/store';
import { AppNotification, NotificationType } from '../types';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
  } = useCompareCart();

  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'order' | 'otp'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCopyOTP = (e: React.MouseEvent, id: string, code: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'order') return n.type === 'order';
    if (activeFilter === 'otp') return n.type === 'otp';
    return true;
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'otp':
        return <KeyRound className="w-4 h-4 text-purple-400" />;
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-amber-400" />;
      case 'success':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-400" />;
    }
  };

  const formatTimeAgo = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full bg-[#1c1c1e]/80 hover:bg-[#2c2c2e] border border-white/10 transition text-zinc-300 hover:text-white group"
        title="Notifications & Security Alerts"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 transition-transform group-hover:scale-110" />
        
        {unreadNotificationCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-lg shadow-rose-500/50 animate-pulse">
            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-[360px] sm:w-[420px] max-w-[95vw] bg-[#121214]/95 backdrop-blur-2xl rounded-2xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-50 overflow-hidden animate-fade-in flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Bell className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  Notifications
                  {unreadNotificationCount > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium">
                      {unreadNotificationCount} new
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-zinc-400">Activity, OTP verification & order tracking</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadNotificationCount > 0 && (
                <button
                  onClick={() => markAllNotificationsAsRead()}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition text-xs"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={() => clearNotifications()}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-rose-400 transition text-xs"
                  title="Clear all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.07] bg-black/20 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-full font-medium transition ${
                activeFilter === 'all'
                  ? 'bg-white text-black font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-2.5 py-1 rounded-full font-medium transition ${
                activeFilter === 'unread'
                  ? 'bg-white text-black font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Unread ({unreadNotificationCount})
            </button>
            <button
              onClick={() => setActiveFilter('otp')}
              className={`px-2.5 py-1 rounded-full font-medium transition ${
                activeFilter === 'otp'
                  ? 'bg-purple-500 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              OTP & Security
            </button>
            <button
              onClick={() => setActiveFilter('order')}
              className={`px-2.5 py-1 rounded-full font-medium transition ${
                activeFilter === 'order'
                  ? 'bg-amber-500 text-black font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Orders & Swipes
            </button>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto divide-y divide-white/[0.06] flex-1">
            {filteredNotifications.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <Bell className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-zinc-400 font-medium">No notifications in this filter</p>
                <p className="text-[11px] text-zinc-600 mt-0.5">Real-time alerts and OTPs will appear here</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`p-3.5 hover:bg-white/[0.04] transition cursor-pointer flex items-start gap-3 relative ${
                    !notif.read ? 'bg-amber-500/[0.04]' : ''
                  }`}
                >
                  {/* Unread dot */}
                  {!notif.read && (
                    <span className="absolute top-4 left-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}

                  {/* Icon */}
                  <div className="p-2 rounded-xl bg-white/[0.06] border border-white/10 shrink-0 mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-semibold ${!notif.read ? 'text-white' : 'text-zinc-300'}`}>
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-zinc-500 shrink-0 font-mono">
                        {formatTimeAgo(notif.timestamp)}
                      </span>
                    </div>

                    <p className="text-[11.5px] text-zinc-400 mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    {/* Specialized OTP Copy Banner */}
                    {notif.otpCode && (
                      <div className="mt-2.5 p-2 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                          <span className="text-[11px] text-purple-300 font-mono">Code:</span>
                          <span className="text-sm font-mono font-bold tracking-widest text-purple-200">
                            {notif.otpCode}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleCopyOTP(e, notif.id, notif.otpCode!)}
                          className="px-2.5 py-1 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-[10px] font-semibold flex items-center gap-1 transition shadow-sm"
                        >
                          {copiedId === notif.id ? (
                            <>
                              <Check className="w-3 h-3 text-white" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy OTP</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-black/40 border-t border-white/10 text-center text-[10px] text-zinc-500 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>CompareCart Real-Time Notification & Event Bus</span>
          </div>
        </div>
      )}
    </div>
  );
};
