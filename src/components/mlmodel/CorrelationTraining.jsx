// src/components/mlmodel/CorrelationTraining.jsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export function CorrelationTraining({ model, selectedDataSource, onTrainingComplete }) {
	const { token } = useAuth();
	const { toast } = useToast();
	const [trainingStatus, setTrainingStatus] = useState('idle');

	// 计算相关性
	const calculateCorrelation = (x, y) => {
		try {
			const n = x.length;
			const sum_x = x.reduce((a, b) => a + b, 0);
			const sum_y = y.reduce((a, b) => a + b, 0);
			const sum_xy = x.reduce((acc, curr, idx) => acc + curr * y[idx], 0);
			const sum_x2 = x.reduce((acc, curr) => acc + curr * curr, 0);
			const sum_y2 = y.reduce((acc, curr) => acc + curr * curr, 0);

			const numerator = n * sum_xy - sum_x * sum_y;
			const denominator = Math.sqrt((n * sum_x2 - sum_x * sum_x) * (n * sum_y2 - sum_y * sum_y));

			if (denominator === 0) return 0;

			return numerator / denominator;
		} catch (error) {
			console.error('Correlation calculation error:', error);
			return 0;
		}
	};

	// 创建新模型
	const createModel = async () => {
		try {
			if (!selectedDataSource?.id) {
				throw new Error('请选择数据源');
			}

			const modelData = {
				name: model.name || '未命名模型',
				description: model.description || '',
				type: 'correlation',
				data_source_id: selectedDataSource.id,
				features: model.features,
				target: model.target,
				parameters: {
					auto_encode: model.parameters.auto_encode, 
					test_size: model.parameters.test_size,
				}
			};

			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mlmodels`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(modelData)
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.msg || '创建模型失败');
			}

			const data = await response.json();
			if (data.code === 0 && data.data) {
				return data.data.id;
			} else {
				throw new Error(data.msg || '创建模型失败');
			}
		} catch (error) {
			console.error('Error creating model:', error);
			throw error;
		}
	};

	// 保存训练结果
	const saveTrainingResult = async (result, modelId) => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/mlmodels/${modelId}/result`,
				{
					method: 'PUT',
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ training_result: result })
				}
			);

			if (!response.ok) {
				throw new Error('保存训练结果失败');
			}
		} catch (error) {
			console.error('Save error:', error);
			throw error;
		}
	};

	// 训练模型（计算相关性）
	const trainModel = async () => {
		if (!selectedDataSource?.content || selectedDataSource.content.length === 0) {
			toast({
				variant: "destructive",
				title: "错误",
				description: '数据源内容为空'
			});
			return;
		}

		setTrainingStatus('training');
		let modelId = null;

		try {
			// 获取所有特征数据
			const allFeatures = [...model.features];
			if (!allFeatures.includes(model.target)) {
				allFeatures.push(model.target);
			}

			// 将所有特征数据转换为数值数组
			const featureData = {};
			allFeatures.forEach(feature => {
				const index = selectedDataSource.headers.indexOf(feature);
				if (index === -1) throw new Error(`特征 ${feature} 不存在`);

				const values = selectedDataSource.content.map(row => {
					const value = Number(row[index]);
					if (isNaN(value)) throw new Error(`特征 ${feature} 包含非数值数据`);
					return value;
				});
				featureData[feature] = values;
			});

			// 计算相关性矩阵
			const correlation_matrix = {};
			allFeatures.forEach(feature1 => {
				correlation_matrix[feature1] = {};
				allFeatures.forEach(feature2 => {
					const correlation = calculateCorrelation(
						featureData[feature1],
						featureData[feature2]
					);
					correlation_matrix[feature1][feature2] = Number(correlation.toFixed(4));
				});
			});

			// 准备结果
			const result = {
				correlation_matrix: correlation_matrix
			};

			// 保存模型和结果
			modelId = await createModel();
			await saveTrainingResult(result, modelId);

			setTrainingStatus('completed');
			toast({
				title: "分析完成",
				description: "相关性分析已完成并保存结果"
			});

			if (onTrainingComplete) {
				onTrainingComplete(modelId);
			}

		} catch (error) {
			console.error('Analysis error:', error);

			// 如果模型创建了但分析失败，删除该模型
			if (modelId) {
				try {
					await fetch(`${import.meta.env.VITE_API_URL}/api/mlmodels/${modelId}`, {
						method: 'DELETE',
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});
				} catch (deleteError) {
					console.error('Error deleting failed model:', deleteError);
				}
			}

			setTrainingStatus('error');
			toast({
				variant: "destructive",
				title: "分析失败",
				description: error.message
			});
		}
	};

	return (
		<Button
			onClick={trainModel}
			disabled={trainingStatus === 'training' || !model.features.length || !model.target}
			className="w-full"
		>
			{trainingStatus === 'training' ? '分析中...' : '开始分析'}
		</Button>
	);
}

export default CorrelationTraining;