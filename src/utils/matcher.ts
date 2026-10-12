import { Recipe, RecipeMatchResult, SortOption } from '../types';

/**
 * Normalizes an ingredient name for robust pantry comparison.
 */
export function normalizeIngredient(raw: string): string {
  if (!raw) return '';
  let str = raw.trim().toLowerCase();

  // Strip trailing punctuation
  str = str.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');

  // Common singularizations & word harmonizations
  if (str.endsWith('ies')) {
    str = str.slice(0, -3) + 'y';
  } else if (str.endsWith('es') && !str.endsWith('cheese')) {
    str = str.slice(0, -2);
  } else if (str.endsWith('s') && !str.endsWith('ss') && !str.endsWith('couscous') && !str.endsWith('hummus')) {
    str = str.slice(0, -1);
  }

  return str;
}

// Bidirectional synonym / alias mapping
const SYNONYMS: Record<string, string[]> = {
  cheese: ['paneer', 'cottage cheese', 'cheddar', 'mozzarella'],
  paneer: ['cheese', 'cottage cheese'],
  potato: ['aloo', 'potatoes', 'batata'],
  aloo: ['potato', 'potatoes'],
  rice: ['basmati', 'basmati rice', 'chawal', 'poha', 'flattened rice'],
  poha: ['rice', 'flattened rice'],
  egg: ['eggs', 'anda'],
  chickpea: ['chickpeas', 'chole', 'chana', 'kabuli chana'],
  chole: ['chickpea', 'chickpeas', 'chana'],
  spinach: ['palak', 'saag'],
  palak: ['spinach', 'saag'],
  tomato: ['tomatoes', 'tamatar'],
  onion: ['onions', 'pyaz', 'shallot'],
  garlic: ['lahsun', 'lasun'],
  butter: ['ghee', 'makhan'],
  ghee: ['butter', 'oil'],
  milk: ['cream', 'malai', 'curd', 'dahi', 'yogurt'],
  curd: ['yogurt', 'dahi', 'milk'],
  dahi: ['curd', 'yogurt', 'milk'],
  bread: ['pav', 'toast', 'roti', 'chapati', 'atta', 'flour', 'wheat flour'],
  atta: ['flour', 'wheat flour', 'bread'],
  flour: ['atta', 'wheat flour', 'maida', 'besan', 'gram flour', 'rava', 'suji'],
  besan: ['gram flour', 'flour', 'chickpea flour'],
  peas: ['matar', 'green peas'],
  matar: ['peas', 'green peas'],
  cauliflower: ['gobi', 'gobhi'],
  gobi: ['cauliflower', 'cauliflowers'],
  oil: ['olive oil', 'cooking oil', 'mustard oil', 'refined oil', 'ghee', 'butter'],
  'olive oil': ['oil', 'cooking oil'],
  tofu: ['soya', 'soy paneer'],
  mushroom: ['mushrooms', 'khumb'],
  pasta: ['macaroni', 'noodles', 'penne'],
  lentils: ['dal', 'toor dal', 'moong dal', 'urad dal', 'masoor dal', 'chana dal'],
  dal: ['lentils', 'toor dal', 'moong dal'],
  rajma: ['kidney beans', 'red kidney beans'],
  'kidney beans': ['rajma'],
  bhindi: ['okra', 'ladyfinger'],
  okra: ['bhindi', 'ladyfinger'],
  baingan: ['eggplant', 'brinjal', 'aubergine'],
  eggplant: ['baingan', 'brinjal'],
};

/**
 * Checks whether a recipe ingredient is satisfied by any item in user's pantry.
 */
export function isIngredientInPantry(
  ingredientPantryKey: string,
  ingredientName: string,
  userPantryTokens: string[]
): boolean {
  const normKey = normalizeIngredient(ingredientPantryKey);
  const normName = normalizeIngredient(ingredientName);

  return userPantryTokens.some((token) => {
    const normToken = normalizeIngredient(token);
    if (!normToken) return false;

    // Direct match
    if (normToken === normKey || normToken === normName) return true;

    // Key contains token or token contains key
    if (normKey.includes(normToken) || normToken.includes(normKey)) return true;

    // Word tokens check
    const keyWords = normKey.split(/\s+/);
    const tokenWords = normToken.split(/\s+/);
    if (tokenWords.some((tw) => keyWords.includes(tw))) return true;

    // Name contains token
    if (normName.includes(normToken)) return true;

    // Check synonyms for key
    const keySyns = SYNONYMS[normKey] || [];
    if (keySyns.some((syn) => normalizeIngredient(syn) === normToken || normToken.includes(normalizeIngredient(syn)))) {
      return true;
    }

    // Check synonyms for token
    const tokenSyns = SYNONYMS[normToken] || [];
    if (tokenSyns.some((syn) => normalizeIngredient(syn) === normKey || normKey.includes(normalizeIngredient(syn)))) {
      return true;
    }

    return false;
  });
}

