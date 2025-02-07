
// ChartRenderer
export const chartAnimationProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 }
};

// src/components/chart/ChartAnimationConfig.js
export const chartProps = {
  // 图表通用动画配置
  animate: true,
  animationBegin: 0,
  animationDuration: 1000,
  animationEasing: "ease-out",
  
  // 交互动画配置
  isAnimationActive: true,
  animationBehaviour: "smooth",

  // 特定图表类型的动画配置
  bar: {
    animationDuration: 1500,
    animationEasing: "ease-in-out"
  },
  line: {
    animationDuration: 2000,
    animationEasing: "ease-out"
  },
  pie: {
    animationDuration: 1200,
    animationEasing: "ease"
  },
  radar: {
    animationDuration: 1500,
    animationEasing: "linear"
  }
};
