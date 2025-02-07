// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
	LayoutDashboard,
	FileSpreadsheet,
	Database,
	Plus,
	ArrowUpRight,
	Activity,
	ChevronRight,
	LineChart,
	BarChart,
	PieChart,
	Brain
} from 'lucide-react';
import RecentActivities from '../components/RecentActivities';
import { github, githuburl, sitename, sitedescription, email } from '@/config/config'
import { TypeWriter } from '@/components/animations/TypeWriter';
import { FadeIn } from '@/components/animations/FadeIn';
import { ScaleIn } from '@/components/animations/ScaleIn';
import RecentLists from '@/components/RecentLists';


function Home() {
	const { user, token } = useAuth();
	const navigate = useNavigate();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [stats, setStats] = useState(null);

	// 只在用户登录时获取统计数据
	useEffect(() => {
		if (user) {
			fetchUserStats();
		}
	}, [user]);

	const fetchUserStats = async () => {
		setLoading(true);
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/stats`, {
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});

			if (!response.ok) throw new Error('获取用户统计数据失败');

			const data = await response.json();
			console.log("fetch data", data)
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

	// 未登录状态的引导页面
	if (!user) {
		return (
			<div className="min-h-[80vh] flex flex-col items-center justify-center space-y-12">
				{/* 顶部标题 */}
				<div className="text-center space-y-4">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 
						text-transparent bg-clip-text">
						<TypeWriter
							text={`${sitename} 一个简单而又强大数据可视化平台`}
							duration={3000}
						/>
					</h1>
					<FadeIn delay={2000}>
						<p className="text-xl text-gray-600">
							简单易用的数据分析与可视化工具
						</p>
					</FadeIn>
				</div>

				{/* 功能特点展示 */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full px-4">
					<ScaleIn delay={2400}>
						<Card className="group hover:shadow-lg transition-all duration-300">
							<CardContent className="pt-6">
								<div className="p-3 bg-blue-100 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
									<BarChart className="h-6 w-6 text-blue-600" />
								</div>
								<h3 className="text-lg font-semibold mb-2">数据分析</h3>
								<p className="text-gray-500 text-sm">
									强大的数据处理能力，支持多种数据源和分析方式
								</p>
							</CardContent>
						</Card>
					</ScaleIn>
					<ScaleIn delay={2600}>
						<Card className="group hover:shadow-lg transition-all duration-300">
							<CardContent className="pt-6">
								<div className="p-3 bg-green-100 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
									<LineChart className="h-6 w-6 text-green-600" />
								</div>
								<h3 className="text-lg font-semibold mb-2">可视化图表</h3>
								<p className="text-gray-500 text-sm">
									丰富的图表类型，让数据更直观、更易理解
								</p>
							</CardContent>
						</Card>
					</ScaleIn>
					<ScaleIn delay={2800}>
						<Card className="group hover:shadow-lg transition-all duration-300">
							<CardContent className="pt-6">
								<div className="p-3 bg-purple-100 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
									<PieChart className="h-6 w-6 text-purple-600" />
								</div>
								<h3 className="text-lg font-semibold mb-2">仪表盘</h3>
								<p className="text-gray-500 text-sm">
									自定义布局，实时数据更新，一键分享
								</p>
							</CardContent>
						</Card>
					</ScaleIn>
				</div>

				{/* 注册登录按钮 */}
				<FadeIn delay={3000} direction="up">
					<div className="space-x-4">
						<Button
							size="lg"
							onClick={() => navigate('/register')}
							className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
						>
							立即开始
							<ChevronRight className="h-4 w-4 ml-2" />
						</Button>
						<Button
							variant="outline"
							size="lg"
							onClick={() => navigate('/login')}
						>
							登录
						</Button>
					</div>
				</FadeIn>


				{/* 底部说明 */}
				<div className="text-center text-gray-500 text-sm">
					<p>免费注册，立即体验数据可视化的无限可能</p>
				</div>
			</div>
		);
	}

	// 加载状态
	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	// 已登录用户的主页内容
	return (
		<div className="space-y-8">
			{/* 欢迎区域 */}
			<div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-xl p-8 text-white 
    transform hover:scale-[1.01] transition-all duration-300 shadow-lg">
				<div className="relative z-10"> {/* 内容区域 */}
					<TypeWriter
						text={`欢迎回来, ${user?.username}`}
						className="text-4xl font-bold mb-2"
					/>
					<FadeIn delay={1000}>
						<p className="text-blue-100 text-lg mb-8 ">
							让我们开始探索数据的奥秘
						</p>
					</FadeIn>
					<FadeIn delay={1500}>
						<div className="flex space-x-4">
							<Button
								size="lg"
								variant="secondary"
								onClick={() => navigate('/dashboards/new')}
								className="bg-white/90 text-blue-600 hover:bg-white 
                    hover:shadow-md transition-all duration-300"
							>
								<Plus className="h-5 w-5 mr-2" />
								创建仪表盘
							</Button>
							<Button
								size="lg"
								variant="outline"
								onClick={() => navigate('/datasources')}
								className="border-white/50 text-white hover:bg-white/20
                    backdrop-blur-sm transition-all duration-300"
							>
								<Database className="h-5 w-5 mr-2" />
								上传数据
							</Button>
						</div>
					</FadeIn>
				</div>
				{/* 添加背景装饰 */}
				<div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50 
        rounded-xl overflow-hidden">
					<div className="absolute inset-0 bg-grid-white/10"></div>
				</div>
			</div>

			{/* 统计卡片区域 */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{[
					{
						title: '总仪表盘',
						value: stats?.total_dashboards || 0,
						icon: LayoutDashboard,
						color: 'blue',
						trend: '+15%'
					},
					{
						title: '总图表',
						value: stats?.total_charts || 0,
						icon: FileSpreadsheet,
						color: 'green',
						trend: '+20%'
					},
					{
						title: '数据源',
						value: stats?.total_data_sources || 0,
						icon: Database,
						color: 'purple',
						trend: '+10%'
					},
					{
						title: '总模型',
						value: stats?.total_ml_models || 0,
						icon: Brain,
						color: 'pink',
						trend: '+5%'
					}

				].map((stat, index) => (
					<ScaleIn key={index} delay={1000 + index * 200}>
						<Card className="transform hover:scale-[1.02] transition-all duration-300
            hover:shadow-lg border-t-4 border-t-${stat.color}-500">
							<CardContent className="pt-6">
								<div className="flex items-center justify-between mb-4">
									<div className={`p-3 bg-${stat.color}-100 rounded-xl`}>
										<stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
									</div>
									<span className="text-green-600 text-sm font-medium">{stat.trend}</span>
								</div>
								<h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
								<p className="text-gray-500 text-sm">{stat.title}</p>
							</CardContent>
						</Card>
					</ScaleIn>
				))}
			</div>


			{/* 最近活动 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<FadeIn delay={2000} direction="left">
					<RecentActivities activities={stats?.recent_activity} />
				</FadeIn>

				<FadeIn delay={2200} direction="right">
					<RecentLists
						dashboards={stats?.recent_dashboards}
						mlModels={stats?.recent_ml_models}
					/>
				</FadeIn>
			</div>
		</div>
	);
}

export default Home;