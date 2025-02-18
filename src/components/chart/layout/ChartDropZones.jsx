import React from 'react';
import { DropZone } from '@/components/chart/layout/DropZone';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function ChartDropZones({ chart, setChart }) {

	const handleDimensionReorder = (field, newIndex, oldIndex) => {
		setChart(prev => {
			const dimensions = [...prev.config.dimensions];
			if (oldIndex !== undefined) {
				// 拖拽排序
				const [removed] = dimensions.splice(oldIndex, 1);
				dimensions.splice(newIndex, 0, removed);
			} else {
				// 新增
				const [removed] = dimensions.splice(dimensions.findIndex(d => d.field === field), 1)
				dimensions.splice(newIndex, 0, removed);
			}
			return {
				...prev,
				config: {
					...prev.config,
					dimensions: dimensions
				}
			};
		});
	};
	const getDimensionDropZoneProps = {
		label: "X轴/维度",
		fields: chart.config?.dimensions?.map(d => d.field) || [],
		onDrop: (field) => {
			setChart(prev => ({
				...prev,
				config: {
					...prev.config,
					dimensions: [...prev.config.dimensions, { field, type: 'category' }]
				}
			}));
		},
		onRemove: (field) => {
			setChart(prev => ({
				...prev,
				config: {
					...prev.config,
					dimensions: prev.config.dimensions.filter(d => d.field !== field)
				}
			}));
		},
		onReorder: handleDimensionReorder
	};
	const handleMetricReorder = (field, newIndex, oldIndex) => {
		setChart(prev => {
			const metrics = [...prev.config.metrics];
			if (oldIndex !== undefined) {
				const [removed] = metrics.splice(oldIndex, 1);
				metrics.splice(newIndex, 0, removed);
			} else {
				const [removed] = metrics.splice(metrics.findIndex(m => m.field === field), 1)
				metrics.splice(newIndex, 0, removed);
			}
			return {
				...prev,
				config: {
					...prev.config,
					metrics: metrics
				}
			};
		});
	};
	const getMetricDropZoneProps = {
		label: "Y轴/指标",
		fields: chart.config?.metrics?.map(m => m.field) || [],
		onDrop: (field) => {
			setChart(prev => ({
				...prev,
				config: {
					...prev.config,
					metrics: [
						...(prev.config.metrics || []),
						{ field, aggregator: 'sum' }
					]
				}
			}));
		},
		onRemove: (field) => {
			setChart(prev => ({
				...prev,
				config: {
					...prev.config,
					metrics: prev.config.metrics.filter(m => m.field !== field)
				}
			}));
		},
		onReorder: handleMetricReorder
	};
	const handleColorReorder = (field, newIndex, oldIndex) => {
		setChart(prev => {
			if (oldIndex !== undefined) {
				// 拖拽排序，但这里其实不需要，因为只能放置一个
			} else {
				// 新增
				return {
					...prev,
					config: {
						...prev.config,
						visualMap: {
							...prev.config?.visualMap,
							colorField: field,
							colorRange: ['#e6f3ff', '#0088FE']
						}
					}
				};
			}
			return prev
		});
	};
	const getColorDropZoneProps = {
		label: "颜色",
		fields: chart.config?.visualMap?.colorField ? [chart.config.visualMap.colorField] : [],
		onDrop: (field) => {
			console.log('Dropping color field:', field); // 添加日志
			setChart(prev => ({
				...prev,
				config: {
					...prev.config,
					visualMap: {
						...prev.config?.visualMap,
						colorField: field,
						colorRange: ['#e6f3ff', '#0088FE']
					}
				}
			}));
		},
		onRemove: () => {
			setChart(prev => ({
				...prev,
				config: {
					...prev.config,
					visualMap: {
						...prev.config?.visualMap,
						colorField: undefined,
						colorRange: undefined
					}
				}
			}));
		},
		onReorder: handleColorReorder
	};
	const handleSizeReorder = (field, newIndex, oldIndex) => {
		setChart(prev => {
			if (oldIndex !== undefined) {
				// 拖拽排序，但这里其实不需要，因为只能放置一个
			} else {
				return {
					...prev,
					config: {
						...prev.config,
						visualMap: {
							...prev.config?.visualMap,
							sizeField: field,
							sizeRange: [4, 20]
						}
					}
				}
			}
			return prev;
		});
	};
	const getSizeDropZoneProps = {
		label: "大小",
		fields: chart.config?.visualMap?.sizeField ? [chart.config.visualMap.sizeField] : [],
		onDrop: (field) => {
			setChart(prev => ({
				...prev,
				config: {
					...prev.config,
					visualMap: {
						...prev.config?.visualMap,
						sizeField: field,
						sizeRange: [4, 20]
					}
				}
			}));
		},
		onRemove: () => {
			setChart(prev => ({
				...prev,
				config: {
					...prev.config,
					visualMap: {
						...prev.config?.visualMap,
						sizeField: undefined,
						sizeRange: undefined
					}
				}
			}));
		},
		onReorder: handleSizeReorder
	};
	const handleLabelReorder = (field, newIndex, oldIndex) => {
		setChart(prev => {
			const labelFields = [...(prev.config.visualMap?.labelFields || [])];
			if (oldIndex !== undefined) {
				const [removed] = labelFields.splice(oldIndex, 1);
				labelFields.splice(newIndex, 0, removed);
			} else {
				const [removed] = labelFields.splice(labelFields.findIndex(m => m === field), 1)
				labelFields.splice(newIndex, 0, removed);
			}
			return {
				...prev,
				config: {
					...prev.config,
					visualMap: {
						...prev.config.visualMap,
						labelFields: labelFields
					}
				}
			};
		});
	};
	const getLabelDropZoneProps = {
		label: "标签",
		fields: chart.config?.visualMap?.labelFields || [],
		onDrop: (field) => {
			setChart(prev => ({
				...prev,
				config: {
					...prev.config,
					visualMap: {
						...prev.config.visualMap,
						labelFields: [
							...(prev.config.visualMap?.labelFields || []),
							field
						]
					}
				}
			}));
		},
		onRemove: (field) => {
			setChart(prev => ({
				...prev,
				config: {
					...prev.config,
					visualMap: {
						...prev.config.visualMap,
						labelFields: (prev.config.visualMap?.labelFields || [])
							.filter(f => f !== field)
					}
				}
			}));
		},
		onReorder: handleLabelReorder
	};
	return (
		<div className="flex gap-4">
			{/* 右侧：维度和指标区域 */}
			<div className="w-[300px] space-y-4">
				<DropZone {...getColorDropZoneProps} />
				<DropZone {...getSizeDropZoneProps} />
				<DropZone {...getLabelDropZoneProps} />
			</div>

			{/* 左侧：维度和指标区域 */}
			<div className="flex-1 space-y-4">
				{/* X轴/维度 */}
				<DropZone {...getDimensionDropZoneProps} />

				{/* Y轴/指标和多轴设置 */}
				<div className="space-y-2">
					<DropZone {...getMetricDropZoneProps} />

					{chart.config?.metrics?.length >= 2 && (
						<div className="p-2 border rounded bg-gray-50">
							<div className="flex items-center gap-2">
								<Label>多轴图表设置</Label>
								<Switch
									checked={chart.config?.dualAxis?.enabled}
									onCheckedChange={(checked) => {
										setChart(prev => ({
											...prev,
											config: {
												...prev.config,
												dualAxis: {
													enabled: checked,
													types: checked ? prev.config.metrics.map(() => 'line') : undefined
												}
											}
										}));
									}}
								/>
							</div>

							{chart.config?.dualAxis?.enabled && (
								<div className="mt-2 space-y-2">
									{chart.config.metrics.map((metric, index) => (
										<div key={index} className="flex items-center gap-2">
											<span className="text-sm w-[120px] truncate">
												{metric.alias || metric.field}:
											</span>
											<Select
												value={chart.config?.dualAxis?.types?.[index] || 'line'}
												onValueChange={(value) => {
													setChart(prev => ({
														...prev,
														config: {
															...prev.config,
															dualAxis: {
																...prev.config.dualAxis,
																types: prev.config.metrics.map((_, i) =>
																	i === index ? value : (prev.config.dualAxis.types[i] || 'line')
																)
															}
														}
													}));
												}}
											>
												<SelectTrigger className="w-24">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="line">折线图</SelectItem>
													<SelectItem value="bar">柱状图</SelectItem>
													<SelectItem value="area">面积图</SelectItem>
													<SelectItem value="scatter">散点图</SelectItem>
												</SelectContent>
											</Select>
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}