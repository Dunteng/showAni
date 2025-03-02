'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Animation } from '../../components/AnimationCard';
import { animations } from '../../data/animations';
import type { PagRefProps } from '../../components/Pag';

// 动态导入 Pag 组件以避免 SSR 问题
const Pag = dynamic(() => import('../../components/Pag'), { ssr: false });

// 扩展 PagRefProps 类型，包含内部状态属性
interface ExtendedPagRef extends PagRefProps {
  _isPaused?: boolean;
}

export default function AnimationDetail() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

  const [animation, setAnimation] = useState<Animation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [animationDuration, setAnimationDuration] = useState<number | null>(null);
  const pagRef = useRef<ExtendedPagRef>(null);

  // 获取动画数据
  useEffect(() => {
    setLoading(true);

    try {
      // 查找匹配ID的动画
      const foundAnimation = animations.find(a => a.id.toString() === id);

      if (foundAnimation) {
        setAnimation(foundAnimation);
        setError(false);
      } else {
        setError(true);
      }
    } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 下载 PAG 文件
  const handleDownload = () => {
    if (animation) {
      // 创建一个临时链接并触发下载
      const link = document.createElement('a');
      link.href = animation.pagFile;
      link.download = `${animation.title}.pag`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // 播放/暂停控制
  const handlePlayPause = () => {
    if (!pagRef.current) return;

    // 检查当前是否是暂停状态
    if (pagRef.current._isPaused) {
      pagRef.current.play();
    } else {
      pagRef.current.pause();
    }
  };

  // 重置动画
  const handleReset = () => {
    if (!pagRef.current) return;
    pagRef.current.setProgress(0);
    pagRef.current.play();
  };

  // 加载中状态
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-gray-600 dark:text-gray-300">加载中...</div>
      </div>
    );
  }

  // 错误状态
  if (error || !animation) {
    return (
      <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto mt-20 text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">未找到动画</h1>
          <p className="text-lg mb-8 text-gray-600 dark:text-gray-400">
            抱歉，您查找的动画不存在或已被移除。
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  // 找到相同类别的其他动画
  const relatedAnimations = animations
    .filter(a => a.category === animation.category && a.id !== animation.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      {/* 返回按钮 */}
      <div className="max-w-6xl mx-auto mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首页
        </Link>
      </div>

      {/* 动画详情 */}
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          {/* 动画预览区域 */}
          <div className="md:flex-shrink-0 md:w-1/2 relative">
            <div className="h-80 md:h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Pag
                ref={pagRef}
                src={animation.pagFile}
                animationName={animation.title}
                repeatCount={0} // 循环播放
                autoPlay={true}
                className="w-full h-full"
                scaleMode={2} // LetterBox 模式
                useScale={true}
                durationCb={(duration) => setAnimationDuration(duration)}
              />
            </div>

            {/* 动画控制按钮 */}
          </div>

          {/* 动画信息 */}
          <div className="p-8 md:w-1/2">
            <div className="flex items-center mb-4">
              <span className="category-tag bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                {animation.category}
              </span>
              <span className="ml-2 text-gray-500 dark:text-gray-400">ID: {animation.id}</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {animation.title}
            </h1>

            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              {animation.description}
            </p>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">动画特点</h2>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  流畅的过渡效果
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  易于集成到您的项目中
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  可自定义颜色和速度
                </li>
              </ul>
            </div>

            {/* PAG 文件链接 */}
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">动画文件</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                PAG 文件格式，适用于多平台应用
              </p>
              <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md overflow-hidden mb-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{animation.pagFile}</p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mr-4 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                下载动画
              </button>
              <button className="px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                查看代码
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 相关动画 */}
      {relatedAnimations.length > 0 && (
        <div className="max-w-6xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            相关 {animation.category} 动画
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedAnimations.map(relatedAnimation => (
              <div key={relatedAnimation.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover-lift">
                <div className="relative h-40">
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1">{relatedAnimation.title}</h3>
                  <Link
                    href={`/animation/${relatedAnimation.id}`}
                    className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                  >
                    查看详情
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 