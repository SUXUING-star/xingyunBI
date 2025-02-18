// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { sitename } from "@/config/config"
import { motion } from 'framer-motion';
import { AuthCard } from '@/components/animations/AuthCard';
import { FormField } from '../../components/animations/FormField';
import { TypeWriter } from '../../components/animations/TypeWriter';

function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { login } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			console.log('Login: Sending request...');
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});

			const responseData = await response.json();
			console.log('Login: Response received', responseData);

			if (responseData.code === 0) { // 检查 code 是否为 0
				// 使用 data 中的 token 和 user
				const { token, user } = responseData.data;
				console.log('Login: Processing login with token and user:', { token, user });
				await login(token, user);
				console.log('Login: Login successful, navigating to dashboard...');
				const from = location.state?.from || '/';
				navigate(from, { replace: true });
			} else {
				setError(responseData.msg || '登录失败');
			}
		} catch (err) {
			console.error('Login: Error during login', err);
			setError('网络错误，请稍后重试');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 
      flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<AuthCard>
				<div>
					<TypeWriter
						text={`欢迎登录${sitename}`}
						className="text-center text-3xl font-extrabold text-gray-900"
						duration={1500}
					/>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1.5 }}
						className="mt-2 text-center text-sm text-gray-600"
					>
						开启您的数据之旅
					</motion.p>
				</div>

				{error && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						className="bg-red-50 border-l-4 border-red-400 p-4 mb-6"
					>
						<div className="text-red-700">{error}</div>
					</motion.div>
				)}

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<FormField delay={0.2}>
						<label className="block text-sm font-medium text-gray-700">用户名</label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 
                rounded-md text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                transition duration-200"
							placeholder="请输入用户名"
						/>
					</FormField>

					<FormField delay={0.3}>
						<label className="block text-sm font-medium text-gray-700">密码</label>
						<div className="mt-1 relative">
							<input
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 
                rounded-md text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                transition duration-200 pr-10"
								placeholder="请输入密码"
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 pr-3 flex items-center"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<EyeOff className="h-5 w-5 text-gray-400" />
								) : (
									<Eye className="h-5 w-5 text-gray-400" />
								)}
							</button>
						</div>
					</FormField>

					<FormField delay={0.4}>
						<motion.button
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
							type="submit"
							className="w-full flex justify-center py-2 px-4 border border-transparent 
                rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r 
                from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                transition-all duration-200"
						>
							{loading ? (
								<div className="animate-spin rounded-full h-5 w-5 border-2 
                  border-white border-t-transparent" />
							) : (
								'登录'
							)}
						</motion.button>
					</FormField>
				</form>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					className="text-center mt-4"
				>
					<span className="text-gray-600">还没有账号? </span>
					<Link to="/register" className="font-medium text-blue-600 hover:text-blue-500
            transition-colors duration-200">
						立即注册
					</Link>
				</motion.div>
			</AuthCard>
		</div>
	);
}

export default Login;