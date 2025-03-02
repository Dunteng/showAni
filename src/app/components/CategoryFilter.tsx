import React from 'react';

type CategoryFilterProps = {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
};

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <nav className="mb-10">
      <ul className="flex flex-wrap gap-2 justify-center">
        <li className="mb-2">
          <button 
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            onClick={() => onSelectCategory(null)}
          >
            全部
          </button>
        </li>
        {categories.map((category) => (
          <li key={category} className="mb-2">
            <button
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
} 