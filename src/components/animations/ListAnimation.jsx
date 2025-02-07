// src/components/animations/ListAnimation.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const ListContainer = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const ListItem = ({ children, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.4,
      delay: index * 0.1,
      ease: "easeOut"
    }}
  >
    {children}
  </motion.div>
);

// 表格行动画
export const TableRowAnimation = ({ children, index }) => (
  <motion.tr
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{
      duration: 0.3,
      delay: index * 0.05,
      ease: "easeOut"
    }}
    className="group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
  >
    {children}
  </motion.tr>
);

// 卡片动画
export const CardAnimation = ({ children, index, className }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      duration: 0.4,
      delay: index * 0.1,
      ease: "easeOut"
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// 页面头部动画
export const PageHeader = ({ title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white"
  >
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        {description && (
          <p className="text-blue-100">{description}</p>
        )}
      </motion.div>
      {action && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {action}
        </motion.div>
      )}
    </div>
  </motion.div>
);