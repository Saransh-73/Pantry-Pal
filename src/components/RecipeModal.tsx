import React, { useEffect } from 'react';
import {
  X,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Heart,
  Lightbulb,
  ChefHat,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { RecipeMatchResult } from '../types';

interface RecipeModalProps {
  matchResult: RecipeMatchResult;
  isFavorite: boolean;
  onToggleFavorite: (recipeId: string) => void;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  matchResult,
  isFavorite,
  onToggleFavorite,
  onClose,
}) => {
  const { recipe, matchedIngredients, missingIngredients, canMake, matchPercentage } = matchResult;
  const [imgError, setImgError] = React.useState(false);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-recipe-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#D8CEBA] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Bar with Close & Favorite */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#EFE7D5] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#666158] hover:text-[#252525] transition-colors py-1 px-2.5 rounded-lg hover:bg-[#F7F2E8] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Recipes</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-pressed={isFavorite}
              onClick={() => onToggleFavorite(recipe.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-[#C65D32] text-white shadow-2xs'
                  : 'bg-[#F7F2E8] text-[#252525] hover:bg-[#EADFCB] border border-[#D8CEBA]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white text-white' : 'text-[#C65D32]'}`} />
              <span>{isFavorite ? 'Favorited' : 'Save'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#F7F2E8] hover:bg-[#EADFCB] text-[#252525] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#EADFCB] shrink-0">
          {imgError ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#252525] via-[#383838] to-[#252525] p-6 text-center text-[#F7F2E8]">
              <div className="w-16 h-16 rounded-full bg-[#C65D32] flex items-center justify-center text-[#F7F2E8] shadow-md mb-3">
                <ChefHat className="w-8 h-8" />
              </div>
              <span className="font-serif font-bold text-xl sm:text-2xl text-[#F7F2E8]">{recipe.title}</span>
              <span className="text-xs text-[#EADFCB] mt-1">{recipe.category} • Authentic Recipe</span>
            </div>
          ) : (
            <img
              src={recipe.image}
              alt={recipe.title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

          <div className="absolute bottom-5 left-6 right-6 text-[#F7F2E8]">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C65D32] text-white">
                {recipe.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-[#F7F2E8] border border-white/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#EADFCB]" /> Vegetarian & Egg
              </span>
            </div>
            <h1 id="modal-recipe-title" className="text-2xl sm:text-3xl font-bold font-serif leading-tight text-white">
              {recipe.title}
            </h1>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-white">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#F7F2E8] border border-[#D8CEBA] text-center">
            <div className="p-2">
              <span className="text-xs text-[#666158] uppercase tracking-wider block">Prep Time</span>
              <span className="text-base font-bold text-[#252525]">{recipe.prepTime} mins</span>
            </div>
            <div className="p-2 border-l border-[#D8CEBA]">
              <span className="text-xs text-[#666158] uppercase tracking-wider block">Cook Time</span>
              <span className="text-base font-bold text-[#252525]">{recipe.cookTime} mins</span>
            </div>
            <div className="p-2 sm:border-l border-[#D8CEBA]">
              <span className="text-xs text-[#666158] uppercase tracking-wider block">Total Time</span>
              <span className="text-base font-bold text-[#C65D32] flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" /> {recipe.totalTime} mins
              </span>
            </div>
            <div className="p-2 border-l border-[#D8CEBA]">
              <span className="text-xs text-[#666158] uppercase tracking-wider block">Servings</span>
              <span className="text-base font-bold text-[#252525] flex items-center justify-center gap-1">
                <Users className="w-4 h-4 text-[#C65D32]" /> {recipe.servings}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[#666158] text-base leading-relaxed">
            {recipe.description}
          </p>

          {/* Pantry Availability Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-center gap-3 ${
              canMake
                ? 'bg-[#F7F2E8] border-[#C65D32] text-[#252525]'
                : 'bg-[#F7F2E8] border-[#D8CEBA] text-[#252525]'
            }`}
          >
            {canMake ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-[#C65D32] shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-[#252525]">You have everything needed!</h4>
                  <p className="text-xs text-[#666158]">All {recipe.ingredients.length} ingredients are currently in your pantry.</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-6 h-6 text-[#C65D32] shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-[#252525]">
                    {matchPercentage}% Ingredient Match ({matchedIngredients.length} of {recipe.ingredients.length} available)
                  </h4>
                  <p className="text-xs text-[#666158]">
                    You need {missingIngredients.length} more {missingIngredients.length === 1 ? 'ingredient' : 'ingredients'} to make this dish.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Ingredients Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#252525] flex items-center gap-2 font-serif">
                <ChefHat className="w-5 h-5 text-[#C65D32]" />
                Ingredients Checklist
              </h3>
              <span className="text-xs text-[#666158] font-medium">
                {matchedIngredients.length}/{recipe.ingredients.length} in pantry
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {recipe.ingredients.map((ing, idx) => {
                const inPantry = matchedIngredients.includes(ing.name);
                return (
                  <div
                    key={idx}
                    className={`flex items-start justify-between p-3 rounded-xl border text-sm transition-all ${
                      inPantry
                        ? 'bg-[#F7F2E8] border-[#C65D32]/50 text-[#252525] font-medium'
                        : 'bg-white border-[#D8CEBA] text-[#666158]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {inPantry ? (
                          <CheckCircle2 className="w-4 h-4 text-[#C65D32]" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-[#D8CEBA] flex items-center justify-center" />
                        )}
                      </div>
                      <div>
                        <span className={inPantry ? 'text-[#252525] font-semibold' : 'text-[#252525]'}>
                          {ing.name}
                        </span>
                        <span className="block text-xs text-[#8C8476] mt-0.5">{ing.amount}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 ml-2 ${
                        inPantry
                          ? 'bg-[#C65D32] text-white'
                          : 'bg-[#EADFCB] text-[#666158]'
                      }`}
                    >
                      {inPantry ? 'In Pantry' : 'Missing'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <h3 className="text-lg font-bold text-[#252525] font-serif mb-4">
              Step-by-Step Instructions
            </h3>
            <div className="space-y-4">
              {recipe.instructions.map((step, idx) => (
                <div key={idx} className="flex gap-4 p-3.5 rounded-xl hover:bg-[#F7F2E8] transition-colors">
                  <div className="w-7 h-7 rounded-full bg-[#252525] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-[#252525] leading-relaxed pt-0.5">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Chef's Pro Tip */}
          {recipe.chefTip && (
            <div className="p-4 rounded-2xl bg-[#F7F2E8] border border-[#D8CEBA] text-[#252525] flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-[#C65D32] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#C65D32] mb-1">
                  Chef&apos;s Secret Tip
                </h4>
                <p className="text-sm text-[#666158] leading-relaxed">
                  {recipe.chefTip}
                </p>
              </div>
            </div>
          )}

          {/* Bottom Action */}
          <div className="pt-4 border-t border-[#EFE7D5] flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#252525] hover:bg-[#383838] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Close Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
