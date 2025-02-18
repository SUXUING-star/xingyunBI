import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  ScatterChart, Scatter, Line, ComposedChart,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import DecisionTreeVisualization from './DecisionTreeVisualization';

export function DecisionTreeResult({ result }) {
  if (!result) return null;

  const feature_importanceData = Object.entries(result.feature_importance || {})
    .map(([feature, importance]) => ({
      feature,
      importance: Number((importance * 100).toFixed(2))
    }))
    .sort((a, b) => b.importance - a.importance);

  const predictionData = React.useMemo(() => {
    if (!result.prediction_samples || result.prediction_samples.length === 0) {
      return { samples: [], fittingLine: [] };
    }

    const samples = result.prediction_samples.map(sample => ({
      actual: Number(sample.actual),
      predicted: Number(sample.predicted)
    })).sort((a, b) => a.actual - b.actual);

    const minValue = Math.min(...samples.map(s => Math.min(s.actual, s.predicted)));
    const maxValue = Math.max(...samples.map(s => Math.max(s.actual, s.predicted)));
    
    const fittingLine = [
      { actual: minValue, predicted: minValue },
      { actual: maxValue, predicted: maxValue }
    ];

    return { samples, fittingLine };
  }, [result.prediction_samples]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>决策树分析结果</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {/* 特征重要性图表 - 调整容器和图表大小 */}
            <div className="min-h-[400px] relative p-4">
              <h3 className="text-lg font-medium mb-4">特征重要性</h3>
              <div className="absolute inset-0 pt-16 px-4 pb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={feature_importanceData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" unit="%" />
                    <YAxis dataKey="feature" type="category" width={120} />
                    <Tooltip
                      formatter={(value) => [`${value}%`, '重要性']}
                      labelFormatter={(label) => `特征：${label}`}
                    />
                    <Bar dataKey="importance" fill="#8884d8" name="重要性" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 预测结果散点图 - 调整容器和图表大小 */}
            <div className="min-h-[400px] relative p-4">
              <h3 className="text-lg font-medium mb-4">预测结果</h3>
              <div className="absolute inset-0 pt-16 px-4 pb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="actual"
                      type="number"
                      name="实际值"
                      label={{ value: '实际值', position: 'bottom', offset: 20 }}
                    />
                    <YAxis
                      dataKey="predicted"
                      type="number"
                      name="预测值"
                      label={{ value: '预测值', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                      formatter={(value) => value.toFixed(2)}
                      labelFormatter={(label) => `实际值: ${Number(label).toFixed(2)}`}
                    />
                    <Legend 
                      verticalAlign="bottom"
                      height={36}
                      wrapperStyle={{
                        bottom: -30,
                        left: 25,
                        lineHeight: '40px'
                      }}
                    />
                    <Scatter
                      name="预测点"
                      data={predictionData.samples}
                      fill="#8884d8"
                    />
                    <Line
                      name="理想预测线"
                      data={predictionData.fittingLine}
                      type="linear"
                      dataKey="predicted"
                      stroke="#ff7300"
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 决策树结构可视化 */}
      {result.tree_structure && (
        <DecisionTreeVisualization treeData={result.tree_structure} />
      )}
    </div>
  );
}