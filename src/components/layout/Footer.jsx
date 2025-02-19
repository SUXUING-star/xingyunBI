// src/components/Footer.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Twitter, Mail, Share2 } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { sitename, email, github, githuburl } from "@/config/config"

function Footer() {
	const navigate = useNavigate();

	const handleShare = async () => {
		try {
			if (navigator.share) {
				await navigator.share({
					title: 'BI-star',
					text: '一个强大的数据可视化平台',
					url: window.location.origin,
				});
			}
		} catch (error) {
			console.error('分享失败:', error);
		}
	};

	return (
		<footer className="bg-white dark:bg-gray-800 border-t py-6">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Logo和描述 */}

					<div className="md:col-span-1">
						<img
							src="/site-logo.svg"
							alt={sitename}
							className="w-16 h-16"
						/>
						<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{sitename}</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							让数据可视化变得简单而强大
						</p>


					</div>

					{/* 快速链接 */}
					<div className="md:col-span-1">
						<h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-5">快速链接</h3>
						<ul className="space-y-2">
							<li>
								<button
									onClick={() => navigate('/release')}
									className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white"
								>
									跨平台应用
								</button>

							</li>
							<li>
								<button
									onClick={() => navigate('/about')}
									className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white"
								>
									关于我们
								</button>

							</li>
							<li>
								<button
									onClick={() => navigate('/dashboards')}
									className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white"
								>
									仪表盘
								</button>
							</li>
							<li>
								<button
									onClick={() => navigate('/datasources')}
									className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white"
								>
									数据源
								</button>
							</li>
							<li>
								<button
									onClick={() => navigate('/mlmodels')}
									className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white"
								>
									机器学习
								</button>
							</li>
						</ul>
					</div>

					{/* 联系我们 */}
					<div className="md:col-span-1">
						<h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">联系我们</h3>
						<ul className="space-y-2">
							<li>
								<a
									href={email}
									className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center"
								>
									<Mail className="h-4 w-4 mr-2" />
									<span>{email}</span>
								</a>
							</li>
							<li>
								<a
									href={githuburl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center"
								>
									<Github className="h-4 w-4 mr-2" />
									<span>{github}</span>
								</a>
							</li>
							<li>
								<button
									onClick={handleShare}
									className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center"
								>
									<Share2 className="h-4 w-4 mr-2" />
									<span>分享平台</span>
								</button>
							</li>
						</ul>
					</div>


				</div>

				<Separator className="my-6" />

				{/* 版权信息 */}
				<div className="flex justify-between items-center">
					<div className="text-sm text-gray-500 dark:text-gray-400">
						© {new Date().getFullYear()} BI-star. All rights reserved.
					</div>

					{/* 社交媒体图标 */}
					<div className="flex space-x-4">
						<a
							href="https://github.com/SUXUING-star"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
						>
							<Github className="h-5 w-5" />
						</a>
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
						>
							<Twitter className="h-5 w-5" />
						</a>
						<button
							onClick={handleShare}
							className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
						>
							<Share2 className="h-5 w-5" />
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;