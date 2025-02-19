import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Github,
  Globe,
  Download,
  Laptop,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { TypeWriter } from '@/components/animations/TypeWriter';
import { FadeIn } from '@/components/animations/FadeIn';
import { ScaleIn } from '@/components/animations/ScaleIn';
import { useLoading } from '@/contexts/loading/LoadingContext';
import { useState } from 'react';
import { useEffect } from 'react';

function Release() {
	const { isLoading, isFirstLoad } = useLoading();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // 简化动画控制逻辑
      setShouldAnimate(true);
    }
  }, [isLoading]);

  // 在加载状态时显示一个简单的加载指示器
  if (isLoading || !shouldAnimate) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  const platforms = [
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: 'Web 版本',
      description: '直接在浏览器中使用，无需安装，随时随地访问您的数据可视化仪表盘。',
      links: [
        {
          text: '立即使用',
          url: '/',
          icon: <ExternalLink className="ml-2 h-5 w-5" />
        },
        {
          text: '查看源码',
          url: 'https://github.com/SUXUING-star/xingyunBI',
          icon: <Github className="ml-2 h-5 w-5" />
        }
      ]
    },
    {
      icon: <Laptop className="h-8 w-8 text-green-500" />,
      title: 'Windows 客户端',
      description: '为Windows用户量身打造的接近原生的桌面端应用，提供更流畅的操作体验和本地化功能。',
      links: [
        {
          text: '下载安装包',
          url: 'https://github.com/SUXUING-star/xingyunBI-win-android/releases',
          icon: <Download className="ml-2 h-5 w-5" />
        },
        {
          text: '查看源码',
          url: 'https://github.com/SUXUING-star/xingyunBI-win-android',
          icon: <Github className="ml-2 h-5 w-5" />
        }
      ]
    },
    {
      icon: <Smartphone className="h-8 w-8 text-purple-500" />,
      title: 'Android 应用',
      description: '随身携带您的数据分析工具，Android版本让您在移动设备上也能享受完整功能。',
      links: [
        {
          text: '下载APK',
          url: 'https://github.com/SUXUING-star/xingyunBI-win-android/releases',
          icon: <Download className="ml-2 h-5 w-5" />
        },
        {
          text: '查看源码',
          url: 'https://github.com/SUXUING-star/xingyunBI-win-android',
          icon: <Github className="ml-2 h-5 w-5" />
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-16">
        <ScaleIn duration={600}>
          <div className="flex justify-center items-center mb-4">
            <img 
              src="/site-logo.svg" 
              alt="星云BI Logo" 
              className="h-16 w-16 mr-4"
            />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              下载与使用
            </h1>
          </div>
        </ScaleIn>
        <div className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          <TypeWriter 
            text="开启你的数据可视化之旅" 
            duration={3000}
            delay={600}
            hideCursor={true}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {platforms.map((platform, index) => (
          <FadeIn 
            key={index} 
            delay={index * 200 + 1000}
            direction="up"
          >
            <Card className="p-6 flex flex-col items-center text-center h-full hover:shadow-lg transition-shadow">
              {platform.icon}
              <h3 className="text-lg font-semibold mt-4 mb-2">{platform.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">
                {platform.description}
              </p>
              <div className="flex flex-col gap-3 w-full">
                {platform.links.map((link, linkIndex) => (
                  <Button
                    key={linkIndex}
                    variant={linkIndex === 0 ? "default" : "outline"}
                    className="w-full"
                    onClick={() => {
                      if (link.url === '/') {
                        window.location.href = link.url;
                      } else {
                        window.open(link.url, '_blank');
                      }
                    }}
                  >
                    {link.text}
                    {link.icon}
                  </Button>
                ))}
              </div>
            </Card>
          </FadeIn>
        ))}
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          技术栈
        </h2>
        <div className="space-y-8 max-w-3xl mx-auto">
          <FadeIn delay={1500}>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">Web 应用</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Badge variant="secondary" className="text-center py-2 hover:bg-primary/20 cursor-default">React</Badge>
                <Badge variant="secondary" className="text-center py-2 hover:bg-primary/20 cursor-default">Vite</Badge>
                <Badge variant="secondary" className="text-center py-2 hover:bg-primary/20 cursor-default">Go (Gin)</Badge>
                <Badge variant="secondary" className="text-center py-2 hover:bg-primary/20 cursor-default">MongoDB</Badge>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={1800}>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">跨平台应用</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Badge variant="secondary" className="text-center py-2 hover:bg-primary/20 cursor-default">Flutter UI</Badge>
                <Badge variant="secondary" className="text-center py-2 hover:bg-primary/20 cursor-default">Hive</Badge>
                <Badge variant="secondary" className="text-center py-2 hover:bg-primary/20 cursor-default">MongoDB</Badge>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

export default Release;