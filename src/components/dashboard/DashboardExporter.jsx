import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useToast } from '@/hooks/use-toast';
import { Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const DashboardExporter = ({ dashboard, dashboardContentSelector = '.dashboard-content' }) => {
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);

    // 添加导出为图片的函数
    const exportAsImage = async () => {
      setExporting(true);
      try {
        const dashboardElement = document.querySelector(dashboardContentSelector);
        if (!dashboardElement) {
          throw new Error('找不到仪表盘内容元素');
        }
    
        const canvas = await html2canvas(dashboardElement);
        const imageUrl = canvas.toDataURL('image/png');
        
        // 创建下载链接
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${dashboard.name}-${new Date().toISOString()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    
        toast({
          title: "导出成功",
          description: "仪表盘已导出为图片"
        });
      } catch (error) {
        console.error('Export as image error:', error);
        toast({
          variant: "destructive",
          title: "导出失败",
          description: "导出图片失败，请重试"
        });
      } finally {
        setExporting(false);
      }
    };
    
    // 添加导出为PDF的函数
    const exportAsPDF = async () => {
      setExporting(true);
      try {
        const dashboardElement = document.querySelector(dashboardContentSelector);
        if (!dashboardElement) {
          throw new Error('找不到仪表盘内容元素');
        }
    
        const canvas = await html2canvas(dashboardElement);
        const imgData = canvas.toDataURL('image/png');
        
        // 创建PDF文档
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${dashboard.name}-${new Date().toISOString()}.pdf`);
    
        toast({
          title: "导出成功",
          description: "仪表盘已导出为PDF"
        });
      } catch (error) {
        console.error('Export as PDF error:', error);
        toast({
          variant: "destructive",
          title: "导出失败",
          description: "导出PDF失败，请重试"
        });
      } finally {
          setExporting(false);
      }
    };
    
    // 修改原有的导出JSON配置函数名称，使其更明确
    const exportAsJSON = async () => {
      setExporting(true);
      try {
        const dashboardData = JSON.stringify(dashboard, null, 2);
        const blob = new Blob([dashboardData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${dashboard.name}-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "导出成功",
          description: "仪表盘配置已导出为JSON"
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "导出失败",
          description: "导出配置失败，请重试"
        });
      } finally {
          setExporting(false);
      }
    };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={exporting}>
          <Share2 className="h-4 w-4 mr-2" />
          导出
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={exportAsImage}>
          <Download className="h-4 w-4 mr-2" />
          导出为图片
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={exportAsPDF}>
          <Download className="h-4 w-4 mr-2" />
          导出为PDF
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={exportAsJSON}>
          <Download className="h-4 w-4 mr-2" />
          导出配置
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DashboardExporter;