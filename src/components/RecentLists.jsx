import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  Brain,
  Code,
  BarChart
} from 'lucide-react';
import CurtainList from '@/components/animations/CurtainList';

const RecentPanel = ({ 
  title, 
  items = [], 
  icon: Icon, 
  emptyText, 
  createText, 
  createPath, 
  viewAllPath,
  getItemPath,
  renderItemContent 
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Button
          variant="link"
          onClick={() => navigate(viewAllPath)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          查看全部
        </Button>
      </CardHeader>
      <CardContent>
        <CurtainList>
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border group cursor-pointer"
                onClick={() => navigate(getItemPath(item))}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Icon className="h-5 w-5 text-blue-600" />
                    <div>
                      {renderItemContent(item)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{emptyText}</p>
              <Button
                variant="link"
                onClick={() => navigate(createPath)}
                className="mt-2"
              >
                {createText}
              </Button>
            </div>
          )}
        </CurtainList>
      </CardContent>
    </Card>
  );
};

export const RecentLists = ({ dashboards = [], mlModels = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RecentPanel
        title="最近的仪表盘"
        items={dashboards}
        icon={LayoutDashboard}
        emptyText="暂无仪表盘"
        createText="创建第一个仪表盘"
        createPath="/dashboards/new"
        viewAllPath="/dashboards"
        getItemPath={(item) => `/dashboards/${item.id}`}
        renderItemContent={(item) => (
          <>
            <p className="font-medium line-clamp-1">{item.name}</p>
            <p className="text-sm text-gray-500 line-clamp-1">
              {item.description || '暂无描述'}
            </p>
            <p className="text-xs text-gray-400">
              创建于 {format(new Date(item.created_at), 'yyyy-MM-dd HH:mm')}
            </p>
          </>
        )}
      />

      <RecentPanel
        title="最近的机器学习模型"
        items={mlModels}
        icon={Brain}
        emptyText="暂无机器学习模型"
        createText="创建第一个模型"
        createPath="/mlmodels/new"
        viewAllPath="/mlmodels"
        getItemPath={(item) => `/mlmodels/${item.id}`}
        renderItemContent={(item) => (
          <>
            <p className="font-medium line-clamp-1">{item.name}</p>
            <p className="text-sm text-gray-500 line-clamp-1">
              <span className="inline-flex items-center">
                {item.type === 'linear_regression' ? (
                  <BarChart className="h-4 w-4 mr-1 text-green-500" />
                ) : (
                  <Code className="h-4 w-4 mr-1 text-purple-500" />
                )}
                {item.type === 'linear_regression' ? '线性回归' :
                  item.type === 'decision_tree' ? '决策树' :
                  item.type === 'correlation' ? '相关性分析' :
                  item.type}
              </span>
            </p>
            <p className="text-xs text-gray-400">
              创建于 {format(new Date(item.created_at), 'yyyy-MM-dd HH:mm')}
            </p>
          </>
        )}
      />
    </div>
  );
};

export default RecentLists;