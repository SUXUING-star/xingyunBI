// src/pages/MLModelList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, Eye, Brain } from 'lucide-react';
import { PageHeader, TableRowAnimation } from '@/components/animations/ListAnimation';
import {motion} from "framer-motion"

export default function MLModelList() {
	const navigate = useNavigate();
	const { token } = useAuth();
	const { toast } = useToast();
	const [models, setModels] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchModels();
	}, []);

	const fetchModels = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mlmodels`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});

			const data = await response.json();

			console.log('Fetched models data:', data);

			if (data.data) {
				setModels(data.data);
			} else if (Array.isArray(data)) {
				setModels(data);
			} else {
				setModels([]);
			}

		} catch (error) {
			console.error('Error fetching models:', error);
			toast({
				variant: "destructive",
				title: "获取失败",
				description: error.message
			});
			setModels([]);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('确定要删除这个模型吗？')) return;

		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mlmodels/${id}`, {
				method: 'DELETE',
				headers: { 'Authorization': `Bearer ${token}` }
			});

			if (!response.ok) throw new Error('Failed to delete model');

			toast({
				title: "删除成功",
				description: "模型已成功删除"
			});

			fetchModels();
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
			<div className="container mx-auto p-4">
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<PageHeader
				title="机器学习模型"
				description="管理和训练您的机器学习模型"
				action={
					<Button
						onClick={() => navigate('/mlmodels/new')}
						className="bg-white text-purple-600 hover:bg-purple-50
            transition-all duration-300 shadow-md hover:shadow-lg"
					>
						<Plus className="mr-2 h-5 w-5" />
						新建模型
					</Button>
				}
			/>

			<motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
				<Card className="shadow-sm">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="font-semibold">名称</TableHead>
								<TableHead className="font-semibold">类型</TableHead>
								<TableHead className="font-semibold">特征数</TableHead>
								<TableHead className="font-semibold">训练状态</TableHead>
								<TableHead className="text-right font-semibold">操作</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{models.map((model, index) => (
								<TableRowAnimation key={model.id} index={index}>
									<TableCell>
										<div className="flex items-center space-x-3">
											<div className="p-2 bg-purple-100 rounded-lg
                                        group-hover:bg-purple-200 transition-colors">
												<Brain className="h-5 w-5 text-purple-600" />
											</div>
											<span className="font-medium">{model.name}</span>
										</div>
									</TableCell>
									<TableCell>
										<span className="px-3 py-1 rounded-full text-sm
                                    bg-gray-100 dark:bg-gray-700">
											{model.type}
										</span>
									</TableCell>
									<TableCell>{model.features?.length || 0}</TableCell>
									<TableCell>
										{model.training_result ? (
											<span className="text-green-600">已训练</span>
										) : (
											<span className="text-yellow-600">未训练</span>
										)}
									</TableCell>
									<TableCell className="text-right space-x-2">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => navigate(`/mlmodels/${model.id}`)}
										>
											<Eye className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => navigate(`/mlmodels/${model.id}/edit`)}
										>
											<Edit className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleDelete(model.id)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</TableCell>
								</TableRowAnimation>
							))}
						</TableBody>
					</Table>
				</Card>
			</motion.div>
		</div>
	);
}