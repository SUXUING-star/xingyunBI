// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { sitename } from '@/config/config';
import { TypeWriter } from '@/components/animations/TypeWriter';

function Register() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	// src/pages/Register.jsx
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		if (password !== confirmPassword) {
			setError('两次输入的密码不一致');
			return;
		}

		const registerData = {
			username: username.trim(),
			password: password,
			email: email.trim(),
		};

		console.log('Sending register data:', registerData); // 添加日志

		setLoading(true);

		try {
			const response = await fetch(`https://${import.meta.env.VITE_API_URL}/api/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(registerData),
			});

			const data = await response.json();
			console.log('Response:', data); // 添加日志

			if (response.ok) {
				alert('注册成功！请查收验证邮件。');
				navigate('/login');
			} else {
				setError(data.error || '注册失败');
			}
		} catch (err) {
			console.error('Registration error:', err); // 添加错误日志
			setError('网络错误，请稍后重试');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 
      flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-sm p-8 rounded-xl 
          shadow-lg border border-gray-100"
			>
				<div>
					<TypeWriter
						text={`欢迎注册${sitename}`}
						className="text-center text-3xl font-extrabold text-gray-900"
						duration={1500}
					/>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1.5 }}
						className="mt-2 text-center text-sm text-gray-600"
					>
						开启您的数据探索之旅
					</motion.p>
				</div>

				{error && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						className="bg-red-50 border-l-4 border-red-400 p-4"
					>
						<div className="text-red-700">{error}</div>
					</motion.div>
				)}

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-4">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 }}
						>
							<label className="block text-sm font-medium text-gray-700">用户名</label>
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
								className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 
                  rounded-md text-sm shadow-sm placeholder-gray-400
                  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                  transition duration-200"
								placeholder="设置您的用户名"
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3 }}
						>
							<label className="block text-sm font-medium text-gray-700">邮箱</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 
                  rounded-md text-sm shadow-sm placeholder-gray-400
                  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                  transition duration-200"
								placeholder="输入您的邮箱地址"
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4 }}
						>
							<label className="block text-sm font-medium text-gray-700">密码</label>
							<div className="mt-1 relative">
								<input
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="block w-full px-3 py-2 bg-white border border-gray-300 
                    rounded-md text-sm shadow-sm placeholder-gray-400
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                    transition duration-200 pr-10"
									placeholder="设置您的密码"
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
									) : (
										<Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
									)}
								</button>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.5 }}
						>
							<label className="block text-sm font-medium text-gray-700">确认密码</label>
							<div className="mt-1 relative">
								<input
									type={showConfirmPassword ? "text" : "password"}
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
									className="block w-full px-3 py-2 bg-white border border-gray-300 
                    rounded-md text-sm shadow-sm placeholder-gray-400
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                    transition duration-200 pr-10"
									placeholder="再次输入密码"
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								>
									{showConfirmPassword ? (
										<EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
									) : (
										<Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
									)}
								</button>
							</div>
						</motion.div>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
					>
						<motion.button
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
							type="submit"
							disabled={loading}
							className="w-full flex justify-center py-2 px-4 border border-transparent 
                rounded-md shadow-sm text-sm font-medium text-white
                bg-gradient-to-r from-blue-600 to-indigo-600
                hover:from-blue-700 hover:to-indigo-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                disabled:opacity-50 transition-all duration-200"
						>
							{loading ? (
								<div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
							) : (
								'注册'
							)}
						</motion.button>
					</motion.div>
				</form>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.7 }}
					className="text-center"
				>
					<span className="text-gray-600">已有账号? </span>
					<Link
						to="/login"
						className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
					>
						立即登录
					</Link>
				</motion.div>
			</motion.div>
		</div>
	);
}

export default Register;