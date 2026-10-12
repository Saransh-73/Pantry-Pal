import React from 'react';
import { Search, Zap, CheckCircle2, ArrowUpDown, X } from 'lucide-react';
import { RecipeCategory, SortOption } from '../types';

interface FilterBarProps {
  category: string;
  onCategoryChange: (cat: string) => void;
  quickMealsOnly: boolean;
  onToggleQuickMeals: () => void;
  canMakeOnly: boolean;
  onToggleCanMakeOnly: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalResults: number;
}

const CATEGORIES: (RecipeCategory | 'All')[] = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Quick Meals',
  'Soups & Salads',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  category,
  onCategoryChange,
  quickMealsOnly,
  onToggleQuickMeals,
  canMakeOnly,
  onToggleCanMakeOnly,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  totalResults,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Top Filter Controls: Search & Sort */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8476]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search recipes by name, ingredient, or tag"
            placeholder="Search recipes, ingredients, sabzi, dal..."
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-[#D8CEBA] bg-white text-sm text-[#252525] placeholder-[#8C8476] focus:outline-none focus:border-[#C65D32] focus:ring-1 focus:ring-[#C65D32] shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8476] hover:text-[#252525] p-0.5 rounded-full cursor-pointer"
              title="Clear search"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Toggles & Sort */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Meals Filter (≤ 30 mins) */}
          <button
            type="button"
            aria-pressed={quickMealsOnly}
            onClick={onToggleQuickMeals}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs md:text-sm font-medium border transition-all cursor-pointer ${
              quickMealsOnly
                ? 'bg-[#C65D32] text-white border-[#B34E25] shadow-xs'
                : 'bg-white text-[#252525] border-[#D8CEBA] hover:bg-[#F7F2E8]'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${quickMealsOnly ? 'text-amber-200 fill-current' : 'text-[#C65D32]'}`} />
            <span>Quick Meals (≤30m)</span>
          </button>

          {/* Can Make Now Filter (100% matched) */}
          <button
            type="button"
            aria-pressed={canMakeOnly}
            onClick={onToggleCanMakeOnly}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs md:text-sm font-medium border transition-all cursor-pointer ${
              canMakeOnly
                ? 'bg-[#252525] text-white border-[#252525] shadow-xs'
                : 'bg-white text-[#252525] border-[#D8CEBA] hover:bg-[#F7F2E8]'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${canMakeOnly ? 'text-[#C65D32]' : 'text-[#8C8476]'}`} />
            <span>Can Make Now (100%)</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-[#D8CEBA] rounded-xl px-2.5 py-1.5 shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#8C8476] shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="Sort recipes by"
              className="text-xs md:text-sm text-[#252525] bg-transparent outline-none cursor-pointer pr-1"
            >
              <option value="match">Sort: Best Match</option>
              <option value="ready-first">Sort: Ready to Cook</option>
              <option value="quickest">Sort: Fastest Cook Time</option>
              <option value="name">Sort: Recipe Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Category Tabs */}
        <div role="tablist" aria-label="Recipe categories" className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C65D32] text-white shadow-xs'
                    : 'bg-white hover:bg-[#F7F2E8] text-[#666158] hover:text-[#252525] border border-[#D8CEBA]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <span className="text-xs font-medium text-[#666158] self-end sm:self-auto shrink-0">
          Showing <strong className="text-[#252525]">{totalResults}</strong> {totalResults === 1 ? 'recipe' : 'recipes'}
        </span>
      </div>
    </div>
  );
};
