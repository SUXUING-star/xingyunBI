// Header.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import {
	User,
	Settings,
	LogOut,
	Bell,
	LayoutDashboard,
	Home,
	Database,
	Menu,
	Brain
} from 'lucide-react';
import ThemeToggle from '../theme/ThemeToggle';
import { github, githuburl, sitename, sitedescription, email } from '@/config/config'


// 在 NAV_ITEMS 数组中添加新项
const NAV_ITEMS = [
	{
		path: '/',
		label: '主页',
		icon: Home
	},
	{
		path: '/dashboards',
		label: '仪表盘',
		icon: LayoutDashboard
	},
	{
		path: '/datasources',
		label: '数据源',
		icon: Database
	},
	// 添加机器学习模型导航
	{
		path: '/mlmodels',
		label: '机器学习',
		icon: Brain // 从 lucide-react 导入 Brain 图标
	}
];

function Header() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const isActive = (path) => {
		return location.pathname === path ||
			(path !== '/' && location.pathname.startsWith(path));
	};

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const NavItems = ({ className = '', isMobile = false }) => (
		<nav className={className}>
			{NAV_ITEMS.map(({ path, label, icon: Icon }) => (
				<Button
					key={path}
					variant={isActive(path) ? "default" : "ghost"}
					className={`
            ${isMobile ? 'w-full justify-start' : ''} 
            flex items-center space-x-2 px-4 py-2 rounded-lg
            transition-all duration-200 
            hover:bg-blue-50 dark:hover:bg-gray-700
            ${isActive(path) ?
							'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' :
							'text-gray-600 dark:text-gray-300'
						}
          `}
					onClick={() => {
						navigate(path);
						if (isMobile) setIsMobileMenuOpen(false);
					}}
				>
					<Icon className={`h-5 w-5 ${isActive(path) ?
						'text-blue-600 dark:text-blue-400' :
						'text-gray-600 dark:text-gray-300'
						}`} />
					<span>{label}</span>
				</Button>
			))}
		</nav>
	);

	return (
		<header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-800 shadow-sm border-b">
			<div className="h-16 px-4 flex items-center justify-between">
				{/* 左侧Logo和导航 */}
				<div className="flex items-center">
					{/* 移动端菜单按钮 */}
					<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="lg:hidden mr-2">
								<Menu className="h-5 w-5" />
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-72">
							{/* 添加 SheetHeader 和 SheetTitle */}
							<SheetHeader>
								<SheetTitle>
									<button
										onClick={() => {
											navigate('/');
											setIsMobileMenuOpen(false);
										}}
										className="flex items-center space-x-2 text-2xl font-bold"
									>
										<img
											src="/site-logo.svg"
											alt={sitename}
											className="w-8 h-8"
										/>
										<span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
											{sitename}
										</span>
									</button>
								</SheetTitle>
							</SheetHeader>
							<div className="mt-4">
								<NavItems isMobile className="flex flex-col space-y-1" />
							</div>
						</SheetContent>
					</Sheet>

					{/* Logo - 在移动端显示，桌面端更大 */}
					<button
						onClick={() => navigate('/')}
						className="flex items-center space-x-2 text-xl sm:text-2xl lg:text-3xl font-bold hidden sm:flex"
					>
						<img
							src="/site-logo.svg"
							alt={sitename}
							className="w-8 h-8 sm:w-10 sm:h-10"
						/>
						<span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
							{sitename}
						</span>
					</button>

					{/* 桌面端导航 - 在大屏幕显示 */}
					<div className="hidden lg:block ml-8">
						<NavItems className="flex items-center space-x-1" />
					</div>
				</div>

				{/* 右侧工具栏 */}
				<div className="flex items-center space-x-2 sm:space-x-4">
					<ThemeToggle />



					{/* 用户菜单 */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="relative h-10 w-10 rounded-full"
							>
								<div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-gray-700 
                             flex items-center justify-center">
									<User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>
								<div className="flex flex-col">
									<p className="text-sm font-medium">{user?.username}</p>
									<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
										{user?.email}
									</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => navigate('/profile')}>
								<User className="h-4 w-4 mr-2" />个人资料
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => navigate('/profile?tab=settings')}>
								<Settings className="h-4 w-4 mr-2" />偏好设置
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={handleLogout}
								className="text-red-600 dark:text-red-400"
							>
								<LogOut className="h-4 w-4 mr-2" />退出登录
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}

export default Header;