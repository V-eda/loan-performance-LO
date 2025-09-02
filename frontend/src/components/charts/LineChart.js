import React from 'react';
import { Line } from 'react-chartjs-2';
import { defaultOptions, colors } from './ChartSetup';

const LineChart = ({ 
  data, 
  title = "Line Chart", 
  height = 300,
  showFill = false,
  color = colors.primary.main,
  className = ""
}) => {
  if (!data || !data.labels || !data.datasets) {
    console.warn('LineChart: Invalid data provided');
    return (
      <div className={`h-${height/4} flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-gray-500 text-center">
          <div className="text-sm">No data available</div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: dataset.borderColor || color,
      backgroundColor: showFill 
        ? dataset.backgroundColor || `${color}20`
        : 'transparent',
      fill: showFill,
      tension: 0.4,
      borderWidth: 2,
      pointBackgroundColor: dataset.borderColor || color,
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }))
  };

  const options = {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      title: {
        display: !!title,
        text: title,
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 16,
          weight: '600'
        },
        color: '#1F2937',
        padding: 20
      }
    }
  };

  return (
    <div className={`relative ${className}`} style={{ height: `${height}px` }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;