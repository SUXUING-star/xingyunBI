// src/components/animations/TypeWriter.jsx
import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

export const TypeWriter = ({ 
  text, 
  className = '', 
  delay = 0, 
  duration = 2000,
  hideCursor = false // 新增参数控制是否在打字完成后隐藏光标
}) => {
  const elementRef = useRef(null);
  const cursorRef = useRef(null);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    const cursor = cursorRef.current;
    
    element.innerHTML = text.split('').map(char => 
      `<span style="opacity: 0">${char}</span>`
    ).join('');

    const timeline = anime.timeline({
      easing: 'easeOutExpo',
      delay: delay,
      complete: () => setIsTypingComplete(true)
    });

    // 文字动画
    timeline.add({
      targets: element.querySelectorAll('span'),
      opacity: [0, 1],
      duration: duration,
      delay: anime.stagger(50)
    });

    // 光标动画 - 永久闪烁
    if (cursor) {
      anime({
        targets: cursor,
        opacity: [1, 0],
        duration: 800,
        easing: 'steps(2)',
        loop: true,
        autoplay: true
      });
    }

    // 如果需要隐藏光标，在打字完成后添加渐隐效果
    if (hideCursor && cursor) {
      timeline.add({
        targets: cursor,
        opacity: 0,
        duration: 1000,
        delay: 1000,
        easing: 'easeOutExpo'
      });
    }
  }, [text, delay, duration, hideCursor]);

  return (
    <div className="relative inline-block">
      <span ref={elementRef} className={className}></span>
      <span 
        ref={cursorRef}
        className={`absolute -right-4 top-0 text-current`}
        style={{ opacity: 0 }}
      >
        _
      </span>
    </div>
  );
};