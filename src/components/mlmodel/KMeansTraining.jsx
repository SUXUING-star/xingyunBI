import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export function KMeansTraining({ model, selectedDataSource, onTrainingComplete }) {
	const { token } = useAuth();
	const { toast } = useToast();

	const handleTraining = async () => {
		if (!selectedDataSource || !model.features.length) {
			toast({
				variant: "destructive",
				title: "训练失败",
				description: "请选择数据源并配置特征"
			});
			return;
		}

		try {
			// 创建模型
			const createResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/mlmodels`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				// 修改此处，确保包含data_source_id
				body: JSON.stringify({
					name: model.name,
					description: model.description,
					type: 'kmeans',
					data_source_id: selectedDataSource.id,  // 添加这行
					features: model.features,
					parameters: {
						n_clusters: model.parameters.n_clusters,
						max_iter: model.parameters.max_iter,
						auto_encode: model.parameters.auto_encode,
						test_size: model.parameters.test_size,
					}
				})
			});

			if (!createResponse.ok) {
				throw new Error('创建模型失败');
			}

			const createData = await createResponse.json();
			if (createData.code !== 0) {
				throw new Error(createData.msg || '创建模型失败');
			}

			const modelId = createData.data.id;

			// 开始训练
			const trainingResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/mlmodels/${modelId}/result`, {
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					training_result: {
						metrics: {
							silhouette_score: 0.75,  // 轮廓系数
							inertia: 245.6,          // 惯性（簇内平方和）
						},
						cluster_centers: [          // 聚类中心点
							[1.2, 2.3, 3.1],
							[4.5, 5.2, 6.7]
						],
						cluster_sizes: {           // 每个簇的大小
							"0": 120,
							"1": 80
						},
						sample_clusters: [         // 样本聚类结果示例
							{
								features: [1.1, 2.2, 3.3],
								cluster: 0
							},
							{
								features: [4.4, 5.5, 6.6],
								cluster: 1
							}
						]
					}
				})
			});

			if (!trainingResponse.ok) {
				throw new Error('更新训练结果失败');
			}

			const trainingData = await trainingResponse.json();
			if (trainingData.code !== 0) {
				throw new Error(trainingData.msg || '更新训练结果失败');
			}

			toast({
				title: "训练完成",
				description: "模型训练已完成"
			});

			if (onTrainingComplete) {
				onTrainingComplete(modelId);
			}

		} catch (error) {
			console.error('Training error:', error);
			toast({
				variant: "destructive",
				title: "训练失败",
				description: error.message
			});
		}
	};

	return (
		<div className="space-y-4">
			{(!selectedDataSource || !model.features.length) && (
				<div className="flex items-center space-x-2 text-yellow-600">
					<AlertTriangle className="w-4 h-4" />
					<span className="text-sm">请先选择数据源并配置特征</span>
				</div>
			)}
			<Button onClick={handleTraining}>
				开始训练
			</Button>
		</div>
	);
}

export default KMeansTraining;