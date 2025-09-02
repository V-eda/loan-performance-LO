import React from 'react';
import { Bar } from 'react-chartjs-2';
import { defaultOptions, colors } from './ChartSetup';

const BarChart = ({ 
  data, 
  title = "Bar Chart", 
  height = 300,
  horizontal = false,
  color = colors.primary.main,
  className = ""
}) => {
  if (!data || !data.labels || !data.datasets) {
    console.warn('BarChart: Invalid data provided');
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
      backgroundColor: dataset.backgroundColor || `${color}80`,
      borderColor: dataset.borderColor || color,
      borderWidth: 1,
      borderRadius: 4,
      borderSkipped: false,
    }))
  };

  const options = {
    ...defaultOptions,
    indexAxis: horizontal ? 'y' : 'x',
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
    },
    scales: {
      x: {
        ...defaultOptions.scales.x,
        grid: {
          display: !horizontal
        }
      },
      y: {
        ...defaultOptions.scales.y,
        grid: {
          display: horizontal,
          color: '#F3F4F6',
          drawBorder: false
        }
      }
    }
  };

  return (
    <div className={`relative ${className}`} style={{ height: `${height}px` }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;