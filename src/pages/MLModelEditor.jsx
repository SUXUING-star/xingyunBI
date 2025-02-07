// src/components/mlmodel/MLModelEditor.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { FieldSelector } from '@/components/FieldSelector';
import { DropZone } from '@/components/DropZone';
import { DataSourcePreview } from '@/components/DataSourcePreview';
import { LinearRegressionTraining } from '@/components/mlmodel/LinearRegressionTraining';
import { CorrelationTraining } from '@/components/mlmodel/CorrelationTraining';
import { DecisionTreeTraining } from '@/components/mlmodel/DecisionTreeTraining';
import { KMeansTraining } from "@/components/mlmodel/KMeansTraining";
import { AlertTriangle } from 'lucide-react';

export function MLModelEditor() {
	const { id } = useParams();
	const { token } = useAuth();
	const navigate = useNavigate();
	const { toast } = useToast();

	const [model, setModel] = useState({
		name: '',
		description: '',
		type: 'linear_regression',
		dataSourceId: '',
		features: [],
		target: '',
		parameters: {
			// 通用参数
			auto_encode: true,
			test_size: 0.2,

			// 线性回归参数
			regularization: 'none',
			alpha: 0.01,

			// 决策树参数
			max_depth: 10,    // 数字类型
			min_samples: 2,   // 数字类型

			// K-means参数
			n_clusters: 3,    // 数字类型
			max_iter: 300,    // 数字类型
		},
	});

	const [dataSources, setDataSources] = useState([]);
	const [selectedDataSource, setSelectedDataSource] = useState(null);
	const [showPreview, setShowPreview] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	// 获取数据源列表
	useEffect(() => {
		fetchDataSources();
	}, []);

	const fetchDataSources = async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/datasources`, {
				headers: { 'Authorization': `Bearer ${token}` }
			});
			const data = await response.json();

			if (data.code === 0) {
				setDataSources(data.data || []);
			} else {
				throw new Error(data.msg || '获取数据源失败');
			}
		} catch (error) {
			console.error('Error fetching data sources:', error);
			toast({
				variant: 'destructive',
				title: "获取失败",
				description: error.message,
			});
		}
	};

	// 获取已有模型数据
	useEffect(() => {
		if (id) {
			fetchModelData();
		}
	}, [id]);

	const fetchModelData = async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mlmodels/${id}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			const data = await response.json();
			if (data.code === 0) {
				setModel(data.data);
				setIsEditing(!!data.data.training_result);
				// 如果有数据源ID，设置选中的数据源
				if (data.data.data_source_id) {
					const ds = dataSources.find(ds => ds.id === data.data.data_source_id);
					setSelectedDataSource(ds);
				}
			}
		} catch (error) {
			console.error('Error fetching model:', error);
			toast({
				variant: "destructive",
				title: "获取失败",
				description: error.message
			});
		}
	};

	// 更新模型基本信息
	const handleUpdate = async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mlmodels/${id}`, {
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: model.name,
					description: model.description
				})
			});

			if (!response.ok) {
				throw new Error('更新失败');
			}

			toast({
				title: "更新成功",
				description: "模型信息已更新"
			});
			navigate(`/mlmodels/${id}`);
		} catch (error) {
			toast({
				variant: "destructive",
				title: "更新失败",
				description: error.message
			});
		}
	};

	const handleFeatureDrop = (field) => {
		if (!model.features.includes(field)) {
			setModel(prev => ({
				...prev,
				features: [...prev.features, field]
			}));
		}
	};

	const handleTargetDrop = (field) => {
		setModel(prev => ({
			...prev,
			target: field
		}));
	};

	const handleFeatureRemove = (field) => {
		setModel(prev => ({
			...prev,
			features: prev.features.filter(f => f !== field)
		}));
	};

	const handleTargetRemove = () => {
		setModel(prev => ({
			...prev,
			target: ''
		}));
	};

	const renderModelParameters = () => {
		switch (model.type) {
			case 'linear_regression':
				return (
					<div className="space-y-4">
						<div>
							<Label>正则化</Label>
							<Select
								value={model.parameters.regularization}
								onValueChange={(value) =>
									setModel({
										...model,
										parameters: { ...model.parameters, regularization: value },
									})
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">无</SelectItem>
									<SelectItem value="l1">L1</SelectItem>
									<SelectItem value="l2">L2</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>测试集比例</Label>
							<Select
								value={String(model.parameters.test_size)}
								onValueChange={(value) =>
									setModel({
										...model,
										parameters: { ...model.parameters, test_size: Number(value) },
									})
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="0.1">10%</SelectItem>
									<SelectItem value="0.2">20%</SelectItem>
									<SelectItem value="0.3">30%</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>正则化参数 (Alpha)</Label>
							<Select
								value={String(model.parameters.alpha)}
								onValueChange={(value) =>
									setModel({
										...model,
										parameters: { ...model.parameters, alpha: Number(value) },
									})
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="0.01">0.01</SelectItem>
									<SelectItem value="0.1">0.1</SelectItem>
									<SelectItem value="1.0">1.0</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center space-x-2">
							<Checkbox
								id="auto-encode"
								checked={model.parameters.auto_encode}
								onCheckedChange={(checked) =>
									setModel({
										...model,
										parameters: { ...model.parameters, auto_encode: checked },
									})
								}
							/>
							<Label htmlFor="auto-encode">自动对分类特征进行数值编码</Label>
						</div>
					</div>
				);
			case 'decision_tree':
				return (
					<div className="space-y-4">
						<div>
							<Label>最大深度</Label>
							<Select
								value={model.parameters.max_depth.toString()}
								onValueChange={(value) =>
									setModel({
										...model,
										parameters: {
											...model.parameters,
											max_depth: parseInt(value)  // 确保转换为数字
										},
									})
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="3">3</SelectItem>
									<SelectItem value="5">5</SelectItem>
									<SelectItem value="7">7</SelectItem>
									<SelectItem value="10">10 (不限制)</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>最小样本分割数</Label>
							<Select
								value={model.parameters.min_samples.toString()}
								onValueChange={(value) =>
									setModel({
										...model,
										parameters: {
											...model.parameters,
											min_samples: parseInt(value)  // 确保转换为数字
										},
									})
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="2">2</SelectItem>
									<SelectItem value="5">5</SelectItem>
									<SelectItem value="10">10</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>测试集比例</Label>
							<Select
								value={String(model.parameters.test_size)}
								onValueChange={(value) =>
									setModel({
										...model,
										parameters: { ...model.parameters, test_size: Number(value) },
									})
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="0.1">10%</SelectItem>
									<SelectItem value="0.2">20%</SelectItem>
									<SelectItem value="0.3">30%</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center space-x-2">
							<Checkbox
								id="auto-encode"
								checked={model.parameters.auto_encode}
								onCheckedChange={(checked) =>
									setModel({
										...model,
										parameters: { ...model.parameters, auto_encode: checked },
									})
								}
							/>
							<Label htmlFor="auto-encode">自动对分类特征进行数值编码</Label>
						</div>
					</div>
				);
			case 'correlation':
				return (
					<div className="space-y-4">
						<div className="flex items-center space-x-2">
							<Checkbox
								id="auto-encode"
								checked={model.parameters.auto_encode}
								onCheckedChange={(checked) =>
									setModel({
										...model,
										parameters: { ...model.parameters, auto_encode: checked },
									})
								}
							/>
							<Label htmlFor="auto-encode">自动对分类特征进行数值编码</Label>
						</div>
					</div>
				);
			case 'kmeans':
				return (
					<div className="space-y-4">
						<div>
							<Label>聚类数量 (K)</Label>
							<Select
								value={String(model.parameters.n_clusters)}
								onValueChange={(value) =>
									setModel({
										...model,
										parameters: { ...model.parameters, n_clusters: Number(value) },
									})
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{[2, 3, 4, 5, 6, 7, 8].map(k => (
										<SelectItem key={k} value={k.toString()}>{k}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>最大迭代次数</Label>
							<Select
								value={String(model.parameters.max_iter)}
								onValueChange={(value) =>
									setModel({
										...model,
										parameters: { ...model.parameters, max_iter: Number(value) },
									})
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="100">100</SelectItem>
									<SelectItem value="300">300</SelectItem>
									<SelectItem value="500">500</SelectItem>
									<SelectItem value="1000">1000</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center space-x-2">
							<Checkbox
								id="auto-encode"
								checked={model.parameters.auto_encode}
								onCheckedChange={(checked) =>
									setModel({
										...model,
										parameters: { ...model.parameters, auto_encode: checked },
									})
								}
							/>
							<Label htmlFor="auto-encode">自动对分类特征进行数值编码</Label>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	const renderTrainingButton = () => {
		if (isEditing) {
			return (
				<Button onClick={handleUpdate}>保存修改</Button>
			);
		}

		switch (model.type) {
			case 'linear_regression':
				return (
					<LinearRegressionTraining
						model={model}
						selectedDataSource={selectedDataSource}
						onTrainingComplete={(modelId) => navigate(`/mlmodels/${modelId}`)}
					/>
				);
			case 'correlation':
				return (
					<CorrelationTraining
						model={model}
						selectedDataSource={selectedDataSource}
						onTrainingComplete={(modelId) => navigate(`/mlmodels/${modelId}`)}
					/>
				);
			case 'decision_tree':
				return (
					<DecisionTreeTraining
						model={model}
						selectedDataSource={selectedDataSource}
						onTrainingComplete={(modelId) => navigate(`/mlmodels/${modelId}`)}
					/>
				);
			case 'kmeans':
				return (
					<KMeansTraining
						model={model}
						selectedDataSource={selectedDataSource}
						onTrainingComplete={(modelId) => navigate(`/mlmodels/${modelId}`)}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<DndProvider backend={HTML5Backend}>
			<div className="container mx-auto p-4">
				<Card>
					<CardHeader>
						<CardTitle>
							{isEditing ? '编辑模型' : '创建模型'}
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-12 gap-6">
							{/* 左侧输入区域 */}
							<div className="col-span-5 space-y-4">
								{/* 基本信息 */}
								<div>
									<Label>模型名称</Label>
									<Input
										value={model.name}
										onChange={(e) => setModel({ ...model, name: e.target.value })}
										placeholder="请输入模型名称"
									/>
								</div>

								<div>
									<Label>模型描述</Label>
									<Textarea
										value={model.description}
										onChange={(e) => setModel({ ...model, description: e.target.value })}
										placeholder="请输入模型描述..."
										className="h-24"
									/>
								</div>

								{/* 仅在新建时显示以下内容 */}
								{!isEditing && (
									<>
										<div>
											<Label>模型类型</Label>
											<Select
												value={model.type}
												onValueChange={(value) => {
													setModel({
														...model,
														type: value,
														// 如果选择kmeans，清除target字段
														target: value === 'kmeans' ? '' : model.target,
													});
												}}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="linear_regression">线性回归</SelectItem>
													<SelectItem value="correlation">相关性分析</SelectItem>
													<SelectItem value="decision_tree">决策树</SelectItem>
													<SelectItem value="kmeans">K-means聚类</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<div>
											<Label>数据源</Label>
											<div className="flex gap-2">
												<div className="flex-1">
													<Select
														value={model.dataSourceId}
														onValueChange={(value) => {
															setModel({
																...model,
																dataSourceId: value,
																features: [], // 清空特征
																target: ''    // 清空目标列
															});
															const ds = dataSources.find(ds => ds.id === value);
															setSelectedDataSource(ds);
														}}
													>
														<SelectTrigger className="w-full">
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{dataSources.map((ds) => (
																<SelectItem key={ds.id} value={ds.id}>
																	{ds.name}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
												<Button
													variant="outline"
													onClick={() => setShowPreview(true)}
													disabled={!selectedDataSource}
												>
													预览数据
												</Button>
											</div>
										</div>

										{/* 模型参数设置 */}
										{renderModelParameters()}

										{/* 底部按钮 */}
										<div className="flex justify-start gap-4 pt-4">
											<Button variant="outline" onClick={() => navigate('/mlmodels')}>
												取消
											</Button>
											{renderTrainingButton()}
										</div>

									</>
								)}
							</div>

							{/* 右侧拖放区域 */}
							<div className="col-span-7 space-y-4">
								{selectedDataSource && !isEditing ? (
									<div>
										<div className="mb-4">
											<FieldSelector
												headers={selectedDataSource.headers || []}
												selectedFields={[...model.features, model.target].filter(Boolean)}
											/>
										</div>
										<DropZone
											label="特征列"
											acceptedTypes={['FIELD']}
											fields={model.features}
											onDrop={handleFeatureDrop}
											onRemove={handleFeatureRemove}
										/>
										{model.type !== 'kmeans' && (
											<DropZone
												label="目标列"
												acceptedTypes={['FIELD']}
												fields={model.target ? [model.target] : []}
												onDrop={handleTargetDrop}
												onRemove={handleTargetRemove}
												maxFields={1}
											/>
										)}
									</div>
								) : !selectedDataSource && !isEditing ? (
									<div className="bg-gray-50 rounded-md p-6 flex items-center justify-center">
										<AlertTriangle className="w-6 h-6 text-gray-400 mr-2" />
										<span className="text-gray-500 text-sm">
											请先选择数据源以配置模型
										</span>
									</div>
								) : isEditing && (
									<div className="space-y-4">
										<div>
											<Label className="block mb-2">已选特征列</Label>
											<div className="p-4 bg-gray-50 rounded-md">
												{model.features.map((feature) => (
													<span key={feature} className="inline-block px-3 py-1 m-1 bg-blue-100 text-blue-700 rounded">
														{feature}
													</span>
												))}
											</div>
										</div>
										{model.type !== 'kmeans' && (
											<div>
												<Label className="block mb-2">已选目标列</Label>
												<div className="p-4 bg-gray-50 rounded-md">
													<span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded">
														{model.target}
													</span>
												</div>
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* 数据预览对话框 */}
				<DataSourcePreview
					isOpen={showPreview}
					onClose={() => setShowPreview(false)}
					dataSource={selectedDataSource}
				/>
			</div>
		</DndProvider>
	);
}

export default MLModelEditor;