import React from 'react';
import { motion } from 'framer-motion';

export const CurtainReveal = ({ children, index = 0, className = '' }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative z-10"
        initial={{ clipPath: 'inset(0 0 0 100%)' }}
        animate={{ clipPath: 'inset(0 0 0 0)' }}
        transition={{
          duration: 0.7,
          delay: index * 0.1,
          ease: [0.76, 0, 0.24, 1]
        }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20"
        initial={{ x: '0%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 0.7,
          delay: index * 0.1,
          ease: [0.76, 0, 0.24, 1]
        }}
      />
    </motion.div>
  );
};

// 列表容器组件
export const AnimatedList = ({ children }) => {
  return (
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="show"
      exit="hidden"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};