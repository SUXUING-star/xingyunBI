import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useNavigate } from 'react-router-dom';
import { DashboardChartPreview } from '@/components/dashboard/DashboardChartPreview';
import { BarChart2, MoreHorizontal, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

const ResponsiveGridLayout = WidthProvider(Responsive);

export function GridLayout({
  layout = [],
  dashboard_id,
  onLayoutChange,
  isEditable = true,
  onChartRemove
}) {
  const navigate = useNavigate();

  // 检查并清理无效的布局项
  const validLayout = layout.filter(item => {
    // 确保使用正确的属性名，同时兼容 chart_id 和 chartId
    const id = item.chart_id || item.chartId;
    return id != null; // 确保 ID 存在
  });

  if (!validLayout?.length) {
    return (
      <div className="min-h-[600px] bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500">
        <BarChart2 className="h-12 w-12 mb-4" />
        <p>暂无图表</p>
        <p className="text-sm mt-2">请先添加一些图表到仪表盘</p>
      </div>
    );
  }

  // 转换为 grid-layout 格式，添加额外的类型检查
  const gridLayout = validLayout.map(item => {
    const id = item.chart_id || item.chartId;
    return {
      i: id.toString(),
      x: Number(item.x) || 0,
      y: Number(item.y) || 0,
      w: Math.max(Number(item.width) || 6, 2),
      h: Math.max(Number(item.height) || 4, 2),
      minW: 2,
      minH: 2
    };
  });

  const handleLayoutChange = (newLayout) => {
    if (onLayoutChange) {
      const updatedLayout = newLayout.map(item => ({
        chart_id: item.i,
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h
      }));
      onLayoutChange(updatedLayout);
    }
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: gridLayout }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={80} // 减小每行的高度
      containerPadding={[10, 10]}
      margin={[10, 10]}
      isDraggable={isEditable}
      isResizable={isEditable}
      onLayoutChange={handleLayoutChange}
    >
      {validLayout.map(item => {
        const id = item.chart_id || item.chartId;
        return (
          <div key={id} className="bg-white rounded-lg shadow-sm p-4 relative group">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{
                scale: 1.01,
                transition: { duration: 0.2 }
              }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className="relative h-full w-full"
            >
              {isEditable && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-6 w-6" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/dashboards/${dashboard_id}/charts/${id}`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        编辑图表
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onChartRemove?.(id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              )}
                <div className="bg-white rounded-lg h-full flex flex-col">
                  <div className="flex-1 min-h-0">
                    <DashboardChartPreview chartId={id} />
                  </div>
                </div>
            </motion.div>
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
}