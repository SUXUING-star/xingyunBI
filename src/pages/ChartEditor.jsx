import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ChartPreview } from '@/components/chart/ChartPreview';
import { useToast } from '@/hooks/use-toast';
import { Save, ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import { Cog } from 'lucide-react';  // 修正图标引入
import { PreprocessingDialog } from '@/components/PreprocessingDialog';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableField } from '@/components/DraggableField';
import { ChartConfiguration } from '@/components/chart/ChartConfiguration';
import { ChartDropZones } from '@/components/chart/ChartDropZones';
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { Label } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

function ChartEditor() {
	const { dashboardId, chartId } = useParams();
	const navigate = useNavigate();
	const { token } = useAuth();
	const { toast } = useToast();
	const API_URL = import.meta.env.VITE_API_URL;

	// 添加仪表盘状态
	const [dashboard, setDashboard] = useState(null);

	const [chart, setChart] = useState({
		name: '',
		type: 'bar',
		dataSourceId: null,
		config: {
			dimensions: [],
			metrics: [],
			settings: {},
			visualMap: {
				colorField: undefined,
				colorRange: ['#e6f3ff', '#0088FE'],
				sizeField: undefined,
				sizeRange: [4, 20],
				labelField: undefined
			}
		}
	});

	const [dataSources, setDataSources] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedDataSource, setSelectedDataSource] = useState(null);
	const [showPreProcessing, setShowPreProcessing] = useState(false);  // 新增处理后的数据状态
	const resizeRef = useRef(null); // 添加 ref
	const [isFullscreen, setIsFullscreen] = useState(false);

	const toggleFullscreen = () => {
		setIsFullscreen(!isFullscreen);
	};

	// 添加一个函数来计算当前布局中的最低位置
	const findLowestPosition = (layout) => {
		if (!layout || layout.length === 0) return 0;
		return Math.max(...layout.map(item => item.y + (item.height || 4)));
	};
	// 布局
	const [chartLayout, setChartLayout] = useState({
		x: 0,
		y: findLowestPosition(dashboard?.layout || []), // 计算最低点
		width: 6,
		height: 4
	});

	// useEffect 用于在 dashboard 数据加载后更新布局的位置
	useEffect(() => {
		if (dashboard?.layout) {
			setChartLayout(prev => ({
				...prev,
				y: findLowestPosition(dashboard.layout)
			}));
		}
	}, [dashboard]);
	// 修改布局调整处理函数
	const handleLayoutChange = (key, value) => {
		setChartLayout(prev => ({
			...prev,
			[key]: parseInt(value) || 0
		}));
		console.log('Layout updated:', { key, value }); // 添加日志
	};
	// 添加获取仪表盘数据的函数
	const fetchDashboard = async () => {
		try {
			const response = await fetch(`${API_URL}/api/dashboards/${dashboardId}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			if (!response.ok) {
				throw new Error('Failed to fetch dashboard');
			}
			const data = await response.json();
			setDashboard(data.data);
		} catch (error) {
			toast({
				variant: "destructive",
				title: "获取仪表盘失败",
				description: error.message
			});
		}
	};
	// 在组件挂载时获取数据
	useEffect(() => {
		fetchDashboard();
		fetchDataSources();
		if (chartId) {
			fetchChart();
		}
	}, [dashboardId, chartId]);

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
	useEffect(() => {
		// 监听 resize
		if (resizeRef.current) {
			const resizeObserver = new ResizeObserver((entries) => {
				for (let entry of entries) {
					const { width, height } = entry.contentRect;
					setChartLayout(prev => ({
						...prev,
						width: Math.ceil(width / 50),  // 转换为网格单位
						height: Math.ceil(height / 50)
					}));
				}
			});

			resizeObserver.observe(resizeRef.current);
			return () => resizeObserver.disconnect();
		}
	}, [resizeRef]);

	// 获取图表数据
	const fetchChart = async () => {
		try {
			const response = await fetch(`${API_URL}/api/charts/${chartId}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			if (!response.ok) throw new Error('Failed to fetch chart');
			const data = await response.json();

			// 确保配置包含所有必要的字段
			const config = {
				dimensions: data.data.chart.config?.dimensions || [],
				metrics: data.data.chart.config?.metrics || [],
				settings: data.data.chart.config?.settings || {},
				visualMap: {
					colorField: data.data.chart.config?.visualMap?.colorField,
					colorRange: data.data.chart.config?.visualMap?.colorRange || ['#e6f3ff', '#0088FE'],
					sizeField: data.data.chart.config?.visualMap?.sizeField,
					sizeRange: data.data.chart.config?.visualMap?.sizeRange || [4, 20],
					labelField: data.data.chart.config?.visualMap?.labelField
				}
			};

			setChart({
				name: data.data.chart.name,
				type: data.data.chart.type,
				dataSourceId: data.data.chart.data_source_id,
				config: config
			});
		} catch (error) {
			toast({
				variant: "destructive",
				title: "获取图表失败",
				description: error.message
			});
		}
	};

	useEffect(() => {
		fetchDataSources();
		if (chartId) {
			fetchChart();
		}
	}, [chartId]);

	const handleSave = async () => {
		try {
			setLoading(true);

			// 验证必填字段
			if (!chart.name || !chart.dataSourceId) {
				toast({
					variant: "destructive",
					title: "保存失败",
					description: "请填写图表名称并选择数据源"
				});
				return;
			}

			// 1. 保存图表，确保包含视觉映射配置
			const chartPayload = {
				name: chart.name,
				type: chart.type,
				data_source_id: chart.dataSourceId,
				config: {
					...chart.config,
					dimensions: chart.config.dimensions || [],
					metrics: chart.config.metrics || [],
					visualMap: {
						colorField: chart.config?.visualMap?.colorField,
						colorRange: chart.config?.visualMap?.colorRange,
						sizeField: chart.config?.visualMap?.sizeField,
						sizeRange: chart.config?.visualMap?.sizeRange,
						labelField: chart.config?.visualMap?.labelField
					},
					dualAxis: chart.config?.dualAxis
				}
			};
			console.log('Saving chart with config:', chartPayload); // 添加日志

			const chartResponse = await fetch(
				chartId ? `${API_URL}/api/charts/${chartId}` : `${API_URL}/api/charts`,
				{
					method: chartId ? 'PUT' : 'POST',
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(chartPayload),
				}
			);

			if (!chartResponse.ok) {
				throw new Error('Failed to save chart');
			}

			const chartData = await chartResponse.json();
			const savedChartId = chartId || chartData.data.id;

			// 2. 获取当前仪表盘布局
			const dashboardResponse = await fetch(`${API_URL}/api/dashboards/${dashboardId}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});

			if (!dashboardResponse.ok) {
				throw new Error('Failed to fetch dashboard');
			}

			const dashboardData = await dashboardResponse.json();
			const currentLayout = dashboardData.data.layout || [];

			// 3. 更新布局
			const newLayout = currentLayout.filter(item =>
				item.chart_id !== savedChartId
			);

			newLayout.push({
				chart_id: savedChartId,
				x: parseInt(chartLayout.x) || 0,
				y: parseInt(chartLayout.y) || 0,
				width: parseInt(chartLayout.width) || 6,
				height: parseInt(chartLayout.height) || 4
			});

			// 4. 保存更新后的仪表盘布局
			const updateResponse = await fetch(`${API_URL}/api/dashboards/${dashboardId}`, {
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...dashboardData.data,
					layout: newLayout
				}),
			});

			if (!updateResponse.ok) {
				throw new Error('Failed to update dashboard layout');
			}

			toast({
				title: "保存成功",
				description: "图表已添加到仪表盘"
			});

			navigate(`/dashboards/${dashboardId}/edit`);
		} catch (error) {
			toast({
				variant: "destructive",
				title: "保存失败",
				description: error.message || "保存图表时出错"
			});
		} finally {
			setLoading(false);
		}
	};
	// 修改返回按钮的处理函数
	const handleGoBack = () => {
		// 不管是新建还是编辑仪表盘，都返回到对应的编辑页面
		navigate(`/dashboards/${dashboardId}/edit`);
	};
	const handleChartTypeChange = (type) => {
		setChart(prev => ({
			...prev,
			type, // 直接更新图表类型
			config: {
				...prev.config,
				chartType: type // 同时更新配置中的图表类型
			}
		}));
	};
	// 修改数据源选择的处理函数
	const handleDataSourceChange = async (dataSourceId) => {
		const source = dataSources.find(ds => ds.id === dataSourceId);
		setSelectedDataSource(source);

		// 如果数据源有预处理配置,显示提示
		if (source?.preprocessing?.length) {
			toast({
				title: "发现预处理配置",
				description: "已加载该数据源的预处理设置"
			});
		}

		setChart(prev => ({
			...prev,
			dataSourceId,
			config: {
				...prev.config,
				dimensions: [],
				metrics: []
			}
		}));
	};
	const handlePreProcessingSuccess = () => {
		setShowPreProcessing(false);
		// 重新获取数据源信息，以获取最新的预处理配置
		if (chart.dataSourceId) {
			const source = dataSources.find(ds => ds.id === chart.dataSourceId);
			if (source) {
				setSelectedDataSource(source);
			}
		}
		toast({
			title: "预处理配置已更新",
			description: "数据源的预处理配置已保存"
		});
	};
	useEffect(() => {
		if (chart.dataSourceId) {
			const source = dataSources.find(ds => ds.id === chart.dataSourceId);
			setSelectedDataSource(source);
		}
	}, [chart.dataSourceId, dataSources]);

	return (
		<DndProvider backend={HTML5Backend}>
			<motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${isFullscreen ? 'fixed inset-0 bg-white dark:bg-gray-900 z-50 p-4 overflow-auto' : 'space-y-6'}`}
      >
        {/* 顶部标题和按钮 */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex justify-between items-center"
        >
          <div className="flex items-center space-x-4">
            {!isFullscreen && (
              <Button variant="ghost" onClick={handleGoBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />返回
              </Button>
            )}
            <h1 className="text-2xl font-bold">{chartId ? '编辑图表' : '新建图表'}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={toggleFullscreen} variant="ghost" size="icon">
              {isFullscreen ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />保存
            </Button>
          </div>
        </motion.div>

        {/* 主要内容区 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`grid grid-cols-12 gap-4 ${isFullscreen ? 'h-[calc(100vh-80px)]' : ''}`}
        >
          {/* 左侧：可用字段 */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="col-span-2"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>可用字段</CardTitle>
              </CardHeader>
              <ScrollArea className="h-[300px]">
                <CardContent>
                  {selectedDataSource?.headers.map(field => (
                    <DraggableField key={field} field={field} type="field" />
                  ))}
                </CardContent>
              </ScrollArea>
            </Card>
          </motion.div>

          {/* 中间部分：图表预览 */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="col-span-7"
          >
            <Card>
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="p-4"
              >
                <Input
                  className="mb-4"
                  value={chart.name}
                  onChange={(e) => setChart(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  placeholder="图表名称"
                />
                <div className="h-[320px] mb-4">
                  <ChartPreview chart={chart} />
                </div>
                <ChartDropZones chart={chart} setChart={setChart} />
              </motion.div>
            </Card>
          </motion.div>

          {/* 右侧：配置面板 */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="col-span-3"
          >
            <ChartConfiguration
              chart={chart}
              dataSources={dataSources}
              selectedDataSource={selectedDataSource}
              onChartChange={setChart}
              onDataSourceChange={handleDataSourceChange}
              onShowPreProcessing={() => setShowPreProcessing(true)}
            />
          </motion.div>
        </motion.div>

        {/* 弹出对话框动画 */}
        <AnimatePresence>
          {showPreProcessing && selectedDataSource && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <PreprocessingDialog
                isOpen={showPreProcessing}
                onClose={() => setShowPreProcessing(false)}
                dataSource={selectedDataSource}
                onSave={handlePreProcessingSuccess}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
		</DndProvider>
	);
}
export default ChartEditor;