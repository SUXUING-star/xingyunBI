// src/components/ChartConfiguration.jsx
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Cog } from 'lucide-react';

// 图表类型配置
const CHART_TYPES = [
  { value: 'line', label: '折线图' },
  { value: 'bar', label: '柱状图' },
  { value: 'area', label: '面积图' },
  { value: 'stacked-area', label: '堆叠面积图' },
  { value: 'pie', label: '饼图' },
  { value: 'scatter', label: '散点图' },
  { value: 'bubble', label: '气泡图' },
  { value: 'radar', label: '雷达图' },
  { value: 'radial-bar', label: '玫瑰图' },
  { value: 'treemap', label: '树形图' }
];

export function ChartConfiguration({
  chart,
  dataSources,
  selectedDataSource,
  onChartChange,
  onDataSourceChange,
  onShowPreProcessing
}) {
  // 更新图表配置的辅助函数
  const updateChart = (updates) => {
    onChartChange({
      ...chart,
      ...updates
    });
  };
	
  

  return (
    <div className="space-y-4">
      {/* 基础配置 */}
      <Card>
        <CardHeader>
          <CardTitle>基础配置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>数据源</Label>
            <div className="flex items-center space-x-2">
              <Select
                value={chart.dataSourceId}
                onValueChange={onDataSourceChange}
                className="flex-1"
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择数据源" />
                </SelectTrigger>
                <SelectContent>
                  {dataSources.map(source => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDataSource && (
                <button
                  className="p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => onShowPreProcessing(true)}
                  title="配置数据预处理"
                >
                  <Cog className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div>
            <Label>图表类型</Label>
            <Select
              value={chart.type}
              onValueChange={(value) => updateChart({ type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择图表类型" />
              </SelectTrigger>
              <SelectContent>
                {CHART_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 布局配置 */}
      <Card>
        <CardHeader>
          <CardTitle>布局配置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>X 位置</Label>
              <Input
                type="number"
                min="0"
                max="11"
                value={chart.layout?.x || 0}
                onChange={(e) => updateChart({
                  layout: {
                    ...chart.layout,
                    x: parseInt(e.target.value)
                  }
                })}
              />
            </div>
            <div>
              <Label>Y 位置</Label>
              <Input
                type="number"
                min="0"
                value={chart.layout?.y || 0}
                onChange={(e) => updateChart({
                  layout: {
                    ...chart.layout,
                    y: parseInt(e.target.value)
                  }
                })}
              />
            </div>
            <div>
              <Label>宽度</Label>
              <Input
                type="number"
                min="1"
                max="12"
                value={chart.layout?.width || 6}
                onChange={(e) => updateChart({
                  layout: {
                    ...chart.layout,
                    width: parseInt(e.target.value)
                  }
                })}
              />
            </div>
            <div>
              <Label>高度</Label>
              <Input
                type="number"
                min="1"
                value={chart.layout?.height || 4}
                onChange={(e) => updateChart({
                  layout: {
                    ...chart.layout,
                    height: parseInt(e.target.value)
                  }
                })}
              />
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium mb-2">布局预览</p>
            <div className="border rounded p-2 bg-gray-50">
              <div className="grid grid-cols-12 gap-1 h-32">
                <div
                  className="bg-blue-200 rounded"
                  style={{
                    gridColumn: `${(chart.layout?.x || 0) + 1} / span ${chart.layout?.width || 6}`,
                    gridRow: `${(chart.layout?.y || 0) + 1} / span ${chart.layout?.height || 4}`,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}