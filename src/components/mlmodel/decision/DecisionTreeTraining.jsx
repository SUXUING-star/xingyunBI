// src/components/mlmodel/DecisionTreeTraining.jsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

// 决策树实现
class DecisionTree {
	constructor(maxDepth = 5, minSamples = 2) {
		this.maxDepth = maxDepth === 'unlimited' ? 10 : parseInt(maxDepth); // 设置默认最大深度
		this.minSamples = Math.max(2, parseInt(minSamples)); // 确保最小样本数至少为2
		this.root = null;
	}

	// 计算均方误差
	calculateMSE(values) {
		const mean = values.reduce((a, b) => a + b, 0) / values.length;
		return values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
	}

	// 计算分割的信息增益
	calculateGain(parent, leftChild, rightChild) {
		const parentMSE = this.calculateMSE(parent);
		const leftMSE = this.calculateMSE(leftChild);
		const rightMSE = this.calculateMSE(rightChild);

		const leftWeight = leftChild.length / parent.length;
		const rightWeight = rightChild.length / parent.length;

		return parentMSE - (leftWeight * leftMSE + rightWeight * rightMSE);
	}

	// 寻找最佳分割点
	findBestSplit(X, y) {
		let bestGain = 0;
		let bestSplit = null;

		// 对每个特征
		for (let feature = 0; feature < X[0].length; feature++) {
			// 获取该特征的所有唯一值
			const values = [...new Set(X.map(x => x[feature]))].sort((a, b) => a - b);

			// 尝试每个可能的分割点
			for (let i = 0; i < values.length - 1; i++) {
				const threshold = (values[i] + values[i + 1]) / 2;

				// 分割数据
				const leftIndices = X.map((x, idx) => x[feature] <= threshold ? idx : -1).filter(idx => idx !== -1);
				const rightIndices = X.map((x, idx) => x[feature] > threshold ? idx : -1).filter(idx => idx !== -1);

				// 提取左右子集的目标值
				const leftY = leftIndices.map(idx => y[idx]);
				const rightY = rightIndices.map(idx => y[idx]);

				// 如果某一侧没有样本，跳过
				if (leftY.length < this.minSamples || rightY.length < this.minSamples) continue;

				// 计算信息增益
				const gain = this.calculateGain(y, leftY, rightY);

				if (gain > bestGain) {
					bestGain = gain;
					bestSplit = { feature, threshold };
				}
			}
		}

		return bestSplit;
	}

	// 构建树
	buildTree(X, y, depth = 0) {
		// 如果样本数少于阈值或达到最大深度，创建叶子节点
		if (y.length < this.minSamples * 2 || depth >= this.maxDepth) {
			return {
				value: y.reduce((a, b) => a + b, 0) / y.length,
				n_samples: y.length
			};
		}

		// 寻找最佳分割点
		const split = this.findBestSplit(X, y);

		// 如果找不到好的分割点，创建叶子节点
		if (!split) {
			return {
				value: y.reduce((a, b) => a + b, 0) / y.length,
				n_samples: y.length
			};
		}

		// 根据分割点分割数据
		const leftIndices = [];
		const rightIndices = [];

		X.forEach((x, idx) => {
			if (x[split.feature] <= split.threshold) {
				leftIndices.push(idx);
			} else {
				rightIndices.push(idx);
			}
		});

		const leftX = leftIndices.map(idx => X[idx]);
		const leftY = leftIndices.map(idx => y[idx]);
		const rightX = rightIndices.map(idx => X[idx]);
		const rightY = rightIndices.map(idx => y[idx]);

		// 创建当前节点
		return {
			feature: split.feature,
			threshold: split.threshold,
			left: this.buildTree(leftX, leftY, depth + 1),
			right: this.buildTree(rightX, rightY, depth + 1),
			n_samples: y.length
		};
	}

	// 训练模型
	train(X, y) {
		this.root = this.buildTree(X, y);
		return this;
	}

	// 预测单个样本
	predictOne(x) {
		let node = this.root;
		while (node.left && node.right) {
			if (x[node.feature] <= node.threshold) {
				node = node.left;
			} else {
				node = node.right;
			}
		}
		return node.value;
	}

	// 预测多个样本
	predict(X) {
		return X.map(x => this.predictOne(x));
	}

	// 计算特征重要性
	getFeatureImportance(numFeatures) {
		const importance = new Array(numFeatures).fill(0);

		const calculateImportance = (node, weight = 1.0) => {
			if (!node.left || !node.right) return;

			importance[node.feature] += weight;

			const childWeight = weight * 0.5;
			calculateImportance(node.left, childWeight);
			calculateImportance(node.right, childWeight);
		};

		calculateImportance(this.root);

		// 归一化
		const total = importance.reduce((a, b) => a + b, 0);
		return importance.map(x => total > 0 ? x / total : 1 / importance.length);
	}
}

