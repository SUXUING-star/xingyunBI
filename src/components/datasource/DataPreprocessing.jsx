// src/components/DataPreprocessing.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export function DataPreprocessing({ dataSource, onSave }) {
	const { token } = useAuth();
	const { toast } = useToast();
	const [preprocessing, setPreprocessing] = useState(
		dataSource.preprocessing || []
	);
	const [processedData, setProcessedData] = useState(null);

	// 预处理数据的函数
	const processData = () => {
		if (!dataSource.content?.length) return;

		const processed = dataSource.content.map(row => {
			const processedRow = [...row];
			preprocessing.forEach(config => {
				const index = dataSource.headers.indexOf(config.field);
				if (index === -1) return;

				let value = row[index];
				switch (config.type) {
					case 'number':
						// 移除非数字字符并转换为数字
						value = String(value).replace(/[^\d.-]/g, '');
						processedRow[index] = parseFloat(value) || 0;
						break;
					case 'date':
						try {
							// 转换日期格式
							const date = new Date(value);
							processedRow[index] = date.toLocaleDateString();
						} catch (e) {
							console.error('Date parsing error:', e);
						}
						break;
					default:
						processedRow[index] = value;
				}
			});
			return processedRow;
		});

		setProcessedData(processed);
	};

	// 当预处理配置改变时更新预览
	useEffect(() => {
		processData();
	}, [preprocessing, dataSource]);

	const handleSave = async () => {
		try {
			// 确保 URL 正确
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/datasources/${dataSource.id}/preprocessing`,
				{
					method: 'PUT',
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ preprocessing }),
				}
			);

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || '保存失败');
			}

			onSave?.();
			toast({
				title: "保存成功",
				description: "数据预处理配置已更新"
			});
		} catch (error) {
			console.error('Error saving preprocessing config:', error);
			toast({
				variant: "destructive",
				title: "保存失败",
				description: error.message
			});
		}
	};

	return (
		<div className="space-y-4">
			<Tabs defaultValue="config">
				<TabsList>
					<TabsTrigger value="config">配置</TabsTrigger>
					<TabsTrigger value="preview">预览</TabsTrigger>
				</TabsList>

				<TabsContent value="config" className="space-y-4">
					{/* 配置界面 */}
					{dataSource.headers.map(field => (
						<Card key={field}>
							<CardContent className="p-4">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<Label>{field}</Label>
									</div>

									{/* 数据类型 */}
									<div>
										<Label>数据类型</Label>
										<Select
											value={preprocessing.find(p => p.field === field)?.type || 'text'}
											onValueChange={(value) => {
												setPreprocessing(prev => {
													const config = prev.find(p => p.field === field);
													if (config) {
														return prev.map(p =>
															p.field === field ? { ...p, type: value } : p
														);
													}
													return [...prev, { field, type: value }];
												});
											}}
										>
											<SelectTrigger>
												<SelectValue placeholder="选择数据类型" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="text">文本</SelectItem>
												<SelectItem value="number">数值</SelectItem>
												<SelectItem value="date">日期</SelectItem>
											</SelectContent>
										</Select>
									</div>

									{/* 聚合方式 - 仅对数值类型显示 */}
									{preprocessing.find(p => p.field === field)?.type === 'number' && (
										<div>
											<Label>聚合方式</Label>
											<Select
												value={preprocessing.find(p => p.field === field)?.aggregator || 'sum'}
												onValueChange={(value) => {
													setPreprocessing(prev =>
														prev.map(p =>
															p.field === field ? { ...p, aggregator: value } : p
														)
													);
												}}
											>
												<SelectTrigger>
													<SelectValue placeholder="选择聚合方式" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="sum">求和</SelectItem>
													<SelectItem value="avg">平均值</SelectItem>
													<SelectItem value="max">最大值</SelectItem>
													<SelectItem value="min">最小值</SelectItem>
													<SelectItem value="count">计数</SelectItem>
												</SelectContent>
											</Select>
										</div>
									)}

									{/* 日期格式 - 仅对日期类型显示 */}
									{preprocessing.find(p => p.field === field)?.type === 'date' && (
										<div>
											<Label>日期格式</Label>
											<Select
												value={preprocessing.find(p => p.field === field)?.format || 'YYYY-MM-DD'}
												onValueChange={(value) => {
													setPreprocessing(prev =>
														prev.map(p =>
															p.field === field ? { ...p, format: value } : p
														)
													);
												}}
											>
												<SelectTrigger>
													<SelectValue placeholder="选择日期格式" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
													<SelectItem value="YYYY/MM/DD">YYYY/MM/DD</SelectItem>
													<SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
													<SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
												</SelectContent>
											</Select>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</TabsContent>


				<TabsContent value="preview">
					<ScrollArea className="h-[400px]">
						<Table>
							<TableHeader>
								<TableRow>
									{dataSource.headers.map((header, index) => (
										<TableHead key={index}>{header}</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{processedData?.slice(0, 100).map((row, rowIndex) => (
									<TableRow key={rowIndex}>
										{row.map((cell, cellIndex) => (
											<TableCell key={cellIndex}>{String(cell)}</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</ScrollArea>
				</TabsContent>
			</Tabs>

			<Button onClick={handleSave} className="w-full">
				保存配置
			</Button>
		</div>
	);
}