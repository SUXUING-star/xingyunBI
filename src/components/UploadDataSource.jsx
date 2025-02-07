import React, { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function UploadDataSource({ onUploadSuccess }) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file) return;

    const fileType = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(fileType)) {
      toast({
        variant: "destructive",
        title: "不支持的文件类型",
        description: "请上传 CSV 或 Excel 文件",
      });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', fileType === 'csv' ? 'csv' : 'excel');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/datasources`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.code === 0) {
        toast({
          title: "上传成功",
          description: "数据源已添加",
        });
        onUploadSuccess?.(data.data);
      } else {
        throw new Error(data.msg || '上传失败');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "上传失败",
        description: error.message,
      });
    } finally {
      setUploading(false);
      setIsDragging(false);
    }
  };

  const handleInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
			className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
    >
      <div 
        className={`
          relative w-full min-h-[200px] p-8
          border-2 border-dashed rounded-xl
          flex flex-col items-center justify-center
          transition-all duration-200 cursor-pointer
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : uploading 
              ? 'border-gray-400 bg-gray-50 dark:bg-gray-800/50' 
              : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
          }
        `}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".csv,.xlsx,.xls"
          onChange={handleInputChange}
          disabled={uploading}
        />
        
        <AnimatePresence>
          {uploading ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center space-y-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              />
              <p className="text-blue-600 dark:text-blue-400 font-medium">
                正在上传文件...
              </p>
            </motion.div>
          ) : (
            <motion.label
              htmlFor="file-upload"
              className="flex flex-col items-center space-y-4 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={isDragging ? {
                  scale: [1, 1.1, 1],
                  transition: { duration: 1, repeat: Infinity }
                } : {}}
              >
                <Upload 
                  className={`h-12 w-12 ${
                    isDragging ? 'text-blue-500' : 'text-gray-400'
                  }`}
                />
              </motion.div>
              
              <div className="text-center space-y-2">
                <motion.div
                  className={`text-lg font-medium ${
                    isDragging ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {isDragging ? "松开以上传文件" : "点击或拖拽文件至此处上传"}
                </motion.div>
                <motion.div 
                  className="text-sm text-gray-500 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  支持 .csv、.xlsx、.xls 格式
                </motion.div>
              </div>
            </motion.label>
          )}
        </AnimatePresence>

        {/* 虚线边框装饰 */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={isDragging ? {
            scale: [1, 1.02, 1],
            transition: { duration: 1.5, repeat: Infinity }
          } : {}}
        >
          <div className="absolute inset-0 border-2 border-dashed rounded-xl" />
        </motion.div>
      </div>
    </motion.div>
  );
}