import React, { useState } from 'react';
import { Clock, Users, Heart, CheckCircle, AlertCircle, ChevronRight, ChefHat } from 'lucide-react';
import { RecipeMatchResult } from '../types';

interface RecipeCardProps {
  matchResult: RecipeMatchResult;
  isFavorite: boolean;
  onToggleFavorite: (recipeId: string) => void;
  onSelectRecipe: (recipe: RecipeMatchResult) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  matchResult,
  isFavorite,
  onToggleFavorite,
  onSelectRecipe,
}) => {
  const { recipe, matchedCount, totalIngredients, matchPercentage, canMake, missingIngredients } =
    matchResult;
  const [imgError, setImgError] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View recipe details for ${recipe.title}`}
      onClick={() => onSelectRecipe(matchResult)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectRecipe(matchResult);
        }
      }}
      className="group bg-white rounded-2xl overflow-hidden border border-[#D8CEBA] hover:border-[#C65D32] focus:outline-none focus:ring-2 focus:ring-[#C65D32] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
    >
      {/* Top Image & Overlays */}
      <div className="relative h-48 w-full overflow-hidden bg-[#EADFCB]">
        {imgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#EADFCB] to-[#D8CEBA] p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#F7F2E8] flex items-center justify-center text-[#C65D32] shadow-xs mb-2">
              <ChefHat className="w-6 h-6" />
            </div>
            <span className="font-serif font-bold text-[#252525] text-sm px-2 line-clamp-1">{recipe.title}</span>
            <span className="text-[11px] text-[#666158] mt-0.5">{recipe.category} • Authentic Dish</span>
          </div>
        ) : (
          <img
            src={recipe.image}
            alt={recipe.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#252525]/80 backdrop-blur-md text-[#F7F2E8] text-xs font-medium z-10">
          {recipe.category}
        </span>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer z-10 ${
            isFavorite
              ? 'bg-[#C65D32] text-white shadow-md shadow-[#C65D32]/40'
              : 'bg-black/40 hover:bg-black/60 text-white'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-white' : ''}`} />
        </button>

        {/* Match Percentage / Availability Banner on Image Bottom */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          {canMake ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C65D32]/95 backdrop-blur-md text-white text-xs font-semibold shadow-md">
              <CheckCircle className="w-4 h-4 text-[#F7F2E8] shrink-0" />
              <span>Ready to Cook! (All {totalIngredients} ingredients)</span>
            </div>
          ) : (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#252525]/90 backdrop-blur-md text-[#F7F2E8] text-xs font-medium shadow-md">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#EADFCB] shrink-0" />
                <span>
                  {matchedCount}/{totalIngredients} ingredients
                </span>
              </div>
              <span className="font-semibold text-[#F7F2E8]">{matchPercentage}% match</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          <h3 className="font-serif font-bold text-[#252525] text-lg group-hover:text-[#C65D32] transition-colors line-clamp-1 mb-1.5">
            {recipe.title}
          </h3>
          <p className="text-[#666158] text-xs line-clamp-2 leading-relaxed mb-4">
            {recipe.description}
          </p>

          {/* Missing items indicator */}
          {!canMake && missingIngredients.length > 0 && (
            <div className="mb-4 bg-[#F7F2E8] border border-[#E5DAC3] rounded-xl p-2.5 text-xs">
              <span className="font-semibold text-[#C65D32] block mb-1">
                Missing ({missingIngredients.length}):
              </span>
              <p className="text-[#252525] line-clamp-1">
                {missingIngredients.slice(0, 3).join(', ')}
                {missingIngredients.length > 3 ? ` +${missingIngredients.length - 3} more` : ''}
              </p>
            </div>
          )}
        </div>

        {/* Footer Meta & Action */}
        <div className="pt-3 border-t border-[#EFE7D5] flex items-center justify-between text-xs text-[#666158]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#C65D32]" />
              {recipe.totalTime}m
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#C65D32]" />
              {recipe.servings} serv
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#F7F2E8] font-medium text-[#252525]">
              {recipe.difficulty}
            </span>
          </div>

          <span className="inline-flex items-center gap-0.5 text-[#C65D32] font-semibold group-hover:translate-x-0.5 transition-transform">
            View <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
};
