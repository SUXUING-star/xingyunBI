import React, { useState, useRef, useEffect } from 'react';
import { ChartRenderer } from '../render/ChartRenderer';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BarChart2 } from 'lucide-react';

export function MiniChartPreview({ dashboard, trigger }) {
  const { token } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const previewRef = useRef(null);
  const triggerRef = useRef(null);


  const fetchPreviewData = async () => {
    if (!dashboard?.layout?.length) return;

    setLoading(true);
    try {
      // 1. 首先获取第一个图表的完整信息
      const firstLayout = dashboard.layout[0];
      const chartResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/charts/${firstLayout.chart_id}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!chartResponse.ok) {
        throw new Error('Failed to fetch chart');
      }

      const chartResult = await chartResponse.json();
      const chart = chartResult.data.chart;

      if (!chart) {
        throw new Error('Invalid chart data');
      }

      if (chartResult.data.dataSource?.content) {
        const formattedData = chartResult.data.dataSource.content.map(row => {
          const rowData = {};
          chartResult.data.dataSource.headers.forEach((header, index) => {
            rowData[header] = row[index];
          });
          return rowData;
        });

        setChartData({
          type: chart.type,
          config: chart.config,
          data: formattedData
        });
      }
    } catch (error) {
      console.error('Failed to fetch preview data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (previewRef.current && !previewRef.current.contains(event.target) && triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div 
      className="relative"
      onMouseEnter={() => {
        setIsVisible(true);
        if (!chartData) {
          fetchPreviewData();
        }
      }}
      onMouseLeave={() => setIsVisible(false)}
      ref={triggerRef}
    >
      {trigger}

      {isVisible && (
          <Card
              ref={previewRef}
            className={cn(
              "absolute z-50 w-[480px] h-[300px]",
              "bg-white/95 backdrop-blur-sm",
              "border border-gray-200/50 shadow-xl",
              "transform transition-all duration-300",
              "opacity-100 scale-100",
              "left-0",
            )}
            style={{
                top:  triggerRef.current ? triggerRef.current.offsetHeight + 8 : '0px',
                
            }}
          >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : !chartData ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <BarChart2 className="h-8 w-8 mb-2" />
              <p>暂无图表数据</p>
            </div>
          ) : (
            <div className="p-4 h-full overflow-hidden">
              <ChartRenderer
                type={chartData.type}
                data={chartData.data}
                config={chartData.config}
                height="100%"  // 设置高度为 100%，确保图表高度受限于父容器
                className="w-full h-full" // 设置宽度和高度为 100%
              />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}