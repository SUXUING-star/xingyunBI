// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PublicRoute } from '@/components/PublicRoute';
import Layout from '@/components/layout/Layout';

// 页面组件
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import VerifyEmail from '@/pages/VerifyEmail';
import UserProfile from '@/pages/UserProfile';
import About from '@/pages/About';
import { NotFound } from '@/pages/NotFound';

// 仪表盘相关组件
import DashboardList from '@/pages/DashboardList';
import { DashboardDetail } from '@/pages/DashboardDetail';
import DashboardEditor from '@/pages/DashboardEditor';
import ChartEditor from '@/pages/ChartEditor';

// 数据源相关
import DataSourceList from '@/pages/DataSourceList';

// 机器学习模型相关
import MLModelList from '@/pages/MLModelList';
import MLModelEditor from '@/pages/MLModelEditor';
import MLModelDetail from '@/pages/MLModelDetail';

function App() {
	return (
		<AuthProvider>
			<Routes>
				{/* 公开路由 - 未登录时才能访问 */}
				<Route path="/login" element={
					<PublicRoute><Login /></PublicRoute>
				} />
				<Route path="/register" element={
					<PublicRoute><Register /></PublicRoute>
				} />
				<Route path="/forgot-password" element={
					<PublicRoute><ForgotPassword /></PublicRoute>
				} />
				<Route path="/reset-password" element={
					<PublicRoute><ResetPassword /></PublicRoute>
				} />
				<Route path="/verify-email" element={
					<PublicRoute><VerifyEmail /></PublicRoute>
				} />

				{/* 使用 Layout 的路由 */}
				<Route path="/" element={<Layout />}>
					{/* 主页 - 不需要登录也能访问 */}
					<Route index element={<Home />} />

					{/* 需要登录才能访问的路由 */}
					<Route path="/about"
						element={<ProtectedRoute><About /></ProtectedRoute>} />

					<Route path="/dashboards"
						element={<ProtectedRoute><DashboardList /></ProtectedRoute>} />
					<Route path="/dashboards/new"
						element={<ProtectedRoute><DashboardEditor /></ProtectedRoute>} />
					<Route path="/dashboards/:id"
						element={<ProtectedRoute><DashboardDetail /></ProtectedRoute>} />
					<Route path="/dashboards/:id/edit"
						element={<ProtectedRoute><DashboardEditor /></ProtectedRoute>} />
					<Route path="/dashboards/:dashboardId/charts/new"
						element={<ProtectedRoute><ChartEditor /></ProtectedRoute>} />
					<Route path="/dashboards/:dashboardId/charts/:chartId"
						element={<ProtectedRoute><ChartEditor /></ProtectedRoute>} />

					<Route path="/datasources"
						element={<ProtectedRoute><DataSourceList /></ProtectedRoute>} />

					<Route path="/mlmodels"
						element={<ProtectedRoute><MLModelList /></ProtectedRoute>} />
					<Route path="/mlmodels/new"
						element={<ProtectedRoute><MLModelEditor /></ProtectedRoute>} />
					<Route path="/mlmodels/:id"
						element={<ProtectedRoute><MLModelDetail /></ProtectedRoute>} />
					<Route path="/mlmodels/:id/edit"
						element={<ProtectedRoute><MLModelEditor /></ProtectedRoute>} />

					<Route path="/profile"
						element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

					{/* 404 页面 */}
					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
			<Toaster />
		</AuthProvider>
	);
}

export default App;