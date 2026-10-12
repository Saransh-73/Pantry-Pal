export interface RecipeIngredient {
  name: string;
  pantryKey: string;
  amount: string;
}

export type RecipeCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Quick Meals' | 'Soups & Salads';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: RecipeCategory;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  totalTime: number; // in minutes
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Intermediate';
  image: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  tags: string[];
  chefTip: string;
}

export interface RecipeMatchResult {
  recipe: Recipe;
  matchedIngredients: string[];
  missingIngredients: string[];
  matchedCount: number;
  totalIngredients: number;
  matchPercentage: number;
  canMake: boolean;
}

export type SortOption = 'match' | 'ready-first' | 'quickest' | 'name';
