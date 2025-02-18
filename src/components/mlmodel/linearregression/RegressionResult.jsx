// src/components/mlmodel/RegressionResult.jsx
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ComposedChart, Line
} from 'recharts';

export function RegressionResult({ predictionSamples }) {
  const chartData = useMemo(() => {
    if (!predictionSamples || predictionSamples.length === 0) {
      return { samples: [], fittingLine: [] };
    }

    const samples = predictionSamples.map(sample => ({
      actual: Number(sample.actual),
      predicted: Number(sample.predicted)
    })).sort((a, b) => a.actual - b.actual);

    const minActual = Math.min(...samples.map(s => s.actual));
    const maxActual = Math.max(...samples.map(s => s.actual));
    const fittingLine = [
      { actual: minActual, predicted: minActual },
      { actual: maxActual, predicted: maxActual }
    ];

    return { samples, fittingLine };
  }, [predictionSamples]);

  if (!chartData.samples.length) return null;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>预测结果与拟合线</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
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
                data={chartData.samples}
                fill="#8884d8"
              />
              <Line
                name="理想预测线"
                data={chartData.fittingLine}
                type="linear"
                dataKey="predicted"
                stroke="#ff7300"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}