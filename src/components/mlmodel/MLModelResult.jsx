// src/components/mlmodel/MLModelResult.jsx
import React from 'react';
import { RegressionResult } from './linearregression/RegressionResult';
import { CorrelationResult } from './correlation/CorrelationResult';
import { DecisionTreeResult } from './decision/DecisionTreeResult';
import { KMeansResult } from './kmeans/KMeansResult';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function MLModelResult({ result, modelType, features, target }) {
	if (!result) return null;

	return (
		<div className="grid grid-cols-12 gap-6">
			{/* 左侧 - 变量信息 */}
			<div className="col-span-2">
				<Card className="h-full">
					<CardHeader>
						<CardTitle>变量信息</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<h3 className="text-sm font-medium text-gray-500 mb-2">特征变量</h3>
								<ul className="space-y-1">
									{features.map((feature) => (
										<li key={feature} className="text-sm">{feature}</li>
									))}
								</ul>
							</div>
							{/* 只在非K-means模型下显示目标变量 */}
							{modelType !== 'kmeans' && (
								<div>
									<h3 className="text-sm font-medium text-gray-500 mb-2">目标变量</h3>
									<strong className="text-sm">{target}</strong>
								</div>
							)}
							{/* K-means特有的信息 */}
							{modelType === 'kmeans' && result?.cluster_sizes && (
								<div>
									<h3 className="text-sm font-medium text-gray-500 mb-2">聚类分布</h3>
									<ul className="space-y-1">
										{Object.entries(result.cluster_sizes).map(([cluster, size]) => (
											<li key={cluster} className="text-sm">
												簇 {cluster}: {size} 个样本
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* 中间 - 图表区域 */}
			<div className="col-span-7">
				{modelType === 'linear_regression' && (
					<RegressionResult predictionSamples={result?.prediction_samples} />
				)}
				{modelType === 'correlation' && (
					<CorrelationResult correlationMatrix={result?.correlation_matrix} />
				)}
				{modelType === 'decision_tree' && (
					<DecisionTreeResult result={result} />
				)}
				{modelType === 'kmeans' && (
					<KMeansResult result={result} />
				)}
			</div>

			{/* 右侧 - 评估指标 */}
			<div className="col-span-3">
				{result?.metrics && (
					<Card className="h-full">
						<CardHeader>
							<CardTitle>评估指标</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{Object.entries(result.metrics).map(([key, value]) => (
									<div key={key} className="p-4 bg-gray-50 rounded-lg">
										<div className="text-sm text-muted-foreground mb-1">
											{key === 'mse' ? '均方误差' :
												key === 'rmse' ? '均方根误差' :
													key === 'r2' ? '决定系数' : key.toUpperCase()}
										</div>
										<div className="text-2xl font-bold">
											{typeof value === 'number' ? value.toFixed(4) : 'N/A'}
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}