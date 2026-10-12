import React from 'react';
import { ChefHat, Heart, Utensils, Sparkles } from 'lucide-react';

interface NavbarProps {
  pantryCount: number;
  favoritesCount: number;
  onFavoritesClick: () => void;
  showFavoritesOnly: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  pantryCount,
  favoritesCount,
  onFavoritesClick,
  showFavoritesOnly,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#252525] text-white border-b border-[#383838] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#C65D32] flex items-center justify-center shadow-md text-[#F7F2E8]">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-[#F7F2E8] font-serif">PantryPal</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#333333] text-[#F7F2E8] border border-[#444444]">
                <Sparkles className="w-3 h-3 mr-1 text-[#C65D32]" />
                Veg & Egg
              </span>
            </div>
            <p className="text-xs text-[#EADFCB]/80 hidden sm:block">Cook delicious homestyle meals from what you already have</p>
          </div>
        </div>

        {/* Status / Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1c1c] border border-[#383838] text-xs text-[#EADFCB] font-medium">
            <Utensils className="w-3.5 h-3.5 text-[#C65D32]" />
            <span>Pantry: </span>
            <span className="font-bold text-white bg-[#333333] px-1.5 py-0.5 rounded">
              {pantryCount} {pantryCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button
            type="button"
            aria-pressed={showFavoritesOnly}
            onClick={onFavoritesClick}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
              showFavoritesOnly
                ? 'bg-[#C65D32] text-white shadow-md shadow-[#C65D32]/30 ring-2 ring-[#C65D32]/50'
                : 'bg-[#333333] hover:bg-[#3d3d3d] text-[#F7F2E8] hover:text-white border border-[#444444]'
            }`}
            title="Toggle saved favorites"
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current text-white' : 'text-[#C65D32]'}`} />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                showFavoritesOnly ? 'bg-white text-[#C65D32]' : 'bg-[#C65D32] text-white'
              }`}>
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
