// src/utils/dataProcessing.js
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

// 数据预处理函数
export function preprocessData(data, preprocessing = []) {
  if (!data?.length || !preprocessing?.length) return data;

  return data.map(row => {
    const processedRow = { ...row };
    preprocessing.forEach(config => {
      const value = row[config.field];
      if (value == null) return;

      switch (config.type) {
        case 'number':
          // 数值处理: 移除非数字字符并转换为数字
          if (typeof value === 'string') {
            const cleanValue = value.replace(/[^\d.-]/g, '');
            processedRow[config.field] = parseFloat(cleanValue) || 0;
          }
          break;
        case 'date':
          // 日期处理: 标准化日期格式
          if (typeof value === 'string') {
            const date = dayjs(value, config.format);
            if (date.isValid()) {
              processedRow[config.field] = date.format('YYYY-MM-DD');
            }
          }
          break;
        // 默认保持原值
        default:
          break;
      }
    });
    return processedRow;
  });
}

// 处理聚合数据
export function aggregateData(data, field, aggregator = 'sum') {
  if (!data?.length) return 0;

  const values = data.map(row => parseFloat(row[field]) || 0);
  switch (aggregator) {
    case 'sum':
      return values.reduce((a, b) => a + b, 0);
    case 'avg':
      return values.reduce((a, b) => a + b, 0) / values.length;
    case 'max':
      return Math.max(...values);
    case 'min':
      return Math.min(...values);
    case 'count':
      return values.length;
    default:
      return 0;
  }
}