import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ChartRenderer } from '../chart/ChartRenderer';
import _ from 'lodash';

export function DashboardChartPreview({ chartId }) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/charts/${chartId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch chart');

        const result = await response.json();
        const chart = result.data.chart;
        const dataSource = result.data.dataSource;

        if (!chart || !dataSource?.content) {
          throw new Error('Invalid chart data structure');
        }

        // 处理原始数据
        const rawData = dataSource.content.map(row => {
          const obj = {};
          dataSource.headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        });

        // 应用预处理配置
        let processedData = rawData;
        if (dataSource.preprocessing?.length > 0) {
          processedData = applyPreprocessing(rawData, dataSource.preprocessing);
        }

        // 处理图表数据
        const finalData = processChartData(processedData, chart.config);

        setChartData({
          ...chart,
          data: finalData
        });
      } catch (error) {
        console.error('Error fetching chart:', error);
        toast({
          variant: "destructive",
          title: "加载失败",
          description: error.message || "获取图表数据失败"
        });
      } finally {
        setLoading(false);
      }
    };

    if (chartId) {
      fetchChartData();
    }
  }, [chartId]);

  const applyPreprocessing = (data, preprocessing) => {
    return data.map(row => {
      const processed = { ...row };
      preprocessing.forEach(config => {
        if (!processed[config.field]) return;

        switch (config.type) {
          case 'number':
            const value = processed[config.field].replace(/[^\d.-]/g, '');
            processed[config.field] = parseFloat(value) || 0;
            break;
          case 'date':
            try {
              const date = new Date(processed[config.field]);
              processed[config.field] = date.toISOString().split('T')[0];
            } catch (e) {
              console.error('Date parsing error:', e);
            }
            break;
        }
      });
      return processed;
    });
  };

  const processChartData = (data, config) => {
    if (!config?.dimensions?.[0]?.field || !config?.metrics?.[0]?.field) {
      return [];
    }

    const dimension = config.dimensions[0].field;
    const metrics = config.metrics.map(m => m.field);
    
    // 获取所有需要保留的字段
    const fieldsToKeep = new Set([
      dimension,
      ...metrics,
      ...(config.visualMap?.labelFields || [])
    ]);

    // 根据维度分组并保留所有需要的字段
    const groupedData = data.reduce((acc, row) => {
      const key = row[dimension];
      if (!acc[key]) {
        acc[key] = {
          [dimension]: key
        };
        
        // 初始化所有需要保留的字段
        fieldsToKeep.forEach(field => {
          if (field !== dimension) {
            acc[key][field] = 0;
          }
        });
      }

      // 更新度量值
      metrics.forEach(metric => {
        acc[key][metric] = (parseFloat(acc[key][metric]) || 0) + (parseFloat(row[metric]) || 0);
      });

      // 更新标签字段值（使用最新值）
      config.visualMap?.labelFields?.forEach(field => {
        if (!metrics.includes(field)) {
          acc[key][field] = row[field];
        }
      });

      // 更新视觉映射字段
      if (config.visualMap?.colorField && !metrics.includes(config.visualMap.colorField)) {
        acc[key][config.visualMap.colorField] = row[config.visualMap.colorField];
      }
      if (config.visualMap?.sizeField && !metrics.includes(config.visualMap.sizeField)) {
        acc[key][config.visualMap.sizeField] = row[config.visualMap.sizeField];
      }

      return acc;
    }, {});

    return Object.values(groupedData);
  };

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        暂无数据
      </div>
    );
  }

  return (
    <ChartRenderer
      type={chartData.type}
      data={chartData.data}
      config={chartData.config}
      title={chartData.name}
      loading={loading}
    />
  );
}