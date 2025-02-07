// src/components/CustomTooltip.jsx
import React from 'react';

export const CustomTooltip = ({ active, payload, label, labelFields }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white p-2 border rounded shadow">
      {/* 维度标签 */}
      <div className="text-sm font-medium mb-1">{label}</div>
      
      {/* 指标数据 */}
      {payload.map((entry, index) => (
        <div key={index} className="text-sm">
          <span style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </span>
        </div>
      ))}
      
      {/* 标签字段数据 */}
      {labelFields?.map((field) => {
        const value = payload[0]?.payload[field];
        if (value !== undefined) {
          return (
            <div key={field} className="text-sm mt-1">
              <span className="text-gray-600">{field}: </span>
              <span>{typeof value === 'number' ? value.toLocaleString() : value}</span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};