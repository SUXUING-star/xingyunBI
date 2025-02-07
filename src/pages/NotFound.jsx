// src/components/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold text-blue-600">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">页面未找到</h2>
          <p className="mt-2 text-base text-gray-500">
            抱歉，您访问的页面不存在。
          </p>
        </div>
        
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base 
              font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              transition-colors duration-200"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}