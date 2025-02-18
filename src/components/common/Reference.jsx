import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Reference = () => {
  const sections = [
    {
      title: "1. 入门指南",
      subsections: [
        {
          title: "1.1 系统概述",
          content: "BI Platform 是一个现代化的数据可视化平台，让您能够轻松创建、管理和分享数据可视化内容。本指南将帮助您快速了解和使用平台的核心功能。"
        },
        {
          title: "1.2 快速开始",
          content: `1. 注册/登录账号
2. 上传您的数据文件
3. 创建仪表盘
4. 添加和配置图表
5. 保存并分享您的作品`
        }
      ]
    },
    {
      title: "2. 数据管理",
      subsections: [
        {
          title: "2.1 支持的数据格式",
          content: "目前支持以下数据格式：\n- CSV 文件\n- JSON 文件\n- Excel 文件（计划支持）"
        },
        {
          title: "2.2 数据处理",
          content: "上传数据后，您可以：\n- 预览数据内容\n- 修改列名和数据类型\n- 筛选和排序数据\n- 创建计算字段"
        }
      ]
    },
    {
      title: "3. 图表创建",
      subsections: [
        {
          title: "3.1 支持的图表类型",
          content: `- 基础图表：柱状图、折线图、饼图
- 统计图表：散点图、箱线图
- 地图可视化（计划支持）
- 高级图表：桑基图、热力图（计划支持）`
        },
        {
          title: "3.2 图表配置",
          content: "每个图表都支持以下配置：\n- 数据映射\n- 样式调整\n- 交互设置\n- 动画效果"
        }
      ]
    },
    {
      title: "4. 仪表盘布局",
      subsections: [
        {
          title: "4.1 布局设计",
          content: "使用拖拽功能调整：\n- 图表位置\n- 图表大小\n- 图表层级"
        },
        {
          title: "4.2 响应式设计",
          content: "仪表盘会自动适应不同屏幕尺寸，确保在各种设备上都能正常显示。"
        }
      ]
    },
    {
      title: "5. 分享与导出",
      subsections: [
        {
          title: "5.1 分享选项",
          content: "- 生成分享链接\n- 设置访问权限\n- 嵌入到其他网站"
        },
        {
          title: "5.2 导出格式",
          content: "支持导出为：\n- 图片（PNG）\n- PDF 文档\n- 原始数据"
        }
      ]
    },
    {
      title: "6. 用户权限",
      subsections: [
        {
          title: "6.1 角色说明",
          content: `- 管理员：完全控制权限
- 编辑者：可以创建和编辑内容
- 查看者：仅可查看已分享的内容`
        },
        {
          title: "6.2 权限管理",
          content: "可以针对以下内容设置权限：\n- 仪表盘访问权限\n- 数据源使用权限\n- 团队协作权限"
        }
      ]
    },
    {
      title: "7. 最佳实践",
      subsections: [
        {
          title: "7.1 数据准备",
          content: `数据质量是可视化效果的基础：
- 确保数据完整性
- 处理异常值和空值
- 统一数据格式
- 合理使用数据类型`
        },
        {
          title: "7.2 可视化建议",
          content: `创建有效的可视化：
- 选择合适的图表类型
- 使用恰当的颜色方案
- 添加必要的标签和说明
- 保持简洁清晰的布局`
        }
      ]
    }
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <h1 className="text-xl font-bold mb-6">
          使用指南
        </h1>
        
        <div className="space-y-8">
          {sections.map((section, index) => (
            <section key={index} className="space-y-4">
              <h2 className="text-lg font-semibold text-primary">
                {section.title}
              </h2>
              
              <div className="space-y-4">
                {section.subsections.map((subsection, subIndex) => (
                  <div key={subIndex} className="pl-4">
                    <h3 className="text-sm font-medium mb-2 text-muted-foreground">
                      {subsection.title}
                    </h3>
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                        {subsection.content}
                      </div>
                    </Card>
                  </div>
                ))}
              </div>

              {index < sections.length - 1 && (
                <Separator className="my-6" />
              )}
            </section>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            如果您在使用过程中遇到任何问题，请联系我们的支持团队：jieyalinjiu@gmail.com
          </p>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Reference;