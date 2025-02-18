import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MLModelResult } from '@/components/mlmodel/MLModelResult';
import { Edit, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AnimatePresence } from 'framer-motion';

export default function MLModelDetail() {
	const { id } = useParams();
	const { token } = useAuth();
	const navigate = useNavigate();
	const { toast } = useToast();
	const [model, setModel] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchModelData();
	}, [id]);

	const fetchModelData = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mlmodels/${id}`, {
				headers: { 'Authorization': `Bearer ${token}` }
			});

			const data = await response.json();
			if (data.code === 0) {
				setModel(data.data);
			} else {
				throw new Error(data.msg || '获取模型数据失败');
			}
		} catch (error) {
			console.error('Error fetching model:', error);
			toast({
				variant: "destructive",
				title: "获取失败",
				description: error.message
			});
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (!model) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-500">未找到模型数据</p>
			</div>
		);
	}
	return (
		<motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4 space-y-6"
    >
      {/* 顶部操作栏 */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/mlmodels')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          返回列表
        </Button>
        <Button
          onClick={() => navigate(`/mlmodels/${id}/edit`)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          编辑模型
        </Button>
      </motion.div>

      {/* 模型信息卡片 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle>{model.name}</CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`grid ${model.type === 'kmeans' ? 'grid-cols-4' : 'grid-cols-5'} gap-4`}
            >
              {/* 添加描述字段 */}
              {model.description && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500">描述</p>
                  <p className="mt-1">{model.description}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">模型类型</p>
                <p className="font-medium">
                  {model.type === 'linear_regression' ? '线性回归' :
                    model.type === 'correlation' ? '相关性分析' :
                      model.type === 'decision_tree' ? '决策树' :
                        model.type === "kmeans" ? "K近邻" :
                          model.type}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">特征数量</p>
                <p className="font-medium">{model.features?.length || 0}</p>
              </div>
              {model.type !== "kmeans" && (
                <div>

                  <p className="text-sm text-gray-500">目标变量</p>
                  <p className="font-medium">{model.target}</p>

                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">训练状态</p>
                <p className="font-medium">
                  {model.training_result ? '已训练' : '未训练'}
                </p>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 训练结果 */}
      {model.training_result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <MLModelResult
            result={model.training_result}
            modelType={model.type}
            features={model.features}
            target={model.target}
          />
        </motion.div>
      )}
    </motion.div>
	);
}