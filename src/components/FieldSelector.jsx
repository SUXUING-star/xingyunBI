import React from 'react';
import { useDrag } from 'react-dnd';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function FieldSelector({ headers = [], selectedFields = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>可用字段</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {headers.map((field) => (
            <DraggableField 
              key={field} 
              field={field} 
              isSelected={selectedFields.includes(field)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DraggableField({ field, isSelected }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FIELD',
    item: { field, fieldType: 'dimension' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`
        px-3 py-2 rounded-md text-sm cursor-move
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'}
        ${isSelected ? 'border-blue-300' : 'border-gray-200'}
        border transition-colors duration-200
      `}
    >
      {field}
    </div>
  );
}