// 训练组件
export function DecisionTreeTraining({ model, selectedDataSource, onTrainingComplete }) {
	const { token } = useAuth();
	const { toast } = useToast();
	const [trainingStatus, setTrainingStatus] = useState('idle');

	// 创建模型
	const createModel = async () => {
		try {
			const modelData = {
				name: model.name,
				description: model.description,
				type: 'decision_tree',
				data_source_id: selectedDataSource.id,
				features: model.features,
				target: model.target,
				parameters: {
					max_depth: parseInt(model.parameters.max_depth),     // 确保是数字
					min_samples: parseInt(model.parameters.min_samples), // 确保是数字
					auto_encode: Boolean(model.parameters.auto_encode),   // 确保是布尔值
					test_size: model.parameters.test_size
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

			const data = await response.json();
			if (data.code === 0) {
				return data.data.id;
			} else {
				throw new Error(data.msg || '创建模型失败');
			}
		} catch (error) {
			throw new Error(`创建模型失败: ${error.message}`);
		}
	};

	// saveTrainingResult 函数修改
	const saveTrainingResult = async (modelId, result) => {
		try {
			// 确保所有数值都是 Number 类型
			const formattedResult = {
				metrics: Object.fromEntries(
					Object.entries(result.metrics).map(([k, v]) => [k, Number(v)])
				),
				prediction_samples: result.prediction_samples.map(sample => ({
					actual: Number(sample.actual),
					predicted: Number(sample.predicted)
				})),
				feature_importance: Object.fromEntries(
					Object.entries(result.feature_importance).map(([k, v]) => [k, Number(v)])
				),
				tree_structure: JSON.parse(JSON.stringify(result.tree_structure))
			};

			console.log('Formatted result:', JSON.stringify(formattedResult, null, 2));

			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/mlmodels/${modelId}/result`,
				{
					method: 'PUT',
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ training_result: formattedResult })
				}
			);

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.msg || '保存训练结果失败');
			}
		} catch (error) {
			throw new Error(`保存训练结果失败: ${error.message}`);
		}
	};

	// 编码分类特征
	const encodeFeatures = (data) => {
		const encodingMaps = {};
		const encodedData = JSON.parse(JSON.stringify(data));

		[...model.features, model.target].forEach(feature => {
			const index = selectedDataSource.headers.indexOf(feature);
			if (index === -1) return;

			// 检查是否需要编码
			const needsEncoding = data.some(row => isNaN(Number(row[index])));

			if (needsEncoding) {
				const uniqueValues = [...new Set(data.map(row => row[index]))];
				encodingMaps[feature] = Object.fromEntries(
					uniqueValues.map((value, i) => [value, i])
				);

				encodedData.forEach(row => {
					row[index] = encodingMaps[feature][row[index]];
				});
			}
		});

		return { encodedData, encodingMaps };
	};

	// 计算评估指标
	const calculateMetrics = (actual, predicted) => {
		const mse = actual.reduce((sum, y, i) =>
			sum + Math.pow(y - predicted[i], 2), 0
		) / actual.length;

		const rmse = Math.sqrt(mse);

		const mean = actual.reduce((a, b) => a + b, 0) / actual.length;
		const total = actual.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
		const r2 = total === 0 ? 0 : 1 - (mse * actual.length) / total;

		return { mse, rmse, r2 };
	};

	// 训练模型
	const trainModel = async () => {
		if (!selectedDataSource?.content?.length) {
			toast({
				variant: "destructive",
				title: "错误",
				description: '数据源为空'
			});
			return;
		}

		setTrainingStatus('training');
		let modelId = null;

		try {
			// 1. 特征编码
			const { encodedData } = model.parameters.auto_encode ?
				encodeFeatures(selectedDataSource.content) :
				{ encodedData: selectedDataSource.content };

			// 2. 准备训练数据
			const features = encodedData.map(row =>
				model.features.map(f => {
					const val = Number(row[selectedDataSource.headers.indexOf(f)]);
					if (isNaN(val)) throw new Error(`特征 ${f} 包含非数值数据`);
					return val;
				})
			);

			const target = encodedData.map(row => {
				const val = Number(row[selectedDataSource.headers.indexOf(model.target)]);
				if (isNaN(val)) throw new Error(`目标列 ${model.target} 包含非数值数据`);
				return val;
			});

			// 3. 分割训练集和测试集
			const splitIndex = Math.floor(features.length * 0.8);
			const X_train = features.slice(0, splitIndex);
			const X_test = features.slice(splitIndex);
			const y_train = target.slice(0, splitIndex);
			const y_test = target.slice(splitIndex);

			// 4. 创建并训练模型
			const dt = new DecisionTree(
				parseInt(model.parameters.max_depth),
				parseInt(model.parameters.min_samples)
			); 
			dt.train(X_train, y_train);

			// 5. 进行预测
			const predictions = dt.predict(X_test);

			// 6. 计算评估指标
			const metrics = calculateMetrics(y_test, predictions);

			// 7. 获取特征重要性
			const importance = dt.getFeatureImportance(model.features.length);
			const featureImportance = Object.fromEntries(
				model.features.map((f, i) => [f, importance[i]])
			);

			// 8. 创建模型
			modelId = await createModel();

			// 9. 保存训练结果
			const result = {
				metrics: metrics,
				prediction_samples: y_test.map((actual, i) => ({
					actual: Number(actual),
					predicted: Number(predictions[i])
				})),
				feature_importance: featureImportance,
				tree_structure: JSON.parse(JSON.stringify(dt.root)) // 确保树结构能被序列化
			};
			// 保存训练结果时打印日志
			console.log('Saving training result:', JSON.stringify(result, null, 2));

			await saveTrainingResult(modelId, result);

			setTrainingStatus('completed');
			toast({
				title: "训练完成",
				description: "模型训练完成并保存结果"
			});

			if (onTrainingComplete) {
				onTrainingComplete(modelId);
			}

		} catch (error) {
			console.error('Training error:', error);

			if (modelId) {
				try {
					await fetch(`${import.meta.env.VITE_API_URL}/api/mlmodels/${modelId}`, {
						method: 'DELETE',
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});
				} catch (e) {
					console.error('Error deleting failed model:', e);
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

export default DecisionTreeTraining;