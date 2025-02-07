import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Edit, ArrowLeft, Share2, Download, MoreHorizontal, Trash } from 'lucide-react';
import { GridLayout } from '@/components/GridLayout';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Plus, BarChart2, Maximize2 } from 'lucide-react';
import DashboardExporter from '@/components/dashboard/DashboardExporter';
import { motion, AnimatePresence } from 'framer-motion';


export function DashboardDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { token } = useAuth();
	const { toast } = useToast();

	const [dashboard, setDashboard] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isFullscreen, setIsFullscreen] = useState(false);


	useEffect(() => {
		fetchDashboard();
	}, [id]);

	// 在 DashboardDetail.jsx 中修改 fetchDashboard 函数
	const fetchDashboard = async () => {
		try {
			// 1. 获取仪表盘基础信息
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboards/${id}`, {
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});

			const data = await response.json();
			console.log('Dashboard data:', data); // 添加日志查看数据结构

			if (!response.ok) {
				throw new Error(data.error || '获取仪表盘失败');
			}

			// 2. 处理布局信息
			const layout = data.data.layout || [];

			// 如果没有布局信息，直接设置空仪表盘
			if (!layout.length) {
				setDashboard(data.data);
				setLoading(false);
				return;
			}

			// 3. 获取所有图表的信息
			const chartIds = layout
				.map(item => item.chart_id)
				.filter(Boolean);

			if (chartIds.length) {
				const chartsResponse = await fetch(
					`${import.meta.env.VITE_API_URL}/api/charts?ids=${chartIds.join(',')}`,
					{
						headers: {
							'Authorization': `Bearer ${token}`,
						},
					}
				);

				if (!chartsResponse.ok) {
					throw new Error('Failed to fetch charts');
				}

				const chartsData = await chartsResponse.json();

				// 4. 合并布局和图表信息
				const enrichedLayout = layout.map(layoutItem => {
					const chartInfo = chartsData.data.find(
						chart => chart.id === layoutItem.chart_id || chart._id === layoutItem.chart_id
					);

					if (!chartInfo) return null;

					return {
						chartId: layoutItem.chart_id,
						x: parseInt(layoutItem.x) || 0,
						y: parseInt(layoutItem.y) || 0,
						width: parseInt(layoutItem.width) || 6,
						height: parseInt(layoutItem.height) || 4,
						type: chartInfo.type,
						name: chartInfo.name,
						dataSourceId: chartInfo.data_source_id,
						config: chartInfo.config
					};
				}).filter(Boolean);

				// 5. 设置最终的仪表盘数据
				setDashboard({
					...data.data,
					layout: enrichedLayout
				});
			} else {
				setDashboard(data.data);
			}
		} catch (error) {
			console.error('Error fetching dashboard:', error);
			toast({
				variant: "destructive",
				title: "加载失败",
				description: error.message || "获取仪表盘数据失败"
			});
		} finally {
			setLoading(false);
		}
	};
	// 添加删除图表的处理函数
	const handleRemoveChart = async (chart_id) => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/dashboards/${id}/charts/${chart_id}`,
				{
					method: 'DELETE',
					headers: {
						'Authorization': `Bearer ${token}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error('删除图表失败');
			}

			// 重新获取仪表盘数据
			await fetchDashboard();

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


	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (!dashboard) {
		return (
			<div className="text-center py-12">
				<h2 className="text-xl font-semibold text-gray-600">仪表盘不存在</h2>
				<Button
					variant="link"
					onClick={() => navigate('/dashboards')}
					className="mt-4"
				>
					返回仪表盘列表
				</Button>
			</div>
		);
	}
	const handleAddChart = () => {
		navigate(`/dashboards/${id}/charts/new`);
	};

	return (
		<motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* 顶部工具栏 */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center"
      >
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/dashboards')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{dashboard.name}</h1>
            <p className="text-sm text-gray-500">{dashboard.description}</p>
          </div>
        </div>
        <div className="flex space-x-4">

          <DashboardExporter dashboard={dashboard} />

          <Button
            onClick={() => navigate(`/dashboards/${id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            编辑
          </Button>
        </div>
      </motion.div>

      {/* 仪表盘内容 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="min-h-[600px] dashboard-content">
            {dashboard.layout?.length ? (
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <GridLayout
                  layout={dashboard.layout}
                  dashboard_id={id}
                  onLayoutChange={() => { }}
                  isEditable={false}
                  onChartRemove={handleRemoveChart}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center justify-center h-[600px] text-gray-500"
              >
                <BarChart2 className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">暂无图表</p>
                <p className="text-sm mt-2">该仪表盘还没有添加任何图表</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={handleAddChart}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  添加图表
                </Button>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* 更新时间 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-gray-500 text-right"
      >
        最后更新时间: {new Date(dashboard.updated_at).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })}
      </motion.div>
    </motion.div>
	);
}