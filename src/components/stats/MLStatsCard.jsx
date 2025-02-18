
import React from 'react';
import { Brain, Award, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';

export const MLStatsCard = ({ stats }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const modelTypeData = Object.entries(stats?.model_types || {}).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          机器学习模型统计
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 模型概览 */}
          <div className="space-y-4">
            <h3 className="font-semibold">模型概览</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">已训练模型</p>
                  <p className="text-xl font-bold">{stats?.trained_models || 0}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">待训练模型</p>
                  <p className="text-xl font-bold">{stats?.pending_models || 0}</p>
                </div>
              </div>
            </div>
            {/* 平均指标 */}
            {stats?.average_metrics && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">平均模型性能</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">平均 R² 分数</p>
                    <p className="text-xl font-bold">
                      {stats.average_metrics.r2?.toFixed(3) || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">平均 MSE</p>
                    <p className="text-xl font-bold">
                      {stats.average_metrics.mse?.toFixed(3) || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 模型类型分布 */}
          <div>
            <h3 className="font-semibold mb-4">模型类型分布</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modelTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {modelTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};