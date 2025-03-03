'use client';

// import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// 动画项类型定义
export type Animation = {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  pagFile: string; // PAG 文件链接
  avatar: string; // 头像图片链接
};

// 动画卡片组件
export default function AnimationCard({ animation }: { animation: Animation }) {
  // 图片加载状态
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover-lift">
      <div className="relative h-48">
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          {/* 封面图片展示区域 */}
          <div className="w-full h-full flex items-center justify-center">
            {/* 封面图片 */}
            <div className="relative w-full h-full">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={animation.avatar}
                alt={animation.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <span className="category-tag bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-2">
          {animation.category}
        </span>
        <h3 className="text-lg font-bold mb-1 mt-2">{animation.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {animation.description}
        </p>
        <Link 
          href={`/animation/${animation.id}`}
          className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
        >
          查看详情
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
} 