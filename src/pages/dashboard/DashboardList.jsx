// src/pages/DashboardList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, LayoutDashboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardCard from '@/components/dashboard/DashboardCard';

function DashboardList() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboards();
  }, []);

  const fetchDashboards = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboards`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.code === 0) {
        setDashboards(data.data || []);
      } else {
        setDashboards([]);
      }
    } catch (error) {
      console.error('Failed to fetch dashboards:', error);
      toast({
        variant: "destructive",
        title: "加载失败",
        description: "获取仪表盘列表失败",
      });
      setDashboards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dashboardId) => {
    if (!window.confirm('确定要删除这个仪表盘吗？')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboards/${dashboardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('删除仪表盘失败');

      toast({
        title: "删除成功",
        description: "仪表盘已成功删除"
      });
      
      // 更新列表
      setDashboards(dashboards.filter(d => d.id !== dashboardId));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "删除失败",
        description: error.message
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* 页面头部 - 添加半透明玻璃拟态效果 */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm
          backdrop-blur-md border border-gray-200 dark:border-gray-700">
        <div className="p-6 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">我的仪表盘</h1>
              <p className="text-gray-500 dark:text-gray-400">创建和管理您的数据可视化仪表盘</p>
            </div>
            <Button
              onClick={() => navigate('/dashboards/new')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg
                transition-all duration-300"
            >
              <Plus className="mr-2 h-5 w-5" />
              新建仪表盘
            </Button>
          </div>
        </div>
        {/* 装饰性背景 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 
            dark:from-blue-900/10 dark:to-indigo-900/10 opacity-50"></div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : dashboards.length === 0 ? (
        <div className="text-center py-12">
          <Card className="bg-gray-50 dark:bg-gray-800 border-dashed">
            <CardContent className="py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <LayoutDashboard className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">暂无仪表盘</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                  点击"新建仪表盘"开始创建您的第一个数据可视化仪表盘
                </p>
                <Button 
                  onClick={() => navigate('/dashboards/new')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" /> 新建仪表盘
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboards.map((dashboard) => (
            <DashboardCard
              key={dashboard.id}
              dashboard={dashboard}
              onView={() => navigate(`/dashboards/${dashboard.id}`)}
              onEdit={() => navigate(`/dashboards/${dashboard.id}/edit`)}
              onDelete={() => handleDelete(dashboard.id)}
              className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardList;