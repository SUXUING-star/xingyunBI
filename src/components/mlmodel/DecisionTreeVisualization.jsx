import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import mermaid from 'mermaid';

const DecisionTreeVisualization = ({ treeData }) => {
  const [maxDepthToShow, setMaxDepthToShow] = useState(1);
  const [chart, setChart] = useState('');
  const [error, setError] = useState(null);
  
  // 初始化 mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      }
    });
  }, []);

  useEffect(() => {
    if (!treeData) return;
    
    try {
      const generateMermaidChart = (node, depth = 0, id = 'root') => {
        if (depth >= maxDepthToShow || !node) return '';
        
        let chart = '';
        
        // 使用 HTML 标签替代换行符，避免使用 blockquote
        const nodeValue = node.value !== undefined 
          ? `("特征值: ${Number(node.value).toFixed(2)}<br>样本数: ${node.n_samples}")`
          : `["特征${node.feature}<br>阈值: ${Number(node.threshold).toFixed(2)}<br>样本数: ${node.n_samples}"]`;
        
        if (node.left) {
          const leftId = `${id}_left`;
          // 使用不同的箭头样式
          chart += `  ${id}${nodeValue} --> ${leftId}\n`;
          chart += generateMermaidChart(node.left, depth + 1, leftId);
        }
        
        if (node.right) {
          const rightId = `${id}_right`;
          chart += `  ${id}${nodeValue} --> ${rightId}\n`;
          chart += generateMermaidChart(node.right, depth + 1, rightId);
        }
        
        return chart;
      };

      const chartDefinition = `graph TD\n${generateMermaidChart(treeData)}`;
      setChart(chartDefinition);
      setError(null);

      const container = document.getElementById('tree-container');
      if (container) {
        // 清空容器
        container.innerHTML = '';
        
        // 渲染新图表
        mermaid.render('decision-tree', chartDefinition).then((result) => {
          container.innerHTML = result.svg;
        }).catch((err) => {
          setError('生成树图时出错，请尝试调整显示层数');
          console.error('Mermaid render error:', err);
        });
      }
    } catch (err) {
      setError('处理树结构数据时出错');
      console.error('Tree processing error:', err);
    }
  }, [treeData, maxDepthToShow]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>决策树结构</CardTitle>
          <Select 
            value={maxDepthToShow.toString()} 
            onValueChange={(value) => setMaxDepthToShow(Number(value))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="选择显示层数" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((depth) => (
                <SelectItem key={depth} value={depth.toString()}>
                  显示 {depth} 层
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-red-500 p-4 text-center">{error}</div>
        ) : (
          <div id="tree-container" className="w-full overflow-x-auto min-h-[300px]" />
        )}
      </CardContent>
    </Card>
  );
};

export default DecisionTreeVisualization;