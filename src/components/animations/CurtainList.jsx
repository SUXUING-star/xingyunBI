import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const CurtainListItem = ({ children, index = 0 }) => {
  const itemRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mouseY, setMouseY] = useState(0);

  const handleMouseMove = (e) => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const y = (e.clientY - rect.top) / rect.height;
    setMouseY(y);
  };

  return (
    <motion.div
      ref={itemRef}
      className="relative overflow-hidden rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      initial={false}
      animate={{
        backgroundColor: isHovered ? 'rgba(243, 244, 246, 0.8)' : 'rgba(255, 255, 255, 0)',
      }}
      transition={{ duration: 0.2 }}
    >
      {/* 装饰性帘子效果 */}
      <motion.div
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-blue-900/10"
        initial={false}
        animate={{
          opacity: isHovered ? 1 : 0,
          backgroundSize: '100% 200%',
          backgroundPosition: `50% ${mouseY * 100}%`
        }}
        transition={{
          opacity: { duration: 0.2 },
          backgroundPosition: { duration: 0.05 }
        }}
      />

      {/* 主要内容 */}
      <motion.div 
        className="relative z-10"
        animate={{
          y: isHovered ? 0 : 0,
          x: isHovered ? 4 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      >
        {children}
      </motion.div>

      {/* 帘子边缘光效 */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.1), transparent)',
          maskImage: 'linear-gradient(to right, transparent, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black, transparent)',
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: mouseY * 100,
        }}
        transition={{
          opacity: { duration: 0.2 },
          y: { duration: 0.1 }
        }}
      />
    </motion.div>
  );
};

// 列表容器组件
export const CurtainList = ({ children, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {React.Children.map(children, (child, index) => (
        <CurtainListItem key={index} index={index}>
          {child}
        </CurtainListItem>
      ))}
    </div>
  );
};

export default CurtainList;