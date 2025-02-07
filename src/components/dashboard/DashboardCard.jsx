import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart2, Settings, Trash2, 
  Calendar, Edit
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { motion } from 'framer-motion';

const DashboardCard = ({ 
  dashboard, 
  onView, 
  onEdit, 
  onDelete,
  className = "",
  index = 0 
}) => {
  const lastUpdateDate = new Date(dashboard.updated_at);
  const chartCount = dashboard.layout?.length || 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }}
    >
      <motion.div
        whileHover={{ 
          y: -5,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.98 }}
      >
        <Card className={`h-full transition-all duration-200 
          hover:shadow-lg ${className}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <motion.div 
              className="flex items-center space-x-2"
              layoutId={`title-${dashboard.id}`}
            >
              <CardTitle className="text-lg font-medium">
                {dashboard.name}
              </CardTitle>
            </motion.div>
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <BarChart2 className="h-5 w-5 text-gray-500" />
            </motion.div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {/* 描述部分 */}
              <div className="min-h-[40px] text-sm text-gray-600">
                {dashboard.description || '暂无描述'}
              </div>
              
              {/* 统计信息 */}
              <div className="grid grid-cols-3 gap-4 py-2">
                <div className="flex items-center space-x-2">
                  <BarChart2 className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{chartCount} 个图表</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {lastUpdateDate.toLocaleDateString()}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {lastUpdateDate.toLocaleString()}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex items-center space-x-2">
                  <Edit className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {dashboard.edit_count || 0} 次编辑
                  </span>
                </div>
              </div>
              
              {/* 操作按钮部分添加hover动画 */}
              <div className="flex justify-end items-center space-x-2 pt-2">
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onView}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    查看
                  </Button>
                </motion.div>
                <motion.div whileHover={{ rotate: 15 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onEdit}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDelete}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardCard;