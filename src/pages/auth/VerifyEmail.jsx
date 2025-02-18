import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  // 添加 ref 来防止重复验证
  const verificationAttempted = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      // 如果已经尝试过验证，直接返回
      if (verificationAttempted.current) {
        return;
      }
      verificationAttempted.current = true;

      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        setMessage('无效的验证链接');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-email?token=${token}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || '邮箱验证成功！');
          // 3秒后自动跳转到登录页面
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error || '验证失败，请重试');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('网络错误，请稍后重试');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              {status === 'verifying' && (
                <motion.div
                  key="verifying"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                  <h2 className="mt-4 text-xl font-semibold">正在验证邮箱...</h2>
                </motion.div>
              )}

              {status === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                    <svg
                      className="h-12 w-12 text-green-500 mx-auto"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  <h2 className="mt-4 text-xl font-semibold">{message}</h2>
                  <p className="mt-2 text-gray-600">即将跳转到登录页面...</p>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                 <svg
                    className="h-12 w-12 text-red-500 mx-auto"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <h2 className="mt-4 text-xl font-semibold text-red-600">{message}</h2>
                  <button
                    onClick={() => navigate('/login')}
                    className="mt-4 text-blue-600 hover:text-blue-500"
                  >
                    返回登录页面
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default VerifyEmail;