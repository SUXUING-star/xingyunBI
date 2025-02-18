// src/components/mlmodel/LinearRegressionTraining.jsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { SimpleLinearRegression, MultivariateLinearRegression } from 'ml-regression';

export function LinearRegressionTraining({ model, selectedDataSource, onTrainingComplete }) {
	const { token } = useAuth();
	const { toast } = useToast();
	const [trainingStatus, setTrainingStatus] = useState('idle');

	// 评估指标计算
	const calculateMetrics = (actual, predicted) => {
		const mse = actual.reduce((sum, y, i) =>
			sum + Math.pow(Number(y) - Number(predicted[i]), 2), 0
		) / actual.length;

		const rmse = Math.sqrt(mse);

		const mean = actual.reduce((sum, y) => sum + Number(y), 0) / actual.length;
		const r2 = 1 - (mse * actual.length) / actual.reduce((sum, y) =>
			sum + Math.pow(Number(y) - mean, 2), 0
		);

		return {
			metrics: {
				mse,
				rmse,
				r2
			}
		};
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
				type: 'linear_regression',
				data_source_id: selectedDataSource.id,
				features: model.features,
				target: model.target,
				parameters: {
					regularization: model.parameters.regularization,
					alpha: model.parameters.alpha,
					test_size: model.parameters.test_size,
					auto_encode: model.parameters.auto_encode  // 改这里
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

	// 训练模型
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
			// 准备训练数据
			const features = selectedDataSource.content.map(row =>
				model.features.map(feature => {
					const index = selectedDataSource.headers.indexOf(feature);
					const value = Number(row[index]);
					if (isNaN(value)) throw new Error(`特征 ${feature} 包含非数值数据`);
					return value;
				})
			);

			const target = selectedDataSource.content.map(row => {
				const index = selectedDataSource.headers.indexOf(model.target);
				const value = Number(row[index]);
				if (isNaN(value)) throw new Error(`目标列 ${model.target} 包含非数值数据`);
				return value;
			});

			// 数据集分割
			const splitIndex = Math.floor(features.length * 0.8);
			const X_train = features.slice(0, splitIndex);
			const X_test = features.slice(splitIndex);
			const y_train = target.slice(0, splitIndex);
			const y_test = target.slice(splitIndex);

			// 训练模型
			let regression;
			if (model.features.length === 1) {
				regression = new SimpleLinearRegression(X_train.map(x => x[0]), y_train);
			} else {
				// 将y_train转换为二维数组格式 [[y1], [y2], ...]
				const y_train_matrix = y_train.map(y => [y]);
				regression = new MultivariateLinearRegression(X_train, y_train_matrix);
			}

			// 预测和评估
			const predictions = X_test.map(x => {
				const pred = regression.predict(x);
				return Array.isArray(pred) ? pred[0] : pred;
			});

			const metrics = calculateMetrics(y_test, predictions);

			// 准备结果
			const result = {
				metrics: metrics.metrics,
				prediction_samples: y_test.map((actual, i) => ({
					actual: Number(actual),
					predicted: Number(predictions[i])
				})),
				model_params: regression.coefficients ? [
					{
						name: 'coefficients',
						value: regression.coefficients
					},
					{
						name: 'intercept',
						value: regression.intercept
					}
				] : []
			};
			console.log("result", result)

			// 保存模型和结果
			modelId = await createModel();
			await saveTrainingResult(result, modelId);

			setTrainingStatus('completed');
			toast({
				title: "训练完成",
				description: "模型训练已完成并保存结果"
			});

			if (onTrainingComplete) {
				onTrainingComplete(modelId);
			}

		} catch (error) {
			console.error('Training error:', error);

			// 如果模型创建了但训练失败，删除该模型
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
				title: "训练失败",
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
			{trainingStatus === 'training' ? '训练中...' : '开始训练'}
		</Button>
	);
}

export default LinearRegressionTraining;