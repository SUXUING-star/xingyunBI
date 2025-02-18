import React from 'react';
import {
	ComposedChart, XAxis, YAxis, CartesianGrid,
	Tooltip, Legend, ResponsiveContainer,
	Line, Bar, Cell, Scatter, Area
} from 'recharts';
import { CustomTooltip } from '../tooltip/CustomTooltip';
import { SingleAxisChart } from './charts/SingleAxisChart';
import { CHART_COLORS, CHART_CONFIG, calculateColorValue } from '../utils/chartUtils';
import { motion } from 'framer-motion';
import { chartAnimationProps } from "../config/ChartAnimationConfig"

// 扩展支持的图表类型
const CHART_COMPONENTS = {
	'line': Line,
	'bar': Bar,
	'scatter': Scatter,
	'area': Area
};

// 定义图表渲染顺序
const RENDER_ORDER = ['bar', 'area', 'scatter', 'line'];

// 定义每种图表类型的默认属性
const CHART_TYPE_PROPS = {
	line: {
		type: "monotone",
		strokeWidth: 2,
		dot: true
	},
	bar: {
		maxBarSize: 50
	},
	scatter: {
		fill: "#8884d8",
		radius: 5
	},
	area: {
		fillOpacity: 0.3,
		strokeWidth: 2
	}
};

export const ChartRenderer = ({
	type,
	data,
	config,
	title,
	loading = false,
	className = ''
}) => {
	if (loading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
			</div>
		);
	}

	if (!data?.length || !config) {
		return (
			<div className="flex items-center justify-center h-full text-gray-500">
				暂无数据
			</div>
		);
	}

	const dimension = config?.dimensions?.[0]?.field;
	const metric = config?.metrics?.[0]?.field;
	const labelFields = config?.visualMap?.labelFields || [];

	if (!dimension || !metric) {
		return (
			<div className="flex items-center justify-center h-full text-gray-500">
				图表配置不完整
			</div>
		);
	}

	// 渲染多轴图表
	const renderDualAxisChart = () => {
		const axisColors = {
			bar: ['#1890ff', '#13c2c2', '#722ed1', '#eb2f96', '#faad14', '#52c41a'],
			line: ['#52c41a', '#722ed1', '#2f54eb', '#faad14', '#eb2f96', '#13c2c2'],
			scatter: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#d0ed57'],
			area: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#d0ed57']
		};

		// 按图表类型分组指标
		const metricsByType = config.metrics.reduce((acc, metric, index) => {
			const type = config.dualAxis?.types?.[index] || 'line';
			if (!acc[type]) acc[type] = [];
			acc[type].push({ metric, index });
			return acc;
		}, {});

		// 计算所有指标的全局值范围
		const allValues = data.reduce((vals, item) => {
			config.metrics.forEach(metric => {
				vals.push(parseFloat(item[metric.field]) || 0);
			});
			return vals;
		}, []);

		const globalRange = {
			min: Math.min(...allValues, 0),
			max: Math.max(...allValues)
		};

		const padding = (globalRange.max - globalRange.min) * 0.1;
		const isMultiAxis = config.metrics.length > 2;

		return (
			<ComposedChart {...CHART_CONFIG.commonProps} data={data}>
				<CartesianGrid {...CHART_CONFIG.grid} />
				<XAxis {...CHART_CONFIG.axis} dataKey={dimension} />

				{/* 渲染Y轴 */}
				{isMultiAxis ? (
					// 三轴及以上使用统一Y轴
					<YAxis
						{...CHART_CONFIG.axis}
						yAxisId="unified"
						orientation="left"
						domain={[0, globalRange.max + padding]}
						interval={0}
						allowDecimals={false}
					/>
				) : (
					// 双轴使用左右两个Y轴
					Object.entries(metricsByType).map(([type, metrics], typeIndex) => (
						<YAxis
							key={`y-axis-${type}`}
							{...CHART_CONFIG.axis}
							yAxisId={type}
							orientation={typeIndex % 2 === 0 ? 'left' : 'right'}
							stroke={axisColors[type][0]}
							domain={[0, globalRange.max + padding]}
							interval={0}
							allowDecimals={false}
						/>
					))
				)}

				<Tooltip content={<CustomTooltip labelFields={labelFields} />} />
				<Legend />

				{/* 按照定义的顺序渲染图表元素 */}
				{RENDER_ORDER.map(orderType => {
					if (!metricsByType[orderType]) return null;

					return metricsByType[orderType].map(({ metric, index }, colorIndex) => {
						const ChartComponent = CHART_COMPONENTS[orderType];
						const typeProps = CHART_TYPE_PROPS[orderType];

						return (
							<ChartComponent
								key={`${orderType}-${metric.field}`}
								yAxisId={isMultiAxis ? "unified" : orderType}
								dataKey={metric.field}
								name={metric.alias || metric.field}
								{...typeProps}
								{...(orderType === 'bar' ? {
									fill: axisColors[orderType][colorIndex]
								} : {
									stroke: axisColors[orderType][colorIndex]
								})}
							>
								{orderType === 'bar' && config?.visualMap?.colorField && data.map((entry, i) => (
									<Cell
										key={`cell-${i}`}
										fill={calculateColorValue(
											entry[config.visualMap.colorField],
											data.map(d => d[config.visualMap.colorField]),
											[axisColors[orderType][colorIndex], axisColors[orderType][colorIndex].replace('ff', '33')]
										)}
									/>
								))}
							</ChartComponent>
						);
					});
				})}
			</ComposedChart>
		);
	};

	return (
		<motion.div
			{...chartAnimationProps}
			className={`w-full h-full overflow-hidden flex flex-col ${className}`}
		>
			{title && (
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
					className="text-sm font-medium mb-2"
				>
					{title}
				</motion.div>
			)}
			<motion.div
				className="w-full h-full flex flex-col"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3 }}
			>
				<div className="flex-1">
					{config?.dualAxis?.enabled && config?.metrics?.length >= 2 ? (
						<ResponsiveContainer width="100%" height="95%">
							{renderDualAxisChart()}
						</ResponsiveContainer>
					) : (
						<SingleAxisChart
							type={type}
							data={data}
							config={config}
							labelFields={labelFields}
						/>
					)}
				</div>
			</motion.div>
		</motion.div>
	);
}
