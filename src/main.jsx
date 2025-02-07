// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { BrowserRouter } from 'react-router-dom'
import { LoadingProvider } from './contexts/LoadingContext'
import { useLoading } from './contexts/LoadingContext'
import LoadingScreen from './components/LoadingScreen'

// 分离出一个新组件来使用 useLoading hook
const LoadingWrapper = () => {
  const { isLoading, isFirstLoad } = useLoading();
  
  return (
    <>
      <LoadingScreen isLoading={isLoading} isFirstLoad={isFirstLoad} />
      <App />
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LoadingProvider>
          <LoadingWrapper />
        </LoadingProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);