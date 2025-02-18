import React, { useState, useEffect } from 'react';
import { Bell, 
	Settings, 
	HelpCircle, 
	X,
	Home,
	Database,
	Menu,
	Brain
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from '@/contexts/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import RecentActivities from '@/components/stats/RecentActivities';
import Reference from '@/components/common/Reference';

const RightSidebar = ({ showReference, onCloseReference }) => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('activities');

  useEffect(() => {
    if (showReference) {
      setActiveTab('reference');
    }
  }, [showReference]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('获取用户统计数据失败');

      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "加载失败",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserStats();
    }
  }, [token]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (value !== 'reference') {
      onCloseReference();
    }
  };

  return (
    <div className="w-80 bg-white border-l dark:bg-gray-800 dark:border-gray-700 h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList className="w-full h-12">
            <TabsTrigger value="activities" className="flex-1">通知中心</TabsTrigger>
            <TabsTrigger value="reference" className="flex-1">帮助文档</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="activities" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">最近动态</h3>
                <Settings className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700" />
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-20">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : stats?.recent_activity ? (
                <div className="space-y-4">
                  <RecentActivities 
                    activities={stats.recent_activity} 
                    showCard={false}
                    maxHeight="max-h-[calc(100vh-200px)]"
                  />
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  暂无活动记录
                </div>
              )}

              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3">快速操作</h4>
                <div className="space-y-2">
                  <button 
                    className="w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    onClick={() => setActiveTab('reference')}
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    <span>帮助文档</span>
                  </button>
                  
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

				<TabsContent value="reference" className="flex-1 m-0 overflow-hidden">
          <div className="h-[calc(100vh-12rem)]"> {/* 调整高度以适应标签栏 */}
            <Reference />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightSidebar;