import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function CorrelationResult({ correlationMatrix }) {
  if (!correlationMatrix) return null;

  const features = Object.keys(correlationMatrix);

  // 计算相关性强度对应的颜色
  const getCorrelationColor = (value) => {
    const absValue = Math.abs(value);
    return value > 0
      ? `rgba(0, 114, 178, ${0.2 + 0.8 * absValue})` // 蓝色表示正相关
      : `rgba(213, 94, 0, ${0.2 + 0.8 * absValue})`; // 红色表示负相关
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>相关性热力图</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 使用 overflow-x-auto 包裹表格，保证水平滚动 */}
        <div className="overflow-x-auto">
          {/* 使用 min-w-full 保证表格宽度不小于容器 */}
          <table className="min-w-full border-collapse table-auto">  
            <thead>
              <tr>
                <th className="p-2 border"></th>
                {features.map(feature => (
                  <th 
                    key={feature} 
                    className="p-2 border text-sm transform -rotate-45 origin-left whitespace-nowrap"
                  >
                    {feature}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map(feature1 => (
                <tr key={feature1}>
                   {/* 使用 whitespace-nowrap 保证表头不换行 */}
                  <td className="p-2 border font-medium whitespace-nowrap">
                    {feature1}
                  </td>
                  {features.map(feature2 => {
                    const value = correlationMatrix[feature1][feature2];
                    return (
                      <td
                        key={`${feature1}-${feature2}`}
                        className="p-2 border text-center w-16 h-16"
                        style={{
                          backgroundColor: getCorrelationColor(value),
                          color: Math.abs(value) > 0.5 ? 'white' : 'black'
                        }}
                      >
                        {value?.toFixed(2) ?? 'N/A'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}