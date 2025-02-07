// src/components/ChartPreview.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ResponsiveContainer } from 'recharts';
import { ChartRenderer } from './ChartRenderer';

export function ChartPreview({ chart }) {
	const { token } = useAuth();
	const [loading, setLoading] = useState(false);
	const [chartData, setChartData] = useState([]);

	useEffect(() => {
		const fetchAndProcessData = async () => {
			if (!chart?.dataSourceId) {
				console.log('等待选择数据源...');
				return;
			}

			try {
				setLoading(true);
				const response = await fetch(`${import.meta.env.VITE_API_URL}/api/datasources/${chart.dataSourceId}`, {
					headers: { 'Authorization': `Bearer ${token}` }
				});

				const result = await response.json();
				if (!result.data?.content?.length) {
					console.log('数据源为空');
					return;
				}

				// 转换数据结构
				const rawData = result.data.content.map(row => {
					const obj = {};
					result.data.headers.forEach((header, index) => {
						obj[header] = row[index];
					});
					return obj;
				});

				// 应用预处理配置
				let processedData = rawData;
				if (result.data.preprocessing?.length > 0) {
					processedData = applyPreprocessing(processedData, result.data.preprocessing);
				}

				// 根据图表配置处理数据
				const finalData = processChartData(processedData, chart.config);
				setChartData(finalData);
			} catch (error) {
				console.error('获取或处理数据失败:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchAndProcessData();
	}, [chart?.dataSourceId, chart?.config]);

	const applyPreprocessing = (data, preprocessing) => {
		return data.map(row => {
			const processed = { ...row };
			preprocessing.forEach(config => {
				if (!processed[config.field]) return;

				switch (config.type) {
					case 'number':
						const value = processed[config.field].replace(/[^\d.-]/g, '');
						processed[config.field] = parseFloat(value) || 0;
						break;
					case 'date':
						try {
							const date = new Date(processed[config.field]);
							processed[config.field] = date.toISOString().split('T')[0];
						} catch (e) {
							console.error('Date parsing error:', e);
						}
						break;
				}
			});
			return processed;
		});
	};

	const processChartData = (data, config) => {
		if (!config?.dimensions?.[0]?.field || !config?.metrics?.[0]?.field) {
			return [];
		}

		const dimension = config.dimensions[0].field;
		const metrics = config.metrics.map(m => m.field);

		// 获取所有需要保留的字段
		const fieldsToKeep = new Set([
			dimension,
			...metrics,
			...(config.visualMap?.labelFields || [])
		]);

		// 根据维度分组并保留所有需要的字段
		const groupedData = data.reduce((acc, row) => {
			const key = row[dimension];
			if (!acc[key]) {
				acc[key] = {
					[dimension]: key
				};

				// 初始化所有需要保留的字段
				fieldsToKeep.forEach(field => {
					if (field !== dimension) {
						acc[key][field] = 0;
					}
				});
			}

			// 更新度量值
			metrics.forEach(metric => {
				acc[key][metric] = (parseFloat(acc[key][metric]) || 0) + (parseFloat(row[metric]) || 0);
			});

			// 更新标签字段值（使用最新值）
			config.visualMap?.labelFields?.forEach(field => {
				if (!metrics.includes(field)) {
					acc[key][field] = row[field];
				}
			});

			return acc;
		}, {});

		return Object.values(groupedData);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
			</div>
		);
	}

	if (!chartData.length) {
		return (
			<div className="flex items-center justify-center h-full text-gray-500">
				{chart?.config?.dimensions?.[0]?.field && chart?.config?.metrics?.[0]?.field
					? '暂无数据'
					: '请拖拽字段到相应的区域'}
			</div>
		);
	}

	return (
		<ResponsiveContainer width="100%" height="100%">
			<ChartRenderer
				type={chart.type}
				data={chartData}
				config={chart.config}
				loading={loading}
			/>
		</ResponsiveContainer>
	);
}