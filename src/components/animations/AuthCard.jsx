// src/components/animations/AuthCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const AuthCard = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg
        border border-gray-100 backdrop-blur-sm bg-white/90"
    >
      {children}
    </motion.div>
  );
};