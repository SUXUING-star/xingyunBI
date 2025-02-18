// src/pages/DataSourceList.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DataSourcePreview } from '@/components/datasource/preview/DataSourcePreview';
import { Input } from '@/components/ui/input';
import {
	Cog,
	Search,
	FileSpreadsheet,
	Eye,
	Trash2,
	MoreHorizontal,
	Download
} from 'lucide-react';
import { PreprocessingDialog } from '@/components/datasource/dialogs/PreprocessingDialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { UploadDataSource } from '@/components/datasource/utils/UploadDataSource';
import {
	ListContainer,
	TableRowAnimation,
	PageHeader
} from '../../components/animations/ListAnimation';

function DataSourceList() {
	const { token } = useAuth();
	const { toast } = useToast();
	const [dataSources, setDataSources] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [previewData, setPreviewData] = useState(null);
	const [showPreview, setShowPreview] = useState(false);
	const [showPreProcessing, setShowPreProcessing] = useState(false);
	const [currentDataSource, setCurrentDataSource] = useState(null);

	// 添加预处理处理函数
	const handlePreProcessing = (dataSource) => {
		setCurrentDataSource(dataSource);
		setShowPreProcessing(true);
	};

	// 添加预处理成功的回调
	const handlePreProcessingSuccess = () => {
		setShowPreProcessing(false);
		fetchDataSources(); // 刷新数据源列表
		toast({
			title: "预处理配置已更新",
			description: "数据源的预处理配置已保存"
		});
	};

	// 获取数据源列表
	const fetchDataSources = async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/datasources`, {
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});

			if (!response.ok) throw new Error('获取数据源列表失败');

			const data = await response.json();
			setDataSources(data.data || []); // 确保 data.data 是一个数组，默认空数组
		} catch (error) {
			toast({
				variant: "destructive",
				title: "加载失败",
				description: error.message
			});
			setDataSources([]); // 如果请求失败，设置为空数组
		} finally {
			setLoading(false);
		}
	};


	useEffect(() => {
		fetchDataSources();
	}, []);

	// 预览数据源
	const handlePreview = (dataSource) => {
		setPreviewData(dataSource);
		setShowPreview(true);
	};

	// 删除数据源
	const handleDelete = async (id) => {
		if (!confirm('确定要删除这个数据源吗？')) return;

		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/datasources/${id}`, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});

			if (!response.ok) throw new Error('删除数据源失败');

			toast({
				title: "删除成功",
				description: "数据源已成功删除"
			});

			fetchDataSources();
		} catch (error) {
			toast({
				variant: "destructive",
				title: "删除失败",
				description: error.message
			});
		}
	};

	// 过滤数据源
	const filteredDataSources = dataSources.filter(ds =>
		ds.name?.toLowerCase().includes(searchTerm.toLowerCase()) // 使用可选链
	);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<PageHeader
				title="数据源"
				description="管理您的所有数据源"
				action={
					<UploadDataSource
						onUploadSuccess={handleUploadSuccess}
						className="shrink-0"
					/>
				}
			/>

			<Card className="shadow-sm">
				<Table>
					<TableHeader>
						<TableRow className="bg-gray-50 dark:bg-gray-800">
							<TableHead className="font-semibold">名称</TableHead>
							<TableHead className="font-semibold">类型</TableHead>
							<TableHead className="font-semibold">行数</TableHead>
							<TableHead className="font-semibold">创建时间</TableHead>
							<TableHead className="text-right font-semibold">操作</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						
						{filteredDataSources.map((dataSource, index) => (
							<TableRowAnimation key={dataSource.id} index={index}>
								<TableCell>
									<div className="flex items-center space-x-3">
										<div className="p-2 bg-blue-100 rounded-lg
                                    group-hover:bg-blue-200 transition-colors">
											<FileSpreadsheet className="h-5 w-5 text-blue-600" />
										</div>
										<span className="font-medium">{dataSource.name}</span>
									</div>
								</TableCell>
								<TableCell>{dataSource.type?.toUpperCase() || 'N/A'}</TableCell>
								<TableCell>{dataSource.content?.length || 0}</TableCell>
								<TableCell>{dataSource.created_at ? format(new Date(dataSource.created_at), 'yyyy-MM-dd HH:mm:ss') : 'N/A'}</TableCell>
								<TableCell className="text-right">
									<div className="flex items-center justify-end space-x-2">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handlePreview(dataSource)}
										>
											<Eye className="h-4 w-4" />
										</Button>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem onClick={() => handlePreview(dataSource)}>
													<Eye className="h-4 w-4 mr-2" />
													预览数据
												</DropdownMenuItem>
												<DropdownMenuItem onClick={() => handlePreProcessing(dataSource)}>
													<Cog className="h-4 w-4 mr-2" />
													数据预处理
												</DropdownMenuItem>
												<DropdownMenuItem>
													<Download className="h-4 w-4 mr-2" />
													导出
												</DropdownMenuItem>
												<DropdownMenuItem
													className="text-red-600 hover:text-red-700"
													onClick={() => handleDelete(dataSource.id)}
												>
													<Trash2 className="h-4 w-4 mr-2" />
													删除
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</TableCell>
							</TableRowAnimation>
						))}
					</TableBody>
				</Table>
			</Card>
			{/* 数据预览对话框 */}
			<DataSourcePreview
				isOpen={showPreview}
				onClose={() => setShowPreview(false)}
				dataSource={previewData}
			/>
			{/* 添加预处理对话框 */}
			{showPreProcessing && (
				<PreprocessingDialog
					isOpen={showPreProcessing}
					onClose={() => setShowPreProcessing(false)}
					dataSource={currentDataSource}
					onSave={handlePreProcessingSuccess}
				/>
			)}
		</div>
	);

	function handleUploadSuccess(newDataSource) {
		setDataSources(prev => [...prev, newDataSource]);
		toast({
			title: "数据源已添加",
			description: `${newDataSource.name} 已成功上传`,
		});
	}
}

export default DataSourceList;