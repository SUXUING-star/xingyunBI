// src/components/Layout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import RightSidebar from './RightSidebar';

function Layout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showReference, setShowReference] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden px-2  sm:px-4 py-4 sm:py-6 px-4">
        <main className={`flex-1 w-full transition-all duration-300 
          ${showSidebar ? 'mr-80' : ''} flex flex-col`}>
          <div className="flex-1 px-2 sm:px-4 py-4 sm:py-6 overflow-auto">
            <Outlet />
          </div>
          <Footer onShowReference={() => setShowReference(true)} />
        </main>

        <div 
          className={`fixed top-0 right-0 flex h-[calc(100vh-64px)] transition-transform duration-300 
            ${showSidebar ? 'translate-x-0' : 'translate-x-[320px]'}`}
          style={{ marginTop: '64px' }}
        >
          {/* 带钉子的按钮 */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="relative -ml-6 w-6 h-32 cursor-pointer flex items-center"
          >
            <div className={`absolute inset-0 flex items-center justify-start
              ${showSidebar ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            >
              {/* 展开状态的纸条和钉子 */}
              <div className="w-6 h-28 bg-white dark:bg-gray-800 shadow-md
                transform rotate-3 origin-right border-l border-gray-200 dark:border-gray-700" />
              <div className="w-6 h-28 bg-white dark:bg-gray-800 shadow-md -ml-[22px]
                transform -rotate-3 origin-left border-l border-gray-200 dark:border-gray-700" />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full
                bg-gray-400 dark:bg-gray-600 shadow-inner transform -translate-y-6 transition-transform duration-300" />
            </div>
            <div className={`absolute inset-0 flex items-center justify-start
              ${showSidebar ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            >
              {/* 收起状态的纸条和钉子 */}
              <div className="w-6 h-28 bg-white dark:bg-gray-800 shadow-md
                transform -rotate-3 origin-right border-r border-gray-200 dark:border-gray-700" />
              <div className="w-6 h-28 bg-white dark:bg-gray-800 shadow-md -ml-[22px]
                transform rotate-3 origin-left border-r border-gray-200 dark:border-gray-700" />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full
                bg-gray-400 dark:bg-gray-600 shadow-sm" />
            </div>
          </button>

          <RightSidebar 
            showReference={showReference}
            onCloseReference={() => setShowReference(false)}
          />
        </div>
      </div>
    </div>
  );
}

export default Layout;