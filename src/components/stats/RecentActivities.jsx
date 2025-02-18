import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
	LayoutDashboard,
	FileSpreadsheet,
	Database,
	ArrowUpRight,
	Activity,
	Brain
} from 'lucide-react';
import { CurtainList } from "@/components/animations/CurtainList"

const RecentActivities = ({
	activities = [],
	showCard = true,
	className = '',
	maxHeight = ''
}) => {
	const navigate = useNavigate();

	const ActivityItem = ({ activity }) => {
		// 如果 activity 为空，返回 null
		if (!activity) return null;

		// 为所有可能用到的属性提供默认值
		const {
			activity_type = 'datasource',
			name = '未命名',
			type = '',
			created_at = new Date(),
			_id = '',
			id = '',
			dashboard_id = ''
		} = activity;

		return (
			<div className="flex items-center space-x-4 group">
				<div className={`p-2 rounded-lg 
                ${activity_type === 'dashboard' ? 'bg-blue-100' :
						activity_type === 'chart' ? 'bg-green-100' :
							activity_type === 'mlmodel' ? 'bg-yellow-100' :
								'bg-purple-100'}`}
				>
					{activity_type === 'dashboard' ? (
						<LayoutDashboard className="h-4 w-4 text-blue-600" />
					) : activity_type === 'chart' ? (
						<FileSpreadsheet className="h-4 w-4 text-green-600" />
					) : activity_type === 'mlmodel' ? (
						<Brain className="h-4 w-4 text-yellow-600" />
					) : (
						<Database className="h-4 w-4 text-purple-600" />
					)}
				</div>
				<div className="flex-1">
					<p className="text-sm font-medium">
						{name}
						{activity_type === 'mlmodel' && type && (
							<span className="ml-2 text-xs text-gray-500">
								{type === 'linear_regression' ? '线性回归' :
									type === 'decision_tree' ? '决策树' :
										type === 'correlation' ? '相关性分析' :
											type}
							</span>
						)}
					</p>
					<p className="text-xs text-gray-500">
						{format(new Date(created_at), 'yyyy-MM-dd HH:mm')}
					</p>
				</div>
				<Button
					variant="ghost"
					size="icon"
					className="opacity-0 group-hover:opacity-100 transition-opacity"
					onClick={(e) => {
						e.stopPropagation();
						const path = activity_type === 'dashboard'
							? `/dashboards/${_id || id}`
							: activity_type === 'datasource'
								? '/datasources/'
								: activity_type === 'mlmodel'
									? `/mlmodels/${_id || id}`
									: `/dashboards/${dashboard_id}/charts/${_id || id}`;
						navigate(path);
					}}
				>
					<ArrowUpRight className="h-4 w-4" />
				</Button>
			</div>
		);
	};

	const ActivitiesList = () => (
		<div className={`${maxHeight ? `overflow-y-auto ${maxHeight}` : ''}`}>
			<CurtainList>
				{Array.isArray(activities) && activities.length > 0 ? (
					activities.map((activity) => (
						<div
							key={activity?._id || activity?.id || Math.random().toString()}
							className="p-3 rounded-lg hover:bg-transparent transition-colors"
						>
							<ActivityItem activity={activity} />
						</div>
					))
				) : (
					<div className="text-center py-8 text-gray-500">
						暂无活动记录
					</div>
				)}
			</CurtainList>
		</div>
	);

	if (!showCard) {
		return <ActivitiesList />;
	}

	return (
		<Card className={className}>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="text-lg font-medium">最近活动</CardTitle>
				<Activity className="h-4 w-4 text-gray-500" />
			</CardHeader>
			<CardContent>
				<ActivitiesList />
			</CardContent>
		</Card>
	);
};

export default RecentActivities;