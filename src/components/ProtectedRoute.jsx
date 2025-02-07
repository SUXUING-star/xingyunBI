// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    // 保存用户想要访问的页面路径，登录后可以重定向回来
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;