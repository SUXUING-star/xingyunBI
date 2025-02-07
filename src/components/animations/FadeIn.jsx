// src/components/animations/FadeIn.jsx
import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

export const FadeIn = ({ 
  children, 
  delay = 0,
  duration = 800,
  direction = 'up', // up, down, left, right
  className = ''
}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    
    const directions = {
      up: [20, 0],
      down: [-20, 0],
      left: [20, 0],
      right: [-20, 0]
    };

    const translateY = direction === 'up' || direction === 'down' ? directions[direction] : [0, 0];
    const translateX = direction === 'left' || direction === 'right' ? directions[direction] : [0, 0];

    anime({
      targets: element,
      translateY: translateY,
      translateX: translateX,
      opacity: [0, 1],
      duration: duration,
      delay: delay,
      easing: 'easeOutExpo'
    });
  }, [delay, duration, direction]);

  return (
    <div ref={elementRef} className={`opacity-0 ${className}`}>
      {children}
    </div>
  );
};
