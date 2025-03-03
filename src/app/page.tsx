'use client';

import { useState } from 'react';
// import Image from 'next/image';
import AnimationCard from './components/AnimationCard';
import CategoryFilter from './components/CategoryFilter';
import { animations, categories } from './data/animations';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 根据选择的分类过滤动画
  const filteredAnimations = selectedCategory
    ? animations.filter(animation => animation.category === selectedCategory)
    : animations;

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <header className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-4xl font-bold text-center mb-3">矢量动画List</h1>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300 max-w-3xl">
            探索高质量的矢量动画，提升您的用户界面和交互体验
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* 分类导航 */}
        <CategoryFilter 
          categories={categories} 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* 结果状态 */}
        <div className="mb-6 text-center">
          {filteredAnimations.length > 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              共展示 <span className="font-bold text-indigo-600 dark:text-indigo-400">{filteredAnimations.length}</span> 个动画
            </p>
          ) : (
            <div className="py-10 text-center">
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">该分类暂无动画</p>
              <p className="text-gray-500 dark:text-gray-500">
                请选择其他分类查看
              </p>
            </div>
          )}
        </div>

        {/* 动画卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAnimations.map((animation) => (
            <AnimationCard key={animation.id} animation={animation} />
          ))}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-20 py-6 text-center text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        <p>© {new Date().getFullYear()} 矢量动画库 | 展示优质矢量动画</p>
      </footer>
    </div>
  );
}
