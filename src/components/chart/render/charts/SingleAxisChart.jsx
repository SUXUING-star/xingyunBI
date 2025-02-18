// src/components/SingleAxisChart.jsx
import React from 'react';
import {
	LineChart, Line, BarChart, Bar, PieChart, Pie,
	ScatterChart, Scatter, AreaChart, Area,
	RadarChart, Radar, ComposedChart,
	XAxis, YAxis, CartesianGrid, Tooltip, Legend,
	RadialBarChart, RadialBar, Treemap, Cell,
	PolarGrid, PolarAngleAxis, PolarRadiusAxis,
	ResponsiveContainer
} from 'recharts';
import { CustomTooltip } from '../../tooltip/CustomTooltip';
import { CHART_COLORS, CHART_CONFIG, calculateColorValue, calculateSizeValue } from '../../utils/chartUtils';

export const SingleAxisChart = ({ type, data, config, labelFields }) => {
	const dimension = config?.dimensions?.[0]?.field;
	const metric = config?.metrics?.[0]?.field;
	console.log('dimension:', dimension);
	console.log('metric:', metric);
	console.log('data:', data);



	const renderChart = () => {
		switch (type) {
			case 'bar':
				return (
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={data} {...CHART_CONFIG.commonProps}>
							<CartesianGrid {...CHART_CONFIG.grid} />
							<XAxis dataKey={dimension} {...CHART_CONFIG.axis} />
							<YAxis {...CHART_CONFIG.axis} />
							<Tooltip content={<CustomTooltip labelFields={labelFields} />} />
							<Legend />
							<Bar dataKey={metric} fill={CHART_COLORS.primary} name={config?.metrics?.[0]?.alias || metric}>
								{data.map((entry, index) => {
									let fill = CHART_COLORS.primary;
									if (config?.visualMap?.colorField) {
										fill = calculateColorValue(
											entry[config.visualMap.colorField],
											data.map(d => d[config.visualMap.colorField])
										);
									}
									return <Cell key={`cell-${index}`} fill={fill} />;
								})}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				);

			case 'line':
				return (
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={data} {...CHART_CONFIG.commonProps}>
							<CartesianGrid {...CHART_CONFIG.grid} />
							<XAxis dataKey={dimension} {...CHART_CONFIG.axis} />
							<YAxis {...CHART_CONFIG.axis} />
							<Tooltip content={<CustomTooltip labelFields={labelFields} />} />
							<Legend />
							<Line
								type="monotone"
								dataKey={metric}
								stroke={CHART_COLORS.primary}
								name={config?.metrics?.[0]?.alias || metric}
								dot={true}
							/>
						</LineChart>
					</ResponsiveContainer>
				);

			case 'area':
				return (
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={data} {...CHART_CONFIG.commonProps}>
							<CartesianGrid {...CHART_CONFIG.grid} />
							<XAxis dataKey={dimension} {...CHART_CONFIG.axis} />
							<YAxis {...CHART_CONFIG.axis} />
							<Tooltip content={<CustomTooltip labelFields={labelFields} />} />
							<Legend />
							<Area
								type="monotone"
								dataKey={metric}
								stroke={CHART_COLORS.primary}
								fill={CHART_COLORS.primary}
								fillOpacity={0.3}
								name={config?.metrics?.[0]?.alias || metric}
							/>
						</AreaChart>
					</ResponsiveContainer>
				);

			case 'pie':
				return (
					<ResponsiveContainer width="100%" height="100%">
						<PieChart {...CHART_CONFIG.commonProps}>
							<Pie
								data={data}
								dataKey={metric}
								nameKey={dimension}
								cx="50%"
								cy="50%"
								outerRadius="80%"
								label={entry => entry[dimension]}
								labelLine={true}
							>
								{data.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={CHART_COLORS.palette[index % CHART_COLORS.palette.length]}
									/>
								))}
							</Pie>
							<Tooltip content={<CustomTooltip labelFields={labelFields} />} />
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				);

			case 'scatter':
				return (
					<ResponsiveContainer width="100%" height="100%">
						<ScatterChart {...CHART_CONFIG.commonProps} data={data}>
							<CartesianGrid {...CHART_CONFIG.grid} />
							<XAxis dataKey={dimension} {...CHART_CONFIG.axis} />
							<YAxis dataKey={metric} {...CHART_CONFIG.axis} />
							<Tooltip content={<CustomTooltip labelFields={labelFields} />} />
							<Legend />
							<Scatter name={dimension}>
								{data.map((entry, index) => {
									let fill = CHART_COLORS.primary;
									let size = 10;

									if (config?.visualMap?.colorField) {
										fill = calculateColorValue(
											entry[config.visualMap.colorField],
											data.map(d => d[config.visualMap.colorField])
										);
									}

									if (config?.visualMap?.sizeField) {
										size = calculateSizeValue(
											entry[config.visualMap.sizeField],
											data.map(d => d[config.visualMap.sizeField])
										);
									}

									return <Cell key={`cell-${index}`} fill={fill} r={size} />;
								})}
							</Scatter>
						</ScatterChart>
					</ResponsiveContainer>
				);

			case 'radar':
				return (
					<ResponsiveContainer width="100%" height="100%">
						<RadarChart {...CHART_CONFIG.commonProps} data={data}>
							<PolarGrid />
							<PolarAngleAxis dataKey={dimension} />
							<PolarRadiusAxis angle={30} domain={[0, 'auto']} />
							<Radar
								name={config?.metrics?.[0]?.alias || metric}
								dataKey={metric}
								stroke={CHART_COLORS.primary}
								fill={CHART_COLORS.primary}
								fillOpacity={0.6}
							/>
							<Tooltip content={<CustomTooltip labelFields={labelFields} />} />
							<Legend />
						</RadarChart>
					</ResponsiveContainer>
				);

			case 'radial-bar':
				return (
					<ResponsiveContainer width="100%" height="100%">
						<RadialBarChart
							{...CHART_CONFIG.commonProps}
							data={data}
							cx="50%"
							cy="50%"
							innerRadius="10%"
							outerRadius="80%"
						>
							<RadialBar
								dataKey={metric}
								name={config?.metrics?.[0]?.alias || metric}
								background
								clockWise
								label={{ fill: '#666', position: 'insideStart' }}
							>
								{data.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={CHART_COLORS.palette[index % CHART_COLORS.palette.length]}
									/>
								))}
							</RadialBar>
							<Tooltip content={<CustomTooltip labelFields={labelFields} />} />
							<Legend />
						</RadialBarChart>
					</ResponsiveContainer>
				);

			case 'treemap':
				const treemapData = data.map(item => ({
					...item,
					size: item[metric]
				}));

				return (
					<ResponsiveContainer width="100%" height="100%">
						<Treemap
							data={treemapData}
							dataKey="size"
							stroke="#fff"
							fill="#8884d8"
							animationDuration={500}
							content={({ x, y, width, height, index }) => {
								const item = treemapData[index];
								const name = item?.[dimension] || '';
								const value = item?.[metric] || 0;

								// 根据矩形块大小动态计算字体大小
								const minFontSize = 12;
								const maxFontSize = 24;
								const area = width * height;
								const fontSize = Math.min(
									maxFontSize,
									Math.max(minFontSize, Math.sqrt(area) / 20)
								);

								// 计算值的字体大小（稍小于标题）
								const valueFontSize = Math.max(minFontSize, fontSize * 0.8);

								// 计算文本是否应该显示（基于空间大小）
								const shouldShowValue = height > fontSize * 2.5; // 确保有足够空间显示两行文本

								return (
									<g>
										<rect
											x={x}
											y={y}
											width={width}
											height={height}
											style={{
												fill: CHART_COLORS.palette[index % CHART_COLORS.palette.length],
												stroke: '#fff',
												strokeWidth: 2,
											}}
										/>
										{/* 标题文本 */}
										<text
											x={x + width / 2}
											y={shouldShowValue ? y + height / 3 : y + height / 2}
											fill="#fff"
											fontSize={`${fontSize}px`}
											fontWeight="500"
											textAnchor="middle"
											dominantBaseline="middle"
										>
											{name}
										</text>
										{/* 数值文本 - 仅在有足够空间时显示 */}
										{shouldShowValue && (
											<text
												x={x + width / 2}
												y={y + height * 2 / 3}
												fill="#fff"
												fontSize={`${valueFontSize}px`}
												textAnchor="middle"
												dominantBaseline="middle"
												opacity="0.9"
											>
												{value.toLocaleString()}
											</text>
										)}
									</g>
								);
							}}
						>
							<Tooltip
								content={({ payload }) => {
									if (!payload?.[0]?.payload) return null;
									const data = payload[0].payload;
									return (
										<div className="bg-white p-2 rounded shadow border">
											<div className="font-medium">{data[dimension]}</div>
											<div className="text-gray-600">
												{`${config?.metrics?.[0]?.alias || metric}: ${data[metric].toLocaleString()}`}
											</div>
										</div>
									);
								}}
							/>
						</Treemap>
					</ResponsiveContainer>
				);

			case 'bubble':
				// 计算数值范围
				const sizeField = config?.visualMap?.sizeField;
				const colorField = config?.visualMap?.colorField;
				const sizeValues = sizeField ? data.map(d => d[sizeField]) : [];
				const minSize = Math.min(...sizeValues);
				const maxSize = Math.max(...sizeValues);

				return (
					<ResponsiveContainer width="100%" height="100%">
						<ScatterChart {...CHART_CONFIG.commonProps}>
							<CartesianGrid {...CHART_CONFIG.grid} />
							<XAxis
								dataKey={dimension}
								{...CHART_CONFIG.axis}
								name={config?.dimensions?.[0]?.alias || dimension}
							/>
							<YAxis
								dataKey={metric}
								{...CHART_CONFIG.axis}
								name={config?.metrics?.[0]?.alias || metric}
							/>
							<Tooltip
								content={({ payload }) => {
									if (!payload || !payload.length) return null;
									const data = payload[0].payload;
									return (
										<div className="bg-white p-2 rounded shadow border">
											<div className="font-medium">{data[dimension]}</div>
											<div className="text-gray-600">
												{`${config?.metrics?.[0]?.alias || metric}: ${data[metric]}`}
											</div>
											{sizeField && (
												<div className="text-gray-600">
													{`${sizeField}: ${data[sizeField]}`}
												</div>
											)}
											{colorField && (
												<div className="text-gray-600">
													{`${colorField}: ${data[colorField]}`}
												</div>
											)}
										</div>
									);
								}}
							/>
							<Legend />
							<Scatter
								name={config?.metrics?.[0]?.alias || metric}
								data={data}
							>
								{data.map((entry, index) => {
									let size = 20;
									let fill = CHART_COLORS.primary;

									// 计算气泡大小
									if (sizeField) {
										const normalizedSize = maxSize === minSize ? 1 :
											(entry[sizeField] - minSize) / (maxSize - minSize);
										size = 20 + normalizedSize * 60; // 20-80px 范围
									}

									// 计算气泡颜色
									if (colorField) {
										fill = calculateColorValue(
											entry[colorField],
											data.map(d => d[colorField])
										);
									}

									return (
										<Cell
											key={`cell-${index}`}
											fill={fill}
											fillOpacity={0.6}
											stroke={fill}
											r={size / 2}
										/>
									);
								})}
							</Scatter>
						</ScatterChart>
					</ResponsiveContainer>
				);
			case 'stacked-area':
				return (
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={data} {...CHART_CONFIG.commonProps}>
							<CartesianGrid {...CHART_CONFIG.grid} />
							<XAxis dataKey={dimension} {...CHART_CONFIG.axis} />
							<YAxis {...CHART_CONFIG.axis} />
							<Tooltip content={<CustomTooltip labelFields={labelFields} />} />
							<Legend />
							{config?.metrics?.map((m, index) => (
								<Area
									key={m.field}
									type="monotone"
									dataKey={m.field}
									stackId="1"
									stroke={CHART_COLORS.palette[index]}
									fill={CHART_COLORS.palette[index]}
									fillOpacity={0.6}
									name={m.alias || m.field}
								/>
							))}
						</AreaChart>
					</ResponsiveContainer>
				);

			default:
				return (
					<div className="flex items-center justify-center h-full text-gray-500">
						暂不支持的图表类型: {type}
					</div>
				);
		}
	};

	// 父容器必须有固定高度
	return (
		// SingleAxisChart.jsx 中的容器
		<div className="w-full h-full flex flex-col">
			<div className="flex-1 min-h-0">
				{renderChart()}
			</div>
		</div>
	);
};