// src/components/animations/ScaleIn.jsx
import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

export const ScaleIn = ({ 
  children, 
  delay = 0,
  duration = 300,
  className = '' 
}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    
    anime({
      targets: element,
      scale: [0.9, 1],
      opacity: [0, 1],
      duration: duration,
      delay: delay,
      easing: 'easeOutExpo'
    });
  }, [delay, duration]);

  return (
    <div ref={elementRef} className={`opacity-0 ${className}`}>
      {children}
    </div>
  );
};