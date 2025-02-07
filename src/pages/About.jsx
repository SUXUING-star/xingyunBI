import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
	BarChart2,
	LineChart,
	PieChart,
	Share2,
	Users,
	Database,
	Layout,
	Workflow,
	Mail,
	Github,
	MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { github, githuburl ,sitename , sitedescription,email} from '@/config/config'
import { motion } from 'framer-motion';

function About() {
	const navigate = useNavigate();
	const features = [
		{
			icon: <BarChart2 className="h-8 w-8 text-blue-500" />,
			title: '丰富的图表类型',
			description: '支持柱状图、折线图、饼图等多种图表类型，满足不同的数据可视化需求。'
		},
		{
			icon: <Database className="h-8 w-8 text-green-500" />,
			title: '多样的数据源',
			description: '支持CSV、JSON等多种数据格式，未来将支持更多数据源类型。'
		},
		{
			icon: <Layout className="h-8 w-8 text-purple-500" />,
			title: '灵活的布局',
			description: '拖拽式布局设计，让您轻松创建富有表现力的数据仪表盘。'
		},
		{
			icon: <Share2 className="h-8 w-8 text-orange-500" />,
			title: '便捷的分享',
			description: '一键导出和分享您的数据可视化作品，支持多种导出格式。'
		}
	];

	const team = [
		{
			name: 'suxing-star',
			role: '全栈开发者',
			description: '独立开发此项目，热爱技术，致力于打造优秀的数据可视化工具。'
		}
	];

	return (
		<motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 max-w-6xl"
    >
			{/* 头部介绍 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16"
      >
				<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
					关于 {sitename}
				</h1>
				<p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
					{sitedescription}
				</p>
				<div className="mt-8 flex justify-center gap-4">
					<Button size="lg" onClick={() => { navigate("/") }}>
						开始使用
						<Workflow className="ml-2 h-5 w-5" />
					</Button>
					<Button size="lg" variant="outline" onClick={() => { navigate("/") }}>
						联系我
						<MessageSquare className="ml-2 h-5 w-5" />
					</Button>
				</div>
			</motion.div>

			{/* 特色功能 */}
			<motion.section className="mb-16">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
					特色功能
				</h2>
				<motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
						<Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
							{feature.icon}
							<h3 className="text-lg font-semibold mt-4 mb-2">{feature.title}</h3>
							<p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
						</Card>
            </motion.div>
					))}
				</motion.div>
			</motion.section>

			{/* 技术栈 */}
			<motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
					技术栈
				</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
					<Badge variant="secondary" className="text-center py-2 hover:bg-primary/20 cursor-default">React</Badge>
					<Badge variant="secondary" className="text-center py-2 hover:bg-primary/20 cursor-default">Vite</Badge>
					<Badge variant="secondary" className="text-center py-2 hover:bg-primary/20 cursor-default">Go (Gin)</Badge>
					<Badge variant="secondary" className="text-center py-2 hover:bg-primary/20 cursor-default">MongoDB</Badge>
					<Badge variant="secondary" className="text-center py-2 hover:bg-primary/20 cursor-default">Radix UI</Badge>
					<Badge variant="secondary" className="text-center py-2 hover:bg-primary/20 cursor-default">ECharts</Badge>
					<Badge variant="secondary" className="text-center py-2 hover:bg-primary/20 cursor-default">WebSocket</Badge>
					<Badge variant="secondary" className="text-center py-2 hover:bg-primary/20 cursor-default">Tailwind CSS</Badge>
				</div>
			</motion.section>

			{/* 团队介绍 */}
			<motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
					项目开发者
				</h2>
				<div className="flex justify-center items-center"> {/* 使用 flex 布局，居中显示 */}
					{team.map((member, index) => (
						<Card key={index} className="p-6 hover:shadow-lg transition-shadow">
							<div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
								<Users className="h-8 w-8 text-gray-500" />
							</div>
							<h3 className="text-lg font-semibold text-center mb-1">{member.name}</h3>
							<p className="text-sm text-center text-gray-500 mb-3">{member.role}</p>
							<p className="text-sm text-gray-600 dark:text-gray-400 text-center">
								{member.description}
							</p>
						</Card>
					))}
				</div>
			</motion.section>

			{/* 常见问题 */}
			<motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 max-w-3xl mx-auto"
      >
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
					常见问题
				</h2>
				<Card className="p-6">
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem value="item-1">
							<AccordionTrigger>支持哪些数据源？</AccordionTrigger>
							<AccordionContent>
								目前支持CSV、JSON等常见数据格式的文件上传。未来将支持更多数据源类型，包括数据库直连等功能。
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-2">
							<AccordionTrigger>如何开始使用？</AccordionTrigger>
							<AccordionContent>
								注册账号后，您可以直接上传数据文件，创建仪表盘，添加图表并自由排布，就能得到一个美观的可视化界面。
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-3">
							<AccordionTrigger>是否支持团队协作？</AccordionTrigger>
							<AccordionContent>
								目前支持基础的仪表盘分享功能。团队协作功能正在开发中，未来将支持多人协作编辑、权限管理等特性。
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-4">
							<AccordionTrigger>如何确保数据安全？</AccordionTrigger>
							<AccordionContent>
								我们采用业界标准的加密技术保护您的数据，并提供多层次的权限控制机制。所有数据传输都经过加密，确保您的信息安全。
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</Card>
			</motion.section>

			{/* 联系我们 */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
					联系我
				</h2>
				<p className="text-gray-600 dark:text-gray-400 mb-8">
					如果您有任何问题或建议，欢迎随时联系我
				</p>
				<div className="flex justify-center space-x-6">
					<a
						href={email}
						className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
					>
						<Mail className="h-5 w-5 mr-2" />
						<span>{email}</span>
					</a>
					<a
						href={githuburl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
					>
						<Github className="h-5 w-5 mr-2" />
						<span>{github}</span>
					</a>
				</div>
			</motion.section>
		</motion.div>
	);
}

export default About;