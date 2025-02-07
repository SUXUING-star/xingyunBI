// src/components/animations/FormField.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const FormField = ({ children, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: delay }}
    >
      {children}
    </motion.div>
  );
};
