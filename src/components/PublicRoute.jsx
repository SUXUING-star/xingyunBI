// src/components/PublicRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function PublicRoute({ children }) {
  const { token } = useAuth();
  
  // 如果用户已登录，重定向到首页
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}