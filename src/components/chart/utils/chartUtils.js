// src/components/chartUtils.js
// 配色方案
export const CHART_COLORS = {
  primary: '#8884d8',
  secondary: '#82ca9d',
  palette: [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
    '#8884d8', '#82ca9d', '#ffc658', '#d0ed57',
    '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1'
  ]
};

// 图表通用配置
export const CHART_CONFIG = {
  height: '100%',
  grid: { strokeDasharray: '3 3' },
  commonProps: {
    margin: { top: 10, right: 30, left: 0, bottom: 0 }
  },
  axis: {
    stroke: '#666',
    fontSize: 12
  }
};

// 计算颜色值
export const calculateColorValue = (value, values, range = ['#e6f3ff', '#0088FE']) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return range[0];
  const percent = (value - min) / (max - min);
  return interpolateColor(range[0], range[1], percent);
};

// 计算大小值
export const calculateSizeValue = (value, values, range = [4, 20]) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return range[0];
  const percent = (value - min) / (max - min);
  return range[0] + (range[1] - range[0]) * percent;
};

// 颜色插值
export const interpolateColor = (color1, color2, factor) => {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};