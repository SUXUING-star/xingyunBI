// utils/mlUtils.js

// 数据预处理函数
export const preprocessData = (data, config) => {
  return data.map(row => {
    const processedRow = [...row];
    config.forEach(conf => {
      const index = data.headers.indexOf(conf.field);
      if (index === -1) return;

      let value = row[index];
      switch (conf.type) {
        case 'number':
          value = parseFloat(String(value).replace(/[^\d.-]/g, '')) || 0;
          break;
        case 'date':
          try {
            const date = new Date(value);
            value = conf.format ? formatDate(date, conf.format) : date.toISOString();
          } catch (e) {
            console.error('Date parsing error:', e);
          }
          break;
        default:
          value = String(value);
      }
      processedRow[index] = value;
    });
    return processedRow;
  });
};

// 数据标准化
export const standardize = (data) => {
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const std = Math.sqrt(
    data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
  );
  return data.map(val => (val - mean) / std);
};

// 数据归一化
export const normalize = (data) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  return data.map(val => (val - min) / (max - min));
};

// 计算相关系数矩阵
export const correlationMatrix = (features, labels) => {
  const allData = features.map((row, i) => [...row, labels[i]]);
  const n = allData[0].length;
  const matrix = Array(n).fill().map(() => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const xi = allData.map(row => row[i]);
      const xj = allData.map(row => row[j]);
      matrix[i][j] = pearsonCorrelation(xi, xj);
    }
  }

  return matrix;
};

// 皮尔逊相关系数
const pearsonCorrelation = (x, y) => {
  const n = x.length;
  const sum_x = x.reduce((a, b) => a + b, 0);
  const sum_y = y.reduce((a, b) => a + b, 0);
  const sum_xy = x.reduce((sum, curr, i) => sum + curr * y[i], 0);
  const sum_x2 = x.reduce((sum, curr) => sum + curr * curr, 0);
  const sum_y2 = y.reduce((sum, curr) => sum + curr * curr, 0);

  const numerator = n * sum_xy - sum_x * sum_y;
  const denominator = Math.sqrt(
    (n * sum_x2 - sum_x * sum_x) * (n * sum_y2 - sum_y * sum_y)
  );

  return denominator === 0 ? 0 : numerator / denominator;
};

// 训练测试集分割
export const trainTestSplit = (features, labels, testSize = 0.2) => {
  const n = features.length;
  const testN = Math.floor(n * testSize);
  const indices = Array.from({ length: n }, (_, i) => i);
  
  // 随机打乱索引
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const trainIndices = indices.slice(testN);
  const testIndices = indices.slice(0, testN);

  return {
    X_train: trainIndices.map(i => features[i]),
    X_test: testIndices.map(i => features[i]),
    y_train: trainIndices.map(i => labels[i]),
    y_test: testIndices.map(i => labels[i])
  };
};

// 评估指标计算
export const calculateMetrics = (yTrue, yPred) => {
  const n = yTrue.length;
  
  // 计算 MSE
  const mse = yTrue.reduce((sum, y, i) => sum + Math.pow(y - yPred[i], 2), 0) / n;
  
  // 计算 RMSE
  const rmse = Math.sqrt(mse);
  
  // 计算 MAE
  const mae = yTrue.reduce((sum, y, i) => sum + Math.abs(y - yPred[i]), 0) / n;
  
  // 计算 R²
  const yMean = yTrue.reduce((sum, y) => sum + y, 0) / n;
  const ssTotal = yTrue.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
  const ssResidual = yTrue.reduce((sum, y, i) => sum + Math.pow(y - yPred[i], 2), 0);
  const r2 = 1 - (ssResidual / ssTotal);

  return { mse, rmse, mae, r2 };
};