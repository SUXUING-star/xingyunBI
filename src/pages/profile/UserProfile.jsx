import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RecentActivities from '../../components/stats/RecentActivities';
import { MLStatsCard } from '@/components/stats/MLStatsCard';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import {
	Settings,
	User,
	BarChart2,
	FileSpreadsheet,
	Database,
	Clock,
	Brain
} from 'lucide-react';
import { motion } from 'framer-motion';

function UserProfile() {
	const { user, token } = useAuth();
	const [activeTab, setActiveTab] = useState('overview');
	const [userStats, setUserStats] = useState({
		totalDashboards: 0,
		totalDataSources: 0,
		totalCharts: 0,
		recentActivity: [],
		usageStats: []
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [preferences, setPreferences] = useState({
		theme: 'light',
		defaultDashboard: '',
		chartPreferences: {
			colorScheme: 'default',
			showLegend: true,
			showGrid: true
		}
	});
	const API_URL = import.meta.env.VITE_API_URL;

	// 获取用户统计数据
	useEffect(() => {
		const fetchUserStats = async () => {
			try {
				const response = await fetch(`${API_URL}/api/user/stats`, {
					headers: {
						'Authorization': `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error('获取用户统计数据失败');
				}

				const data = await response.json();
				setUserStats(data.data || {
					total_dashboards: 0,
					total_data_sources: 0,
					total_charts: 0,
					recent_activity: [],
					usage_stats: []
				});
			} catch (err) {
				setError('获取用户统计数据失败');
				console.error('Error fetching user stats:', err);
			} finally {
				setLoading(false);
			}
		};

		if (user) {
			fetchUserStats();
		}
	}, [user, token]);


	const StatCard = ({ icon: Icon, title, value, className }) => (
		<Card className={className}>
			<CardContent className="p-6">
				<div className="flex items-center space-x-4">
					<div className="p-2 bg-blue-100 rounded-lg">
						<Icon className="h-6 w-6 text-blue-600" />
					</div>
					<div>
						<p className="text-sm font-medium text-gray-500">{title}</p>
						<p className="text-2xl font-bold text-gray-900">{value}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);

	const formatMongoDate = (dateValue) => {
		if (!dateValue) return '';
		// 如果是 primitive.DateTime，它会是一个包含时间戳的对象
		const timestamp = dateValue.$date ? new Date(dateValue.$date) : new Date(parseInt(dateValue));
		return format(timestamp, 'yyyy-MM-dd HH:mm');
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.div className="space-y-6">
					{/* 个人信息卡片 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center space-x-4">
									<div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
										<User className="h-8 w-8 text-blue-600" />
									</div>
									<div>
										<h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
										<p className="text-gray-500">{user.email}</p>
										<p className="text-sm text-gray-400">
											注册于 {format(new Date(user.created_at), 'yyyy-MM-dd')}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
          </motion.div>

					{/* 统计卡片 */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						{[
							{ icon: BarChart2, title: "仪表盘", value: userStats.total_dashboards },
							{ icon: FileSpreadsheet, title: "数据图表", value: userStats.total_charts },
							{ icon: Database, title: "数据源", value: userStats.total_data_sources },
							{ icon: Brain, title: "机器学习模型", value: userStats.total_ml_models },
						].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <StatCard {...stat} />
              </motion.div>
            ))}
					</div>

					{/* 主要内容区域 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
						{/* 使用趋势图表 */}
						<Card className="lg:col-span-2">
							<CardHeader>
								<CardTitle>使用趋势</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="h-80">
									<ResponsiveContainer width="100%" height="100%">
										<LineChart data={userStats.usage_stats}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="date" />
											<YAxis />
											<Tooltip />
											<Legend />
											<Line
												type="monotone"
												dataKey="dashboards"
												stroke="#8884d8"
												name="仪表盘"
											/>
											<Line
												type="monotone"
												dataKey="charts"
												stroke="#82ca9d"
												name="图表"
											/>
											<MLStatsCard stats={userStats.ml_model_stats} />
											<Line
												type="monotone"
												dataKey="queries"
												stroke="#ffc658"
												name="查询"
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							</CardContent>
						</Card>

						{/* 最近活动 */}
						<RecentActivities
							activities={userStats.recent_activity}
							className="h-full"
							maxHeight="max-h-96"
						/>
          </motion.div>
				</motion.div>
			</div>
		</motion.div>
	);
}

export default UserProfile;