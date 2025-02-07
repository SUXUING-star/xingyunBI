import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GridLayout } from '@/components/GridLayout';
import { UploadDataSource } from '@/components/UploadDataSource';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save, ArrowLeft ,Maximize2} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from 'framer-motion';

function DashboardEditor() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { token } = useAuth();
	const { toast } = useToast();
	const API_URL = import.meta.env.VITE_API_URL;

	const [dashboard, setDashboard] = useState({
		name: '',
		description: '',
		layout: []
	});
	const [dataSources, setDataSources] = useState([]);
	const [selectedChart, setSelectedChart] = useState(null);
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("layout");

	// 获取数据源列表
	const fetchDataSources = async () => {
		try {
			const response = await fetch(`${API_URL}/api/datasources`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			if (!response.ok) throw new Error('Failed to fetch data sources');
			const data = await response.json();
			setDataSources(data.data || []);
		} catch (error) {
			toast({
				variant: "destructive",
				title: "获取数据源失败",
				description: error.message
			});
		}
	};
	// 获取仪表板数据
	const fetchDashboard = async () => {
		if (!id) return;
		try {
			const response = await fetch(`${API_URL}/api/dashboards/${id}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			if (!response.ok) throw new Error('Failed to fetch dashboard');
			const data = await response.json();
			setDashboard(data.data);
		} catch (error) {
			toast({
				variant: "destructive",
				title: "获取仪表板失败",
				description: error.message
			});
		}
	};
	useEffect(() => {
		fetchDataSources();
		fetchDashboard();
	}, [id]);


	const handleSave = async () => {
		try {
			setLoading(true);
			const url = id
				? `${API_URL}/api/dashboards/${id}`
				: `${API_URL}/api/dashboards`;

			const response = await fetch(url, {
				method: id ? 'PUT' : 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(dashboard),
			});

			if (response.ok) {
				toast({
					title: "保存成功",
					description: "仪表盘已保存",
				});
				if (!id) {
					navigate('/dashboards');
				}
			}
		} catch (error) {
			toast({
				variant: "destructive",
				title: "保存失败",
				description: "保存仪表盘时出错",
			});
		} finally {
			setLoading(false);
		}
	};
	// Generate default dashboard name
	const generateDefaultName = () => {
		const now = new Date();
		const date = now.toLocaleDateString('zh-CN').replace(/\//g, '-');
		const time = now.toLocaleTimeString('zh-CN', {
			hour: '2-digit',
			minute: '2-digit'
		});
		return `未命名-${date}-${time}`;
	};
	// Save dashboard and return the saved dashboard's ID
	const saveDashboard = async (dashboardData) => {
		try {
			const url = id
				? `${API_URL}/api/dashboards/${id}`
				: `${API_URL}/api/dashboards`;

			const response = await fetch(url, {
				method: id ? 'PUT' : 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(dashboardData),
			});

			if (!response.ok) throw new Error('Failed to save dashboard');

			const data = await response.json();
			return data.data.id;
		} catch (error) {
			throw error;
		}
	};
	const handleAddChart = async () => {
		try {
			setLoading(true);
			let dashboardId = id;

			// If this is a new dashboard, save it first
			if (!id) {
				const dashboardToSave = {
					...dashboard,
					name: dashboard.name || generateDefaultName()
				};

				dashboardId = await saveDashboard(dashboardToSave);

				toast({
					title: "仪表盘已自动保存",
					description: `仪表盘「${dashboardToSave.name}」已创建`,
				});
			}

			// Navigate to the chart editor
			navigate(`/dashboards/${dashboardId}/charts/new`);
		} catch (error) {
			toast({
				variant: "destructive",
				title: "操作失败",
				description: error.message || "保存仪表盘时出错",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleLayoutChange = (newLayout) => {
		setDashboard(prev => ({
			...prev,
			layout: newLayout
		}));
	};

	const handleChartConfigChange = (newConfig) => {
		setDashboard(prev => ({
			...prev,
			layout: prev.layout.map(item =>
				item.chartId === selectedChart?.chartId
					? { ...item, config: newConfig }
					: item
			)
		}));
	};

	// 添加删除图表的处理函数
	const handleRemoveChart = async (chart_id) => {
		try {
			// 从布局中移除图表
			setDashboard(prev => ({
				...prev,
				layout: prev.layout.filter(item => item.chart_id !== chart_id)
			}));

			toast({
				title: "删除成功",
				description: "图表已从仪表盘中移除"
			});
		} catch (error) {
			toast({
				variant: "destructive",
				title: "删除失败",
				description: error.message
			});
		}
	};

	return (
		<motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex flex-col"
    >
      {/* 顶部导航栏 */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="border-b bg-white px-6 py-3 flex justify-between items-center"
      >
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/dashboards')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <h1 className="text-2xl font-bold">
            {id ? '编辑仪表盘' : '新建仪表盘'}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Input
            value={dashboard.name}
            onChange={(e) => setDashboard(prev => ({
              ...prev,
              name: e.target.value
            }))}
            placeholder="仪表板名称"
            className="w-64"
          />
          <Button onClick={handleAddChart} disabled={loading}>
            <Plus className="mr-2 h-4 w-4" /> 添加图表
          </Button>
          <Button variant="default" onClick={handleSave} disabled={loading}>
            <Save className="mr-2 h-4 w-4" /> 保存
          </Button>
        </div>
      </motion.div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-hidden relative">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="border-b px-6"
          >
            <TabsList>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TabsTrigger value="layout">布局设计</TabsTrigger>
              </motion.div>
                <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                 <TabsTrigger value="data">数据管理</TabsTrigger>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TabsTrigger value="settings">基本设置</TabsTrigger>
              </motion.div>
            </TabsList>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6 h-[calc(100%-48px)] overflow-auto"
            >
              <TabsContent value="layout" className="m-0 h-full">
                <div className="flex h-full">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex-1 min-h-0 overflow-auto"
                  >
                    <Card className="h-full">
                      <div className="h-full overflow-auto p-4">
                        <GridLayout
                          layout={dashboard.layout || []}
                          dashboard_id={id}
                          onLayoutChange={handleLayoutChange}
                          isEditable={true}
                          onChartRemove={handleRemoveChart}
                        />
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="data" className="m-0">
                <div className="space-y-4">
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">数据源管理</h2>
                    <UploadDataSource
                      onUploadSuccess={(newDataSource) => {
                        setDataSources(prev => [...prev, newDataSource]);
                        toast({
                          title: "数据源已添加",
                          description: `${newDataSource.name} 已成功上传`,
                        });
                      }}
                    />
                    <div className="mt-4">
                      {/* 数据源列表 */}
                      {dataSources.map(source => (
                        <div
                          key={source.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div>
                            <div className="font-medium">{source.name}</div>
                            <div className="text-sm text-gray-500">
                              {source.headers?.length || 0} 列 · {source.content?.length || 0} 行
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="m-0">
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">基本设置</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">描述</label>
                      <Textarea
                        value={dashboard.description}
                        onChange={(e) => setDashboard(prev => ({
                          ...prev,
                          description: e.target.value
                        }))}
                        placeholder="仪表板描述"
                        rows={4}
                      />
                    </div>
                    {/* 其他设置选项... */}
                  </div>
                </Card>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </motion.div>
	);
}

export default DashboardEditor;