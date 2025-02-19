// src/contexts/LoadingContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LoadingContext = createContext({
  isLoading: true,
  isFirstLoad: true,
  setIsLoading: () => {},
});

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const location = useLocation();

  // 处理路由变化时的加载状态
  useEffect(() => {
    if (!isFirstLoad) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isFirstLoad]);

	useEffect(() => {
		if (isFirstLoad) {
			const timer = setTimeout(() => {
				setIsLoading(false);
				setIsFirstLoad(false);
			}, 1000); // 从 2000 减少到 1000
			return () => clearTimeout(timer);
		}
	}, [isFirstLoad]);

  return (
    <LoadingContext.Provider value={{ isLoading, isFirstLoad, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};