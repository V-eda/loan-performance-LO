import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { colors } from './ChartSetup';

const DoughnutChart = ({ 
  data, 
  title = "Doughnut Chart", 
  height = 300,
  showLabels = true,
  className = ""
}) => {
  if (!data || !data.labels || !data.datasets) {
    console.warn('DoughnutChart: Invalid data provided');
    return (
      <div className={`h-${height/4} flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-gray-500 text-center">
          <div className="text-sm">No data available</div>
        </div>
      </div>
    );
  }

  const defaultColors = [
    colors.primary.main,
    colors.success.main,
    colors.warning.main,
    colors.danger.main,
    colors.purple.main,
    colors.gray.main
  ];

  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: dataset.backgroundColor || defaultColors,
      borderColor: dataset.borderColor || '#ffffff',
      borderWidth: 2,
      hoverBorderWidth: 3,
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLabels,
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const backgroundColor = Array.isArray(dataset.backgroundColor) 
                  ? dataset.backgroundColor[i] 
                  : dataset.backgroundColor;
                
                const value = dataset.data[i];
                const total = dataset.data.reduce((sum, val) => sum + val, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: backgroundColor,
                  strokeStyle: backgroundColor,
                  pointStyle: 'circle'
                };
              });
            }
            return [];
          }
        }
      },
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
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        font: {
          family: 'Inter, system-ui, sans-serif'
        },
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    elements: {
      arc: {
        borderRadius: 4
      }
    }
  };

  return (
    <div className={`relative ${className}`} style={{ height: `${height}px` }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DoughnutChart;