/**
 * Evaluates a single recipe against the user's pantry.
 */
export function matchRecipeWithPantry(recipe: Recipe, pantryList: string[]): RecipeMatchResult {
  const userTokens = pantryList.map((item) => item.trim().toLowerCase()).filter(Boolean);

  const matchedIngredients: string[] = [];
  const missingIngredients: string[] = [];

  recipe.ingredients.forEach((ing) => {
    if (isIngredientInPantry(ing.pantryKey, ing.name, userTokens)) {
      matchedIngredients.push(ing.name);
    } else {
      missingIngredients.push(ing.name);
    }
  });

  const totalIngredients = recipe.ingredients.length;
  const matchedCount = matchedIngredients.length;
  const matchPercentage = totalIngredients > 0 ? Math.round((matchedCount / totalIngredients) * 100) : 0;
  const canMake = missingIngredients.length === 0;

  return {
    recipe,
    matchedIngredients,
    missingIngredients,
    matchedCount,
    totalIngredients,
    matchPercentage,
    canMake,
  };
}

/**
 * Evaluates, filters, and ranks recipe results.
 */
export function rankAndFilterRecipes(
  recipes: Recipe[],
  pantryList: string[],
  options: {
    category?: string;
    quickMealsOnly?: boolean;
    canMakeOnly?: boolean;
    favoritesOnly?: boolean;
    searchQuery?: string;
    favoriteIds?: string[];
    sortBy?: SortOption;
  } = {}
): RecipeMatchResult[] {
  const results = recipes.map((r) => matchRecipeWithPantry(r, pantryList));

  const filtered = results.filter((res) => {
    const { recipe } = res;

    // Category filter
    if (options.category && options.category !== 'All' && recipe.category !== options.category) {
      return false;
    }

    // Quick meal filter (30 minutes or less)
    if (options.quickMealsOnly && recipe.totalTime > 30) {
      return false;
    }

    // Can make only filter (100% matched)
    if (options.canMakeOnly && !res.canMake) {
      return false;
    }

    // Favorites only filter
    if (options.favoritesOnly && options.favoriteIds && !options.favoriteIds.includes(recipe.id)) {
      return false;
    }

    // Search query filter
    if (options.searchQuery && options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase().trim();
      const matchTitle = recipe.title.toLowerCase().includes(q);
      const matchDesc = recipe.description.toLowerCase().includes(q);
      const matchTags = recipe.tags.some((t) => t.toLowerCase().includes(q));
      const matchIng = recipe.ingredients.some(
        (i) => i.name.toLowerCase().includes(q) || i.pantryKey.toLowerCase().includes(q)
      );
      if (!matchTitle && !matchDesc && !matchTags && !matchIng) {
        return false;
      }
    }

    return true;
  });

  const sortBy = options.sortBy || 'match';

  filtered.sort((a, b) => {
    if (sortBy === 'match') {
      // 1. Ready-to-cook (0 missing) at the very top
      if (a.canMake && !b.canMake) return -1;
      if (!a.canMake && b.canMake) return 1;

      // 2. Highest match percentage
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }

      // 3. Fewest missing ingredients
      if (a.missingIngredients.length !== b.missingIngredients.length) {
        return a.missingIngredients.length - b.missingIngredients.length;
      }

      // 4. Quickest cooking time
      return a.recipe.totalTime - b.recipe.totalTime;
    }

    if (sortBy === 'ready-first') {
      if (a.canMake && !b.canMake) return -1;
      if (!a.canMake && b.canMake) return 1;
      return b.matchPercentage - a.matchPercentage;
    }

    if (sortBy === 'quickest') {
      return a.recipe.totalTime - b.recipe.totalTime;
    }

    if (sortBy === 'name') {
      return a.recipe.title.localeCompare(b.recipe.title);
    }

    return 0;
  });

  return filtered;
}
