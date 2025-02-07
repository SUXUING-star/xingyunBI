// src/components/ui/grid-layout.jsx
import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export function GridLayout({ 
  children, 
  layouts = { lg: [] },  // 添加默认值
  onLayoutChange,
  className = "",
  ...props 
}) {
  const defaultProps = {
    className: `${className}`,
    rowHeight: 150,
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    containerPadding: [10, 10],
    margin: [10, 10],
    layouts: layouts,  // 确保使用传入的 layouts
    ...props
  };

  return (
    <ResponsiveGridLayout
      {...defaultProps}
      onLayoutChange={(layout, layouts) => onLayoutChange?.(layouts)}
    >
      {children}
    </ResponsiveGridLayout>
  );
}