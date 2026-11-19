'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { Product, OptimizedDeal } from '../../types';
import { NavTab } from '../BottomNavBar';

interface UserSavedTabProps {
  lovedProductIds: string[];
  toggleLovedProduct: (id: string) => void;
  products: Product[];
  optimizeProductDeals: (p: Product) => OptimizedDeal[];
  onSelectProduct: (id: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  getDealPrice: (deal?: OptimizedDeal | null) => number;
}

export const UserSavedTab: React.FC<UserSavedTabProps> = ({
  lovedProductIds,
  toggleLovedProduct,
  products,
  optimizeProductDeals,
  onSelectProduct,
  onNavigateTab,
  getDealPrice,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Saved Products</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track price drops and instant bank deals</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#7047F5]/10 text-[#7047F5] border border-[#7047F5]/20">
          {lovedProductIds.length} Items Saved
        </span>
      </div>

      {lovedProductIds.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 text-center space-y-3">
          <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h4 className="text-base font-bold">Your Wishlist is Empty</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any product to save it and monitor instant bank price drops.
          </p>
          <button
            type="button"
            onClick={() => onNavigateTab('home')}
            className="px-5 py-2.5 rounded-full cc-gradient-btn text-white text-xs font-semibold shadow-glow-blue mt-2"
          >
            Explore Trending Deals
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products
            .filter((p) => lovedProductIds.includes(p.id))
            .map((p) => {
              const deals = optimizeProductDeals(p);
              const lowest = deals[0];
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProduct(p.id);
                    onNavigateTab('compare');
                  }}
                  className="cursor-pointer rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 p-5 shadow-soft hover:shadow-glow-blue transition flex flex-col justify-between"
                >
                  <div>
                    <div className="relative w-full h-40 rounded-2xl bg-slate-50 dark:bg-black/30 flex items-center justify-center p-4 mb-3">
                      <img src={p.image} alt={p.title} className="max-h-32 object-contain" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLovedProduct(p.id);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-red-500 text-white shadow-sm"
                      >
                        <Heart className="w-4 h-4 fill-white" />
                      </button>
                    </div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">{p.brand}</p>
                    <h4 className="text-sm font-bold text-[#101936] dark:text-white line-clamp-1 mt-0.5">{p.title}</h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500">Best Deal</span>
                      <p className="text-base font-black text-[#101936] dark:text-white">
                        ₹{lowest ? getDealPrice(lowest).toLocaleString('en-IN') : 'N/A'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(p.id);
                        onNavigateTab('compare');
                      }}
                      className="px-3.5 py-1.5 rounded-full cc-gradient-btn text-white text-xs font-semibold"
                    >
                      Compare
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
