import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ isLoading, isFirstLoad }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');

  // 预加载文本动画
  useEffect(() => {
    if (isFirstLoad) {
      const texts = ['初始化应用...', '加载资源...', '准备就绪...'];
      let currentIndex = 0;

      const textInterval = setInterval(() => {
        setLoadingText(texts[currentIndex]);
        currentIndex = (currentIndex + 1) % texts.length;
      }, 800);

      return () => clearInterval(textInterval);
    }
  }, [isFirstLoad]);

  // 进度条动画
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 20);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  // 首次加载的全屏动画
  if (isFirstLoad) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-gradient-to-r from-blue-600/90 via-indigo-500/90 to-purple-600/90 
            backdrop-blur-sm z-50 flex items-center justify-center"
        >
          {/* 背景装饰 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/30 rounded-full"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/30 rounded-full"
            />
          </div>

          {/* 主要加载内容 */}
          <div className="relative flex flex-col items-center justify-center space-y-8 p-8">
            {/* Logo 动画 */}
            <div className="relative">
              <motion.div
                animate={{
                  rotate: 360,
                  borderRadius: ["25%", "50%", "25%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-20 h-20 border-4 border-blue-200"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 w-20 h-20 border-t-4 border-blue-600"
              />
            </div>

            {/* 进度条 */}
            <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-white rounded-full"
              />
            </div>

            {/* 加载文本 */}
            <div className="h-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={loadingText}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-white font-medium tracking-wider"
                >
                  {loadingText || "加载中..."}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 欢迎文本 */}
            <div className="absolute bottom-8 w-full max-w-xs text-center">
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [0.98, 1, 0.98],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="text-white/80 text-sm"
              >
                欢迎使用
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // 非首次加载时的简化版动画
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 
          bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8"
      >
        <div className="flex flex-col items-center space-y-4">
          {/* 简化版 Logo 动画 */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-12 h-12 border-4 border-blue-200 rounded-full border-t-blue-600"
          />
          
          {/* 简化版进度指示器 */}
          <div className="w-32 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: "100%",
                transition: { duration: 0.8, ease: "easeInOut" }
              }}
              className="h-full bg-blue-600 rounded-full"
            />
          </div>

          {/* 简化版文本 */}
          <motion.span 
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="text-sm text-gray-600 dark:text-gray-300"
          >
            加载中...
          </motion.span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;