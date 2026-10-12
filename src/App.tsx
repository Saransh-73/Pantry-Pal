import { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { PantryInput } from './components/PantryInput';
import { FilterBar } from './components/FilterBar';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { RECIPES } from './data/recipes';
import { rankAndFilterRecipes } from './utils/matcher';
import { RecipeMatchResult, SortOption } from './types';
import { UtensilsCrossed, Sparkles, ChefHat } from 'lucide-react';

const FAVORITES_STORAGE_KEY = 'pantrypal_favorites';
const PANTRY_STORAGE_KEY = 'pantrypal_ingredients';

const DEFAULT_PANTRY = ['Eggs', 'Tomatoes', 'Garlic', 'Olive Oil', 'Cheese', 'Pasta'];

export default function App() {
  // --- Pantry State with LocalStorage ---
  const [pantryIngredients, setPantryIngredients] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(PANTRY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const sanitized = parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
          if (sanitized.length > 0) {
            return sanitized;
          }
        }
      }
    } catch {
      // Fallback to default
    }
    return DEFAULT_PANTRY;
  });

  // Save pantry to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PANTRY_STORAGE_KEY, JSON.stringify(pantryIngredients));
    } catch {
      // Ignore storage errors
    }
  }, [pantryIngredients]);

  // --- Favorites State with LocalStorage Persistence ---
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((id): id is string => typeof id === 'string' && id.trim().length > 0);
        }
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Ignore storage errors
    }
  }, [favorites]);

  const toggleFavorite = (recipeId: string) => {
    setFavorites((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  // --- Filter & Search States ---
  const [category, setCategory] = useState<string>('All');
  const [quickMealsOnly, setQuickMealsOnly] = useState<boolean>(false);
  const [canMakeOnly, setCanMakeOnly] = useState<boolean>(false);
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('match');

  // --- Modal State ---
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeMatchResult | null>(null);

  // --- Pantry Handlers ---
  const addIngredient = (name: string) => {
    const trimmed = name.trim().slice(0, 50);
    if (!trimmed) return;
    const exists = pantryIngredients.some(
      (item) => item.toLowerCase() === trimmed.toLowerCase()
    );
    if (!exists) {
      setPantryIngredients((prev) => [...prev, trimmed]);
    }
  };

  const removeIngredient = (name: string) => {
    setPantryIngredients((prev) =>
      prev.filter((item) => item.toLowerCase() !== name.toLowerCase())
    );
  };

  const clearIngredients = () => {
    setPantryIngredients([]);
  };

  // --- Filtered and Ranked Recipes ---
  const matchedRecipes = useMemo(() => {
    return rankAndFilterRecipes(RECIPES, pantryIngredients, {
      category,
      quickMealsOnly,
      canMakeOnly,
      favoritesOnly,
      searchQuery,
      favoriteIds: favorites,
      sortBy,
    });
  }, [pantryIngredients, category, quickMealsOnly, canMakeOnly, favoritesOnly, searchQuery, favorites, sortBy]);

  // Keep modal in sync with matched ingredients when pantry updates
  const currentModalResult = useMemo(() => {
    if (!selectedRecipe) return null;
    const updated = matchedRecipes.find((m) => m.recipe.id === selectedRecipe.recipe.id);
    return updated || selectedRecipe;
  }, [selectedRecipe, matchedRecipes]);

  // Count ready to cook recipes
  const readyToCookCount = useMemo(() => {
    return matchedRecipes.filter((r) => r.canMake).length;
  }, [matchedRecipes]);

  return (
    <div className="min-h-screen bg-[#F7F2E8] text-[#252525] font-sans flex flex-col">
      {/* Navigation */}
      <Navbar
        pantryCount={pantryIngredients.length}
        favoritesCount={favorites.length}
        onFavoritesClick={() => setFavoritesOnly((prev) => !prev)}
        showFavoritesOnly={favoritesOnly}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Banner */}
        <section className="mb-8 bg-[#252525] text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden border border-[#383838]">
          <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none text-white">
            <ChefHat className="w-80 h-80" />
          </div>

          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#333333] text-[#F7F2E8] text-xs font-semibold mb-3 border border-[#444444]">
              <Sparkles className="w-3.5 h-3.5 text-[#C65D32]" />
              <span>Smart Pantry Matcher</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight leading-tight mb-3 text-[#F7F2E8]">
              Turn your everyday ingredients into comforting meals.
            </h1>
            <p className="text-[#EADFCB] text-sm sm:text-base leading-relaxed max-w-xl">
              Tell us what is in your kitchen — potatoes, onions, tomatoes, eggs, or lentils. Discover familiar, wholesome Indian dishes ranked by what you can cook right away.
            </p>

            {readyToCookCount > 0 && (
              <div className="mt-5 inline-flex items-center gap-2 bg-[#1c1c1c] border border-[#C65D32]/50 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm text-[#F7F2E8]">
                <span className="w-2 h-2 rounded-full bg-[#C65D32] animate-pulse" />
                <span>
                  <strong>{readyToCookCount} {readyToCookCount === 1 ? 'dish is' : 'dishes are'}</strong> ready to cook with your pantry!
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Pantry Input Section */}
        <PantryInput
          ingredients={pantryIngredients}
          onAddIngredient={addIngredient}
          onRemoveIngredient={removeIngredient}
          onClearIngredients={clearIngredients}
        />

        {/* Filter and Search Bar */}
        <FilterBar
          category={category}
          onCategoryChange={setCategory}
          quickMealsOnly={quickMealsOnly}
          onToggleQuickMeals={() => setQuickMealsOnly((prev) => !prev)}
          canMakeOnly={canMakeOnly}
          onToggleCanMakeOnly={() => setCanMakeOnly((prev) => !prev)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalResults={matchedRecipes.length}
        />

        {/* Recipe Grid or Empty State */}
        {matchedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedRecipes.map((item) => (
              <RecipeCard
                key={item.recipe.id}
                matchResult={item}
                isFavorite={favorites.includes(item.recipe.id)}
                onToggleFavorite={toggleFavorite}
                onSelectRecipe={setSelectedRecipe}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#D8CEBA] p-12 text-center max-w-md mx-auto my-8 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-[#F7F2E8] text-[#C65D32] flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#252525] font-serif mb-2">
              No matching recipes found
            </h3>
            <p className="text-[#666158] text-sm leading-relaxed mb-6">
              {favoritesOnly
                ? "You haven't saved any favorite recipes yet. Click the heart icon on any dish to bookmark it."
                : 'Try adjusting your filters, searching for a different item, or adding more staples to your pantry.'}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {favoritesOnly && (
                <button
                  onClick={() => setFavoritesOnly(false)}
                  className="px-4 py-2 rounded-xl bg-[#C65D32] text-white text-xs font-semibold hover:bg-[#B34E25] transition-colors cursor-pointer"
                >
                  Show All Recipes
                </button>
              )}
              {canMakeOnly && (
                <button
                  onClick={() => setCanMakeOnly(false)}
                  className="px-4 py-2 rounded-xl bg-[#252525] text-white text-xs font-semibold hover:bg-[#383838] transition-colors cursor-pointer"
                >
                  Show Partial Matches
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl bg-[#F7F2E8] text-[#252525] border border-[#D8CEBA] text-xs font-semibold hover:bg-[#EADFCB] transition-colors cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Recipe Detail Modal */}
      {currentModalResult && (
        <RecipeModal
          matchResult={currentModalResult}
          isFavorite={favorites.includes(currentModalResult.recipe.id)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 bg-[#252525] text-[#F7F2E8] border-t border-[#383838] py-8 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#F7F2E8] text-sm">PantryPal</span>
            <span className="text-[#8C8476]">—</span>
            <span className="text-[#EADFCB]">Everyday Indian Vegetarian & Egg-friendly meals</span>
          </div>
          <p className="text-[#8C8476]">
            Pantry-based culinary matching engine • Ready for GitHub Pages
          </p>
        </div>
      </footer>
    </div>
  );
}
