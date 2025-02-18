// src/components/DraggableField.jsx
import React from 'react';
import { useDrag } from 'react-dnd';
import { Badge } from '@/components/ui/badge';

export function DraggableField({ field, type }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FIELD',
    item: { field, fieldType: type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex items-center px-2 py-1 rounded cursor-move hover:bg-gray-50 
        ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <Badge
        variant={type === 'dimension' ? 'dimension' : 'metric'}
        className="select-none"
      >
        {field}
      </Badge>
    </div>
  );
}