import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ZAxis } from 'recharts';

export function KMeansResult({ result }) {
  if (!result) return null;

  // 转换数据格式用于散点图显示，并添加大小信息
  const transformDataForScatter = () => {
    // 获取每个簇的大小
    const clusterSizes = result.cluster_sizes;
    const maxSize = Math.max(...Object.values(clusterSizes));
    
    // 样本点数据
    const samplePoints = result.sample_clusters.map((sample, index) => ({
      x: sample.features[0],
      y: sample.features[1],
      z: clusterSizes[sample.cluster] / maxSize * 1000, // 根据簇大小设置点大小
      cluster: `簇 ${sample.cluster}`,
      type: 'sample'
    }));

    // 聚类中心点数据
    const centerPoints = result.cluster_centers.map((center, index) => ({
      x: center[0],
      y: center[1],
      z: 2000, // 中心点设置更大
      cluster: `簇 ${index} 中心`,
      type: 'center'
    }));

    return [...samplePoints, ...centerPoints];
  };

  // 根据点的类型返回不同的样式
  const getPointStyle = (type, cluster) => {
    // 提取簇号用于颜色计算
    const clusterNum = parseInt(cluster.split(' ')[1]);
    const baseColor = `hsl(${clusterNum * 120}, 70%, ${type === 'center' ? '30%' : '50%'})`;
    
    return {
      fill: baseColor,
      stroke: type === 'center' ? 'white' : baseColor,
      strokeWidth: type === 'center' ? 2 : 0,
    };
  };

  const data = transformDataForScatter();

  return (
    <div className="space-y-6">
      {/* 聚类散点图 */}
      <Card>
        <CardHeader>
          <CardTitle>聚类结果散点图</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="X" 
                  domain={[0, 8]} 
                  tickCount={9}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Y" 
                  domain={[0, 8]} 
                  tickCount={9}
                />
                <ZAxis 
                  type="number" 
                  dataKey="z" 
                  range={[100, 1000]} 
                  name="Size" 
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name) => {
                    if (name === 'X' || name === 'Y') {
                      return value.toFixed(2);
                    }
                    return value;
                  }}
                />
                <Legend />
                {/* 分别为每个簇和其中心点创建散点图 */}
                {Object.keys(result.cluster_sizes).map((cluster) => [
                  // 样本点
                  <Scatter
                    key={`cluster-${cluster}`}
                    name={`簇 ${cluster}`}
                    data={data.filter(point => 
                      point.cluster === `簇 ${cluster}` && point.type === 'sample'
                    )}
                    shape="circle"
                    fill={`hsl(${cluster * 120}, 70%, 50%)`}
                  />,
                  // 中心点
                  <Scatter
                    key={`center-${cluster}`}
                    name={`簇 ${cluster} 中心`}
                    data={data.filter(point => 
                      point.cluster === `簇 ${cluster} 中心`
                    )}
                    shape="star"
                    fill={`hsl(${cluster * 120}, 70%, 30%)`}
                  />
                ])}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 聚类统计信息 */}
      <Card>
        <CardHeader>
          <CardTitle>聚类统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                轮廓系数 (Silhouette Score)
              </div>
              <div className="text-2xl font-bold">
                {result.metrics.silhouette_score.toFixed(4)}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                惯性 (Inertia)
              </div>
              <div className="text-2xl font-bold">
                {result.metrics.inertia.toFixed(2)}
              </div>
            </div>
          </div>

          {/* 簇大小分布 */}
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">簇大小分布</h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(result.cluster_sizes).map(([cluster, size]) => (
                <div 
                  key={cluster} 
                  className="p-2 bg-gray-50 rounded text-center"
                  style={{
                    backgroundColor: `hsla(${cluster * 120}, 70%, 50%, 0.1)`,
                    borderLeft: `4px solid hsla(${cluster * 120}, 70%, 50%, 1)`
                  }}
                >
                  <div className="text-sm text-muted-foreground">簇 {cluster}</div>
                  <div className="font-semibold">{size} 个样本</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default KMeansResult;