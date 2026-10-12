import React, { useState } from 'react';
import { Plus, X, Sparkles, Trash2, ShoppingBasket } from 'lucide-react';

interface PantryInputProps {
  ingredients: string[];
  onAddIngredient: (name: string) => void;
  onRemoveIngredient: (name: string) => void;
  onClearIngredients: () => void;
}

// Preserve existing suggestions list exactly as required
const COMMON_SUGGESTIONS = [
  'Eggs',
  'Tomatoes',
  'Garlic',
  'Onion',
  'Pasta',
  'Rice',
  'Cheese',
  'Olive Oil',
  'Spinach',
  'Potatoes',
  'Tofu',
  'Bread',
  'Milk',
  'Butter',
  'Chickpeas',
  'Mushrooms',
];

export const PantryInput: React.FC<PantryInputProps> = ({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onClearIngredients,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onAddIngredient(trimmed);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E5DAC3] p-5 md:p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#252525] flex items-center gap-2 font-serif">
            <ShoppingBasket className="w-5 h-5 text-[#C65D32]" />
            What is in your pantry & fridge?
          </h2>
          <p className="text-sm text-[#666158]">
            Type an ingredient and press <span className="font-semibold text-[#252525]">Enter</span> or click <span className="font-semibold text-[#252525]">Add</span>.
          </p>
        </div>
        {ingredients.length > 0 && (
          <button
            type="button"
            onClick={onClearIngredients}
            className="self-start md:self-auto flex items-center gap-1.5 text-xs text-[#666158] hover:text-[#C65D32] transition-colors py-1 px-2.5 rounded-lg hover:bg-[#F7F2E8] cursor-pointer"
            title="Remove all ingredients"
            aria-label={`Clear all ${ingredients.length} pantry ingredients`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all ({ingredients.length})
          </button>
        )}
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            maxLength={50}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Enter ingredient to add to pantry"
            placeholder="Type an ingredient (e.g., potatoes, paneer, eggs, onions, tomatoes)..."
            className="w-full px-4 py-3 rounded-xl border border-[#D8CEBA] bg-[#F7F2E8]/30 focus:bg-white focus:border-[#C65D32] focus:ring-2 focus:ring-[#C65D32]/20 outline-none text-[#252525] placeholder-[#8C8476] text-sm md:text-base transition-all"
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-[#C65D32] hover:bg-[#B34E25] disabled:bg-[#E5DAC3] disabled:text-[#8C8476] text-white font-medium text-sm md:text-base transition-colors shadow-sm disabled:shadow-none shrink-0 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Add ingredient"
        >
          <Plus className="w-5 h-5" />
          <span>Add</span>
        </button>
      </div>

      {/* Suggested Quick Add Chips (Unchanged list) */}
      <div className="mt-4 pt-3 border-t border-[#EFE7D5]">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#666158] uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C65D32]" />
          <span>Quick Add Staples:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_SUGGESTIONS.map((item) => {
            const isAlreadyAdded = ingredients.some(
              (ing) => ing.toLowerCase() === item.toLowerCase()
            );
            return (
              <button
                key={item}
                type="button"
                aria-pressed={isAlreadyAdded}
                aria-label={`${isAlreadyAdded ? 'Remove' : 'Add'} staple ${item}`}
                onClick={() => {
                  if (!isAlreadyAdded) {
                    onAddIngredient(item);
                  } else {
                    onRemoveIngredient(item);
                  }
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                  isAlreadyAdded
                    ? 'bg-[#F7F2E8] border-[#C65D32] text-[#C65D32] font-semibold'
                    : 'bg-[#F7F2E8]/40 hover:bg-[#F7F2E8] border-[#E5DAC3] text-[#252525]'
                }`}
              >
                <span>{item}</span>
                {isAlreadyAdded ? (
                  <span className="text-[#C65D32] font-bold">✓</span>
                ) : (
                  <span className="text-[#8C8476]">+</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active pantry chips list */}
      {ingredients.length > 0 ? (
        <div className="mt-5 pt-4 border-t border-[#EFE7D5]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C65D32]">
              Your Pantry Ingredients ({ingredients.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F2E8] border border-[#D8CEBA] text-[#252525] text-sm font-medium shadow-2xs animate-in fade-in duration-200"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => onRemoveIngredient(item)}
                  className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-[#C65D32] text-[#666158] hover:text-white transition-colors ml-0.5 cursor-pointer"
                  aria-label={`Remove ${item}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 p-3 bg-[#F7F2E8] border border-[#E5DAC3] rounded-xl text-xs text-[#666158] flex items-center gap-2">
          <span>💡 <strong>Tip:</strong> Add staple ingredients like potatoes, onions, tomatoes, or eggs to explore comforting Indian recipes you can cook right now!</span>
        </div>
      )}
    </div>
  );
};
