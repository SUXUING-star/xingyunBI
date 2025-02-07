import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataPreprocessing } from './DataPreprocessing';

export function PreprocessingDialog({ isOpen, onClose, dataSource, onSave }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>数据预处理配置 - {dataSource?.name}</DialogTitle>
        </DialogHeader>
        
        <DataPreprocessing 
          dataSource={dataSource} 
          onSave={() => {
            onSave?.();
            onClose();
          }} 
        />
      </DialogContent>
    </Dialog>
  );
}